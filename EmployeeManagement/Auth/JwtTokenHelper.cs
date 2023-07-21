using EmployeeManagement.Entity.Auth;
using EmployeeManagement.Entity.DataModels;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace EmployeeManagement.Auth
{
    /// <summary>
    /// to generate jwt token everytime user logs in for authentication
    /// </summary>
    public static class JwtTokenHelper
    {
        /// <summary>
        /// generate jwt token method 
        /// </summary>
        /// <param name="jwtSetting">jwtsettings model containing issuer, key and audience</param>
        /// <param name="user">user model </param>
        /// <returns>jwt token in string format </returns>
        public static string GenerateToken(JwtSetting jwtSetting, User user)
        {
            if (jwtSetting == null)
                return string.Empty;

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSetting.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.FirstName + user.LastName),
                new Claim(ClaimTypes.NameIdentifier, user.Email),
                new Claim(ClaimTypes.Role, user.UserType),          
                new Claim("CustomClaimForUser", JsonSerializer.Serialize(user)),  // Additional Claims
                new Claim("CustomSubRoleClaims",  user.RoleId.ToString()),
                new Claim("exp", DateTime.UtcNow.AddMinutes(30).ToString()) // Expiration Time Claim
            };

            var token = new JwtSecurityToken(
                jwtSetting.Issuer,
                jwtSetting.Audience,
                claims,
                expires: DateTime.UtcNow.AddMinutes(30), // Default 5 mins, max 1 day
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
