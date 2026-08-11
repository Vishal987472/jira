package com.jira.repository;

import com.jira.entity.Task;
import com.jira.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("""
        SELECT t
        FROM Task t
        WHERE t.createdBy.id = :userId
           OR t.assignee.id = :userId
        ORDER BY t.createdAt DESC
    """)
    List<Task> findAccessibleTasks(
            @Param("userId") Long userId
    );

    @Query("""
        SELECT t
        FROM Task t
        WHERE t.id = :taskId
          AND (
              t.createdBy.id = :userId
              OR t.assignee.id = :userId
          )
    """)
    Optional<Task> findAccessibleTask(
            @Param("taskId") Long taskId,
            @Param("userId") Long userId
    );

    long countByCreatedByIdOrAssigneeId(
            Long createdById,
            Long assigneeId
    );

    long countByStatusAndCreatedByIdOrStatusAndAssigneeId(
            TaskStatus status1,
            Long createdById,
            TaskStatus status2,
            Long assigneeId
    );
}