namespace News.DAL.Interfaces;

public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> All();
    Task<T?> Find(Guid id);
    Task<IEnumerable<T>> Find(Func<T, bool> predicate);
    Task<bool> Exists(Guid id);
    Task<bool> Exists(Func<T, bool> predicate);
    Task<T?> Add(T item);
    Task<T?> Update(T item);
    Task<T?> Delete(Guid id);
}
