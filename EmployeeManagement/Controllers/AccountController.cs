using EmployeeManagement.Auth;
using EmployeeManagement.Entity.Auth;
using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.ViewModel;
using EmployeeManagement.Services.AccountServiceFolder;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    /// <summary>
    /// To perform basic account operations such as login, register, forget password etc
    /// </summary>
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly IConfiguration _configuration;

        public AccountController(IAccountService accountService, IConfiguration configuration)
        {
            _accountService = accountService;
            _configuration = configuration;
        }

        /// <summary>
        /// to register a new process 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public  IActionResult Register(RegisterViewModel model)
        {
            try
            {
                if (!ModelState.IsValid) 
                {
                    return BadRequest();
                }
                bool returnvalue = _accountService.Registration(model, Request.Headers["origin"]);
                if (!returnvalue)
                {
                    return BadRequest(new { message = Static.Account.ResgisterError });
                }
                return Ok(new { message = Static.Account.RegisterSuccess });

            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }

        }

        /// <summary>
        /// to verify the details of user on login and set token and redirect it further 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Login (LoginViewModel model)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest();
                User user = _accountService.Login(model);  

                if(user != null)
                {
                    if(user.IsVerified == false)
                    {
                        return BadRequest(new { message = Static.Account.Verify });
                    }
                    if(user.Status == false)
                    {
                        return BadRequest(new { message = Static.Account.Inactive });
                    }
                    bool DoesPasswordMatch = BCrypt.Net.BCrypt.Verify(model.Password, user.Password);
                    if(DoesPasswordMatch)
                    {
                        JwtSetting jwtSettings = _configuration.GetSection(nameof(JwtSetting)).Get<JwtSetting>()!;
                        var token = JwtTokenHelper.GenerateToken(jwtSettings, user);
                        HttpContext.Session.SetString("token", token);

                        if (user.UserType == Static.Enums.UserType.admin.ToString())
                        {
                            return Ok(new { message = Static.Account.AdminSide , token,user });
                        }
                        if(user.UserType == Static.Enums.UserType.user.ToString())
                        {
                            return Ok(new { message = Static.Account.UserSide , token, user });
                        }
                    }
                    else
                    {
                        return BadRequest(new { message = Static.Account.WrongPassword });
                    }  
                }
                return NotFound(new { message = Static.Account.UserNotFound });
            }
            catch(Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message );
                return BadRequest();
            }
        }

       

        /// <summary>
        /// verification of user after registeration based on the unique token generated 
        /// </summary>
        /// <param name="token"></param>
        /// <returns></returns>
        [HttpPost("verify-email")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult VerifyEmail(string token)
        {
            try
            {
                if(string.IsNullOrEmpty(token))
                {
                    return BadRequest();
                }
                bool returnvalue = _accountService.VerifyEmail(token);
                if (!returnvalue)
                {
                    return BadRequest(new { message = Static.Account.VerifyError });
                }
                return Ok(new { message = Static.Account.VerifySuccess });
            }
            catch(Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message );
                return BadRequest();
            }
        }

        /// <summary>
        /// to send email when user foregts the password and wants to change it 
        /// </summary>
        /// <param name="Email"></param>
        /// <returns></returns>
        [HttpPost("forget-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ForgetPassword(string Email) 
        {
            try
            {
                if(string.IsNullOrEmpty(Email))
                {
                    return BadRequest(new { message = Static.Account.ForgetPassError });            
                }
                _accountService.ForgetPassword(Email, Request.Headers["origin"]);
                return Ok(new { message = Static.Account.ForgetPass });
            }
            catch(Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }

        /// <summary>
        /// to check the unique token and reset the user's password 
        /// </summary>
        /// <param name="token"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        [HttpPost("reset-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ResetPassword(string token, string Password)
        {
            try
            {
                if(string.IsNullOrEmpty(token) || string.IsNullOrEmpty(Password))
                {
                    return BadRequest();
                }
                bool returnvalue = _accountService.ResetPassword(token, Password);
                if (!returnvalue)
                {
                    return BadRequest(new { message = Static.Account.ResetPassError });

                }
                return Ok(new { message = Static.Account.ResetPassSuccess });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message );
                return BadRequest();
            }
        }

        /// <summary>
        /// logout 
        /// </summary>
        /// <returns></returns>
        [HttpPost("Logout")]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok();
        }

    }
}
