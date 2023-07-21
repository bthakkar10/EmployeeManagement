using EmployeeManagement.Entity.ViewModel;
using EmployeeManagement.Services.UserServiceFolder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    /// <summary>
    /// To perform basic CRUD for users 
    /// </summary>
   
    [ApiController]
    [Route("User")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// get all the users (used in admin side only)
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = "admin")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetAllUser()
        {
            try
            {
                var result = await _userService.GetAllUserAsync();
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
        /// get the list of users who works in the same company (for users )
        /// </summary>
        /// <returns></returns>
        [HttpGet("Get/{CompanyId:int}")]
        [Authorize(Policy = Static.Permissions.View)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetUsers(long CompanyId)
        {
            try
            {
                if(CompanyId == 0)
                {
                    return BadRequest();
                }
                var result = await _userService.GetUsers(CompanyId);
                if (result == null)
                {
                    return BadRequest(new { message = Static.User.GetUserError });
                }
                return Ok(result);
            }
            catch(Exception ex) 
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }

        /// <summary>
        /// get users details based on its id 
        /// </summary>
        /// <param name="id"></param>
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
                var result = await _userService.GetUserById(id);
                if (result == null || result.UserId == 0)
                {
                    return BadRequest(new { message = Static.User.GetUserById });
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
        /// to add a new user 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Policy = Static.Permissions.Create)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> AddUser(UserViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }
                bool returnvalue = await _userService.AddUser(model, Request.Headers["origin"]);
                if (returnvalue == false)
                {
                    return BadRequest(new { message = Static.User.AddUserError });
                }
                return Ok(new { message = Static.User.AddUserSuccess });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
            }

        /// <summary>
        /// to update any exisiting user
        /// </summary>
        /// <param name="id">get user based on its id </param>
        /// <param name="model"> values tthat are updated  </param>
        /// <returns></returns>
        [HttpPut("{id:int}")]
        [Authorize(Policy = Static.Permissions.Edit)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditUser(long id, EditUserVM model)
        {
            try
            {
                if(!ModelState.IsValid || id ==0)
                {
                    return BadRequest();
                }
                bool returnvalue = await _userService.EditUser(model, id);
                if (!returnvalue)
                {
                    return BadRequest(new { message = Static.User.UpdateUserError });
                }
                return Ok(new { message = Static.User.UpdateUserSuccess });

            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }

        /// <summary>
        /// delete a user based on its id 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id:int}")]
        [Authorize(Policy = Static.Permissions.Delete)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult DeleteUser(long id)
        {
            try
            {
                if(id == 0)
                {
                    return BadRequest();
                }
                _userService.DeleteUser(id);
                return Ok(new { message = Static.User.DeleteUser });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }
    }
}
