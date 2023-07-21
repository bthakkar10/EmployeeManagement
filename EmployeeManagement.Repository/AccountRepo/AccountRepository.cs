using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;
using EmployeeManagement.Repository.EmailRepo;

namespace EmployeeManagement.Repository.AccountRepo
{
    public class AccountRepository : IAccountRepository
    {
        private readonly EmpDbContext _db;
       
        private readonly IEmailMessageRepository _emailMessageRepo;

        public AccountRepository(EmpDbContext db, IEmailMessageRepository emailMessageRepo)
        {
            _db = db;
            _emailMessageRepo= emailMessageRepo;
        }

        /// <summary>
        /// Register of new user
        /// </summary>
        /// <param name="registerVM">Viewmodel for registration</param>
        /// <param name="origin"></param>
        /// <returns></returns>
        public bool Register(RegisterViewModel registerVM , string origin)
        {
            if (registerVM != null)
            {
                User? DoesUserExist = _db.Users.FirstOrDefault(user => user.Email == registerVM.Email);
                if (DoesUserExist == null)
                {
                    User newUser = new()
                    {
                        FirstName = registerVM.FirstName,
                        LastName = registerVM.LastName,
                        Email = registerVM.Email.ToLower(),
                        ContactNo = registerVM.ContactNo,
                        UserType = Static.Enums.UserType.user.ToString(),
                        ProfileImg = Static.CommonStrings.default_img,
                        Password = BCrypt.Net.BCrypt.HashPassword(registerVM.Password),
                        CompanyId = (long)registerVM.companyId!,
                    };
                    _db.Users.Add(newUser);
                    _db.SaveChanges();

                    //method to create random token and send verification mail after that
                    _emailMessageRepo.VerifyEmailToken(newUser.UserId, origin);
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// To verify email of the registered user 
        /// </summary>
        /// <param name="token">Generated token</param>
        /// <returns></returns>
        public bool VerifyEmail(string token)
        {
            TokenVerification? tv = _db.TokenVerifications.Where(x => x.VerificationToken == token && x.IsVerified == false && x.VerificationTokenTime > DateTime.Now).OrderByDescending(x=>x.Id).FirstOrDefault();
            if(tv != null)
            {
                User? user = _db.Users.FirstOrDefault(x=>x.UserId == tv.UserId); 
                if(user != null) { user.IsVerified = true; }
                _db.Remove(tv); 
                _db.SaveChanges();
                return true;
            }
            return false;
        }

        /// <summary>
        /// Login user
        /// </summary>
        /// <param name="loginVM">Login View model</param>
        /// <returns></returns>
        public User Login(LoginViewModel loginVM)
        {
            if (loginVM != null)
            {
                User? user = _db.Users.FirstOrDefault(x => x.Email == loginVM.Email && x.IsDeleted == false);
                
                if(user != null)
                {
                    return user;
                } 
            }
            return new User();
        }

        /// <summary>
        /// Forget Password 
        /// </summary>
        /// <param name="email"></param>
        /// <param name="origin"></param>
        public void ForgotPassword(string email, string origin)
        {
            User? user = _db.Users.SingleOrDefault(x => x.Email == email);

            // always return ok response to prevent email enumeration
            if (user == null) return;

            //method to create random token and send mail after that
            _emailMessageRepo.ForgetPassToken(user.UserId, origin);
        }

        /// <summary>
        /// To reset password of user
        /// </summary>
        /// <param name="token">Generated token</param>
        /// <param name="Password">Password</param>
        /// <returns></returns>
        public bool ResetPassword(string token, string Password)
        {
            TokenVerification? tokenVerification = _db.TokenVerifications
                .Where(x => x.PasswordResetToken == token && x.IsResetTokenUsed== false && x.ResetTokenTime > DateTime.Now)
                .OrderByDescending(x => x.Id)
                .FirstOrDefault(); ;

            if (tokenVerification == null)  return false; 
            // update password and remove reset token
            User? user = _db.Users.FirstOrDefault(x => x.UserId == tokenVerification.UserId);
            if(user != null)
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(Password);
                _db.Users.Update(user);
                _db.Remove(tokenVerification);
                _db.SaveChanges();
                return true;
            }
            return false;
        }
    }
}
