using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeManagement.Repository.AccountRepo
{
    public interface IAccountRepository
    {
        bool Register(RegisterViewModel registerVM, string origin);

        bool VerifyEmail(string token);

         User Login(LoginViewModel loginVM);

        //User GetDetails();

        void ForgotPassword(string email, string origin);

        bool ResetPassword(string token, string Password);

       
    }
}
