package br.com.mgobo.web.dto;


import java.io.Serializable;

public record LivroDto(Long id,
                       String titulo,
                       String editora,
                       Integer edicao,
                       String anoPublicacao,
                       Long assuntoId,
                       Long autorId) implements Serializable {
    private static final long serialVersionUID	= 1L;
}
