using AutoMapper;
using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;
using EmployeeManagement.Repository.Generic;

namespace EmployeeManagement.Services.CompanyServiceFolder
{
    public class CompanyService : ICompanyService
    {
      
        private readonly IGenericRepository<Company> _generic;
        private readonly IMapper _mapper;

        public CompanyService( IMapper mapper, IGenericRepository<Company> generic)
        {
            _mapper = mapper;
            _generic = generic;
        }

        /// <summary>
        /// get company list based on search, sort and pagination
        /// </summary>
        /// <returns></returns>
        public  IEnumerable<Company> GetRecords()
        {
            return  _generic.GetRecordsAsync("company","CompanyDetails","CompanyName", 1);
        }
        
        /// <summary>
        /// get the list of all company
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Company>> GetAllAsync()
        {
            return await _generic.GetAllAsync();
        }

        /// <summary>
        /// add new company
        /// </summary>
        /// <param name="vm">Viewmodel of company</param>
        /// <returns></returns>
        public async Task<bool> AddCompany(CompanyViewModel vm)
        {

            var DoesExist = await  _generic.FindByConditionAsync(x => x.CompanyName == vm.CompanyName);
            if(DoesExist == null)
            {
                //Company company = _mapper.Map<Company>(vm);
                Company company = new()
                {
                    CompanyName = vm.CompanyName,
                    CompanyEmail = vm.CompanyEmail,
                    CompanyContact = vm.CompanyContact,
                    CompanyDetails = vm.CompanyDetails,
                };
                _generic.Insert(company);
                _generic.Save();
                return true;
            }
            return false;
        }

        /// <summary>
        /// edit company 
        /// </summary>
        /// <param name="vm">Viewmodel of company</param>
        /// <param name="id">edit company id </param>
        /// <returns></returns>
        public async Task<bool> EditCompany(CompanyViewModel vm, long id)
        {
           
            var DoesExist = await _generic.GetByIdAsync(id);
            if (DoesExist != null)
            {
                //Company company = _mapper.Map<Company>(vm);

                DoesExist.CompanyName = vm.CompanyName;
                DoesExist.CompanyEmail = vm.CompanyEmail;
                DoesExist.CompanyContact = vm.CompanyContact;
                DoesExist.CompanyDetails = vm.CompanyDetails;
               
                _generic.Update(DoesExist);
                _generic.Save();
                return true;
            }
            return false;
        }

        /// <summary>
        /// delete company 
        /// </summary>
        /// <param name="id">id for deleting company</param>
        /// <returns></returns>
        public async Task<bool> DeleteCompany (long id)
        {
            var IsUsed = await _generic.FindByConditionAsync(x=>x.CompanyId == id && !x.Users.Any(u=>u.CompanyId == id && u.IsDeleted==false));

            //var DoesExist = await _generic.GetByIdAsync(id);
            if (IsUsed != null)
            {
                IsUsed.IsDeleted = true;
                _generic.Update(IsUsed);
                _generic.Save();
                return true;
            }
            return false;
        }

        /// <summary>
        /// to fetch company details based on its id 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Company> GetByIdAsync(long id)
        {
            var DoesExist = await _generic.GetByIdAsync(id);
            if(DoesExist == null)
            {
                return new Company();
            }
            else
            {
                return DoesExist;
            }

        }
    }
}