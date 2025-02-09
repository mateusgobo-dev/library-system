package br.com.mgobo.web.dto;


import jakarta.validation.constraints.NegativeOrZero;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

public record LivroDto(Long id,
                       @NotBlank(message = "Informe o titulo")
                       String titulo,
                       @NotBlank(message = "Informe a editora")
                       String editora,
                       @NotBlank(message = "Informe a edição")
                       String edicao,
                       @NotBlank(message = "Informe o ano de publicação")
                       String anoPublicacao,
                       Long assuntoId,
                       Long autorId) implements Serializable {
    private static final long serialVersionUID	= 1L;
}
