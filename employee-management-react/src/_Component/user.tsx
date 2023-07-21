import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Roles } from './nav';
import { userService } from '../_Services/user.service';
import { accountService } from '../_Services/account.service';
import { Link, useNavigate } from 'react-router-dom';
import { roleService } from '../_Services/role.service';
import { useAlertContext } from '../_Context/useAlertContext';

export interface User {
    userId: number,
    firstName: string,
    lastName: string,
    companyId: any,
    email: string,
    contactNo: string,
    password: string,
    status: any,
    roleId: any,
    userType: any,
}

interface rolePermission {
    rolePermissionId: number;
    roleId: number;
    canAdd: boolean;
    canEdit: boolean;
    canView: boolean;
    canDelete: boolean;
}

const Users = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<User[]>([]);
    //for delete
    const [openDialog, setOpenDialog] = useState(false);
    const [id, setId] = useState(0);

    //set alert message
    const { setAlert } = useAlertContext();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdminUser, setIsAdminUser] = useState(false);

    const userJson = localStorage.getItem("user");
    const user = userJson !== null ? JSON.parse(userJson) : null;

    //getting and setting the company list 
    const [companyList, setCompanyList] = React.useState([]);
    useEffect(() => {
        accountService.getAllCompany()
            .then((response) => {
                setCompanyList(response); //  response is an array of companies
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);

    const companyMap = useMemo(() => {
        const map = new Map<number, string>(); // Or use an object if companyId is a string
        companyList.forEach((company: any) => {
            map.set(company.companyId, company.companyName);
        });
        return map;
    }, [companyList]);

    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    useEffect(() => {
        if (currentUser) {
            setIsAdminUser(currentUser.userType === Roles.admin);
            if (currentUser.userType === Roles.admin && data.length === 0) {
                userService.getAllUsers()
                    .then((response) => {
                        setData(response);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else if (currentUser.userType === Roles.user && currentUser.companyId && data.length === 0) {
                userService.getUsersBasedOnCompany(currentUser.companyId)
                    .then((response) => {
                        setData(response);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    }, [currentUser, data, isAdminUser]);


    //to fetch the role permission so that add/edit can be shown accordingly 
    const [rolePermissionList, setRolePermissionList] = useState<rolePermission | null>(null);
    useEffect(() => {
        const RoleId = user.roleId;
        if (RoleId) {
            roleService.getRolePermission(RoleId)
                .then((response) => {
                    setRolePermissionList(response);
                    //  console.log(rolePermissionList, "rolepermission")
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [user.roleId]);

    const columns = useMemo<MRT_ColumnDef<User>[]>(() =>
        [
            {
                accessorFn: (user) => `${user.firstName} ${user.lastName}`,
                id: 'name',
                header: 'Name',
                size: 100
            },
            {
                accessorFn: (user) => user.email,
                id: 'email',
                header: 'Email',
                size: 400
            },
            {
                accessorFn: (user) => user.contactNo,
                id: 'contactNo',
                header: 'Contact No',
                size: 100
            },
            {
                accessorFn: (user) => {
                    const companyName = companyMap.get(user.companyId);
                    return companyName || '';
                },
                id: 'companyId',
                header: 'Company Name',
                size: 50
            },
        ], [companyMap]
    );
    // to rediect to edit
    const handleEdit = (id: any) => {
        navigate(`/EditUser/${id}`);
    };

    //to open dialog in delete
    const handleDialog = (id: any) => {
        setOpenDialog(true);
        setId(id);
    };
    //delete user
    const handleOnDeleteClick = (id: any) => {
        if (id !== 0) {
            userService.deleteUser(id)
                .then((response) => {
                    setAlert({ type: 'success', message: response.message });

                    // Remove the deleted user from the data array
                    setData((prevData) => prevData.filter((user) => user.userId !== id));
                })
                .catch((error) => {
                    setAlert({ type: 'error', message: error.message });

                    console.log(error)
                });
        }
        setOpenDialog(false);
    }

    return (
        <Container maxWidth="xl">
            <Typography variant="h2" align="center" margin={4}>
                Users
            </Typography>

            {/* delete alert dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>Are you sure you want to delete this user?</DialogContent>
                <DialogActions>
                    <Button onClick={() => handleOnDeleteClick(id)} color="error">
                        Delete
                    </Button>

                </DialogActions>
            </Dialog>
            <MaterialReactTable
                columns={columns} data={data}
                positionActionsColumn="last"
                getRowId={(originalRow: any) => originalRow.userId}
                enableColumnFilters={false} enableHiding={false} enableDensityToggle={false}
                enableFullScreenToggle={false} enableSortingRemoval={false}
                enableRowActions

                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>

                        {(isAdminUser || rolePermissionList?.canEdit) &&
                            <IconButton
                                color="secondary"
                                onClick={() => handleEdit(row.id)}
                            >
                                <Edit />
                            </IconButton>}

                        {(isAdminUser || rolePermissionList?.canDelete) && <IconButton
                            color="error"
                            onClick={() => handleDialog(row.id)}
                        >
                            <Delete />
                        </IconButton>}
                    </Box>)}
                renderTopToolbarCustomActions={() => (
                    (isAdminUser || rolePermissionList?.canAdd) &&
                    <Button
                        color="primary"
                        variant="contained"
                    >
                        <Link className='links' to="/AddUser"> Add Users</Link>
                    </Button>
                )}
            />
        </Container>
    )
};

export default Users;
