using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;

namespace EmployeeManagement.Services.RolePermissionServiceFoler
{
    public interface IRolePermissionService
    {
        Task<IEnumerable<Role>> GetAllRolesAsync();

        Task<IEnumerable<RolePermission>> GetAllRolePermissionAsync();

        RolePermission GetRolePermissionByRole(long RoleId);

        Task<bool> EditRolePermission(RolePermissionViewModel viewmodel, long RoleId);

        Task<bool> AddNewRole(string RoleName);

        Task<RolePermission> GetRolePermissionById(long RoleId);
    }
}
