package br.com.mgobo.api.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Set;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "livro")
@SequenceGenerator(name = "default_seq", sequenceName = "livro_seq", allocationSize = 1)
public class Livro extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(nullable = false, length = 40)
    private String titulo;

    @Column(nullable = false, length = 40)
    private String editora;

    private Integer edicao;

    @Column(nullable = false, length = 4)
    private String anoPublicacao;

    @Column(length = 10, precision = 2)
    private Double preco;

    @OneToMany(mappedBy = "livro", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<LivroAutor> livroAutorCollection;

    @OneToMany(mappedBy = "livro", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<LivroAssunto> livroAssuntoCollection;
}
