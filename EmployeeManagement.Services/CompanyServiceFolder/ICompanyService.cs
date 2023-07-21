using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;

namespace EmployeeManagement.Services.CompanyServiceFolder
{
    public interface ICompanyService
    {
        IEnumerable<Company> GetRecords();

        Task<IEnumerable<Company>> GetAllAsync();

         Task<bool>  AddCompany(CompanyViewModel model);

         Task<bool> EditCompany(CompanyViewModel vm, long id);

        Task<bool> DeleteCompany(long id);

        Task<Company> GetByIdAsync(long id);

    }
}
