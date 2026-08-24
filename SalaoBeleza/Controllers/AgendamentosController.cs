using Microsoft.AspNetCore.Mvc;
using SalaoBeleza.DTOs;
using SalaoBeleza.Services;

namespace SalaoBeleza.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgendamentosController : ControllerBase
{
    private readonly AgendamentoService _service;

    public AgendamentosController(AgendamentoService service)
    {
        _service = service;
    }

    // GET api/agendamentos
    [HttpGet]
    public async Task<IActionResult> Listar()
    {
        var agendamentos = await _service.Listar();
        return Ok(agendamentos);
    }

    // POST api/agendamentos
    [HttpPost]
    public async Task<IActionResult> Criar(AgendamentoCriarDTO dto)
    {
        try
        {
            var criado = await _service.Criar(dto);
            return Ok(criado);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE api/agendamentos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Remover(int id)
    {
        var ok = await _service.Remover(id);
        if (!ok)
            return NotFound();

        return NoContent();
    }
}
