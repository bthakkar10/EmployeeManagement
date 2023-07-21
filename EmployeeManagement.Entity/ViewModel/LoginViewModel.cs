using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Entity.ViewModel
{
    public class LoginViewModel
    {

        [EmailAddress(ErrorMessage = Static.ValidationMessages.ValidEmail)]
        [Required(ErrorMessage = Static.ValidationMessages.EmailReq)]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = Static.ValidationMessages.PassReq)]
        [RegularExpression(Static.ValidationPatterns.Password,
        ErrorMessage = Static.ValidationMessages.Password)]
        public string Password { get; set; } = null!;

    }
}
