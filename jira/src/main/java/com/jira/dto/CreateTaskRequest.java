package com.jira.dto;

import com.jira.entity.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateTaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    @NotBlank(message = "Task description is required")
    private String description;

    private LocalDate dueDate;

    private TaskPriority priority;

    private Long assigneeId;

    private String labels;
}