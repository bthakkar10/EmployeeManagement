using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;

namespace EmployeeManagement.Services.AccountServiceFolder
{
    public interface IAccountService
    {
        public bool Registration(RegisterViewModel registerVM, string origin);

        bool VerifyEmail(string token);

         User Login(LoginViewModel loginVM);

       // User GetDetails();

        void ForgetPassword(string email, string origin);

        bool ResetPassword(string token, string Password);

        //List<Company> GetCompanies();
    }
}
