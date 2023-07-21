import { Alert, Snackbar, Stack } from "@mui/material";
import { useAlertContext } from "../_Context/useAlertContext";

function extractMessageFromResponse(response: any) {
    if (response && response.message) {
        return response.message;
    }
    return null;
}

const Alerts = () => {
    const { alert, setAlert } = useAlertContext();

    const handleClose = () => {
        setAlert(null);
    }

    return (
        <>
            {alert && (
                <Stack spacing={2}>
                    <Snackbar anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }} open={true} autoHideDuration={5000} onClose={handleClose}>
                        <Alert variant="filled" onClose={handleClose} severity={alert.type}
                            style={{ width: '500px' }} // Increase the width here
                            elevation={6}>
                            {alert.message}
                        </Alert>
                    </Snackbar>
                </Stack>
            )}
        </>
    );
}


export { Alerts, extractMessageFromResponse };