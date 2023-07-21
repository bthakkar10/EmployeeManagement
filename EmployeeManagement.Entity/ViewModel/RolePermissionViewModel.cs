namespace EmployeeManagement.Entity.ViewModel
{
    public class RolePermissionViewModel
    {
        public long RoleId {  get; set; }

        public bool CanAdd { get; set; }

        public bool CanEdit { get; set; }

        public bool CanView { get; set; }

        public bool CanDelete { get; set; } 
        
        public string? RoleName { get; set; }
    }
}
