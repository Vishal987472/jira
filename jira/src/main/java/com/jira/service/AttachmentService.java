package com.jira.service;

import com.jira.dto.AttachmentResponse;
import com.jira.entity.Attachment;
import com.jira.entity.Task;
import com.jira.entity.User;
import com.jira.exception.BadRequestException;
import com.jira.exception.ResourceNotFoundException;
import com.jira.exception.UnauthorizedException;
import com.jira.repository.AttachmentRepository;
import com.jira.repository.TaskRepository;
import com.jira.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public AttachmentResponse upload(
            Long taskId,
            MultipartFile file,
            String email
    ) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }

        validateFileType(file);

        User user = getUser(email);

        Task task = taskRepository
                .findAccessibleTask(taskId, user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task not found or access denied"
                        )
                );

        checkPermission(task, user);

        try {

            Path uploadPath = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(uploadPath);

            String originalName = file.getOriginalFilename();

            if (originalName == null || originalName.isBlank()) {
                throw new BadRequestException(
                        "Invalid file name"
                );
            }

            String storedName =
                    UUID.randomUUID()
                            + getExtension(originalName);

            Path targetPath =
                    uploadPath.resolve(storedName);

            Files.copy(
                    file.getInputStream(),
                    targetPath
            );

            Attachment attachment = Attachment.builder()
                    .fileName(originalName)
                    .storedName(storedName)
                    .fileType(
                            file.getContentType() != null
                                    ? file.getContentType()
                                    : "application/octet-stream"
                    )
                    .fileSize(file.getSize())
                    .filePath(targetPath.toString())
                    .task(task)
                    .build();

            return AttachmentResponse.from(
                    attachmentRepository.save(attachment)
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to store file"
            );
        }
    }

    @Transactional(readOnly = true)
    public List<AttachmentResponse> getTaskAttachments(
            Long taskId,
            String email
    ) {

        User user = getUser(email);

        taskRepository.findAccessibleTask(
                taskId,
                user.getId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Task not found or access denied"
                )
        );

        return attachmentRepository
                .findByTaskId(taskId)
                .stream()
                .map(AttachmentResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Attachment getAttachment(
            Long attachmentId,
            String email
    ) {

        User user = getUser(email);

        Attachment attachment =
                attachmentRepository.findById(attachmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attachment not found"
                                )
                        );

        taskRepository.findAccessibleTask(
                attachment.getTask().getId(),
                user.getId()
        ).orElseThrow(() ->
                new UnauthorizedException(
                        "You cannot access this attachment"
                )
        );

        return attachment;
    }

    @Transactional
    public void delete(
            Long attachmentId,
            String email
    ) {

        User user = getUser(email);

        Attachment attachment =
                attachmentRepository.findById(attachmentId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Attachment not found"
                                )
                        );

        Task task = attachment.getTask();

        checkPermission(task, user);

        try {

            Files.deleteIfExists(
                    Paths.get(attachment.getFilePath())
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to delete file"
            );
        }

        attachmentRepository.delete(attachment);
    }

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    private void checkPermission(
            Task task,
            User user
    ) {

        boolean creator =
                task.getCreatedBy()
                        .getId()
                        .equals(user.getId());

        boolean assignee =
                task.getAssignee() != null
                        && task.getAssignee()
                        .getId()
                        .equals(user.getId());

        if (!creator && !assignee) {

            throw new UnauthorizedException(
                    "You do not have permission"
            );
        }
    }

    private String getExtension(String fileName) {

        int index = fileName.lastIndexOf(".");

        return index >= 0
                ? fileName.substring(index)
                : "";
    }

    private void validateFileType(
            MultipartFile file
    ) {

        String contentType = file.getContentType();

        if (contentType == null) {
            throw new BadRequestException(
                    "Unsupported file type"
            );
        }

        List<String> allowedTypes = List.of(
                "image/jpeg",
                "image/png",
                "image/webp",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "text/plain"
        );

        if (!allowedTypes.contains(contentType)) {
            throw new BadRequestException(
                    "File type is not supported"
            );
        }
    }
}