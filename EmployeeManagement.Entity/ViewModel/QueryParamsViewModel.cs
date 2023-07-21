using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeManagement.Entity.ViewModel
{
    public class QueryParamsViewModel
    {

        public string? SearchText { get; set; }  

        public string? SearchProperty { get; set;}

        public string? SortBy { get; set; }

        public int PageNo { get; set; }

        public int PageSize { get; set; } = 3;

    }
}
