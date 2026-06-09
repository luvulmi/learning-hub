package com.portfolio.learninghub.security.oauth2;

import com.portfolio.learninghub.domain.user.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/**
 * Spring Security OAuth2User와 도메인 User를 연결하는 어댑터.
 * SecurityContext에서 User 엔티티를 꺼낼 수 있도록 감싼다.
 */
@Getter
public class OAuth2UserAdapter implements OAuth2User {

    private final User user;
    private final Map<String, Object> attributes;

    public OAuth2UserAdapter(User user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getName() {
        return user.getEmail();
    }
}
