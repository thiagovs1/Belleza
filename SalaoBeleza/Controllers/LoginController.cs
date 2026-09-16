using Microsoft.AspNetCore.Mvc;
using SalaoBeleza.Services;

namespace SalaoBeleza.Controllers;

[ApiController]
[Route("api/login")]
public class LoginController : ControllerBase
{
    private readonly ClienteService _service;

    public LoginController(ClienteService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Login(
        [FromForm] string email,
        [FromForm] string senha)
    {
        var cliente = await _service.Login(email, senha);

        if (cliente == null)
        {
            return Redirect("/login_cliente.html?erro=1");
        }

        return Redirect("/tela_inicial.html");
    }
}