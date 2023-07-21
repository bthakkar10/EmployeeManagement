namespace EmployeeManagement.Repository.EmailRepo
{
    public interface IEmailMessageRepository
    {
        void VerifyEmailToken(long UserId, string origin);

        void ForgetPassToken(long UserId, string origin);

    }
}
