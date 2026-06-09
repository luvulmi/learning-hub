package com.portfolio.learninghub.domain.record.dto;

import com.portfolio.learninghub.domain.record.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public record LearningRecordRequest(
        @NotBlank String title,
        @NotBlank String content,
        @NotNull Category category,
        @Size(max = 10) List<String> tags,
        boolean isPublic
) {
    public LearningRecordRequest {
        tags = (tags == null) ? new ArrayList<>() : tags;
    }
}
