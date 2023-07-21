using System;
using System.Collections.Generic;

namespace EmployeeManagement.Entity.DataModels;

public partial class RolePermission
{
    public long RolePermissionId { get; set; }

    public long RoleId { get; set; }

    public bool? CanAdd { get; set; }

    public bool? CanEdit { get; set; }

    public bool? CanDelete { get; set; }

    public bool? CanView { get; set; }

    public virtual Role Role { get; set; } = null!;
}
