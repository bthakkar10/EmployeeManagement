import { Button, Container, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useAlertContext } from "../_Context/useAlertContext";
import { roleService } from "../_Services/role.service";

interface CombinedList {
    RoleId: number;
    RoleName: string;
    RolePermissionId: number;
    canEdit: boolean;
    canAdd: boolean;
    canDelete: boolean;
    canView: boolean;
}

const RolePermission = () => {

    //set alert message
    const { setAlert } = useAlertContext();

    //getting both roles and roles permissions
    const [rolesList, setRolesList] = useState([]);
    const [rolePermissionList, setRolePermissionList] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        roleService.getRolesList()
            .then((response) => {
                setRolesList(response);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setAlert({ type: 'error', message: error.message });
            });
        roleService.getRolePermissionList()
            .then((response) => {
                setRolePermissionList(response);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setAlert({ type: 'error', message: error.message });
            });
    }, []);

    //combining both roles and roles permissions
    const [combinedData, setCombinedData] = useState<CombinedList[]>([]);

    useEffect(() => {
        setCombinedData(rolesList.map((item: any) => {
            const list: any = rolePermissionList.find((element: any) => element.roleId === item.roleId);
            if (list) {
                return { ...item, ...list };
            }
            return item;
            //console.log(combinedData);
        }))
    }, [rolePermissionList, rolesList])

    // handle toggle switch change event 
    const handleSwitchChange = (row: any, propertyName: string) => {
        const updatedRow = { ...row, [propertyName]: !row[propertyName] };
        // Update the combinedData state with the updated row
        setCombinedData((prevData: any) =>
            prevData.map((prevRow: any) => (prevRow.rolePermissionId === row.rolePermissionId ? updatedRow : prevRow))
        );
    };

    //edit the role permissions
    const handleSaveClick = (row: any) => {
        // console.log("Saving changes for row:", row);
        roleService.editRolePermission(row, row.roleId)
            .then((response) => {
                setAlert({ type: 'success', message: response.message });
            })
            .catch((error) => {
                setAlert({ type: 'error', message: error.message });

            });
    };


    return (
        <Container maxWidth="xl">
            <Typography variant="h2" align="center" margin={4}>
                Role Permissions
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Role Name</TableCell>
                            <TableCell>View</TableCell>
                            <TableCell>Add</TableCell>
                            <TableCell>Edit</TableCell>
                            <TableCell>Delete</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    {!loading && <TableBody>
                        {combinedData.map((row: any) => (
                            <TableRow
                                key={row.roleId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell >
                                    {row.roleName}
                                </TableCell>
                                <TableCell>
                                    <Switch checked={row.canView}
                                        onChange={() => handleSwitchChange(row, 'canView')} />
                                </TableCell>
                                <TableCell >
                                    <Switch checked={row.canAdd}
                                        onChange={() => handleSwitchChange(row, 'canAdd')} />
                                </TableCell>
                                <TableCell >
                                    <Switch checked={row.canEdit}
                                        onChange={() => handleSwitchChange(row, 'canEdit')} />
                                </TableCell>
                                <TableCell >
                                    <Switch checked={row.canDelete}
                                        onChange={() => handleSwitchChange(row, 'canDelete')} />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained" onClick={() => handleSaveClick(row)}>
                                        Save
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>}
                </Table>
            </TableContainer>
        </Container>
    );
};
export default RolePermission;
