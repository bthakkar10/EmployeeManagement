import { useState } from 'react';

export const useAlertService = () => {
    const [alertProps, setAlertProps] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const showAlert = (severity: 'success' | 'info' | 'warning' | 'error', message: string) => {
        setAlertProps({ open: true, severity, message });
    };

    const closeAlert = () => {
        setAlertProps((prevAlertProps) => ({ ...prevAlertProps, open: false }));
    };

    return { alertProps, showAlert, closeAlert };
};
