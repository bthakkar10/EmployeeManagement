using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Entity.ViewModel
{
    public class RegisterViewModel
    {

        [Required(ErrorMessage = Static.ValidationMessages.FNameReq)]
        [MaxLength(16, ErrorMessage = Static.ValidationMessages.MaxCharac)]
        [RegularExpression( Static.ValidationPatterns.AlphabetsOnly , ErrorMessage = Static.ValidationMessages.AlphabetsOnly )]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = Static.ValidationMessages.LNameReq)]
        [MaxLength(16, ErrorMessage = Static.ValidationMessages.MaxCharac)]
        [RegularExpression( Static.ValidationPatterns.AlphabetsOnly , ErrorMessage = Static.ValidationMessages.AlphabetsOnly )]
        public string LastName { get; set; } = null!;

        [Required(ErrorMessage = Static.ValidationMessages.PassReq )]
        [RegularExpression(Static.ValidationPatterns.Password ,
        ErrorMessage = Static.ValidationMessages.Password )]
        public string? Password { get; set; }

        [Required(ErrorMessage = Static.ValidationMessages.EmailReq )]
        [EmailAddress(ErrorMessage = Static.ValidationMessages.ValidEmail )]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = Static.ValidationMessages.ContactReq )]
        [RegularExpression(Static.ValidationPatterns.ContactNo , ErrorMessage = Static.ValidationMessages.Contact )]
        public string? ContactNo { get; set; }

        public long? companyId { get; set; } = null!;

    }
}
