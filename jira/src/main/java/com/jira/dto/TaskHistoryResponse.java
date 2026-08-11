package com.jira.dto;

import com.jira.entity.TaskHistory;
import com.jira.entity.enums.TaskStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TaskHistoryResponse {

    private Long id;

    private TaskStatus oldStatus;

    private TaskStatus newStatus;

    private Long changedById;

    private String changedByName;

    private LocalDateTime changedAt;

    public static TaskHistoryResponse from(
            TaskHistory history
    ) {

        return TaskHistoryResponse.builder()
                .id(history.getId())
                .oldStatus(history.getOldStatus())
                .newStatus(history.getNewStatus())
                .changedById(
                        history.getChangedBy().getId()
                )
                .changedByName(
                        history.getChangedBy().getFullName()
                )
                .changedAt(
                        history.getChangedAt()
                )
                .build();
    }
}