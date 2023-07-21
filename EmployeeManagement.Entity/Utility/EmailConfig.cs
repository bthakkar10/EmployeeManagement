namespace EmployeeManagement.Entity.Utility
{
    /// <summary>
    /// General Configuration settings to send email 
    /// </summary>
    public class EmailConfig
    {
        public string Secret { get; set; } = null!;

        public string EmailFrom { get; set; } = null!;

        public string SmtpHost { get; set; } = null!;

        public int SmtpPort { get; set; }

        public string? SmtpUser { get; set; }

        public string SmtpPass { get; set; } = null!;

    }
}
