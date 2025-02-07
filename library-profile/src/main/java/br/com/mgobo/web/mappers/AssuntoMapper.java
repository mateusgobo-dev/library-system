package br.com.mgobo.web.mappers;

import br.com.mgobo.api.entities.Assunto;
import br.com.mgobo.web.dto.AssuntoDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AssuntoMapper {
    AssuntoMapper INSTANCE = Mappers.getMapper(AssuntoMapper.class);

    Assunto toEntity(AssuntoDto assuntoDto);

    AssuntoDto toDto(Assunto assunto);
}
