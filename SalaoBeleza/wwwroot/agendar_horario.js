const API = "http://localhost:5000/api";


// ========================================
// DADOS DA SELEÇÃO ANTERIOR
// ========================================

let servico = obterDados("servicoSelecionado");
let profissional = obterDados("profissionalSelecionado");


// Caso sua página anterior salve somente o ID
if (!servico) {

    const idServico =
        localStorage.getItem("idServico") ||
        localStorage.getItem("servicoId");

    if (idServico) {

        servico = {
            id: Number(idServico)
        };

    }

}


if (!profissional) {

    const idProfissional =
        localStorage.getItem("idProfissional") ||
        localStorage.getItem("profissionalId");

    if (idProfissional) {

        profissional = {
            id: Number(idProfissional)
        };

    }

}


// ========================================
// DATA ATUAL
// ========================================

let hoje = new Date();

let mesAtual = hoje.getMonth();

let anoAtual = hoje.getFullYear();

let dataSelecionada = null;

let horarioSelecionado = null;


// ========================================
// ELEMENTOS
// ========================================

const calendario =
    document.getElementById("diasCalendario");

const nomeMes =
    document.getElementById("mesAtual");

const listaHorarios =
    document.getElementById("listaHorarios");


// ========================================
// INÍCIO
// ========================================

document.addEventListener("DOMContentLoaded", async () => {

    mostrarResumo();

    await carregarCalendario();

});


// ========================================
// PEGAR LOCALSTORAGE
// ========================================

function obterDados(chave) {

    const dados = localStorage.getItem(chave);

    if (!dados)
        return null;

    try {

        return JSON.parse(dados);

    } catch {

        return {
            nome: dados
        };

    }

}


// ========================================
// RESUMO
// ========================================

function mostrarResumo() {

    const campoServico =
        document.getElementById("resumoServico");

    const campoProfissional =
        document.getElementById("resumoProfissional");

    const campoPreco =
        document.getElementById("resumoPreco");


    if (servico) {

        campoServico.textContent =
            servico.nome || "Serviço selecionado";

        if (servico.preco != null) {

            campoPreco.textContent =
                formatarMoeda(servico.preco);

        }

    }


    if (profissional) {

        campoProfissional.textContent =
            profissional.nome ||
            "Profissional selecionado";

    }

}


// ========================================
// CALENDÁRIO
// ========================================

async function carregarCalendario() {

    calendario.innerHTML = "";

    nomeMes.textContent =
        new Date(
            anoAtual,
            mesAtual
        ).toLocaleDateString(
            "pt-BR",
            {
                month: "long",
                year: "numeric"
            }
        );


    if (!profissional?.id || !servico?.id) {

        mostrarMensagemCalendario(
            "Selecione primeiro o serviço e o profissional."
        );

        return;

    }


    try {

        const resposta =
            await fetch(
                `${API}/agendamento/calendario?` +
                `profissionalId=${profissional.id}` +
                `servicoId=${servico.id}` +
                `ano=${anoAtual}` +
                `mes=${mesAtual + 1}`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao consultar o calendário."
            );

        }


        const dados =
            await resposta.json();


        montarDias(
            dados
        );


    } catch (erro) {

        console.error(erro);

        mostrarMensagemCalendario(
            "Não foi possível carregar o calendário."
        );

    }

}


// ========================================
// MONTAR DIAS
// ========================================

function montarDias(dados) {

    calendario.innerHTML = "";

    const primeiroDia =
        new Date(
            anoAtual,
            mesAtual,
            1
        ).getDay();


    const quantidadeDias =
        new Date(
            anoAtual,
            mesAtual + 1,
            0
        ).getDate();


    // espaços antes do primeiro dia

    for (
        let i = 0;
        i < primeiroDia;
        i++
    ) {

        const vazio =
            document.createElement("span");

        vazio.className = "vazio";

        calendario.appendChild(vazio);

    }


    // dias

    for (
        let dia = 1;
        dia <= quantidadeDias;
        dia++
    ) {

        const botao =
            document.createElement("button");


        botao.type = "button";

        botao.className = "dia";

        botao.textContent = dia;


        const informacao =
            dados.find(
                x => Number(x.dia) === dia
            );


        if (!informacao) {

            botao.classList.add(
                "indisponivel"
            );

            botao.disabled = true;

        }


        else if (!informacao.disponivel) {

            botao.classList.add(
                "indisponivel"
            );

            botao.disabled = true;

        }


        else {

            botao.classList.add(
                "disponivel"
            );


            botao.addEventListener(
                "click",
                () => selecionarData(dia)
            );

        }


        calendario.appendChild(botao);

    }

}


// ========================================
// SELECIONAR DATA
// ========================================

async function selecionarData(dia) {

    dataSelecionada =
        criarDataISO(
            anoAtual,
            mesAtual + 1,
            dia
        );


    horarioSelecionado = null;


    document
        .querySelectorAll(".dia")
        .forEach(botao => {

            botao.classList.remove(
                "escolhido"
            );

        });


    const botoes =
        document.querySelectorAll(".dia");


    for (const botao of botoes) {

        if (
            Number(botao.textContent) === dia
        ) {

            botao.classList.add(
                "escolhido"
            );

            break;

        }

    }


    atualizarResumoData();

    await carregarHorarios();

}


// ========================================
// HORÁRIOS
// ========================================

