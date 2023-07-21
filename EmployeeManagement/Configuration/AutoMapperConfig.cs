using AutoMapper;
using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.Utility;
using EmployeeManagement.Entity.ViewModel;

namespace EmployeeManagement.Configuration
{
    /// <summary>
    /// auto mapper configuration class to create all the mapping 
    /// </summary>
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {
            CreateMap<Company, CompanyViewModel>().ReverseMap();
            CreateMap<User, UserViewModel>().ReverseMap();
            CreateMap<User, EditUserVM>().ReverseMap();
            CreateMap<RolePermission, RolePermissionViewModel>().ReverseMap();
        }
    }
}
