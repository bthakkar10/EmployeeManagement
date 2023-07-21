namespace EmployeeManagement
{
    /// <summary>
    /// all the constants are defined here 
    /// </summary>
    public class Static
    {
        #region Enums
        public class Enums
        {
            public  enum UserType
            {
                admin,
                user
            }
        }
        #endregion

        #region Commonly used strings
        public class CommonStrings
        {
            public const string Delete = "IsDeleted";
            public const string default_img = "default-profile-img.png";
        }
        #endregion

        #region Company controller strings
        public class Company
        {
            public const string AddCompanySuccess = "New Company Added Successfully!!";
            public const string AddCompanyError = "Company Already Exists";

            public const string UpdateCompanySuccess = "Company Updated Successfully!!";
            public const string UpdateCompanyError = "Company Does not exists!!";

            public const string DeleteCompanySuccess = "Company Deleted Successfully!!";
            public const string DeleteCompanyError = "Users of this company already exists!!";

            public const string GetById = "Company does not exists !!";
        }
        #endregion

        #region User Controller strings
        public class User
        {
            public const string GetUserById = "User does not exist!";

            public const string AddUserSuccess = "New User created and verification mail sent successfully!!";
            public const string AddUserError = "User already exists!!";

            public const string UpdateUserSuccess = "User edited successfully!";
            public const string UpdateUserError = "User does not exists!";

            public const string DeleteUser = "User Deleted successfully!!";

            public const string GetUserError = "There are no Users of this company!!";
        }
        #endregion

        #region Account Controller strings
        public class Account
        {
            public const string RegisterSuccess = "Registration successful, please check your email for verification ";
            public const string ResgisterError = "User Already Exists!! Please login";

            public const string Verify = "You are not verified!! Please verify yourself first by clicking on the link provided in your mail!";
            public const string Inactive = "You are inactive!! Please try after sometime!!";
            public const string AdminSide = "Welcome to admin dashboard ";
            public const string UserSide = "Welcome  user !! ";
            public const string WrongPassword = "Your Password is incorrect!!";
            public const string UserNotFound = " User does not exist!! Please register first!! ";

            public const string VerifySuccess = "Verification successful, you can now login";
            public const string VerifyError = "Invalid token!! Please try again!!";

            public const string ForgetPass = "Email sent successfully! Please check your email and reset your password!";
            public const string ForgetPassError = "Please enter a valid email!!";

            public const string ResetPassSuccess = "Password resetted successfully!! You can now login!";
            public const string ResetPassError = "Token is invalid!! Please try again!!";
        }
        #endregion
        
        #region Role Permissions strings
        // Custom static class to define the policy names
        public class Permissions
        {
            public const string Create = "Create";
            public const string Edit = "Edit";
            public const string View = "View";
            public const string Delete = "Delete";
        }
        #endregion

        #region Validation Patterns 
        public class ValidationPatterns
        {
            public const string AlphabetsOnly = @"^[a-zA-Z]+$";
            public const string Password = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";
            public const string ContactNo = @"^[6-9]\d{9}$";
        }
        #endregion

        #region Validation Error Messages 
        public class ValidationMessages
        {
            public const string FNameReq = "First Name is required";
            public const string LNameReq = "Last Name is required";
            public const string MaxCharac = "Maximum 16 characters are allowed!!";
            public const string AlphabetsOnly = "Only alphabetical characters are allowed!!";
            public const string Password = "The password must contain at least 8 characters including at least one uppercase letter, one lowercase letter, one digit and one special character!!";
            public const string PassReq = "Password is required";
            public const string EmailReq = "Email is required";
            public const string ContactReq = "Contact Number is required";
            public const string ValidEmail = "Please enter only valid email addresss!!";
            public const string Contact = "Contact number must be of 10 digits and should start with 6, 7, 8, or 9.";
        }
        #endregion

        #region Role Permission Controller Strings
        public class RolePermissionConstatnt
        {
            public const string UpdateRoleSuccess = "Role Permission Updated Successfully";
            public const string UpdateRoleError = "Role does not exist";

            public const string AddRoleSuccess = "New Role Added Successfully";
            public const string AddRoleError = "The Role Already Exist";

            public const string GetRolePermissionById = "Role does not exist!";
        }
        #endregion

    }
}
