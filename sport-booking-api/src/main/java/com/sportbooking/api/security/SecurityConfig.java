package com.sportbooking.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import lombok.RequiredArgsConstructor;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import java.util.List;

@EnableWebSecurity // để kích hoạt bảo mật web trong ứng dụng Spring Boot
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ← thêm dòng này
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() //
                        .requestMatchers(HttpMethod.POST, "/users").permitAll()
                        .requestMatchers(HttpMethod.GET, "/users").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/users/**").permitAll()
                        // Cho phép tất cả các phương thức HTTP trên endpoint /users, có thể cấu hình
                        // chi tiết hơn nếu muốn
                        .requestMatchers(HttpMethod.POST, "/admin/users/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/admin/users/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/admin/users/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/admin/users/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/areas", "/api/areas/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/areas", "/api/areas/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/areas/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/areas/**").hasAuthority("ADMIN")
                        .anyRequest().authenticated())
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtAuthenticationFilter, // ← thêm dòng này
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Vite dev server
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
