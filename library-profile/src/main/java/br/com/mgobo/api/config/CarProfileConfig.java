package br.com.mgobo.api.config;

import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.event.EventListener;

@Primary
@ComponentScan(value = "br.com.mgobo.*")
@Configuration
public class CarProfileConfig {

    @EventListener(value = {ApplicationStartedEvent.class})
    public void onApplicationEvent(ApplicationStartedEvent event) {
        LoggerFactory.getLogger(CarProfileConfig.class).info("Application started in %s seconds".formatted(event.getTimeTaken().getSeconds()));
    }
}
