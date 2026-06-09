package com.portfolio.learninghub.domain.user.dto;

import com.portfolio.learninghub.domain.user.User;

public record ProfileResponse(
        String nickname,
        String profileSlug,
        long totalPublicRecords
) {
    public static ProfileResponse of(User user, long totalPublicRecords) {
        return new ProfileResponse(
                user.getNickname(),
                user.getProfileSlug(),
                totalPublicRecords
        );
    }
}
