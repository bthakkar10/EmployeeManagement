using EmployeeManagement.Entity.Auth;
using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Services.RolePermissionServiceFoler;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace EmployeeManagement.Auth
{
    /// <summary>
    /// permission handler class to set authorization for specific permissions. In this case, CRUD permission of user 
    /// </summary>
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IRolePermissionService _rolePermission;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PermissionHandler(IHttpContextAccessor httpContextAccessor, IRolePermissionService rolePermission)
        {
            _rolePermission = rolePermission;
            _httpContextAccessor= httpContextAccessor;  
        }

        /// <summary>
        /// to handle the allowed permissions requirement 
        /// </summary>
        /// <param name="context"></param>
        /// <param name="requirement"></param>
        /// <returns></returns>
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            string? userType = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.Role)?.Value;
            // Check if the user has the required permission
            if (userType == Static.Enums.UserType.admin.ToString() || HasPermission(requirement.Permission) )
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }

        /// <summary>
        /// to check if the specific permission is allowed to user or not 
        /// </summary>
        /// <param name="permission"></param>
        /// <returns></returns>
        private bool HasPermission(string permission)
        {
            //to get the custom claim from the jwt token
            var customClaim = _httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(c => c.Type == "CustomSubRoleClaims");
            if (customClaim != null)
            {
                // Use the custom claim value as needed
                var customClaimValue = customClaim.Value;
                if (long.TryParse(customClaimValue, out long roleId))
                {
                    //get the user permissions from role_permission table based on role_id
                    var rolePermissions =  _rolePermission.GetRolePermissionByRole(roleId);
                     // Check if the rolePermissions exist
                     if (rolePermissions != null)
                     {
                            // Check the specific permission in the rolePermissions
                            if (permission == Static.Permissions.Create && rolePermissions.CanAdd == true)
                            {
                                return true;
                            }
                            else if (permission == Static.Permissions.Edit && rolePermissions.CanEdit == true)
                            {
                                return true;
                            }
                            if (permission == Static.Permissions.Delete && rolePermissions.CanDelete == true)
                            {
                                return true;
                            }
                            else if (permission == Static.Permissions.View && rolePermissions.CanView == true)
                            {
                                return true;
                            }
                     }
                }
            }
            return false;
            
        }
    }
}
