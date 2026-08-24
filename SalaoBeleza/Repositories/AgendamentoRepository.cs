using Microsoft.EntityFrameworkCore;
using SalaoBeleza.Data;
using SalaoBeleza.Models;

namespace SalaoBeleza.Repositories;

public class AgendamentoRepository : IAgendamentoRepository
{
    private readonly AppDbContext _context;

    public AgendamentoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Agendamento>> ListarTodos()
    {
        // Include traz junto os dados do cliente e do servico.
        return await _context.Agendamentos
            .Include(a => a.Cliente)
            .Include(a => a.Servico)
            .ToListAsync();
    }

    public async Task<Agendamento?> BuscarPorId(int id)
    {
        return await _context.Agendamentos
            .Include(a => a.Cliente)
            .Include(a => a.Servico)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Agendamento> Adicionar(Agendamento agendamento)
    {
        _context.Agendamentos.Add(agendamento);
        await _context.SaveChangesAsync();
        return agendamento;
    }

    public async Task Remover(Agendamento agendamento)
    {
        _context.Agendamentos.Remove(agendamento);
        await _context.SaveChangesAsync();
    }
}
