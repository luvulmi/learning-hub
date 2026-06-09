package com.portfolio.learninghub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class LearningHubBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearningHubBackendApplication.class, args);
	}

}
