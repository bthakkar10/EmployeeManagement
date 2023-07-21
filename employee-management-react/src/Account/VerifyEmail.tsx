import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { accountService } from '../_Services/account.service';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box, Container } from '@mui/material';
import { useAlertContext } from '../_Context/useAlertContext';

const VerifyEmail = () => {
    const EmailStatus = {
        Verifying: 'Verifying',
        Failed: 'Failed',
        Verified: 'Verified'
    }

    const navigate = useNavigate();

    //set alert message
    const { setAlert } = useAlertContext();

    const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

    useEffect(() => {
        // eslint-disable-next-line no-restricted-globals
        const { token } = queryString.parse(location.search);

        // remove token from url to prevent http referer leakage
        // eslint-disable-next-line no-restricted-globals
        navigate(location.pathname);

        accountService.verifyEmail(token)
            .then((response) => {
                setAlert({ type: 'success', message: response.message });
                setEmailStatus(EmailStatus.Verified)
            })
            .catch((error) => {
                setAlert({ type: 'error', message: error.message });
                setEmailStatus(EmailStatus.Failed);
            });
    }, []);

    function getBody() {
        switch (emailStatus) {
            case EmailStatus.Verifying:
                return <Typography variant="h3" align="center" margin="dense">
                    Verifying...
                </Typography>;
            case EmailStatus.Failed:
                return <Typography variant="h3" align="center" margin="dense">
                    Verification Failed!!
                </Typography>;
            case EmailStatus.Verified:
                return <Typography variant="h3" align="center" margin="dense">
                    Congratulations!! You have been successfully verified!!. <Link to="/"> Please click here to Login!!</Link>
                </Typography>;
        }
    }

    return (
        <Container maxWidth="md">
            <Grid container margin={5} spacing={5}>
                <Box px={5} py={5}>
                    <Typography variant="h1" align="center" margin="dense">
                        Verify Email
                    </Typography>
                    <Typography>{getBody()}</Typography>
                </Box>
            </Grid>
        </Container>
    )
}

export default VerifyEmail; 