package com.jira.service;

import com.jira.dto.UserResponse;
import com.jira.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserResponse::from)
                .toList();
    }
}