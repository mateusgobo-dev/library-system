package br.com.mgobo.web.dto;

import java.io.Serializable;

public record AssuntoDto(Long id,
                         String descricao) implements Serializable {
    private static final long serialVersionUID = 1L;
    public AssuntoDto {
        if(id == null) id = null;
    }
}
