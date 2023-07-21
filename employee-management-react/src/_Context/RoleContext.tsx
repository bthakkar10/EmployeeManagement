import React, { useState, createContext } from "react";
import { Roles } from "../_Component/nav";

interface RoleProviderProps {
    children: React.ReactNode
}
// interface UserContextValue {
//     user: User | null;
//     setUser: (user: User | null) => void;
// }
export const RoleContext = createContext({
    currentRole: Roles.user, setCurrentRole: (currentRole: Roles) => { }
});
export const RoleProvider = ({ children }: RoleProviderProps) => {
    const [currentRole, setCurrentRole] = useState(Roles.user);
    return (
        <RoleContext.Provider value={{ currentRole, setCurrentRole }}>
            {children}
        </RoleContext.Provider>
    );
};
