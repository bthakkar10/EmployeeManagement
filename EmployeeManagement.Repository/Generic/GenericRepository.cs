using EmployeeManagement.Entity.DataModels;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace EmployeeManagement.Repository.Generic
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly EmpDbContext _db;
        private readonly DbSet<T> _table;

        public GenericRepository(EmpDbContext db)
        {
            _db = db ?? throw new ArgumentNullException(nameof(db));
            _table = db.Set<T>();
          
        }

        /// <summary>
        /// fetch all the records from db
        /// </summary>
        /// <returns></returns>
        public async  Task<IEnumerable<T>> GetAllAsync()
        {
            IQueryable<T> query = _table;
            var IsDeletedProperty = typeof(T).GetProperty(Static.CommonStrings.Delete);
            if (IsDeletedProperty != null && IsDeletedProperty.PropertyType == typeof(bool?))
            {
                query = query.Where(x => EF.Property<bool?>(x, Static.CommonStrings.Delete) == false);
            }
            return await query.ToListAsync();
        }

        /// <summary>
        /// fetch records with sort, pagination and search
        /// </summary>
        /// <param name="paramsViewModel"></param>
        /// <returns></returns>
        public IEnumerable<T> GetRecordsAsync(string? SearchText, string? SearchProperty, string? SortBy, int PageNo, int PageSize = 3)
        {
            IQueryable<T> query = _table;
           
            //take all records which are not deleted 
            var IsDeletedProperty = typeof(T).GetProperty(Static.CommonStrings.Delete);
            if(IsDeletedProperty !=  null && IsDeletedProperty.PropertyType == typeof(bool?)) 
            {
                query = query.Where(x => EF.Property<bool?>(x, Static.CommonStrings.Delete) == false).AsQueryable();
            }

            //search
            if(!string.IsNullOrEmpty(SearchText) && !string.IsNullOrEmpty(SearchProperty))
            {
                var property = typeof(T).GetProperty(SearchProperty);
                if (property != null && property.PropertyType == typeof(string) )
                {
                    query = query.AsEnumerable().Where(x => ((string)property.GetValue(x)).Contains(SearchText , StringComparison.OrdinalIgnoreCase)).AsQueryable();
                }
            }

            //sorting 
            if(!string.IsNullOrEmpty(SortBy))
            {
                var property = typeof(T).GetProperty(SortBy);   
                if(property != null) 
                {
                    query = query.AsEnumerable().OrderBy(x => property.GetValue(x)).AsQueryable();
                }
            }

            //pagination

            query =  query.Skip((PageNo - 1) * PageSize).Take(PageSize);
            return  query.ToList();
        }

        /// <summary>
        /// fetch record according to id 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async  Task<T> GetByIdAsync(object id)
        {
            return await  _table.FindAsync(id);
        }

        /// <summary>
        /// add in db
        /// </summary>
        /// <param name="obj"></param>
        public void Insert(T obj)
        {
            //It will mark the Entity state as Added State
            _table.Add(obj);
        }

        /// <summary>
        /// update record in db
        /// </summary>
        /// <param name="obj"></param>
        public void Update(T obj)
        {
            //First attach the object to the table
            _table.Update(obj);

        }

        /// <summary>
        /// save changes in db
        /// </summary>
        public void Save()
        {
            _db.SaveChanges();
        }

        /// <summary>
        /// delete a record from db
        /// </summary>
        /// <param name="id"></param>
        public  void Delete(object id)
        {
            //First, fetch the record from the table
            var existing = _table.Find(id);
            
            if (existing != null)
            {
                //to check if it contain IsDeleted
                if (typeof(T).GetProperty(Static.CommonStrings.Delete)!.GetValue(existing) as bool? == false)
                {
                    typeof(T).GetProperty(Static.CommonStrings.Delete)!.SetValue(existing, true);
                }
                else
                {
                    _table.Remove(existing);
                }
            }
        }

        /// <summary>
        /// find any particular reord accroding to the condition
        /// </summary>
        /// <param name="predicate">condition by which filtering needs to be done</param>
        /// <returns></returns>
        public async Task<T> FindByConditionAsync(Expression<Func<T, bool>> predicate)
        {
            Task<T?> task = _table.FirstOrDefaultAsync(predicate);
            return await task;
        }

        /// <summary>
        /// find any particular reord accroding to the condition
        /// </summary>
        /// <param name="predicate">condition by which filtering needs to be done</param>
        /// <returns></returns>
        public T FindByConditions(Func<T, bool> predicate)
        {
            T? task = _table.FirstOrDefault(predicate);
            if(task == null) 
            {
                return null;
            }
            return task;
        }

    }
}
