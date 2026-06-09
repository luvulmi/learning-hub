package com.portfolio.learninghub.security.oauth2;

import com.portfolio.learninghub.domain.user.User;
import com.portfolio.learninghub.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> createUser(email, name));

        return new OAuth2UserAdapter(user, oAuth2User.getAttributes());
    }

    private User createUser(String email, String name) {
        return userRepository.save(User.builder()
                .email(email)
                .nickname(name)
                .profileSlug(generateUniqueSlug(name))
                .build());
    }

    private String generateUniqueSlug(String name) {
        // 이름에서 영문/숫자만 추출해 슬러그 기반 생성, 중복이면 UUID 일부 추가
        String base = name.toLowerCase().replaceAll("[^a-z0-9]", "");
        if (base.isBlank()) base = "user";

        String slug = base;
        while (userRepository.existsByProfileSlug(slug)) {
            slug = base + "-" + UUID.randomUUID().toString().substring(0, 6);
        }
        return slug;
    }
}
