using System.ComponentModel.DataAnnotations;


namespace EmployeeManagement.Entity.ViewModel
{
    public class ResetPassViewModel
    {
        [Required]
        public string Token { get; set; } = null!;

        [Required]
        [RegularExpression( Static.ValidationPatterns.Password ,
        ErrorMessage = Static.ValidationMessages.Password )]
        public string Password { get; set; } = null!;

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; } = null!;
    }
}
