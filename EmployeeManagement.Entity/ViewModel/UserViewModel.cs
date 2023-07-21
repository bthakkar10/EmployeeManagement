namespace EmployeeManagement.Entity.ViewModel
{
    public class UserViewModel
    {

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Email { get; set; } = null!; 

        public string ContactNo { get; set; } = null!;

        public string? ProfileImg { get; set; } 

        public string Password { get; set; } = null!;

        public long? CompanyId { get; set; }

        public long? RoleId { get; set; }

        public string? UserType { get; set; }

        public bool? Status { get; set; }
    }
}
