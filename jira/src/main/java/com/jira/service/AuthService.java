package com.jira.service;

import com.jira.dto.AuthResponse;
import com.jira.dto.LoginRequest;
import com.jira.dto.RegisterRequest;
import com.jira.entity.User;
import com.jira.exception.BadRequestException;
import com.jira.repository.UserRepository;
import com.jira.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public User register(RegisterRequest request) {

        if (!request.getPassword()
                .equals(request.getConfirmPassword())) {

            throw new BadRequestException(
                    "Passwords do not match"
            );
        }

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new BadRequestException(
                    "Email already registered"
            );
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .build();

        return userRepository.save(user);
    }

    public String login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(
                        request.getEmail()
                );

        return jwtService.generateToken(userDetails);
    }

    public AuthResponse getUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadRequestException(
                                "User not found"
                        )
                );

        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}