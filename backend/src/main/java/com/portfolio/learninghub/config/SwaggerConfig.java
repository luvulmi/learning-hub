package com.portfolio.learninghub.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Learning Hub API",
                description = "학습 기록을 관리하고 AI가 다음 학습 주제를 추천해주는 서비스",
                version = "v1",
                contact = @Contact(name = "GitHub", url = "https://github.com")
        ),
        servers = {
                @Server(url = "http://localhost:8080", description = "로컬 개발 서버"),
                @Server(url = "https://api.learning-hub.com", description = "운영 서버")
        }
)
@SecurityScheme(
        name = "JWT",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "구글 로그인 후 발급된 JWT 토큰을 입력하세요. (Bearer 접두사 불필요)"
)
public class SwaggerConfig {
}
