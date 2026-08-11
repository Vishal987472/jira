package com.jira.dto;

import com.jira.entity.Task;
import com.jira.entity.enums.TaskPriority;
import com.jira.entity.enums.TaskStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class TaskResponse {

    private Long id;

    private String title;

    private String description;

    private TaskStatus status;

    private TaskPriority priority;

    private LocalDate dueDate;

    private String labels;

    private Long createdById;

    private String createdByName;

    private Long assigneeId;

    private String assigneeName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public static TaskResponse from(Task task) {

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .labels(task.getLabels())
                .createdById(task.getCreatedBy().getId())
                .createdByName(task.getCreatedBy().getFullName())
                .assigneeId(
                        task.getAssignee() != null
                                ? task.getAssignee().getId()
                                : null
                )
                .assigneeName(
                        task.getAssignee() != null
                                ? task.getAssignee().getFullName()
                                : null
                )
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}