using SalaoBeleza.Models;

namespace SalaoBeleza.Repositories;

public interface IAgendamentoRepository
{
    Task<List<Agendamento>> ListarTodos();
    Task<Agendamento?> BuscarPorId(int id);
    Task<Agendamento> Adicionar(Agendamento agendamento);
    Task Remover(Agendamento agendamento);
}
