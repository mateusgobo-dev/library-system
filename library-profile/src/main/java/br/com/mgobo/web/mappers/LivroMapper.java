package br.com.mgobo.web.mappers;

import br.com.mgobo.api.entities.Livro;
import br.com.mgobo.web.dto.LivroDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Locale;

@Mapper
public interface LivroMapper {
    LivroMapper INSTANCE = Mappers.getMapper(LivroMapper.class);

    LivroDto toDto(Livro livro);
    @Mapping(source = "preco",target = "preco", numberFormat = "new java.text.NumberFormat.getInstance(new Locale(\"pt\", \"BR\").parse)")
    Livro toEntity(LivroDto livroDto);

    default double mapBrazilianToDouble(String value) {
        if (value == null || value.isEmpty()) {
            return 0.0; // Default or error handling
        }
        try {
            NumberFormat format = NumberFormat.getInstance(new Locale("pt", "BR"));
            return format.parse(value).doubleValue();
        } catch (ParseException e) {
            throw new IllegalArgumentException("Invalid Brazilian number format: " + value, e);
        }
    }
}
