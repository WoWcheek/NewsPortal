using News.DAL.Entities;

namespace News.DAL.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<Article> Articles { get; }
    IRepository<Category> Categories { get; }
    Task CommitChanges();
}
