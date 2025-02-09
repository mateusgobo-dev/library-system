package br.com.mgobo.web.advices;

import lombok.Getter;

@Getter
public class HandlerError {
    private String key;
    private String message;

    private HandlerError(String key, String message) {
        this.message = message;
        this.key = key;
    }

    public static HandlerError instanceOf(String key, String message) {
        return new HandlerError(key, message);
    }
}
