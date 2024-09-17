using Microsoft.EntityFrameworkCore;
using News.DAL.Entities;
using News.DAL.Interfaces;
using News.DAL.Storage;

namespace News.DAL.Repositories;

public class ArticleRepository : IRepository<Article>
{
    private readonly NewsContext _context;

    public ArticleRepository(NewsContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Article>> All()
    {
        return await _context
            .Articles
            .Include(x => x.Category)
            .Include(x => x.Author)
            .ToListAsync();
    }

    public async Task<Article?> Find(Guid id)
    {
        return await _context
            .Articles
            .Include(x => x.Category)
            .Include(x => x.Author)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IEnumerable<Article>> Find(Func<Article, bool> predicate)
    {
        return _context
            .Articles
            .Include(x => x.Category)
            .Include(x => x.Author)
            .Where(predicate)
            .ToList();
    }

    public async Task<bool> Exists(Guid id)
    {
        return await _context
            .Articles
            .AnyAsync(x => x.Id == id);
    }

    public async Task<bool> Exists(Func<Article, bool> predicate)
    {
        return await _context
            .Articles
            .Include(x => x.Category)
            .Include(x => x.Author)
            .AnyAsync(x => predicate(x));
    }

    public async Task<Article?> Add(Article item)
    {
        return (await _context
            .Articles
            .AddAsync(item))
            .Entity;
    }

    public async Task<Article?> Update(Article item)
    {
        _context
            .Entry(item)
            .State = EntityState.Modified;

        return item;
    }

    public async Task<Article?> Delete(Guid id)
    {
        var existingProduct = await _context
            .Articles
            .FindAsync(id);

        if (existingProduct is null)
        {
            return null;
        }

        return _context
            .Articles
            .Remove(existingProduct)
            .Entity;
    }
}
