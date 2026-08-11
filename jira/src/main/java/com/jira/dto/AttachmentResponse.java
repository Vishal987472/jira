package com.jira.dto;

import com.jira.entity.Attachment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AttachmentResponse {

    private Long id;

    private String fileName;

    private String fileType;

    private Long fileSize;

    private LocalDateTime createdAt;

    public static AttachmentResponse from(
            Attachment attachment
    ) {

        return AttachmentResponse.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .fileSize(attachment.getFileSize())
                .createdAt(attachment.getCreatedAt())
                .build();
    }
}