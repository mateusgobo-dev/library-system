package br.com.mgobo.web.dto;

import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

public record AssuntoDto(Long id,
                         @NotBlank(message = "Informe a descrição do assunto")
                         String descricao) implements Serializable {
    private static final long serialVersionUID = 1L;
    public AssuntoDto {
        if(id == null) id = null;
    }
}
