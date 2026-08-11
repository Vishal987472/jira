package com.jira.service;

import com.jira.dto.CreateTaskRequest;
import com.jira.dto.TaskResponse;
import com.jira.dto.UpdateStatusRequest;
import com.jira.dto.UpdateTaskRequest;
import com.jira.entity.Task;
import com.jira.entity.enums.TaskStatus;
import com.jira.entity.User;
import com.jira.exception.ResourceNotFoundException;
import com.jira.exception.UnauthorizedException;
import com.jira.repository.TaskRepository;
import com.jira.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskHistoryService taskHistoryService;

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasks(String email) {

        User user = getUser(email);

        return taskRepository
                .findAccessibleTasks(user.getId())
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(
            Long taskId,
            String email
    ) {

        User user = getUser(email);

        Task task = getAccessibleTask(taskId, user);

        return TaskResponse.from(task);
    }

    @Transactional
    public TaskResponse createTask(
            CreateTaskRequest request,
            String email
    ) {

        User currentUser = getUser(email);

        User assignee = null;

        if (request.getAssigneeId() != null) {

            assignee = userRepository.findById(
                    request.getAssigneeId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Assignee not found"
                    )
            );
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .labels(request.getLabels())
                .createdBy(currentUser)
                .assignee(assignee)
                .status(TaskStatus.IDEA)
                .build();

        task = taskRepository.save(task);

        return TaskResponse.from(task);
    }

    @Transactional
    public TaskResponse updateTask(
            Long taskId,
            UpdateTaskRequest request,
            String email
    ) {

        User currentUser = getUser(email);

        Task task = getAccessibleTask(taskId, currentUser);

        checkModificationPermission(task, currentUser);

        if (request.getTitle() != null
                && !request.getTitle().isBlank()) {

            task.setTitle(request.getTitle());
        }

        if (request.getDescription() != null
                && !request.getDescription().isBlank()) {

            task.setDescription(request.getDescription());
        }

        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        if (request.getStatus() != null
                && request.getStatus() != task.getStatus()) {

            TaskStatus oldStatus = task.getStatus();

            task.setStatus(request.getStatus());

            taskHistoryService.recordStatusChange(
                    task,
                    currentUser,
                    oldStatus,
                    request.getStatus()
            );
        }

        if (request.getLabels() != null) {
            task.setLabels(request.getLabels());
        }

        if (request.getAssigneeId() != null) {

            User assignee = userRepository.findById(
                    request.getAssigneeId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Assignee not found"
                    )
            );

            task.setAssignee(assignee);
        }

        return TaskResponse.from(
                taskRepository.save(task)
        );
    }

    @Transactional
    public TaskResponse updateStatus(
            Long taskId,
            UpdateStatusRequest request,
            String email
    ) {

        User currentUser = getUser(email);

        Task task = getAccessibleTask(
                taskId,
                currentUser
        );

        checkModificationPermission(
                task,
                currentUser
        );

        TaskStatus oldStatus = task.getStatus();
        TaskStatus newStatus = request.getStatus();

        if (oldStatus != newStatus) {

            task.setStatus(newStatus);

            taskHistoryService.recordStatusChange(
                    task,
                    currentUser,
                    oldStatus,
                    newStatus
            );
        }

        return TaskResponse.from(
                taskRepository.save(task)
        );
    }

    @Transactional
    public void deleteTask(
            Long taskId,
            String email
    ) {

        User currentUser = getUser(email);

        Task task = getAccessibleTask(taskId, currentUser);

        checkModificationPermission(task, currentUser);

        taskRepository.delete(task);
    }

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    private Task getAccessibleTask(
            Long taskId,
            User user
    ) {

        return taskRepository
                .findAccessibleTask(
                        taskId,
                        user.getId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found or access denied"
                        )
                );
    }

    private void checkModificationPermission(
            Task task,
            User user
    ) {

        boolean isCreator =
                task.getCreatedBy()
                        .getId()
                        .equals(user.getId());

        boolean isAssignee =
                task.getAssignee() != null
                        && task.getAssignee()
                        .getId()
                        .equals(user.getId());

        if (!isCreator && !isAssignee) {

            throw new UnauthorizedException(
                    "You do not have permission to modify this task"
            );
        }
    }

    @Transactional
    public TaskResponse updateAssignee(
            Long taskId,
            Long userId,
            String email
    ) {

        User currentUser = getUser(email);

        Task task = getAccessibleTask(
                taskId,
                currentUser
        );

        checkModificationPermission(
                task,
                currentUser
        );

        if (userId == null) {

            task.setAssignee(null);

        } else {

            User assignee = userRepository.findById(userId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found"
                            )
                    );

            task.setAssignee(assignee);
        }

        return TaskResponse.from(
                taskRepository.save(task)
        );
    }
}