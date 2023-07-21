namespace EmployeeManagement.Entity.ViewModel
{
    public class EditUserVM
    {
           public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string ContactNo { get; set; } = null!;

        public string? ProfileImg { get; set; }

       //public string? Password { get; set; } 

        public long? CompanyId { get; set; }

        public long? RoleId { get; set; }

        public string? UserType { get; set; } = null!;

        public bool Status { get; set; }
    }
}
