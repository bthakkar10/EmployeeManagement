using AutoMapper;
using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;
using EmployeeManagement.Repository.EmailRepo;
using EmployeeManagement.Repository.Generic;

namespace EmployeeManagement.Services.UserServiceFolder
{
    public class UserService : IUserService
    {
        //dependency injection
        #region Initialize variables
        private readonly IGenericRepository<User> _generic;
        private readonly IMapper _mapper;
        private readonly IEmailMessageRepository _emailMessageRepo; 
        #endregion

        public UserService(IGenericRepository<User> generic, IMapper mapper, IEmailMessageRepository emailMessageRepo) 
        {
            _generic = generic;
            _mapper = mapper;    
            _emailMessageRepo = emailMessageRepo;
        }

        /// <summary>
        /// get list of all the users 
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<User>> GetAllUserAsync()
        {
            var result = await _generic.GetAllAsync();
            return result;
        }

        public async Task<IEnumerable<User>> GetUsers(long CompanyId)
        {
            IEnumerable<User> result = await _generic.GetAllAsync();
            return result.Where(x=> x.CompanyId == CompanyId && x.UserType.ToLower() == Static.Enums.UserType.user.ToString());
        }

        /// <summary>
        /// get a particular user's details by its userid
        /// </summary>
        /// <param name="UserId"></param>
        /// <returns></returns>
        public async Task<User> GetUserById(long UserId)
        {
            User user = await _generic.GetByIdAsync(UserId);
            if (user == null)
                return new User();
            else 
                return user;
        }

        /// <summary>
        /// add a new user 
        /// </summary>
        /// <param name="userVM">user view model</param>
        /// <returns></returns>
        public async Task<bool> AddUser(UserViewModel userVM, string origin)
        {
            User DoesExist = await _generic.FindByConditionAsync(x => x.Email == userVM.Email);
            if (DoesExist == null) 
            {
                User newUser = _mapper.Map<User>(userVM);
                newUser.Password = BCrypt.Net.BCrypt.HashPassword(userVM.Password);
                _generic.Insert(newUser);
                _generic.Save();

                //method to generate random token and send verification mail after that for email verification 
                _emailMessageRepo.VerifyEmailToken(newUser.UserId, origin);
                return true;
            }
            return false;
        }

        /// <summary>
        /// to edit any user 
        /// </summary>
        /// <param name="userVM">user view model</param>
        /// <param name="UserId">user id </param>
        /// <returns></returns>
        public async Task<bool> EditUser(EditUserVM userVM, long UserId)
        {
            User DoesExist = await _generic.GetByIdAsync(UserId);
            if(DoesExist != null)
            {
                User editUser = _mapper.Map<EditUserVM, User>(userVM, DoesExist);
                _generic.Update(editUser);
                _generic.Save();    
                return true;
            }
            return false;
        }

        /// <summary>
        /// to remove a particular user 
        /// </summary>
        /// <param name="UserId"></param>
        public void DeleteUser(long UserId)
        {
            _generic.Delete(UserId);
            _generic.Save();
        }
       
    }
}
