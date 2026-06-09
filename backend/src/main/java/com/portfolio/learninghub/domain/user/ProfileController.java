package com.portfolio.learninghub.domain.user;

import com.portfolio.learninghub.domain.record.dto.LearningRecordResponse;
import com.portfolio.learninghub.domain.user.dto.ProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{slug}")
    ResponseEntity<ProfileResponse> getProfile(@PathVariable String slug) {
        return ResponseEntity.ok(profileService.getProfile(slug));
    }

    @GetMapping("/{slug}/records")
    ResponseEntity<Page<LearningRecordResponse>> getPublicRecords(
            @PathVariable String slug,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(profileService.getPublicRecords(slug, pageable));
    }
}
