import { useContext } from "react"
import { AlertContext } from "./AlertContext"

export const useAlertContext = () => {
    return useContext(AlertContext);
}