async function carregarHorarios() {

    listaHorarios.innerHTML = `
        <p class="mensagem-horario">
            Carregando horários...
        </p>
    `;


    if (!dataSelecionada) {

        return;

    }


    try {

        const resposta =
            await fetch(
                `${API}/agendamento/horarios?` +
                `profissionalId=${profissional.id}` +
                `servicoId=${servico.id}` +
                `data=${dataSelecionada}`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar horários."
            );

        }


        const horarios =
            await resposta.json();


        montarHorarios(
            horarios
        );


    } catch (erro) {

        console.error(erro);

        listaHorarios.innerHTML = `
            <p class="mensagem-horario">
                Não foi possível carregar os horários.
            </p>
        `;

    }

}


// ========================================
// MONTAR HORÁRIOS
// ========================================

function montarHorarios(horarios) {

    listaHorarios.innerHTML = "";


    if (
        !horarios ||
        horarios.length === 0
    ) {

        listaHorarios.innerHTML = `
            <p class="mensagem-horario">
                Não há horários disponíveis
                para esse serviço neste dia.
            </p>
        `;

        return;

    }


    horarios.forEach(horario => {

        const botao =
            document.createElement("button");


        botao.type = "button";

        botao.className = "horario";


        botao.textContent =
            `${horario.inicio} - ${horario.fim}`;


        if (!horario.disponivel) {

            botao.disabled = true;

            botao.classList.add(
                "indisponivel"
            );

        }

        else {

            botao.addEventListener(
                "click",
                () => selecionarHorario(
                    horario,
                    botao
                )
            );

        }


        listaHorarios.appendChild(
            botao
        );

    });

}


// ========================================
// SELECIONAR HORÁRIO
// ========================================

function selecionarHorario(
    horario,
    botao
) {

    horarioSelecionado =
        horario;


    document
        .querySelectorAll(".horario")
        .forEach(item => {

            item.classList.remove(
                "escolhido-horario"
            );

        });


    botao.classList.add(
        "escolhido-horario"
    );


    atualizarResumoData();

}


// ========================================
// RESUMO DATA/HORA
// ========================================

function atualizarResumoData() {

    const campo =
        document.getElementById(
            "resumoDataHorario"
        );


    if (
        !dataSelecionada ||
        !horarioSelecionado
    ) {

        if (dataSelecionada) {

            campo.textContent =
                formatarData(dataSelecionada);

        } else {

            campo.textContent =
                "Não selecionado";

        }

        return;

    }


    campo.textContent =
        `${formatarData(dataSelecionada)}
         - ${horarioSelecionado.inicio}
         às ${horarioSelecionado.fim}`;

}


// ========================================
// MUDAR MÊS
// ========================================

document
    .getElementById("mesAnterior")
    .addEventListener(
        "click",
        async () => {

            mesAtual--;

            if (mesAtual < 0) {

                mesAtual = 11;

                anoAtual--;

            }


            dataSelecionada = null;

            horarioSelecionado = null;

            document
                .getElementById(
                    "resumoDataHorario"
                )
                .textContent =
                "Não selecionado";


            listaHorarios.innerHTML = `
                <p class="mensagem-horario">
                    Selecione uma data para
                    visualizar os horários.
                </p>
            `;


            await carregarCalendario();

        }
    );


document
    .getElementById("mesProximo")
    .addEventListener(
        "click",
        async () => {

            mesAtual++;

            if (mesAtual > 11) {

                mesAtual = 0;

                anoAtual++;

            }


            dataSelecionada = null;

            horarioSelecionado = null;


            document
                .getElementById(
                    "resumoDataHorario"
                )
                .textContent =
                "Não selecionado";


            listaHorarios.innerHTML = `
                <p class="mensagem-horario">
                    Selecione uma data para
                    visualizar os horários.
                </p>
            `;


            await carregarCalendario();

        }
    );


// ========================================
// CONTINUAR
// ========================================

document
    .getElementById("btnContinuar")
    .addEventListener(
        "click",
        () => {

            if (!servico?.id) {

                alert(
                    "Nenhum serviço foi selecionado."
                );

                return;

            }


            if (!profissional?.id) {

                alert(
                    "Nenhum profissional foi selecionado."
                );

                return;

            }


            if (!dataSelecionada) {

                alert(
                    "Selecione uma data."
                );

                return;

            }


            if (!horarioSelecionado) {

                alert(
                    "Selecione um horário."
                );

                return;

            }


            const agendamento = {

                servicoId: servico.id,

                profissionalId:
                    profissional.id,

                data: dataSelecionada,

                inicio:
                    horarioSelecionado.inicio,

                fim:
                    horarioSelecionado.fim,

                preco:
                    servico.preco || 0

            };


            localStorage.setItem(
                "agendamentoSelecionado",
                JSON.stringify(
                    agendamento
                )
            );


            window.location.href =
                "tela_pg.html";

        }
    );


// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function criarDataISO(
    ano,
    mes,
    dia
) {

    return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

}


function formatarData(data) {

    const partes =
        data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function mostrarMensagemCalendario(
    mensagem
) {

    calendario.innerHTML = "";

    const p =
        document.createElement("p");

    p.textContent = mensagem;

    p.style.gridColumn = "1 / -1";

    p.style.textAlign = "center";

    p.style.color = "#91425f";

    calendario.appendChild(p);

}