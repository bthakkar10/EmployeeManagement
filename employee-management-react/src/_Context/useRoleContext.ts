import { useContext } from 'react'
import { RoleContext } from './RoleContext'
export const useRoleContext = () => {
    return useContext(RoleContext)
}