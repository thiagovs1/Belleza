CREATE DATABASE Belleza;

USE Belleza;

CREATE TABLE Cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(11) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
telefone VARCHAR(20) NOT NULL UNIQUE,
    senha VARCHAR(10) NOT NULL,
    cpf VARCHAR(14) NULL UNIQUE

);

CREATE TABLE Servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(11) NOT NULL,
    preco DECIMAL(7,2) NOT NULL,
duracaominutos INT NOT NULL
   
);

CREATE TABLE Agendamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    idServico INT NOT NULL,
    datahora TIMESTAMP NOT NULL,
    status_tipo VARCHAR(20) DEFAULT 'Pendente',
    CONSTRAINT FK_Agendamentos_Clientes FOREIGN KEY (idCliente) REFERENCES Cliente(id),
    CONSTRAINT FK_Agendamentos_Servico FOREIGN KEY (idServico) REFERENCES Servico(id)
   
);