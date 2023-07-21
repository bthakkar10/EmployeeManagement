import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { companyService } from '../_Services/company.service';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAlertContext } from '../_Context/useAlertContext';

interface Company {
    companyId: number
    companyName: string
    companyDetails: string
    companyEmail: string
    companyContact: string
    companyImage: string
}

const Companies = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<Company[]>([]);
    //delete company alert
    const [openDialog, setOpenDialog] = useState(false);
    const [id, setId] = useState(0);

    //set alert message
    const { setAlert } = useAlertContext();

    useEffect(() => {
        companyService.getAllCompany()
            .then((response) => {
                setData(response); //  response is an array of companies
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);

    const columns = useMemo<MRT_ColumnDef<Company>[]>(() =>
        [
            {
                accessorKey: 'companyName',
                header: 'Name',
                size: 100
            },
            {
                accessorKey: 'companyDetails',
                header: 'Details',
                size: 400
            },
            {
                accessorKey: 'companyEmail',
                header: 'Email',
                size: 100
            },
            {
                accessorKey: 'companyContact',
                header: 'Contact Number',
                size: 50
            },
        ], []
    );

    const handleEdit = (id: any) => {
        navigate(`/EditCompany/${id}`);
    };

    const handleOnDeleteClick = (id: any) => {
        if (id !== 0) {
            companyService.deleteCompany(id)
                .then((response) => {
                    setAlert({ type: 'success', message: response.message });
                    // Remove the deleted company from the data array
                    setData((prevData) => prevData.filter((company) => company.companyId !== id));
                })
                .catch((error) => {
                    setAlert({ type: 'error', message: error.message });
                    console.log(error)
                });
        }
        setOpenDialog(false);

    }

    const handleDialog = (id: any) => {
        setOpenDialog(true);
        setId(id);
    };


    return (
        <Container maxWidth="xl">
            <Typography variant="h2" align="center" margin={4}>
                Companies
            </Typography>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Delete Company</DialogTitle>
                <DialogContent>Are you sure you want to delete this company?</DialogContent>
                <DialogActions>
                    <Button onClick={() => handleOnDeleteClick(id)} color="error">
                        Delete
                    </Button>

                </DialogActions>
            </Dialog>


            <MaterialReactTable
                columns={columns} data={data}
                positionActionsColumn="last"
                getRowId={(originalRow: any) => originalRow.companyId}
                enableColumnFilters={false} enableHiding={false} enableDensityToggle={false}
                enableFullScreenToggle={false} enableSortingRemoval={false}
                enableRowActions

                renderRowActions={({ row, table }) => (

                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>

                        <IconButton
                            color="secondary"
                            onClick={() => handleEdit(row.id)}
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            color="error"
                            onClick={() => handleDialog(row.id)}
                        >
                            <Delete />
                        </IconButton>
                    </Box>)}
                renderTopToolbarCustomActions={() => (
                    <Button
                        color="primary"
                        variant="contained"
                    >
                        <Link className='links' to="/AddCompany"> Add Company</Link>
                    </Button>
                )}
            />
        </Container>
    )
};

export default Companies;
