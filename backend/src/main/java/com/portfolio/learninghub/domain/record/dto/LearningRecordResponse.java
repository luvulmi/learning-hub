package com.portfolio.learninghub.domain.record.dto;

import com.portfolio.learninghub.domain.record.Category;
import com.portfolio.learninghub.domain.record.LearningRecord;

import java.time.LocalDateTime;
import java.util.List;

public record LearningRecordResponse(
        Long id,
        String title,
        String content,
        Category category,
        List<String> tags,
        boolean isPublic,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static LearningRecordResponse from(LearningRecord record) {
        List<String> tagNames = record.getRecordTags().stream()
                .map(rt -> rt.getTag().getName())
                .toList();

        return new LearningRecordResponse(
                record.getId(),
                record.getTitle(),
                record.getContent(),
                record.getCategory(),
                tagNames,
                record.isPublic(),
                record.getCreatedAt(),
                record.getUpdatedAt()
        );
    }
}
