import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import { accountService } from '../_Services/account.service';
import { useLoginContext } from '../_Context/useLoginContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRoleContext } from '../_Context/useRoleContext';

export enum Roles {
    user = 'user',
    admin = 'admin'
}

function NavBar() {
    const navigate = useNavigate();
    const { loggedIn, setLoggedIn } = useLoginContext()
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const [currentTab, setCurrentTab] = useState("/home");

    const handleChangeTab = (event: any) => {
        setCurrentTab(event.target.pathname);
    };

    const renderTab = (pathname: string) => {
        const isActive = pathname === currentTab;
        return (
            <Link
                className={isActive ? "links current" : "links"}
                to={pathname}
                onClick={handleChangeTab}
            >
                {pathname === "/users" ? "Users" : pathname === "/company" ? "Company" : pathname === "/home" ? "EMPLOYEE MANAGEMENT"
                    : pathname === '/rolePermission' ? "Role Permission" : pathname}
            </Link>
        );
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    //to get the type of user 
    const { currentRole } = useRoleContext();

    const handleLogout = () => {
        setCurrentTab("/home");
        accountService.logout();
        setLoggedIn(!loggedIn);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate('/');
    };

    return (
        <>
            {
                (loggedIn) ?
                    (
                        <AppBar position="static" >
                            < Container maxWidth="xl" >
                                <Toolbar disableGutters>

                                    <Typography
                                        variant="h6"
                                        noWrap
                                        component="a"
                                        sx={{
                                            mr: 2,
                                            display: { xs: 'none', md: 'flex' },
                                            fontFamily: 'monospace',
                                            fontWeight: 300,
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {renderTab("/home")}
                                    </Typography>

                                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                        <IconButton
                                            size="large"
                                            aria-label="account of current user"
                                            aria-controls="menu-appbar"
                                            aria-haspopup="true"
                                            onClick={handleOpenNavMenu}
                                            color="inherit"
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                        <Menu
                                            id="menu-appbar"
                                            color='primary'
                                            anchorEl={anchorElNav}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            open={Boolean(anchorElNav)}
                                            onClose={handleCloseNavMenu}
                                            sx={{
                                                display: { xs: 'block', md: 'none' },
                                            }}
                                        >

                                            <MenuItem onClick={handleCloseNavMenu}>
                                                <Typography textAlign="center">
                                                    {renderTab("/users")}
                                                </Typography>
                                            </MenuItem>

                                            {(currentRole === Roles.admin) && <>
                                                <MenuItem onClick={handleCloseNavMenu}>
                                                    <Typography textAlign="center">
                                                        {renderTab("/company")}
                                                    </Typography>
                                                </MenuItem>
                                                <MenuItem onClick={handleCloseNavMenu}>
                                                    <Typography textAlign="center">
                                                        {renderTab("/rolePermission")}
                                                    </Typography>
                                                </MenuItem>
                                            </>
                                            }
                                            <Button onClick={handleLogout}>
                                                <Link to="/"> Logout  </Link>
                                            </Button>

                                        </Menu>
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        noWrap
                                        component="a"
                                        href=""
                                        sx={{
                                            mr: 2,
                                            display: { xs: 'flex', md: 'none' },
                                            flexGrow: 1,
                                            fontFamily: 'monospace',
                                            fontWeight: 300,
                                            color: 'inherit',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Employee Management
                                    </Typography>
                                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                    </Box>

                                    <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                                        <Button
                                            onClick={handleCloseNavMenu}>
                                            {renderTab("/users")}
                                        </Button>
                                        {(currentRole === Roles.admin) && <>
                                            <Button
                                                onClick={handleCloseNavMenu}>
                                                {renderTab("/company")}
                                            </Button>
                                            <Button
                                                onClick={handleCloseNavMenu}>
                                                {renderTab("/rolePermission")}
                                            </Button>
                                        </>
                                        }
                                        <Button aria-label="logout" onClick={handleLogout}>
                                            <LogoutIcon className='links' />
                                        </Button>
                                    </Box>
                                </Toolbar>
                            </Container >
                        </AppBar >) : <></>
            }

        </>
    );
}
export default NavBar;
