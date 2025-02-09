package br.com.mgobo.web.advices;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static br.com.mgobo.api.parsers.ParserObject.parserObject;
import static br.com.mgobo.api.parsers.ParserObject.toJsonString;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> dataIntegrityViolation(DataIntegrityViolationException e) {
        return new ResponseEntity<>(parserObject.toJson(HandlerError.instanceOf(e.getCause().getMessage(), e.getMessage())), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> methodArgumentNotValid(MethodArgumentNotValidException e) {
        List<HandlerError> errors = new ArrayList<>();
        e.getBindingResult().getFieldErrors().forEach(error -> {
            errors.add(HandlerError.instanceOf(error.getField(), error.getDefaultMessage()));
        });
        return new ResponseEntity<>(parserObject.toJson(errors), HttpStatus.BAD_REQUEST);
    }
}
