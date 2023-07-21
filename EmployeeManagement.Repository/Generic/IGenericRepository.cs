using EmployeeManagement.Entity.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace EmployeeManagement.Repository.Generic
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();

        IEnumerable<T>  GetRecordsAsync(string? SearchText, string? SearchProperty, string? SortBy, int PageNo, int PageSize = 3);

        Task<T> GetByIdAsync(object id);

        void Insert(T obj);

        void Update(T obj);

        void Delete(object id);

        void Save();

        Task<T> FindByConditionAsync(Expression<Func<T, bool>> predicate);

        T FindByConditions(Func<T, bool> predicate);
    }
}

