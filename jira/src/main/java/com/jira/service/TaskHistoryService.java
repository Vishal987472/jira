package com.jira.service;

import com.jira.dto.TaskHistoryResponse;
import com.jira.entity.Task;
import com.jira.entity.TaskHistory;
import com.jira.entity.enums.TaskStatus;
import com.jira.entity.User;
import com.jira.repository.TaskHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskHistoryService {

    private final TaskHistoryRepository taskHistoryRepository;

    @Transactional
    public void recordStatusChange(
            Task task,
            User user,
            TaskStatus oldStatus,
            TaskStatus newStatus
    ) {

        if (oldStatus == newStatus) {
            return;
        }

        TaskHistory history = TaskHistory.builder()
                .task(task)
                .changedBy(user)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .build();

        taskHistoryRepository.save(history);
    }

    @Transactional(readOnly = true)
    public List<TaskHistoryResponse> getHistory(
            Long taskId
    ) {

        return taskHistoryRepository
                .findByTaskIdOrderByChangedAtDesc(taskId)
                .stream()
                .map(TaskHistoryResponse::from)
                .toList();
    }
}