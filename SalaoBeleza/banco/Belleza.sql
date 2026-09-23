CREATE DATABASE Belleza;

USE Belleza;

CREATE TABLE Cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
telefone VARCHAR(20) NOT NULL UNIQUE,
    senha VARCHAR(10) NOT NULL,
    cpf VARCHAR(14) NULL UNIQUE

);

CREATE TABLE Usuario (

    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    senha VARCHAR(10) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL DEFAULT 'Cliente'

);

CREATE TABLE Servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(30) NOT NULL,
    categoria VARCHAR(30) NOT NULL,
    preco DECIMAL(7,2) NOT NULL,
duracaominutos INT NOT NULL
   
);

CREATE TABLE Profissional (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    avaliacao DECIMAL(2,1) DEFAULT 0.0
);

CREATE TABLE HorarioProfissional (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idProfissional INT NOT NULL,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
   
    CONSTRAINT FK_Horario_Profissional FOREIGN KEY (idProfissional) REFERENCES Profissional(id)
);


CREATE TABLE Agendamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    idProfissional INT NOT NULL,
    datahora TIMESTAMP NOT NULL,
    status_tipo VARCHAR(20) DEFAULT 'Pendente',
   
    CONSTRAINT FK_Agendamentos_Clientes FOREIGN KEY (idCliente) REFERENCES Cliente(id),
    CONSTRAINT FK_Agendamentos_Servico FOREIGN KEY (idProfissional) REFERENCES Profissional(id)
   
);

CREATE TABLE AgendamentoServico (
    idAgendamento INT NOT NULL,
    idServico INT NOT NULL,
   
    PRIMARY KEY (idAgendamento, idServico),
    CONSTRAINT FK_AgendamentoServico_Agendamento FOREIGN KEY (idAgendamento) REFERENCES Agendamento(id),
    CONSTRAINT FK_AgendamentoServico_Servico FOREIGN KEY (idServico) REFERENCES Servico(id)
);

CREATE TABLE Combo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco DECIMAL(7,2) NOT NULL
);

CREATE TABLE ComboServico (
    idCombo INT NOT NULL,
    idServico INT NOT NULL,

    PRIMARY KEY (idCombo, idServico),
    CONSTRAINT FK_ComboServico_Combo FOREIGN KEY (idCombo) REFERENCES Combo(id),
    CONSTRAINT FK_ComboServico_Servico FOREIGN KEY (idServico) REFERENCES Servico(id)
);

CREATE TABLE Promocao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    percentual_desconto DECIMAL(5,2),
    data_inicio DATE,
    data_fim DATE,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Avaliacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    idProfissional INT NOT NULL,
    nota DECIMAL(2,1) NOT NULL,
    comentario VARCHAR(500),
    data_avaliacao DATE,
   
    CONSTRAINT FK_Avaliacao_Cliente FOREIGN KEY (idCliente) REFERENCES Cliente(id),
    CONSTRAINT FK_Avaliacao_Profissional FOREIGN KEY (idProfissional) REFERENCES Profissional(id)
);

