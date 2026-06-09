package com.portfolio.learninghub.domain.user;

import com.portfolio.learninghub.common.entity.BaseTimeEntity;
import com.portfolio.learninghub.domain.record.LearningRecord;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "users")
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    @Column(unique = true)
    private String profileSlug;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LearningRecord> records = new ArrayList<>();

    @Builder
    private User(String email, String password, String nickname, String profileSlug) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.profileSlug = profileSlug;
    }

    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    public void changeProfileSlug(String profileSlug) {
        this.profileSlug = profileSlug;
    }
}
