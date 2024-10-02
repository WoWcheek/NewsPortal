using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using News.Presentation.Controllers;
using News.Presentation.Models.Requests;
using News.Presentation.Models.Responses;

namespace AuthTests;

public class AuthControllerTests
{
    private readonly Mock<UserManager<IdentityUser>> _userManagerMock;
    private readonly Mock<IConfiguration> _configurationMock;
    private readonly AuthController _controller;

    public AuthControllerTests()
    {
        var userStoreMock = new Mock<IUserStore<IdentityUser>>();
        _userManagerMock = new Mock<UserManager<IdentityUser>>(
            userStoreMock.Object, null, null, null, null, null, null, null, null);

        _configurationMock = new Mock<IConfiguration>();

        _controller = new AuthController(_configurationMock.Object, _userManagerMock.Object);
    }

    [Fact]
    public async Task Register_UserAlreadyExists_ReturnsBadRequest()
    {
        var request = new SignUpRequest
        {
            Username = "existinguser",
            Email = "user@example.com",
            Password = "Password123"
        };

        _userManagerMock.Setup(um => um.FindByNameAsync(request.Username))
                        .ReturnsAsync(new IdentityUser { UserName = request.Username });

        var result = await _controller.Register(request);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("User already exists!", badRequestResult.Value);
    }

    [Fact]
    public async Task Register_UserCreationFailed_ReturnsBadRequest()
    {
        var request = new SignUpRequest
        {
            Username = "newuser",
            Email = "newuser@example.com",
            Password = "Password123"
        };

        _userManagerMock.Setup(um => um.FindByNameAsync(request.Username))
                        .ReturnsAsync((IdentityUser)null);

        _userManagerMock.Setup(um => um.CreateAsync(It.IsAny<IdentityUser>(), request.Password))
                        .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "User creation error" }));

        var result = await _controller.Register(request);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("User creation failed! Please check user details and try again.", badRequestResult.Value);
    }

    [Fact]
    public async Task Register_UserCreatedSuccessfully_ReturnsOk()
    {
        var request = new SignUpRequest
        {
            Username = "newuser",
            Email = "newuser@example.com",
            Password = "Password123"
        };

        _userManagerMock.Setup(um => um.FindByNameAsync(request.Username))
                        .ReturnsAsync((IdentityUser)null);

        _userManagerMock.Setup(um => um.CreateAsync(It.IsAny<IdentityUser>(), request.Password))
                        .ReturnsAsync(IdentityResult.Success);

        var result = await _controller.Register(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("User was created successfully!", okResult.Value);
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsOkResult()
    {
        var request = new SignInRequest
        {
            Username = "testuser",
            Password = "Password123"
        };

        var user = new IdentityUser { UserName = request.Username };

        _configurationMock.Setup(config => config["JWT:ValidAudience"])
            .Returns("http://localhost:4200");
        _configurationMock.Setup(config => config["JWT:ValidIssuer"])
            .Returns("http://localhost:5000");
        _configurationMock.Setup(config => config["JWT:Secret"])
            .Returns("JWTAuthenticationHIGHsecuredPasswordVVVp1OH7Xzyr");

        _userManagerMock.Setup(um => um.FindByNameAsync(request.Username))
                        .ReturnsAsync(user);

        _userManagerMock.Setup(um => um.CheckPasswordAsync(user, request.Password))
                        .ReturnsAsync(true);

        var result = await _controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<TokenResponse>(okResult.Value);
        Assert.False(string.IsNullOrEmpty(response.Token));
    }

    [Fact]
    public async Task Login_InvalidCredentials_ReturnsUnauthorizedResult()
    {
        var request = new SignInRequest
        {
            Username = "testuser",
            Password = "WrongPassword"
        };

        var user = new IdentityUser { UserName = request.Username };

        _userManagerMock.Setup(um => um.FindByNameAsync(request.Username))
                        .ReturnsAsync(user);

        _userManagerMock.Setup(um => um.CheckPasswordAsync(user, request.Password))
                        .ReturnsAsync(false);

        var result = await _controller.Login(request);

        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async Task Login_UserNotFound_ReturnsUnauthorizedResult()
    {
        var request = new SignInRequest
        {
            Username = "nonexistentuser",
            Password = "Password123"
        };

        _userManagerMock.Setup(um => um.FindByNameAsync(request.Username))
                        .ReturnsAsync((IdentityUser)null);

        var result = await _controller.Login(request);

        Assert.IsType<UnauthorizedResult>(result);
    }
}
