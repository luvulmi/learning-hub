package com.portfolio.learninghub.domain.user;

import com.portfolio.learninghub.domain.record.dto.LearningRecordResponse;
import com.portfolio.learninghub.domain.user.dto.ProfileResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "공개 프로필", description = "인증 없이 접근 가능한 공개 프로필 API")
@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @Operation(summary = "프로필 조회", description = "슬러그(/@slug)로 사용자 프로필과 공개 기록 수를 조회합니다.")
    @ApiResponse(responseCode = "404", description = "존재하지 않는 슬러그")
    @GetMapping("/{slug}")
    ResponseEntity<ProfileResponse> getProfile(@PathVariable String slug) {
        return ResponseEntity.ok(profileService.getProfile(slug));
    }

    @Operation(summary = "공개 기록 목록", description = "해당 사용자가 공개 설정한 학습 기록을 최신순으로 조회합니다.")
    @GetMapping("/{slug}/records")
    ResponseEntity<Page<LearningRecordResponse>> getPublicRecords(
            @PathVariable String slug,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(profileService.getPublicRecords(slug, pageable));
    }
}
