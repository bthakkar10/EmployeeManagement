using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Repository.AccountRepo;
using EmployeeManagement.Repository.EmailRepo;
using EmployeeManagement.Repository.Generic;
using EmployeeManagement.Services.AccountServiceFolder;
using EmployeeManagement.Services.CompanyServiceFolder;
using EmployeeManagement.Services.RolePermissionServiceFoler;
using EmployeeManagement.Services.UserServiceFolder;

namespace EmployeeManagement.Configuration
{
    public  static class DependencyInjectionConfig
    {
        /// <summary>
        /// all the dependency injection for program.cs file
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection ResolveDependencies(this IServiceCollection services)
        {

            services.AddScoped<EmpDbContext>();
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<ISendEmailRepository, SendEmailRepository>();
            services.AddScoped<IEmailMessageRepository, EmailMessageRepository>();              


            services.AddScoped<ICompanyService, CompanyService>();
            services.AddScoped<IAccountService , AccountService>(); 
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRolePermissionService, RolePermissionService>();        

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            return services;
        }
    }
}
