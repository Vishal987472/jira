package com.jira.dto;

import com.jira.entity.enums.TaskPriority;
import com.jira.entity.enums.TaskStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateTaskRequest {

    private String title;

    private String description;

    private LocalDate dueDate;

    private TaskPriority priority;

    private TaskStatus status;

    private Long assigneeId;

    private String labels;
}