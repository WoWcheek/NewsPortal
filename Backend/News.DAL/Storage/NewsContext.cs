using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using News.DAL.Entities;

namespace News.DAL.Storage;

public class NewsContext : IdentityDbContext<IdentityUser>
{
    public DbSet<Article> Articles { get; set; }

    public DbSet<Category> Categories { get; set; }

    public NewsContext(DbContextOptions<NewsContext> options) : base(options)
    { }

    protected override void OnConfiguring(DbContextOptionsBuilder builder)
        => base.OnConfiguring(builder);

    protected override void OnModelCreating(ModelBuilder builder)
        => base.OnModelCreating(builder);
}