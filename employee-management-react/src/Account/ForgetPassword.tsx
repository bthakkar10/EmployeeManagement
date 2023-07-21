import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Typography, Paper, Box, Grid, TextField, Button, Container, CircularProgress } from '@mui/material';
import { accountService } from '../_Services/account.service';
import { validations } from '../_Helpers/validations';
import { Link, useNavigate } from 'react-router-dom';
import { useAlertContext } from '../_Context/useAlertContext';

//validations using yup library
const ForgetPassword = () => {

    const navigate = useNavigate();

    //set alert message
    const { setAlert } = useAlertContext();

    const [Loading, setLoading] = useState(false);

    //yup validations
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .matches(validations.patterns.email, validations.messages.emailValid),
    });

    //formState
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema)
    });



    //Handle OnSubmit Method call
    const onSubmit = (data: any) => {
        setLoading(true);
        setTimeout(() => {
            accountService.forgetPassword(data.email)
                .then((response) => {
                    //navigate to login
                    setAlert({ type: 'success', message: response.message });
                    navigate('/');
                })
                .catch(error => {
                    setAlert({ type: 'error', message: error.message });
                });
            setLoading(false);
        }, 3000)
    };


    //UI code starts from here 
    return (
        <Fragment>
            <Container maxWidth="md">
                {/* <AlertNotification {...alertProps} onClose={closeAlert} /> */}
                <Box mt={6} py={5}>
                    <Paper elevation={3}>
                        <Grid padding={4}>
                            <Typography variant="h2" align="center" margin="dense">
                                Forget Password
                            </Typography>

                            <Typography variant="h6" align="center" margin="dense">
                                Enter your email to reset your password
                            </Typography>

                            <Grid container margin="dense" spacing={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="email"
                                        label="Email"
                                        fullWidth
                                        margin="dense"
                                        {...register('email')}
                                        name="email"
                                        error={errors.email ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {errors.email?.message}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box mt={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Submit &nbsp;
                                    {Loading && <CircularProgress color='inherit' />}
                                </Button>
                            </Box>
                            <Typography margin={5}>
                                Don't have an account? <Link to="/register">Register Now</Link>
                            </Typography>
                        </Grid>
                    </Paper>
                </Box>
            </Container>
        </Fragment>
    );
}

export default ForgetPassword;


