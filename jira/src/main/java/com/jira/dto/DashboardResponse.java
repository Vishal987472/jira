package com.jira.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardResponse {

    private long totalTasks;

    private long ideaTasks;

    private long todoTasks;

    private long inProgressTasks;

    private long inReviewTasks;

    private long completedTasks;
}