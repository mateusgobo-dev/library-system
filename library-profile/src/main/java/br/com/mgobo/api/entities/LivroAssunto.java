package br.com.mgobo.api.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "livro_assunto")
@SequenceGenerator(name = "default_seq", sequenceName = "livro_assunto_seq", allocationSize = 1)
public class LivroAssunto extends BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @JoinColumn(name = "livroId", referencedColumnName = "id")
    @ManyToOne
    private Livro livro;

    @JoinColumn(name = "assuntoId", referencedColumnName = "id")
    @ManyToOne
    private Assunto assunto;
}
