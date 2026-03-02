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
        public UserDetails loadUserByUsername(String email)
                        throws UsernameNotFoundException {

                var user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("Not found"));

                return new User(
                                user.getEmail(),
                                user.getPassword(),
                                List.of(new SimpleGrantedAuthority(
                                                "ROLE_" + user.getRole().name())));
        }
}