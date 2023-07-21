import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Typography, Paper, Box, Grid, TextField, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, IconButton, Container, CircularProgress } from '@mui/material';
import { accountService } from '../_Services/account.service';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validations } from '../_Helpers/validations';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAlertContext } from '../_Context/useAlertContext';

const Register = () => {
    const navigate = useNavigate();

    //set alert message
    const { setAlert } = useAlertContext();

    //set spinner while loading
    const [Loading, setLoading] = useState(false);

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

    //validations using yup library
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        contactNo: Yup.string()
            .required('Contact No is required')
            .matches(validations.patterns.contactNo, validations.messages.digitOnly)
            .min(10, validations.messages.contactLength)
            .max(10, validations.messages.contactLength),
        email: Yup.string()
            .required('Email is required')
            .matches(validations.patterns.email, validations.messages.emailValid),
        password: Yup.string()
            .required('Password is required')
            .matches(validations.patterns.password, validations.messages.password),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), ''], validations.messages.confPassMatch),
        companyId: Yup.string()
            .required('Company Name is required'),
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
            accountService.register(data)
                .then((response) => {
                    setAlert({ type: 'success', message: response.message });
                    navigate("/");
                })
                .catch(error => {
                    console.log(error);
                    setAlert({ type: 'error', message: error.message });
                });
            setLoading(false);
        }, 3000)
    };

    //getting and setting the company list 
    const [companyList, setCompanyList] = React.useState([]);
    const [companyName, setCompanyName] = React.useState('');

    useEffect(() => {
        accountService.getAllCompany()
            .then((response) => {
                setCompanyList(response); //  response is an array of companies
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);

    //handle change in select box (used to display company list)
    const handleChange = (event: SelectChangeEvent) => {
        setCompanyName(event.target.value);
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
                                Register
                            </Typography>
                            <Grid container margin="dense" spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="firstName"
                                        label="First Name"
                                        fullWidth
                                        margin="dense"
                                        {...register('firstName')}
                                        name='firstName'
                                        //error={errors.firstName && touchedFields.firstName}
                                        error={errors.firstName ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {(errors.firstName) ? errors.firstName?.message : ''}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="lastName"
                                        label="Last Name"
                                        fullWidth
                                        margin="dense"
                                        {...register('lastName')}
                                        error={errors.lastName ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {errors.lastName?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="contactNo"
                                        label="Contact Number"
                                        fullWidth
                                        margin="dense"
                                        {...register('contactNo')}
                                        name="contactNo"
                                        error={errors.contactNo ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {errors.contactNo?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
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
                                <Grid item xs={12} sm={6}>
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
                                <Grid item xs={12} sm={6}>
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

                                <Grid item xs={12}>
                                    <FormControl required fullWidth >
                                        <InputLabel id="">Select Company</InputLabel>
                                        <Select
                                            id="companyId"
                                            value={companyName}
                                            label="Company Name *"
                                            {...register('companyId')}
                                            onChange={handleChange}
                                            error={errors.companyId ? true : false}
                                        >
                                            {companyList.map((list: any) => (
                                                <MenuItem key={list.companyId} value={list.companyId}>
                                                    {list.companyName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Typography variant="inherit" color="error">
                                        {errors.companyId?.message}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box mt={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Register &nbsp;
                                    {Loading && <CircularProgress color='inherit' />}
                                </Button>
                            </Box>
                            <Typography margin={3}>
                                Already Registered? <Link to="/">Login Now</Link>
                            </Typography>
                        </Grid>
                    </Paper>
                </Box>
            </Container>
        </Fragment>
    );
}

export default Register;
