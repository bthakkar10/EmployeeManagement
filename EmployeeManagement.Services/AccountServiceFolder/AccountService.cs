using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;
using EmployeeManagement.Repository.AccountRepo;

namespace EmployeeManagement.Services.AccountServiceFolder
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _account ;

        public AccountService(IAccountRepository account) 
        { 
            _account = account;  
        }

        /// <summary>
        /// register a new user 
        /// </summary>
        /// <param name="registerVM"></param>
        /// <param name="origin">it is the localhost url of front end which is then sent with email</param>
        /// <returns></returns>
        public bool Registration(RegisterViewModel registerVM , string origin)
        {
            if (registerVM != null)
            {
                if(_account.Register(registerVM, origin))
                {
                     return true;
                }
                return false;
            }
            return false;
        }

        /// <summary>
        /// to verify email of registered user 
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        public bool VerifyEmail(string token)
        {
            if (_account.VerifyEmail(token)) return true;
            return false;
                
        }

        /// <summary>
        /// login user or admin 
        /// </summary>
        /// <param name="loginVM"></param>
        /// <returns></returns>
        public  User Login (LoginViewModel loginVM)
        {
            if (loginVM != null)
            {
                return _account.Login(loginVM);
            }
            return new User();
        }

        //public User GetDetails()
        //{
        //    return _account.GetDetails();
        //}


        /// <summary>
        /// to send email when user forgets the password 
        /// </summary>
        /// <param name="email"></param>
        /// <param name="origin"></param>
        public void ForgetPassword(string email, string origin)
        {
            _account.ForgotPassword(email, origin);
        }

        /// <summary>
        /// to check the token so that user can reset the password 
        /// </summary>
        /// <param name="token"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        public bool ResetPassword(string token, string Password)
        {
            if(token== null)return false;
            if(_account.ResetPassword(token,Password))
                return true;
            return false;
        }

        

    }
}
