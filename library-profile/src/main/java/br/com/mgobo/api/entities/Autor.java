package br.com.mgobo.api.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "autor")
@SequenceGenerator(name = "default_seq", sequenceName = "autor_seq", allocationSize = 1)
public class Autor extends BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(nullable = false)
    private String nome;

    @OneToMany(mappedBy = "autor", fetch = FetchType.LAZY)
    private Set<LivroAutor> livroAutorCollection;
}
