package com.portfolio.learninghub.domain.record;

import com.portfolio.learninghub.domain.record.dto.LearningRecordRequest;
import com.portfolio.learninghub.domain.record.dto.LearningRecordResponse;
import com.portfolio.learninghub.domain.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@Tag(name = "학습 기록", description = "학습 기록 CRUD API — JWT 인증 필요")
@SecurityRequirement(name = "JWT")
@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class LearningRecordController {

    private final LearningRecordService recordService;

    @Operation(summary = "학습 기록 생성", description = "새 학습 기록을 작성합니다. 태그는 최대 10개까지 입력 가능합니다.")
    @ApiResponse(responseCode = "201", description = "생성 성공")
    @PostMapping
    ResponseEntity<LearningRecordResponse> create(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid LearningRecordRequest request) {

        LearningRecordResponse response = recordService.create(user, request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @Operation(summary = "내 학습 기록 목록", description = "로그인한 사용자의 학습 기록을 최신순으로 페이지네이션하여 조회합니다.")
    @GetMapping
    ResponseEntity<Page<LearningRecordResponse>> getMyRecords(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(recordService.findMyRecords(user, pageable));
    }

    @Operation(summary = "학습 기록 단건 조회")
    @ApiResponse(responseCode = "404", description = "기록 없음 또는 권한 없음")
    @GetMapping("/{id}")
    ResponseEntity<LearningRecordResponse> getOne(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        return ResponseEntity.ok(recordService.findById(user, id));
    }

    @Operation(summary = "학습 기록 수정", description = "태그를 포함한 모든 필드를 교체합니다 (PUT semantics).")
    @PutMapping("/{id}")
    ResponseEntity<LearningRecordResponse> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody @Valid LearningRecordRequest request) {

        return ResponseEntity.ok(recordService.update(user, id, request));
    }

    @Operation(summary = "학습 기록 삭제")
    @ApiResponse(responseCode = "204", description = "삭제 성공")
    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        recordService.delete(user, id);
        return ResponseEntity.noContent().build();
    }
}
