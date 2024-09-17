using News.DAL.Entities;
using News.DAL.Interfaces;
using News.DAL.Storage;

namespace News.DAL.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private bool _isDisposed;

    private readonly NewsContext _context;

    private readonly IRepository<Article> _articles;
    private readonly IRepository<Category> _categories;

    public IRepository<Article> Articles => _articles;
    public IRepository<Category> Categories => _categories;

    public UnitOfWork(NewsContext context)
    {
        _isDisposed = false;

        _context = context;

        _articles = new ArticleRepository(_context);
        _categories = new CategoryRepository(_context);
    }

    public async Task CommitChanges()
    {
        await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    private void Dispose(bool disposing)
    {
        if (_isDisposed) return;

        if (disposing)
        {
            _context.Dispose();
            _isDisposed = true;
        }
    }
}
