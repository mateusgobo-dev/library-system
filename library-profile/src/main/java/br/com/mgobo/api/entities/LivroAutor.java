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
@Table(name = "livro_autor")
@SequenceGenerator(name = "default_seq", sequenceName = "livro_autor_seq", allocationSize = 1)
public class LivroAutor extends BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @JoinColumn(name = "livroId", referencedColumnName = "id")
    @ManyToOne
    private Livro livro;

    @JoinColumn(name = "autorId", referencedColumnName = "id")
    @ManyToOne
    private Autor autor;
}
