import { Roles } from "./Role"

export class User {
    userId!: number
    FirstName!: string
    LastName!: string
    CompanyId?: number
    Email!: string
    ContactNo!: string
    Password?: string
    status!: boolean
    RoleId?: number
    UserType!: Roles
}