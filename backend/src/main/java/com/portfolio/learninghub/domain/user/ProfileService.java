package com.portfolio.learninghub.domain.user;

import com.portfolio.learninghub.domain.record.LearningRecordRepository;
import com.portfolio.learninghub.domain.record.dto.LearningRecordResponse;
import com.portfolio.learninghub.domain.user.dto.ProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService {

    private final UserRepository userRepository;
    private final LearningRecordRepository recordRepository;

    public ProfileResponse getProfile(String slug) {
        User user = findUserBySlug(slug);
        long total = recordRepository.countByUserAndIsPublicTrue(user);
        return ProfileResponse.of(user, total);
    }

    public Page<LearningRecordResponse> getPublicRecords(String slug, Pageable pageable) {
        User user = findUserBySlug(slug);
        return recordRepository.findPublicByUser(user, pageable)
                .map(LearningRecordResponse::from);
    }

    private User findUserBySlug(String slug) {
        return userRepository.findByProfileSlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
    }
}
