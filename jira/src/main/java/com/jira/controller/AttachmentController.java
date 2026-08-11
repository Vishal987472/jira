package com.jira.controller;

import com.jira.dto.AttachmentResponse;
import com.jira.entity.Attachment;
import com.jira.exception.ResourceNotFoundException;
import com.jira.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping("/tasks/{taskId}/attachments")
    public ResponseEntity<AttachmentResponse> upload(
            @PathVariable Long taskId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                attachmentService.upload(
                        taskId,
                        file,
                        authentication.getName()
                )
        );
    }

    @GetMapping("/tasks/{taskId}/attachments")
    public ResponseEntity<List<AttachmentResponse>> getAttachments(
            @PathVariable Long taskId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                attachmentService.getTaskAttachments(
                        taskId,
                        authentication.getName()
                )
        );
    }

    @GetMapping("/attachments/{id}")
    public ResponseEntity<Resource> download(
            @PathVariable Long id,
            Authentication authentication
    ) throws Exception {

        Attachment attachment =
                attachmentService.getAttachment(
                        id,
                        authentication.getName()
                );

        Path path = Paths.get(
                attachment.getFilePath()
        );

        Resource resource =
                new UrlResource(path.toUri());

        if (!resource.exists() || !resource.isReadable()) {

            throw new ResourceNotFoundException(
                    "File not found"
            );
        }

        return ResponseEntity.ok()
                .contentType(
                        MediaType.parseMediaType(
                                attachment.getFileType()
                        )
                )
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition
                                .attachment()
                                .filename(
                                        attachment.getFileName()
                                )
                                .build()
                                .toString()
                )
                .body(resource);
    }

    @DeleteMapping("/attachments/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication
    ) {

        attachmentService.delete(
                id,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}