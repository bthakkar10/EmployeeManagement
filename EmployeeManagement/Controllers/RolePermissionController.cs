using EmployeeManagement.Entity.ViewModel;
using EmployeeManagement.Services.RolePermissionServiceFoler;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    /// <summary>
    /// Role and role permissions(for users) releated all the work 
    /// </summary>

    [ApiController]
    [Route("RolePermission")]
    public class RolePermissionController : Controller
    {

        private readonly IRolePermissionService _rolePermissionService;

        public RolePermissionController(IRolePermissionService rolePermissionService)
        {
            _rolePermissionService = rolePermissionService;  
        }

        #region Roles operation

        /// <summary>
        /// to  get the list of roles of the users 
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetRoles")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var result = await _rolePermissionService.GetAllRolesAsync();
                if (result == null)
                {
                    return BadRequest();
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }

        /// <summary>
        /// adding a new role 
        /// </summary>
        /// <param name="RoleName"></param>
        /// <returns></returns>
        [Authorize(Roles = "admin")]
        [HttpPost("{RoleName}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AddRole(string RoleName)
        {
            try
            {
                if(string.IsNullOrEmpty(RoleName))
                {
                    return BadRequest();
                }
                bool returnvalue = await _rolePermissionService.AddNewRole(RoleName);
                if(!returnvalue)
                {
                    return BadRequest(new { message = Static.RolePermissionConstatnt.AddRoleError });
                }
                return Ok(new { message = Static.RolePermissionConstatnt.AddRoleSuccess });                         
            }
            catch(Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }

        #endregion


        #region Role Permission operations
        /// <summary>
        /// to  get the list of role permissions of the users 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllRolePermission()
        {
            try
            {
                var result = await _rolePermissionService.GetAllRolePermissionAsync();
                if (result == null)
                {
                    return BadRequest();
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }

        /// <summary>
        /// to edit the role permissions of the user 
        /// </summary>
        /// <returns></returns>
        [HttpPut("{roleId:int}")]
        [Authorize(Roles = "admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditRolePermission( RolePermissionViewModel viewModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }
                bool returnvalue = await _rolePermissionService.EditRolePermission(viewModel, viewModel.RoleId);

                if (!returnvalue)
                {
                    return BadRequest(new { message = Static.RolePermissionConstatnt.UpdateRoleError });
                }
                return Ok(new { message = Static.RolePermissionConstatnt.UpdateRoleSuccess });

            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }

        /// <summary>
        /// get role permissions based on role id 
        /// </summary>
        /// <param name="RoleId"></param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetByIdUser(long id)
        {
            try
            {
                if (id == 0)
                {
                    return BadRequest();
                }
                var result = await _rolePermissionService.GetRolePermissionById(id);
                if (result == null || result.RoleId == 0)
                {
                    return BadRequest(new { message = Static.RolePermissionConstatnt.GetRolePermissionById });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }

        #endregion
    }
}
