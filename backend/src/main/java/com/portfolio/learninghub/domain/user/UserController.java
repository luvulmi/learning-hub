package com.portfolio.learninghub.domain.user;

import com.portfolio.learninghub.domain.user.dto.MeResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "사용자")
@SecurityRequirement(name = "JWT")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Operation(summary = "내 정보 조회")
    @GetMapping("/me")
    ResponseEntity<MeResponse> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(MeResponse.of(user));
    }
}
