using EmployeeManagement.Entity.ViewModel;
using EmployeeManagement.Services.CompanyServiceFolder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.Controllers
{
    /// <summary>
    /// To perform basic CRUD for company
    /// </summary>
    [Authorize(Roles  = "admin")]
    [ApiController]
    [Route("Companies")]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompaniesController(ICompanyService comapnyService)
        {
            _companyService = comapnyService;
        }

        /// <summary>
        /// get the records of company based on searching, sorting and pagination
        /// </summary>
        /// <returns></returns>
        [HttpGet("Get")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult GetCompany()
        {
            try
            {
                var result =  _companyService.GetRecords();
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
        /// get the list of company
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCompany()
        {
            try
            {
                var result = await _companyService.GetAllAsync();
                if(result == null)
                {
                    return BadRequest();
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
        /// to add a new company
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async  Task<IActionResult> AddCompany(CompanyViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }
                bool returnvalue = await _companyService.AddCompany(model);
                if (!returnvalue)
                {
                    return BadRequest(new { message = Static.Company.AddCompanyError });
                }
                return Ok( new { message =  Static.Company.AddCompanySuccess });

            }
            catch (Exception ex)
            {   
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }

        }

        /// <summary>
        /// to edit a company 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EditCompany(long id, CompanyViewModel model)
        {
            try
            {
                if (!ModelState.IsValid || id == 0 )
                {
                    return BadRequest();
                }
                bool returnvalue = await _companyService.EditCompany(model, id);
                if (!returnvalue)
                {
                    return BadRequest(new { message = Static.Company.UpdateCompanyError });
                }
                return Ok(new { message =  Static.Company.UpdateCompanySuccess });

            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }

        /// <summary>
        /// delete a particular company 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteCompany(long id)
        {
            try
            {
                if (id == 0)
                {
                    return BadRequest();
                }
                bool returnvalue = await _companyService.DeleteCompany(id);
                if (!returnvalue)
                {
                    return BadRequest(new { message = Static.Company.DeleteCompanyError });
                }
                return Ok(new { message = Static.Company.DeleteCompanySuccess });
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }

        /// <summary>
        /// get the details of a company based on its id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetByIdCompany(long id)
        {
            try
            {
                if (id == 0)
                {
                    return BadRequest();
                }
                var result = await _companyService.GetByIdAsync(id);
                if (result == null || result.CompanyId == 0)
                {
                    return BadRequest(new { message = Static.Company.GetById });
                }
                return Ok(result); 
            }
            catch(Exception ex)
            {
                Serilog.Log.Error(ex, ex.Message);
                return BadRequest();
            }
        }


    }
}
