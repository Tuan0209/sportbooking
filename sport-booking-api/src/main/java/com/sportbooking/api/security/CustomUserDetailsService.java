package com.sportbooking.api.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.sportbooking.api.repository.user.UserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import com.sportbooking.api.entity.user.User;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

        private final UserRepository userRepository;
        User user;

        @Override
        public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

                return new org.springframework.security.core.userdetails.User(
                                user.getId(),
                                user.getPassword(),
                                List.of(new SimpleGrantedAuthority(user.getRole().name())));
        }
}