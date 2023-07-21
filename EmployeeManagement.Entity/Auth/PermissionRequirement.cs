
using Microsoft.AspNetCore.Authorization;

namespace EmployeeManagement.Entity.Auth
{
    /// <summary>
    /// to get the permission strings. this helps in checking CRUD permission of user
    /// </summary>
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public string Permission { get; }

        public PermissionRequirement(string permission)
        {
            Permission = permission;
        }
    }
}
