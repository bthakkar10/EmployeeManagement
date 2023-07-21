import { createContext, useState } from 'react';

export type AlertType = 'success' | 'error';

interface AlertProviderProps {
    children: React.ReactNode
}

export interface AlertMessage {
    type: AlertType;
    message: string;
}

export interface AlertContextValue {
    alert: AlertMessage | null;
    setAlert: (message: AlertMessage | null) => void;
}

export const AlertContext = createContext<AlertContextValue>({
    alert: null,
    setAlert: () => null,
});

export const AlertProvider = ({ children }: AlertProviderProps) => {
    const [alert, setAlert] = useState<AlertMessage | null>(null);

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            {children}
        </AlertContext.Provider>
    );
};
