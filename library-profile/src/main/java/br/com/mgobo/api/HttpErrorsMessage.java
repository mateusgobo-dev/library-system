package br.com.mgobo.api;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum HttpErrorsMessage {
    CREATED("Registro %s criado com sucesso"),
    ACCEPTED("Registro %s alterado com sucesso"),
    NOT_FOUND("Registro não encontrado"),
    BAD_REQUEST("Erro na requisicao. Acesso %s. erro => %s");
    String message;
}
