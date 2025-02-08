package br.com.mgobo.web.dto;

import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

public record AutorDto(Long id,
                       @NotBlank(message = "Informe o nome do autor")
                       String nome) implements Serializable {
    private static final long serialVersionUID = 1L;
    public AutorDto {
        if(id == null) id = null;
    }
}
