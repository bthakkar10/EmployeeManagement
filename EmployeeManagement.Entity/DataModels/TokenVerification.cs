using System;
using System.Collections.Generic;

namespace EmployeeManagement.Entity.DataModels;

public partial class TokenVerification
{
    public long Id { get; set; }

    public long? UserId { get; set; }

    public string? Email { get; set; }

    public string? VerificationToken { get; set; }

    public bool? IsVerified { get; set; }

    public DateTime? VerificationTokenTime { get; set; }

    public string? PasswordResetToken { get; set; }

    public bool? IsResetTokenUsed { get; set; }

    public DateTime? ResetTokenTime { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User? User { get; set; }
}
