package com.jira.controller;

import com.jira.dto.*;
import com.jira.service.TaskHistoryService;
import com.jira.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final TaskHistoryService taskHistoryService;

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                taskService.getTasks(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(
            @PathVariable Long id,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                taskService.getTask(
                        id,
                        authentication.getName()
                )
        );
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        taskService.createTask(
                                request,
                                authentication.getName()
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                taskService.updateTask(
                        id,
                        request,
                        authentication.getName()
                )
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                taskService.updateStatus(
                        id,
                        request,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            Authentication authentication
    ) {

        taskService.deleteTask(
                id,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<TaskHistoryResponse>> getHistory(
            @PathVariable Long id,
            Authentication authentication
    ) {

        // Verify the user can access the task
        taskService.getTask(
                id,
                authentication.getName()
        );

        return ResponseEntity.ok(
                taskHistoryService.getHistory(id)
        );
    }

    @PatchMapping("/{id}/assignee")
    public ResponseEntity<TaskResponse> updateAssignee(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                taskService.updateAssignee(
                        id,
                        userId,
                        authentication.getName()
                )
        );
    }
}