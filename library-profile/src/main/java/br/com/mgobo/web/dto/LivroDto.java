package br.com.mgobo.web.dto;


import br.com.mgobo.web.mappers.LivroMapper;
import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

import static br.com.mgobo.web.mappers.LivroMapper.INSTANCE;

public record LivroDto(Long id,
                       @NotBlank(message = "Informe o titulo")
                       String titulo,
                       @NotBlank(message = "Informe a editora")
                       String editora,
                       @NotBlank(message = "Informe a edição")
                       String edicao,
                       @NotBlank(message = "Informe o ano de publicação")
                       String anoPublicacao,
                       @NotBlank(message = "Informe o preço")
                       String preco,
                       Long assuntoId,
                       String assunto,
                       Long autorId,
                       String autor) implements Serializable {
    private static final long serialVersionUID	= 1L;
    public LivroDto {
        if(preco != null) INSTANCE.mapBrazilianToDouble(preco);
    }
}
