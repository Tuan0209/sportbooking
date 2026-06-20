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
                                                // Cho phép tất cả các phương thức HTTP trên endpoint /users, có thể cấu
                                                // hình
                                                // chi tiết hơn nếu muốn
                                                .requestMatchers(HttpMethod.POST, "/admin/users/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/admin/users/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/admin/users/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/admin/users/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/api/areas", "/api/areas/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/areas", "/api/areas/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/areas/**").hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/areas/**")
                                                .hasAuthority("ADMIN")
                                                //
                                                .requestMatchers(HttpMethod.GET, "/api/fields", "/api/fields/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/fields", "/api/fields/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/fields/**").hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/fields/**")
                                                .hasAuthority("ADMIN")
                                                //
                                                .requestMatchers(HttpMethod.GET, "/api/field-types",
                                                                "/api/field-types/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/field-types")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/field-types/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/field-types/**")
                                                .hasAuthority("ADMIN")
                                                //
                                                .requestMatchers(HttpMethod.GET, "/api/venue-images/**").permitAll()
                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/venue-images/*/cover",
                                                                "/api/venue-images/*/thumbnail",
                                                                "/api/venue-images/*/gallery")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.PUT,
                                                                "/api/venue-images/*/cover",
                                                                "/api/venue-images/*/thumbnail")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/api/venue-images/image/**",
                                                                "/api/venue-images/*/all")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.GET,
                                                                "/api/venues",
                                                                "/api/venues/**")
                                                .permitAll()

                                                .requestMatchers(HttpMethod.POST,
                                                                "/api/venues")
                                                .hasAuthority("ADMIN")

                                                .requestMatchers(HttpMethod.PUT,
                                                                "/api/venues/**")
                                                .hasAuthority("ADMIN")

                                                .requestMatchers(HttpMethod.DELETE,
                                                                "/api/venues/**")
                                                .hasAuthority("ADMIN")
                                                // sprot types
                                                .requestMatchers(HttpMethod.GET, "/api/sport-types",
                                                                "/api/sport-types/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/sport-types")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/sport-types/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/sport-types/**")
                                                .hasAuthority("ADMIN")
                                                // fild price slot
                                                .requestMatchers(HttpMethod.GET, "/api/fields/*/price-slots")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/fields/*/price")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/price-slots")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/price-slots/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/price-slots/**")
                                                .hasAuthority("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/bookings/**")
                                                .permitAll()
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
