using AutoMapper;
using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;
using EmployeeManagement.Repository.Generic;
using static EmployeeManagement.Static;

namespace EmployeeManagement.Services.RolePermissionServiceFoler
{
    public class RolePermissionService : IRolePermissionService
    {
        private readonly IGenericRepository<Role> _generic;
        private readonly IGenericRepository<RolePermission> _genericRolePermission;
        private readonly IMapper _mapper;

        public RolePermissionService(IGenericRepository<Role> generic, IGenericRepository<RolePermission> genericRolePermission, IMapper mapper) 
        {
            _generic = generic;
            _genericRolePermission = genericRolePermission;
            _mapper = mapper;
        }

        /// <summary>
        /// get list of all the roles of user 
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Role>> GetAllRolesAsync()
        {
            return await _generic.GetAllAsync();
        }

        public async Task<IEnumerable<RolePermission>> GetAllRolePermissionAsync()
        {
            return await _genericRolePermission.GetAllAsync();
        }

        /// <summary>
        /// get the permissions of every particular user role.
        /// </summary>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public RolePermission GetRolePermissionByRole(long RoleId)
        {
            // returns a single record which has similar role_id and now needs to check can_add, can_edit, can_delete and can_view permissions from that
            var permissions =  _genericRolePermission.FindByConditions(x=>x.RoleId == RoleId);
            if (permissions != null)
            {
                return permissions;
            }
            return new RolePermission();
        }

        /// <summary>
        /// to update the role permissions of user 
        /// </summary>
        /// <param name="viewmodel"></param>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public async Task<bool> EditRolePermission(RolePermissionViewModel viewmodel, long RoleId)
        {
            RolePermission DoesRoleExist = await _genericRolePermission.FindByConditionAsync(x=>x.RoleId == RoleId);
            if (DoesRoleExist != null)
            {
                RolePermission editRolePermission = _mapper.Map<RolePermissionViewModel, RolePermission>(viewmodel, DoesRoleExist);
                _genericRolePermission.Update(editRolePermission);
                _genericRolePermission.Save();
                return true;
            }
            return false;
        }

        /// <summary>
        /// to add new role and its corresponding role permissions
        /// </summary>
        /// <param name="RoleName"></param>
        /// <returns></returns>
        public async Task<bool> AddNewRole(string RoleName)
        {
            Role role = await _generic.FindByConditionAsync(x => x.RoleName == RoleName);
            if(role == null)
            {
                //adding new role
                Role newRole = new()
                {
                    RoleName = RoleName,
                };
                _generic.Insert(newRole);
                _generic.Save();

                //adding new role permission when the role is added. by default view permission is true and others are false
                RolePermission rolePermission = new()
                {
                    RoleId = newRole.RoleId,
                    CanAdd = false,
                    CanEdit = false,
                    CanDelete = false,
                    CanView = true
                };
                _genericRolePermission.Insert(rolePermission);
                _genericRolePermission.Save();
                return true;
            }
            return false;
        }

        /// <summary>
        /// get the permission of user based on its role id 
        /// </summary>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        public async Task<RolePermission> GetRolePermissionById(long RoleId)
        {
            RolePermission rolePermission = await _genericRolePermission.GetByIdAsync(RoleId);
            if (rolePermission == null)
                return new RolePermission();
            else
                return rolePermission;
        }
    }
}
