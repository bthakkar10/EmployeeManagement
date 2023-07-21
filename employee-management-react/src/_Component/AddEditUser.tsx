import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Typography, Paper, Box, Grid, TextField, Button, Container, IconButton, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { validations } from '../_Helpers/validations';
import { useParams } from 'react-router-dom';
import { accountService } from '../_Services/account.service';
import { userService } from '../_Services/user.service';
import { User } from './user';
import { Roles } from './nav';
import { useAlertContext } from '../_Context/useAlertContext';
import { useNavigate } from 'react-router-dom';

const AddEditUsers = () => {
    //to fetch id from url
    const { id } = useParams();
    //edit if id is present else add mode 
    const isAddMode = !id;

    //set alert message
    const { setAlert } = useAlertContext();

    const navigate = useNavigate();

    //to set initial values in edit mode
    const [intialValues, setInitialValues] = useState<User | null>(null);

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

    //set spinner while loading
    const [Loading, setLoading] = useState(false);

    //to get the type of user 
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const userJson = localStorage.getItem("user");
    const user = userJson !== null ? JSON.parse(userJson) : null;

    useEffect(() => {
        setCurrentUser(user);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const isAdminUser = (currentUser?.userType === Roles.admin);

    //to fetch all the details of user when it is in edit mode 
    useEffect(() => {
        // Fetch the user data for editing and set it to the 'user' state
        if (!isAddMode) {
            const fetchUserData = (id: any) => {
                userService.getUserById(id)
                    .then((response) => {
                        setInitialValues(response);
                    })
                    .catch(error => {
                        console.log(error)

                    });
            };
            fetchUserData(id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAddMode, id]);

    //validations using yup library
    const validationSchema = Yup.object().shape({
        // isAddMode : isAddMode,
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
            .when('$isAddMode', {
                is: true,
                then: (validationSchema) => validationSchema.required('Password is required')
                    .matches(validations.patterns.password, validations.messages.password),
                otherwise: (validationSchema) => validationSchema.notRequired(),
            }),
        confirmPassword: Yup.string()
            .when('$isAddMode', {
                is: true,
                then: (validationSchema) => validationSchema.required('Confirm Password is required')
                    .oneOf([Yup.ref('password'), ''], validations.messages.confPassMatch),
                otherwise: (validationSchema) => validationSchema.notRequired(),
            }),
        companyId: Yup.string()
            .when('$isAdminUser', {
                is: true,
                then: (validationSchema) => validationSchema.required('Company is required'),
                otherwise: (validationSchema) => validationSchema.notRequired(),
            }),
        roleId: Yup.string()
            .when('$isAdminUser ', {
                is: true,
                then: (validationSchema) => validationSchema.required('Role is required'),
                otherwise: (validationSchema) => validationSchema.notRequired(),
            }),
        status: Yup.string()
            .when('$isAdminUser', {
                is: true,
                then: (validationSchema) => validationSchema.required('Status is required'),
                otherwise: (validationSchema) => validationSchema.notRequired(),
            }),
        userType: Yup.string()
            .when('$isAdminUser', {
                is: true,
                then: (validationSchema) => validationSchema.required('User Type is required'),
                otherwise: (validationSchema) => validationSchema.notRequired(),
            }),
    });

    //formState
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,

    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema),
        context: { isAddMode, isAdminUser }
    });


    //Handle OnSubmit Method call
    const onSubmit = (data: any) => {
        setLoading(true);
        setTimeout(() => {
            if (!isAddMode) {
                //edit
                console.log("in")
                const formValue = data;
                if (!isAdminUser) {
                    formValue.password = intialValues?.password;
                    formValue.userType = intialValues?.userType;
                    formValue.companyId = intialValues?.companyId;
                    formValue.status = intialValues?.status;
                    formValue.roleId = intialValues?.roleId;
                }
                console.log(formValue, "edit");
                userService.updateUser(formValue, id)
                    .then((response) => {
                        navigate('/users');
                        setAlert({ type: 'success', message: response.message });
                    })
                    .catch(error => {
                        console.log(error);
                        setAlert({ type: 'error', message: error.message });
                    });
            }
            else {
                //add
                const formValue = data;
                if (!isAdminUser) {
                    formValue.companyId = user.companyId; // Add same company Id as of the current user
                    formValue.userType = Roles.user; //  add new role as user if an user is adding new employee of same company 
                }
                console.log(formValue, "add")
                userService.addUser(formValue)
                    .then((response) => {
                        setAlert({ type: 'success', message: response.message });
                        navigate('/users');
                    })
                    .catch(error => {
                        console.log(error);
                        setAlert({ type: 'error', message: error.message });
                    });
            }
            setLoading(false);
        }, 3000);
    };


    // to set all the fetched values in edit mode
    useEffect(() => {
        //console.log(intialValues?.status)
        // Populate the form fields with initial values when they are available
        if (intialValues) {
            setValue("firstName", intialValues.firstName);
            setValue('lastName', intialValues.lastName);
            setValue('email', intialValues.email);
            setValue('contactNo', intialValues.contactNo);
            setValue('password', intialValues.password);
            setValue('companyId', intialValues.companyId);
            setValue('roleId', intialValues.roleId);
            setValue('status', intialValues.status);
            setValue('userType', intialValues.userType);
        }
    }, [intialValues, setValue]);

    //getting and setting the company list 
    const [companyList, setCompanyList] = useState([]);
    const [companyName, setCompanyName] = useState(intialValues?.companyId ?? '');

    useEffect(() => {
        accountService.getAllCompany()
            .then((response) => {
                setCompanyList(response); //  response is an array of companies
                setCompanyName(intialValues?.companyId)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [intialValues?.companyId]);

    //handle change in select box (used to display  change in company list)
    const handleChange = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value;
        setCompanyName(selectedValue === '' ? intialValues?.companyId ?? '' : selectedValue);
    };

    //getting and setting the role list 
    const [roleList, setRoleList] = useState([]);
    const [roleName, setRoleName] = useState(intialValues?.roleId ?? '');

    useEffect(() => {
        userService.getRolesList()
            .then((response) => {
                setRoleList(response); //  response is an array of roles
                setRoleName(intialValues?.roleId);
            })
            .catch((error) => {
                console.log(error)
            });
    }, [intialValues?.roleId]);

    //handle change in select box (used to display change in role list)
    const handleRoleChange = (event: SelectChangeEvent) => {
        setRoleName(event.target.value);
    };

    //handle change in select box (used to display change in status)
    const [status, setStatus] = useState(intialValues?.status ?? '');
    //setStatus(intialValues?.status);
    const handleStatusChange = (event: SelectChangeEvent) => {
        setStatus(event.target.value);
    }

    //handle change in select box (used to display change in user type)
    const [userType, setUserType] = useState(intialValues?.userType ?? '');
    //setUserType(intialValues?.userType)
    const handleUserTypeChange = (event: SelectChangeEvent) => {
        setUserType(event.target.value);
    }

    useEffect(() => {
        setStatus(intialValues?.status);
        setUserType(intialValues?.userType);
    }, [intialValues?.status, intialValues?.userType]);

    //UI code starts from here 
    return (
        <Fragment>
            <Container maxWidth="md">
                {/* <AlertNotification {...alertProps} onClose={closeAlert} /> */}
                <Box mt={6} py={5}>
                    <Paper elevation={3}>
                        <Grid padding={4}>
                            <Typography variant="h2" align="center" margin="dense">
                                {isAddMode ? "Add User" : " Edit User"}
                            </Typography>
                            <Grid container margin="dense" spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="firstName"
                                        variant="filled"
                                        placeholder="First Name"
                                        fullWidth
                                        margin="dense"
                                        {...register('firstName')}
                                        name='firstName'
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
                                        placeholder="Last Name"
                                        fullWidth
                                        variant="filled"
                                        margin="dense"
                                        {...register('lastName')}
                                        name="lastName"
                                        error={errors.lastName ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {errors.lastName?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="email"
                                        placeholder="Email"
                                        fullWidth
                                        margin="dense"
                                        variant="filled"
                                        {...register('email')}
                                        name="email"
                                        error={errors.email ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {errors.email?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="contactNo"
                                        placeholder="Contact No"
                                        fullWidth
                                        margin="dense"
                                        variant="filled"
                                        {...register('contactNo')}
                                        name="contactNo"
                                        error={errors.contactNo ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {errors.contactNo?.message}
                                    </Typography>
                                </Grid>
                                {!id && <>
                                    <Grid item xs={12} sm={6}>
                                        <div className='password-div'>
                                            <TextField
                                                required
                                                id="password"
                                                placeholder="Password"
                                                type={passwordShown ? "text" : "password"}
                                                fullWidth
                                                variant="filled"
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
                                                placeholder="Confirm Password"
                                                type={confirmPasswordShow ? "text" : "password"}
                                                fullWidth
                                                variant="filled"
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
                                </>
                                }

                                {isAdminUser ? <>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl required fullWidth >
                                            <InputLabel id="">Select Company</InputLabel>
                                            <Select
                                                id="companyId"
                                                value={companyName}
                                                variant="filled"
                                                placeholder="Company Name"
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

                                    <Grid item xs={12} sm={6}>
                                        <FormControl required fullWidth >
                                            <InputLabel id="">Select Role</InputLabel>
                                            <Select
                                                id="roleId"
                                                value={roleName ?? ""}
                                                variant="filled"
                                                placeholder="Role Name *"
                                                {...register('roleId')}
                                                //defaultValue={intialValues?.RoleId}
                                                onChange={handleRoleChange}
                                                error={errors.roleId ? true : false}
                                            >
                                                {roleList.map((list: any) => (
                                                    <MenuItem key={list.roleId} value={list.roleId}>
                                                        {list.roleName}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Typography variant="inherit" color="error">
                                            {errors.roleId?.message}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl required fullWidth >
                                            <InputLabel id="status-label">Select Status</InputLabel>
                                            <Select
                                                id="status"
                                                value={status ?? ""}
                                                variant="filled"
                                                placeholder="Status "
                                                {...register('status')}
                                                //defaultValue={intialValues?.status} // Set the initial value here
                                                onChange={handleStatusChange}
                                                error={errors.status ? true : false}
                                            >
                                                <MenuItem value="false">
                                                    In-Active
                                                </MenuItem>
                                                <MenuItem value="true">
                                                    Active
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Typography variant="inherit" color="error">
                                            {errors.status?.message}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl required fullWidth >
                                            <InputLabel id="">Select User Type</InputLabel>
                                            <Select
                                                id="userType"
                                                value={userType ?? ""}
                                                variant="filled"
                                                placeholder="User Type "
                                                {...register('userType')}
                                                // defaultValue={intialValues?.userType}
                                                onChange={handleUserTypeChange}
                                                error={errors.userType ? true : false}
                                            >
                                                <MenuItem key={Roles.admin} value={Roles.admin}>
                                                    Admin
                                                </MenuItem>
                                                <MenuItem key={Roles.user} value={Roles.user}>
                                                    User
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Typography variant="inherit" color="error">
                                            {errors.userType?.message}
                                        </Typography>
                                    </Grid>
                                </> : <></>
                                }
                            </Grid>

                            <Box mt={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {isAddMode ? "Add" : "Save"} &nbsp;
                                    {Loading && <CircularProgress color='inherit' />}
                                </Button>
                            </Box>
                        </Grid>
                    </Paper>
                </Box>
            </Container>
        </Fragment>
    );
}

export default AddEditUsers;
