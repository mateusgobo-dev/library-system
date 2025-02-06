package br.com.mgobo.web.mappers;

import br.com.mgobo.api.entities.Autor;
import br.com.mgobo.web.dto.AutorDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AutorMapper {
    AutorMapper INSTANCE = Mappers.getMapper(AutorMapper.class);

    Autor toEntity(AutorDto autorDto);

    AutorDto toDto(Autor autor);
}
