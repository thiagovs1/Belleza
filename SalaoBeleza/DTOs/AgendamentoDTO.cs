namespace SalaoBeleza.DTOs;

// Para criar, mandamos so os ids do cliente e do servico.
public record AgendamentoCriarDTO(DateTime DataHora, int ClienteId, int ServicoId);

// Ao devolver, mostramos os nomes para ficar legivel.
public record AgendamentoRespostaDTO(
    int Id,
    DateTime DataHora,
    string NomeCliente,
    string NomeServico,
    decimal Preco);
