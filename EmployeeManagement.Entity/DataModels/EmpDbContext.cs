using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Entity.DataModels;

public partial class EmpDbContext : DbContext
{
    public EmpDbContext()
    {
    }

    public EmpDbContext(DbContextOptions<EmpDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<Log> Logs { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RolePermission> RolePermissions { get; set; }

    public virtual DbSet<TokenVerification> TokenVerifications { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.CompanyId).HasName("PK__company__3E267235EDE73AAE");

            entity.ToTable("company");

            entity.Property(e => e.CompanyId).HasColumnName("company_id");
            entity.Property(e => e.CompanyContact)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("company_contact");
            entity.Property(e => e.CompanyDetails)
                .HasColumnType("text")
                .HasColumnName("company_details");
            entity.Property(e => e.CompanyEmail)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("company_email");
            entity.Property(e => e.CompanyImage)
                .IsUnicode(false)
                .HasColumnName("company_image");
            entity.Property(e => e.CompanyName)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("company_name");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValueSql("((0))")
                .HasColumnName("is_deleted");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<Log>(entity =>
        {
            entity.Property(e => e.TimeStamp).HasColumnType("datetime");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__roles__760965CCDE076B6E");

            entity.ToTable("roles");

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.RoleName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("role_name");
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => e.RolePermissionId).HasName("PK__role_per__B1E85A10299BE0A3");

            entity.ToTable("role_permission");

            entity.Property(e => e.RolePermissionId).HasColumnName("role_permission_id");
            entity.Property(e => e.CanAdd)
                .HasDefaultValueSql("((0))")
                .HasColumnName("can_add");
            entity.Property(e => e.CanDelete)
                .HasDefaultValueSql("((0))")
                .HasColumnName("can_delete");
            entity.Property(e => e.CanEdit)
                .HasDefaultValueSql("((0))")
                .HasColumnName("can_edit");
            entity.Property(e => e.CanView)
                .HasDefaultValueSql("((1))")
                .HasColumnName("can_view");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__role_perm__role___60A75C0F");
        });

        modelBuilder.Entity<TokenVerification>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__token_ve__3213E83F889035A5");

            entity.ToTable("token_verification");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.IsResetTokenUsed)
                .HasDefaultValueSql("((0))")
                .HasColumnName("is_reset_token_used");
            entity.Property(e => e.IsVerified)
                .HasDefaultValueSql("((0))")
                .HasColumnName("is_verified");
            entity.Property(e => e.PasswordResetToken)
                .IsUnicode(false)
                .HasColumnName("password_reset_token");
            entity.Property(e => e.ResetTokenTime)
                .HasColumnType("datetime")
                .HasColumnName("reset_token_time");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.VerificationToken)
                .IsUnicode(false)
                .HasColumnName("verification_token");
            entity.Property(e => e.VerificationTokenTime)
                .HasColumnType("datetime")
                .HasColumnName("verification_token_time");

            entity.HasOne(d => d.User).WithMany(p => p.TokenVerifications)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__token_ver__user___74AE54BC");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__users__B9BE370F1CBBD432");

            entity.ToTable("users");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CompanyId).HasColumnName("company_id");
            entity.Property(e => e.ContactNo)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("contact_no");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(128)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("first_name");
            entity.Property(e => e.IsDeleted)
                .HasDefaultValueSql("((0))")
                .HasColumnName("is_deleted");
            entity.Property(e => e.IsVerified)
                .HasDefaultValueSql("((0))")
                .HasColumnName("is_verified");
            entity.Property(e => e.LastName)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("last_name");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.ProfileImg)
                .IsUnicode(false)
                .HasColumnName("profile_img");
            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.Status)
                .HasDefaultValueSql("((0))")
                .HasColumnName("status");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserType)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("user_type");

            entity.HasOne(d => d.Company).WithMany(p => p.Users)
                .HasForeignKey(d => d.CompanyId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__users__company_i__5165187F");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK__users__role_id__656C112C");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
