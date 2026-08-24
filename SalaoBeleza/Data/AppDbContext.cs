using Microsoft.EntityFrameworkCore;
using SalaoBeleza.Models;

namespace SalaoBeleza.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Servico> Servicos { get; set; }
    public DbSet<Agendamento> Agendamentos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // =========================
        // CLIENTE
        // =========================

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("Cliente");

            entity.HasKey(c => c.Id);

            entity.Property(c => c.Id)
                .HasColumnName("id");

            entity.Property(c => c.Nome)
                .HasColumnName("nome")
                .HasMaxLength(11)
                .IsRequired();

            entity.Property(c => c.Telefone)
                .HasColumnName("telefone")
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(c => c.Email)
                .HasColumnName("email")
                .HasMaxLength(30)
                .IsRequired();

            entity.Property(c => c.Senha)
                .HasColumnName("senha")
                .HasMaxLength(10)
                .IsRequired();

            entity.Property(c => c.Cpf)
                .HasColumnName("cpf")
                .HasMaxLength(14);
        });

        // =========================
        // SERVICO
        // =========================

        modelBuilder.Entity<Servico>(entity =>
        {
            entity.ToTable("Servico");

            entity.HasKey(s => s.Id);

            entity.Property(s => s.Id)
                .HasColumnName("id");

            entity.Property(s => s.Nome)
                .HasColumnName("nome")
                .HasMaxLength(11)
                .IsRequired();

            entity.Property(s => s.Preco)
                .HasColumnName("preco")
                .HasPrecision(7, 2)
                .IsRequired();

            entity.Property(s => s.DuracaoMinutos)
                .HasColumnName("duracaominutos")
                .IsRequired();
        });

        // =========================
        // AGENDAMENTO
        // =========================

        modelBuilder.Entity<Agendamento>(entity =>
        {
            entity.ToTable("Agendamento");

            entity.HasKey(a => a.Id);

            entity.Property(a => a.Id)
                .HasColumnName("id");

            entity.Property(a => a.ClienteId)
                .HasColumnName("idCliente");

            entity.Property(a => a.ServicoId)
                .HasColumnName("idServico");

            entity.Property(a => a.DataHora)
                .HasColumnName("datahora");

            entity.HasOne(a => a.Cliente)
                .WithMany(c => c.Agendamentos)
                .HasForeignKey(a => a.ClienteId);

            entity.HasOne(a => a.Servico)
                .WithMany(s => s.Agendamentos)
                .HasForeignKey(a => a.ServicoId);
        });
    }
}