using System;
using System.Collections.Generic;

namespace EmployeeManagement.Entity.DataModels;

public partial class Company
{
    public long CompanyId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string? CompanyDetails { get; set; }

    public string? CompanyEmail { get; set; }

    public string? CompanyContact { get; set; }

    public string? CompanyImage { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool? IsDeleted { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
