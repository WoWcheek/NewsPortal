using Microsoft.EntityFrameworkCore;
using News.DAL.Entities;
using News.DAL.Interfaces;
using News.DAL.Storage;

namespace News.DAL.Repositories;

public class CategoryRepository : IRepository<Category>
{
    private readonly NewsContext _context;

    public CategoryRepository(NewsContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> All()
    {
        return await _context
            .Categories
            .ToListAsync();
    }

    public async Task<Category?> Find(Guid id)
    {
        return await _context
            .Categories
            .FindAsync(id);
    }

    public async Task<IEnumerable<Category>> Find(Func<Category, bool> predicate)
    {
        return _context
            .Categories
            .Where(predicate)
            .ToList();
    }

    public async Task<bool> Exists(Guid id)
    {
        return await _context
            .Categories
            .AnyAsync(x => x.Id == id);
    }

    public async Task<bool> Exists(Func<Category, bool> predicate)
    {
        return _context
            .Categories
            .Where(predicate)
            .Count() > 0;
    }

    public async Task<Category?> Add(Category item)
    {
        return (await _context
            .Categories
            .AddAsync(item))
            .Entity;
    }

    public async Task<Category?> Update(Category item)
    {
        _context
            .Entry(item)
            .State = EntityState.Modified;

        return item;
    }

    public async Task<Category?> Delete(Guid id)
    {
        var existingCategory = await _context
            .Categories
            .FindAsync(id);

        if (existingCategory is null)
        {
            return null;
        }

        return _context
            .Categories
            .Remove(existingCategory)
            .Entity;
    }
}
