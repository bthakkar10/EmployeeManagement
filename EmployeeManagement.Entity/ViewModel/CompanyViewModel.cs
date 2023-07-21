using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Entity.ViewModel
{
    public  class CompanyViewModel
    {  

        [Required]
        public string CompanyName { get; set; } = null!;

        [Required]
        public string? CompanyDetails { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = Static.ValidationMessages.ValidEmail)]
        public string? CompanyEmail { get; set; }

        [Required]
        [RegularExpression( Static.ValidationPatterns.ContactNo , ErrorMessage = Static.ValidationMessages.Contact )]
        public string? CompanyContact { get; set; }
    }
}
