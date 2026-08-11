package com.jira.service;

import com.jira.dto.DashboardResponse;
import com.jira.entity.enums.TaskStatus;
import com.jira.entity.User;
import com.jira.repository.TaskRepository;
import com.jira.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        var tasks = taskRepository
                .findAccessibleTasks(user.getId());

        return DashboardResponse.builder()
                .totalTasks(tasks.size())

                .ideaTasks(
                        count(tasks, TaskStatus.IDEA)
                )

                .todoTasks(
                        count(tasks, TaskStatus.TODO)
                )

                .inProgressTasks(
                        count(tasks, TaskStatus.IN_PROGRESS)
                )

                .inReviewTasks(
                        count(tasks, TaskStatus.IN_REVIEW)
                )

                .completedTasks(
                        count(tasks, TaskStatus.COMPLETED)
                )

                .build();
    }

    private long count(
            java.util.List<com.jira.entity.Task> tasks,
            TaskStatus status
    ) {

        return tasks.stream()
                .filter(task ->
                        task.getStatus() == status
                )
                .count();
    }
}