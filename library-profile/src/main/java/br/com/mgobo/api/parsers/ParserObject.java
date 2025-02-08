package br.com.mgobo.api.parsers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.function.Function;

@FunctionalInterface
public interface ParserObject {
    String toJson(Object dto);
    ParserObject parserObject = object -> {
        try {
            return new ObjectMapper().writeValueAsString(object);
        }catch (JsonProcessingException ex){
            throw new RuntimeException(ex);
        }
    };

    Function<String, String> toJsonString = value -> {
        try {
            return new ObjectMapper().writeValueAsString(value);
        }catch (JsonProcessingException ex){
            throw new RuntimeException(ex);
        }
    };
}
