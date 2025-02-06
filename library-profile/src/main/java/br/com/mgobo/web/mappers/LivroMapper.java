package br.com.mgobo.web.mappers;

import br.com.mgobo.api.entities.Livro;
import br.com.mgobo.web.dto.LivroDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface LivroMapper {
    LivroMapper INSTANCE = Mappers.getMapper(LivroMapper.class);

    LivroDto toDto(Livro livro);
    Livro toEntity(LivroDto livroDto);
}
