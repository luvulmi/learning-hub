package com.portfolio.learninghub.domain.record;

import com.portfolio.learninghub.domain.record.dto.LearningRecordRequest;
import com.portfolio.learninghub.domain.record.dto.LearningRecordResponse;
import com.portfolio.learninghub.domain.tag.RecordTag;
import com.portfolio.learninghub.domain.tag.Tag;
import com.portfolio.learninghub.domain.tag.TagRepository;
import com.portfolio.learninghub.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LearningRecordService {

    private final LearningRecordRepository recordRepository;
    private final TagRepository tagRepository;

    @Transactional
    public LearningRecordResponse create(User user, LearningRecordRequest request) {
        LearningRecord record = LearningRecord.builder()
                .user(user)
                .title(request.title())
                .content(request.content())
                .category(request.category())
                .isPublic(request.isPublic())
                .build();

        recordRepository.save(record);
        record.replaceTags(buildRecordTags(record, request.tags()));

        return LearningRecordResponse.from(record);
    }

    public Page<LearningRecordResponse> findMyRecords(User user, Pageable pageable) {
        return recordRepository.findAllByUser(user, pageable)
                .map(LearningRecordResponse::from);
    }

    public LearningRecordResponse findById(User user, Long id) {
        LearningRecord record = getOwnedRecord(id, user);
        return LearningRecordResponse.from(record);
    }

    @Transactional
    public LearningRecordResponse update(User user, Long id, LearningRecordRequest request) {
        LearningRecord record = getOwnedRecord(id, user);
        record.update(request.title(), request.content(), request.category(), request.isPublic());
        record.replaceTags(buildRecordTags(record, request.tags()));
        return LearningRecordResponse.from(record);
    }

    @Transactional
    public void delete(User user, Long id) {
        LearningRecord record = getOwnedRecord(id, user);
        recordRepository.delete(record);
    }

    private LearningRecord getOwnedRecord(Long id, User user) {
        return recordRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found"));
    }

    private List<RecordTag> buildRecordTags(LearningRecord record, List<String> tagNames) {
        return tagNames.stream()
                .map(name -> {
                    Tag tag = tagRepository.findByName(name)
                            .orElseGet(() -> tagRepository.save(Tag.builder().name(name).build()));
                    return RecordTag.builder().record(record).tag(tag).build();
                })
                .toList();
    }
}
