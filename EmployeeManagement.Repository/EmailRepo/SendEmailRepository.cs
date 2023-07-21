using EmployeeManagement.Entity.Utility;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;

namespace EmployeeManagement.Repository.EmailRepo
{
    public class SendEmailRepository : ISendEmailRepository
    {
        private  EmailConfig _emailConfig;

        public SendEmailRepository(IOptions<EmailConfig> emailConfig)
        {
            _emailConfig = emailConfig.Value;
        }
       

        /// <summary>
        /// Global Method to send email
        /// </summary>
        /// <param name="to">Receipent's address</param>
        /// <param name="subject">Subject of the email</param>
        /// <param name="html">message body of the email</param>
        /// <param name="from">Sender's address</param>
        public void Send(string to, string subject, string html, string from)
        {
            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_emailConfig.EmailFrom));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = html };

            // send email
            using var smtp = new SmtpClient();
            smtp.Connect(_emailConfig.SmtpHost, _emailConfig.SmtpPort, SecureSocketOptions.StartTls);
            smtp.Authenticate(_emailConfig.SmtpUser, _emailConfig.SmtpPass);
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}
