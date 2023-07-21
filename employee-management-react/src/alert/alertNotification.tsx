import React from 'react';
import { Snackbar, Stack } from '@mui/material';
import { Alert } from '@mui/material';

export enum SeverityType {
    info = 'info',
    success = 'success',
    error = 'error',
    warning = 'warning'
}

type AlertNotificationProps = {
    open: boolean;
    severity: SeverityType;
    message: string;
    onClose: () => void;
    vertical: 'top',
    horizontal: 'center',
};



const AlertNotification: React.FC<AlertNotificationProps> = ({
    open,
    severity,
    message,
    onClose,
}) => {
    // if (!open) {
    //     return null; // Return null if open is false to hide the component
    // }
    return (
        // <Stack sx={{ width: '100%' }} spacing={2}>
        //     <Alert variant="filled" severity={severity}>
        //         {message}
        //     </Alert>
        // </Stack>
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Snackbar open={open} autoHideDuration={5000} onClose={onClose}>
                <Alert severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default AlertNotification;
