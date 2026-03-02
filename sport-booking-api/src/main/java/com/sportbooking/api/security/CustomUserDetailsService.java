package com.sportbooking.api.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.sportbooking.api.repository.user.UserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

        private final UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String userId)
                        throws UsernameNotFoundException {

                var user = userRepository.findById(userId)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                return new org.springframework.security.core.userdetails.User(
                                user.getId(), // 👈 principal = userId
                                user.getPassword(),
                                List.of(new SimpleGrantedAuthority(
                                                "ROLE_" + user.getRole().name())));
        }
}