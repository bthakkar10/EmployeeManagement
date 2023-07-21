using EmployeeManagement.Entity.DataModels;
using System.Security.Cryptography;

namespace EmployeeManagement.Repository.EmailRepo
{
    public class EmailMessageRepository : IEmailMessageRepository
    {
        private readonly EmpDbContext _db;
        private readonly ISendEmailRepository _sendEmailRepo;

        public EmailMessageRepository(EmpDbContext db, ISendEmailRepository sendEmailRepo)
        {
            _db = db;
            _sendEmailRepo= sendEmailRepo;
        }

        /// <summary>
        /// to generate and store the token for email verification
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="origin"></param>
        public void VerifyEmailToken(long UserId, string origin)
        {
            TokenVerification tokenVerification = new()
            {
                UserId = UserId,
                VerificationToken = randomTokenString(),
                VerificationTokenTime = DateTime.Now.AddHours(4),
            };
            _db.Add(tokenVerification);
            _db.SaveChanges();

            //to set message body for sending email
            SendVerificationEmail(tokenVerification, origin);
        }

        /// <summary>
        /// to generate and store random token for password reset 
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="origin"></param>
        public void ForgetPassToken(long UserId, string origin)
        {
            // create reset token that expires after 4 hours
            TokenVerification tokenVerification = new()
            {
                UserId = UserId,
                PasswordResetToken = randomTokenString(),
                //setting the time after 4 hours to check the expiration of token
                ResetTokenTime = DateTime.Now.AddHours(4), 
                IsResetTokenUsed = false
            };

            _db.Add(tokenVerification);
            _db.SaveChanges();

            // send email
            SendResetPasswordMail(tokenVerification, origin);
        }


        /// <summary>
        /// To generate random token for forget password and email verification
        /// </summary>
        /// <returns></returns>
        private string randomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[40];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }

        /// <summary>
        /// Message body for sending verification email 
        /// </summary>
        /// <param name="tokenVerification"></param>
        /// <param name="origin"></param>
        private void SendVerificationEmail(TokenVerification tokenVerification, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var verifyUrl = $"{origin}/verify-email?token={tokenVerification.VerificationToken}";
                message = $@"<p>Please click the below link to verify your email address. The link will be valid for only 4 hours:</p>
                             <p><a href=""{verifyUrl}"">{verifyUrl}</a></p>";
            }
            else
            {
                message = $@"<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                             <p><code>{tokenVerification.VerificationToken}</code></p>";
            }

            //to send email
            _sendEmailRepo.Send(
                to: tokenVerification.User!.Email,
                subject: "Sign-up Verification - Verify Email",
                html: $@"<h4>Verify Email</h4><h5>Dear {tokenVerification.User.FirstName}</h5>
                         <p>Thanks for registering!</p>
                         {message}"
            );
        }

        /// <summary>
        /// Message body to send reset password mail
        /// </summary>
        /// <param name="tokenVerification"></param>
        /// <param name="origin"></param>
        private void SendResetPasswordMail(TokenVerification tokenVerification, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var resetUrl = $"{origin}/reset-password?token={tokenVerification.PasswordResetToken}";
                message = $@"<p>Please click the below link to reset your password, the link will be valid for 4 hours:</p>
                             <p><a href=""{resetUrl}"">{resetUrl}</a></p>";
            }
            else
            {
                message = $@"<p>Please use the below token to reset your password with the <code>/accounts/reset-password</code> api route:</p>
                             <p><code>{tokenVerification.PasswordResetToken}</code></p>";
            }

            //to send email
            _sendEmailRepo.Send(
                to: tokenVerification.User!.Email,
                subject: "Sign-up Verification - Reset Password",
                html: $@"<h4>Reset Password Email</h4><h5>Dear {tokenVerification.User.FirstName}</h5>
                         {message}"
            );
        }
    }
}
