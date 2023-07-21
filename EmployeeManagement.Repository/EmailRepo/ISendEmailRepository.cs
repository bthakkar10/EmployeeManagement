using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeManagement.Repository.EmailRepo
{
    public interface ISendEmailRepository
    {
        public void Send(string to, string subject, string html, string from = null);
    }
}
