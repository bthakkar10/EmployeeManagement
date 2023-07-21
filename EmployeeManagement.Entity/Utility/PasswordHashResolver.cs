using AutoMapper;
using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;

namespace EmployeeManagement.Entity.Utility
{
    public class PasswordHashResolver : IValueResolver<User, UserViewModel, string>
    {
        public string Resolve(User source, UserViewModel destination, string destMember, ResolutionContext context)
        {
            string password = source.Password;
            string hashedPassword = HashPassword(password);
            return hashedPassword;
        }

        private string HashPassword(string password)
        {
            //  password hashing logic here using BCrypt hashing library:
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
