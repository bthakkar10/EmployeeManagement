import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ForgetPassword from './Account/ForgetPassword';
import Login from './Account/Login';
import Register from './Account/Register';
import ResetPassword from './Account/ResetPassword';
import VerifyEmail from './Account/VerifyEmail';
import AddEditCompany from './admin/AddEditCompany';
import Companies from './admin/company';
import RolePermission from './admin/RolePermission';
import { Alerts } from './alert/Alerts';
import './App.css';
import AddEditUsers from './_Component/AddEditUser';
import Home from './_Component/home';
import NavBar from './_Component/nav';
import Users from './_Component/user';
import { AlertProvider } from './_Context/AlertContext';
import { LoginProvider } from './_Context/LoginContext';
import { RoleProvider } from './_Context/RoleContext';

// import ShowSnakbar from './_Component/showSnackbar';
// import { Provider } from 'react-redux';
// import store from './store';

function App() {

  const userJson = localStorage.getItem('user');
  const user = userJson !== null ? JSON.parse(userJson) : null;
  console.log(user, "user from app component")

  return (
    //<Provider store={store}>
    <div className="App">
      <AlertProvider>
        <Alerts />
        <LoginProvider>
          <RoleProvider>
            <BrowserRouter>
              <NavBar />
              <Routes>
                <Route path={`/`} Component={Login} />
                <Route path={`/register`} Component={Register} />
                <Route path={`/verify-email`} Component={VerifyEmail} />
                <Route path={`/forget-password`} Component={ForgetPassword} />
                <Route path={`/reset-password`} Component={ResetPassword} />
                <Route path={`/home`} Component={Home} />
                <Route path={`/company`} Component={Companies} />
                <Route path={`/AddCompany`} Component={AddEditCompany} />
                <Route path={`/EditCompany/:id`} Component={AddEditCompany} />
                <Route path={`/users`} Component={Users} />
                <Route path={`/AddUser`} Component={AddEditUsers} />
                <Route path={`/EditUser/:id`} Component={AddEditUsers} />
                <Route path={`/rolePermission`} Component={RolePermission} />
              </Routes>
            </BrowserRouter>
          </RoleProvider>
        </LoginProvider>
      </AlertProvider>
    </div>
    //</Provider>
  );
}

export default App;
