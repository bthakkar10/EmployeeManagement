using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;

namespace EmployeeManagement.Services.UserServiceFolder
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUserAsync();

        Task<IEnumerable<User>> GetUsers(long CompanyId);

        Task<User> GetUserById(long UserId);

        Task<bool> AddUser(UserViewModel userVM, string origin);

        Task<bool> EditUser(EditUserVM userVM, long UserId);

        void DeleteUser(long UserId);
    }
}
