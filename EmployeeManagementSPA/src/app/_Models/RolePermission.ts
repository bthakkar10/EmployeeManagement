export class RolePermission {
    RolePermissionId!: number
    roleId!: number
    RoleName?: string
    CanAdd: boolean = false
    CanEdit: boolean = false
    CanDelete: boolean = false
    CanView: boolean = true
}