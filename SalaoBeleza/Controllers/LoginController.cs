using System.Text.Json;
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
    public async Task<IActionResult> Login([FromBody] JsonElement dados)
    {
        try
        {
            string email = "";

            string senha = "";

            if (dados.TryGetProperty("email", out JsonElement emailElement))
            {
                email = emailElement.GetString() ?? "";
            }

            if (dados.TryGetProperty("senha", out JsonElement senhaElement))
            {
                senha = senhaElement.GetString() ?? "";
            }

            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new
                {
                    mensagem = "O e-mail não foi recebido pelo servidor."
                });
            }

            if (string.IsNullOrWhiteSpace(senha))
            {
                return BadRequest(new
                {
                    mensagem = "A senha não foi recebida pelo servidor."
                });
            }

            var cliente = await _service.Login(email, senha);

            if (cliente == null)
            {
                return Unauthorized(new
                {
                    mensagem = "E-mail ou senha inválidos."
                });
            }

            return Ok(cliente);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                mensagem = "Erro ao realizar o login.",
                erro = ex.Message,
                detalhe = ex.InnerException?.Message
            });
        }
    }
}