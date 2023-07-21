import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Typography, Paper, Box, Grid, TextField, Button, IconButton, Container, CircularProgress } from '@mui/material';
import { accountService } from '../_Services/account.service';
import { validations } from '../_Helpers/validations';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLoginContext } from '../_Context/useLoginContext';
import { useRoleContext } from '../_Context/useRoleContext';
import { useAlertContext } from '../_Context/useAlertContext';
import { Roles } from '../_Component/nav';


const Login = () => {
    const { loggedIn, setLoggedIn } = useLoginContext()
    const { currentRole, setCurrentRole } = useRoleContext();
    const navigate = useNavigate();

    //set alert message
    const { setAlert } = useAlertContext();

    //set spinner on loading
    const [Loading, setLoading] = useState(false);

    //show/hide password 
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePassword = () => {
        // When the handler is invoked inverse the boolean state of passwordShown
        setPasswordShown(!passwordShown);
    };

    //validations using yup library
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is required')
            .matches(validations.patterns.email, validations.messages.emailValid),
        password: Yup.string()
            .required('Password is required')
            .matches(validations.patterns.password, validations.messages.password),
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
            accountService.login(data.email, data.password)
                .then((response) => {
                    console.log(response)
                    setAlert({ type: 'success', message: response.message });
                    setLoggedIn(!loggedIn);
                    if (response.user.userType === Roles.admin) {
                        setCurrentRole(Roles.admin);
                    }
                    else if (response.user.userType === Roles.user) {
                        setCurrentRole(Roles.user);
                    }
                    console.log(currentRole, "setCurrentUser");
                    navigate('/home');
                })
                .catch(error => {
                    setAlert({ type: 'error', message: error });
                });
            setLoading(false);
        }, 1000)
    };

    //UI code starts from here 
    return (

        <Fragment>
            <Container maxWidth="md">

                <Box mt={6} py={5}>
                    <Paper elevation={3}>
                        <Grid padding={4}>
                            <Typography variant="h2" align="center" margin="dense">
                                Login
                            </Typography>

                            <Typography variant="h4" align="center" margin="dense">
                                Welcome Back here
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
                            </Grid>

                            <Box mt={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Login &nbsp;
                                    {Loading && <CircularProgress color='inherit' />}
                                </Button>
                            </Box>
                            <Typography margin={3}>
                                Don't have an account? <Link to="/register">Register Now</Link>
                            </Typography>
                            <Typography margin={3}>
                                Don't remember your password? <Link to="/forget-password">Reset Now</Link>
                            </Typography>
                        </Grid>
                    </Paper>
                </Box>
            </Container>
        </Fragment>

    );
}

export default Login;


