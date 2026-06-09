package com.portfolio.learninghub.domain.record;

import com.portfolio.learninghub.domain.record.dto.LearningRecordRequest;
import com.portfolio.learninghub.domain.record.dto.LearningRecordResponse;
import com.portfolio.learninghub.domain.user.User;
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

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class LearningRecordController {

    private final LearningRecordService recordService;

    @PostMapping
    ResponseEntity<LearningRecordResponse> create(
            @AuthenticationPrincipal User user,
            @RequestBody @Valid LearningRecordRequest request) {

        LearningRecordResponse response = recordService.create(user, request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(response.id()).toUri();
        return ResponseEntity.created(location).body(response);
    }

    @GetMapping
    ResponseEntity<Page<LearningRecordResponse>> getMyRecords(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        return ResponseEntity.ok(recordService.findMyRecords(user, pageable));
    }

    @GetMapping("/{id}")
    ResponseEntity<LearningRecordResponse> getOne(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        return ResponseEntity.ok(recordService.findById(user, id));
    }

    @PutMapping("/{id}")
    ResponseEntity<LearningRecordResponse> update(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @RequestBody @Valid LearningRecordRequest request) {

        return ResponseEntity.ok(recordService.update(user, id, request));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {

        recordService.delete(user, id);
        return ResponseEntity.noContent().build();
    }
}
