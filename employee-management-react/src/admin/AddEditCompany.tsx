import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Typography, Paper, Box, Grid, TextField, Button, Container, CircularProgress } from '@mui/material';
import { validations } from '../_Helpers/validations';
import { companyService } from '../_Services/company.service';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlertContext } from '../_Context/useAlertContext';

interface InitialValues {
    companyName: string;
    companyContact: string;
    companyEmail: string;
    companyDetails: string;
}

const AddEditCompany = () => {

    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();

    //set alert message
    const { setAlert } = useAlertContext();

    const [intialValues, setInitialValues] = useState<InitialValues | null>(null);

    const [Loading, setLoading] = useState(false);



    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // Fetch the company data for editing and set it to the `company` state
        if (!isAddMode) {
            const fetchCompany = (id: any) => {
                companyService.getCompanyById(id)
                    .then((response) => {
                        setInitialValues(response);
                    })
                    .catch(error => {
                        console.log(error)

                    });
            };
            fetchCompany(id);
        }

    }, [isAddMode, id]);


    //validations using yup library
    const validationSchema = Yup.object().shape({
        companyName: Yup.string().required('Company Name is required'),
        companyContact: Yup.string()
            .required('Contact No is required')
            .matches(validations.patterns.contactNo, validations.messages.digitOnly)
            .min(10, validations.messages.contactLength)
            .max(10, validations.messages.contactLength),
        companyEmail: Yup.string()
            .required('Email is required')
            .matches(validations.patterns.email, validations.messages.emailValid),
        companyDetails: Yup.string()
            .required('Company Details is required')
    });

    //formState
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(validationSchema)
    });


    //Handle OnSubmit Method call
    const onSubmit = (data: any) => {
        setLoading(true);
        setTimeout(() => {
            if (!isAddMode) {
                //edit
                companyService.updateCompany(data, id)
                    .then((response) => {
                        setAlert({ type: 'success', message: response.message });
                        navigate('/company');
                    })
                    .catch(error => {
                        console.log(error);
                        setAlert({ type: 'error', message: error.message });
                    });

            }
            else {
                //add
                companyService.addCompany(data)
                    .then((response) => {
                        setAlert({ type: 'success', message: response.message });
                        navigate('/company');
                    })
                    .catch(error => {
                        console.log(error);
                        setAlert({ type: 'error', message: error.message });
                    });
            }
            setLoading(false);
        }, 1000)
    };



    useEffect(() => {
        // Populate the form fields with initial values when they are available
        if (intialValues) {
            setValue("companyName", intialValues.companyName);
            setValue('companyDetails', intialValues.companyDetails);
            setValue('companyEmail', intialValues.companyEmail);
            setValue('companyContact', intialValues.companyContact);
        }
    }, [intialValues, setValue]);


    //UI code starts from here 
    return (
        <Fragment>
            <Container maxWidth="md">
                <Box mt={6} py={5}>
                    <Paper elevation={3}>
                        <Grid padding={4}>
                            <Typography variant="h2" align="center" margin="dense">
                                {isAddMode ? "Add Company" : " Edit Company"}
                            </Typography>
                            <Grid container margin="dense" spacing={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="companyName"
                                        variant="filled"
                                        placeholder="Company Name"
                                        fullWidth
                                        margin="dense"
                                        {...register('companyName')}
                                        name='companyName'
                                        error={errors.companyName ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {(errors.companyName) ? errors.companyName?.message : ''}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="companyContact"
                                        placeholder="Contact Number"
                                        fullWidth
                                        variant="filled"
                                        margin="dense"
                                        {...register('companyContact')}
                                        name="companyContact"
                                        error={errors.companyContact ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {errors.companyContact?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="companyEmail"
                                        placeholder="Email"
                                        fullWidth
                                        margin="dense"
                                        variant="filled"
                                        {...register('companyEmail')}
                                        name="companyEmail"
                                        error={errors.companyEmail ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {errors.companyEmail?.message}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        multiline
                                        minRows={3}
                                        maxRows={6}
                                        required
                                        id="companyDetails"
                                        placeholder="Company Details"
                                        fullWidth
                                        variant="filled"
                                        margin="dense"
                                        {...register('companyDetails')}
                                        name="companyDetails"
                                        error={errors.companyDetails ? true : false}
                                    />
                                    <Typography variant="inherit" color="error">
                                        {errors.companyDetails?.message}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Box mt={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {isAddMode ? "Add" : "Save"} &nbsp;
                                    {Loading ? <CircularProgress color="inherit" /> : <></>}
                                </Button>
                            </Box>
                        </Grid>
                    </Paper>
                </Box>
            </Container>
        </Fragment>
    );
}

export default AddEditCompany;
