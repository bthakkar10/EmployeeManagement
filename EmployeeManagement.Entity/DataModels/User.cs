using System;
using System.Collections.Generic;

namespace EmployeeManagement.Entity.DataModels;

public partial class User
{
    public long UserId { get; set; }

    public long CompanyId { get; set; }

    public string FirstName { get; set; } = null!;

    public string? LastName { get; set; }

    public string Email { get; set; } = null!;

    public string? ContactNo { get; set; }

    public string? ProfileImg { get; set; }

    public string Password { get; set; } = null!;

    public bool? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    public long? RoleId { get; set; }

    public string UserType { get; set; } = null!;

    public bool? IsVerified { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual Role? Role { get; set; }

    public virtual ICollection<TokenVerification> TokenVerifications { get; set; } = new List<TokenVerification>();
}
