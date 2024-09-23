using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using News.Presentation.Models.Requests;
using News.Presentation.Models.Responses;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace News.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : Controller
{
    private readonly IConfiguration _configuration;
    private readonly UserManager<IdentityUser> _userManager;

    public AuthController(
        IConfiguration configuration,
        UserManager<IdentityUser> userManager)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    /// <summary>
    /// Вход пользователя в аккаунт
    /// </summary>
    /// <param name="request">
    /// Запрос, включающий в себя имя пользователя и пароль
    /// </param>
    /// <returns>
    /// JWT токен и точное время его истечения
    /// </returns>
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] SignInRequest request)
    {
        var user = await _userManager
            .FindByNameAsync(request.Username);

        if (user != null && await _userManager.CheckPasswordAsync(user, request.Password))
        {
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var token = GetToken(authClaims);

            var response = new TokenResponse
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ValidUntil = token.ValidTo
            };

            return Ok(response);
        }
        return Unauthorized();
    }

    /// <summary>
    /// Регистрация пользователя
    /// </summary>
    /// <param name="request">
    /// Запрос, включающий в себя имя пользователя, адрес електронной почты и пароль
    /// </param>
    /// <returns>
    /// Успешная/неуспешная регистрация. Для получения токена нужно послать запрос на вход.
    /// </returns>
    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] SignUpRequest request)
    {
        var userExists = await _userManager
            .FindByNameAsync(request.Username) is not null;

        if (userExists)
        {
            return BadRequest("User already exists!");
        }

        IdentityUser user = new()
        {
            Email = request.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = request.Username
        };

        var result = await _userManager
            .CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest("User creation failed! Please check user details and try again.");
        }

        return Ok("User was created successfully!");
    }

    private JwtSecurityToken GetToken(List<Claim> authClaims)
    {
        var authSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!));

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

        return token;
    }
}
