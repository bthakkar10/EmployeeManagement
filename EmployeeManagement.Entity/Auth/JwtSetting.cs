namespace EmployeeManagement.Entity.Auth
{
    /// <summary>
    /// General settings to set the jwt token 
    /// </summary>
    public class JwtSetting
    {
        public string Key { get; set; } = null!;
        public string Issuer { get; set; } = null!;
        public string Audience { get; set; } = null!;
    }
}
