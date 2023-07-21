using EmployeeManagement;
using EmployeeManagement.Auth;
using EmployeeManagement.Configuration;
using EmployeeManagement.Entity.Auth;
using EmployeeManagement.Entity.DataModels;
using EmployeeManagement.Entity.Utility;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//serilog for logging exception in db 
Serilog.Log.Logger = new LoggerConfiguration().CreateBootstrapLogger();
builder.Host.UseSerilog(((ctx, lc) => lc

.ReadFrom.Configuration(ctx.Configuration)));

// Add services to the container.

//controllers
builder.Services.AddControllers()
.AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

//authorization in swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "EmployeeManagementAPI",
        Version = "v1"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 1safsfsdfdfd\"",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});


//cors for cross platform connection
builder.Services.AddCors(p => p.AddPolicy("corsapp", builder =>
{
    builder.WithOrigins("http://localhost:4200", "http://localhost:3000").AllowAnyMethod().AllowAnyHeader().AllowCredentials(); // Enable credentials;
}));

builder.Services.AddMemoryCache();

//to connect with db
builder.Services.AddDbContext<EmpDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//automapper
builder.Services.AddAutoMapper(typeof(Program));

//all dependency injections
builder.Services.ResolveDependencies();

//to set the email configuration 
builder.Services.Configure<EmailConfig>(builder.Configuration.GetSection("EmailConfig"));

//to set session 
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

//jwt authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSetting:Issuer"],
        ValidAudience = builder.Configuration["JwtSetting:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSetting:Key"]))
    };
});

//policy based authorization for add/edit/delete or view permissions 
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(Static.Permissions.Create, policy =>
    {
        policy.Requirements.Add(new PermissionRequirement(Static.Permissions.Create));
    });
    options.AddPolicy(Static.Permissions.Edit, policy =>
    {
        policy.Requirements.Add(new PermissionRequirement(Static.Permissions.Edit));
    });
    options.AddPolicy(Static.Permissions.Delete, policy =>
    {
        policy.Requirements.Add(new PermissionRequirement(Static.Permissions.Delete));
    });
    options.AddPolicy(Static.Permissions.View, policy =>
    {
        policy.Requirements.Add(new PermissionRequirement(Static.Permissions.View));
    });
});
builder.Services.AddTransient<IAuthorizationHandler, PermissionHandler>();


//options.AddPolicy("Create", policy => policy.RequireAssertion(context =>
//context.User.HasClaim(c => c.Type == "permissions" && c.Value == "Create")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("corsapp");

app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.UseSerilogRequestLogging();

app.MapControllers();

app.Run();
