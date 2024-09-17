using Microsoft.EntityFrameworkCore;
using News.DAL.Interfaces;
using News.DAL.Repositories;
using News.DAL.Storage;
using News.Presentation.Mappings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<NewsContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(typeof(AutoMapperProfiles));

builder.Services.AddSingleton<IUnitOfWork, UnitOfWork>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
