package br.com.mgobo.web.dto;

import java.io.Serializable;

public record AutorDto(Long id,
                       String nome) implements Serializable {
    private static final long serialVersionUID = 1L;
    public AutorDto {
        if(id == null) id = null;
    }
}
