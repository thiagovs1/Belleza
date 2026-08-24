using SalaoBeleza.DTOs;
using SalaoBeleza.Models;
using SalaoBeleza.Repositories;

namespace SalaoBeleza.Services;

public class AgendamentoService
{
    private readonly IAgendamentoRepository _repo;
    private readonly IClienteRepository _clienteRepo;
    private readonly IServicoRepository _servicoRepo;

    public AgendamentoService(
        IAgendamentoRepository repo,
        IClienteRepository clienteRepo,
        IServicoRepository servicoRepo)
    {
        _repo = repo;
        _clienteRepo = clienteRepo;
        _servicoRepo = servicoRepo;
    }

    public async Task<List<AgendamentoRespostaDTO>> Listar()
    {
        var agendamentos = await _repo.ListarTodos();
        return agendamentos.Select(a => new AgendamentoRespostaDTO(
            a.Id,
            a.DataHora,
            a.Cliente?.Nome ?? "",
            a.Servico?.Nome ?? "",
            a.Servico?.Preco ?? 0
        )).ToList();
    }

    public async Task<AgendamentoRespostaDTO> Criar(AgendamentoCriarDTO dto)
    {
        // Regra: nao pode agendar no passado.
        if (dto.DataHora < DateTime.Now)
            throw new Exception("A data do agendamento nao pode estar no passado.");

        // Confere se o cliente existe.
        var cliente = await _clienteRepo.BuscarPorId(dto.ClienteId);
        if (cliente == null)
            throw new Exception("Cliente nao encontrado.");

        // Confere se o servico existe.
        var servico = await _servicoRepo.BuscarPorId(dto.ServicoId);
        if (servico == null)
            throw new Exception("Servico nao encontrado.");

        var agendamento = new Agendamento
        {
            DataHora = dto.DataHora,
            ClienteId = dto.ClienteId,
            ServicoId = dto.ServicoId
        };

        var criado = await _repo.Adicionar(agendamento);

        return new AgendamentoRespostaDTO(
            criado.Id,
            criado.DataHora,
            cliente.Nome,
            servico.Nome,
            servico.Preco
        );
    }

    public async Task<bool> Remover(int id)
    {
        var agendamento = await _repo.BuscarPorId(id);
        if (agendamento == null)
            return false;

        await _repo.Remover(agendamento);
        return true;
    }
}
