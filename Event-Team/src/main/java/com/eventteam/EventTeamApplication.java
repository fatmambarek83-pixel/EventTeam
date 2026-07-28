package com.eventteam;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages ={"com.eventteam", "com/eventteam/exception"})
public class EventTeamApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventTeamApplication.class, args);
	}

}
