package com.portfolio.learninghub.domain.user.dto;

import com.portfolio.learninghub.domain.user.User;

public record MeResponse(
        Long id,
        String email,
        String nickname,
        String profileSlug
) {
    public static MeResponse of(User user) {
        return new MeResponse(user.getId(), user.getEmail(), user.getNickname(), user.getProfileSlug());
    }
}
