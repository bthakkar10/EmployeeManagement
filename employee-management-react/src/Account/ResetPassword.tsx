import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Typography, Paper, Box, Grid, TextField, Button, IconButton, Container } from '@mui/material';
import { accountService } from '../_Services/account.service';
import { validations } from '../_Helpers/validations';
import { Link, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAlertContext } from '../_Context/useAlertContext';

//validations using yup library
const ResetPassword = () => {

    const navigate = useNavigate();

    //set alert message
    const { setAlert } = useAlertContext();

    //show/hide password 
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePassword = () => {
        // When the handler is invoked inverse the boolean state of passwordShown
        setPasswordShown(!passwordShown);
    };

    const [confirmPasswordShow, SetConfirmPasswordShow] = useState(false);
    const toggleConfirmPassword = () => {
        // When the handler is invoked inverse the boolean state of passwordShown
        SetConfirmPasswordShow(!confirmPasswordShow);
    };


    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .required('Password is required')
            .matches(validations.patterns.password, validations.messages.password),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), ''], validations.messages.confPassMatch),
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

    // eslint-disable-next-line no-restricted-globals
    const tokenRef = queryString.parse(location.search);
    // const [token, setToken] = useState(null);
    // const [tokenStatus, setTokenStatus] = useState(TokenStatus.Validating);
    useEffect(() => {
        const token = tokenRef.token;
        if (token) {
            console.log(token)
        }
    })

    //Handle OnSubmit Method call
    const onSubmit = (data: any) => {
        accountService.resetPassword(tokenRef.token, data.password)
            .then((response) => {
                setAlert({ type: 'success', message: response.message });
                //navigate to login
                navigate('/');
            })
            .catch(error => {
                setAlert({ type: 'error', message: error.message });

            });
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
                                Reset Password
                            </Typography>

                            <Typography variant="h6" align="center" margin="dense">
                                Enter your new password
                            </Typography>

                            <Grid container margin="dense" spacing={4}>
                                <Grid item xs={12}>
                                    <div className='password-div'>
                                        <TextField
                                            required
                                            id="password"
                                            label="Password"
                                            type={passwordShown ? "text" : "password"}
                                            fullWidth
                                            margin="dense"
                                            {...register('password')}
                                            name='password'
                                            error={errors.password ? true : false}
                                        />
                                        <IconButton className="password-icon" edge="end" onClick={togglePassword}><VisibilityIcon /></IconButton>
                                    </div>
                                    <Typography variant="inherit" color="error">
                                        {errors.password?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className='password-div'>
                                        <TextField
                                            required
                                            id="confirmPassword"
                                            label="Confirm Password"
                                            type={confirmPasswordShow ? "text" : "password"}
                                            fullWidth
                                            margin="dense"
                                            {...register('confirmPassword')}
                                            name='confirmPassword'
                                            error={errors.confirmPassword ? true : false}
                                        />
                                        <IconButton className="password-icon" edge="end" onClick={toggleConfirmPassword}><VisibilityIcon /></IconButton>
                                    </div>
                                    <Typography variant="inherit" color="error">
                                        {errors.confirmPassword?.message}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box mt={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Reset Password
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

export default ResetPassword;


