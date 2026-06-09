package com.portfolio.learninghub.domain.record;

import com.portfolio.learninghub.common.entity.BaseTimeEntity;
import com.portfolio.learninghub.domain.tag.RecordTag;
import com.portfolio.learninghub.domain.user.User;
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
@Table(name = "learning_records")
public class LearningRecord extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private boolean isPublic = false;

    @OneToMany(mappedBy = "record", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecordTag> recordTags = new ArrayList<>();

    @Builder
    private LearningRecord(User user, String title, String content, Category category, boolean isPublic) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.category = category;
        this.isPublic = isPublic;
    }

    public void update(String title, String content, Category category, boolean isPublic) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.isPublic = isPublic;
    }
}
