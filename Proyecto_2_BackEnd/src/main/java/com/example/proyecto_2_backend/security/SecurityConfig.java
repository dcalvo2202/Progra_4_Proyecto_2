package com.example.proyecto_2_backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Configuración CORS simplificada
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.setAllowedOrigins(List.of(
                            "http://localhost:3000",
                            "http://localhost:4200",
                            "http://localhost:8080",
                            "http://localhost:8000",
                            "http://127.0.0.1:8000"
                    ));
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfig.setAllowedHeaders(List.of("*"));
                    corsConfig.setAllowCredentials(true); // Importante para sesiones
                    return corsConfig;
                }))

                // Deshabilitar CSRF para APIs REST
                .csrf(csrf -> csrf.disable())

                // Configurar headers
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))

                // Configurar autorización de requests
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos de autenticación
                        .requestMatchers("/auth/login", "/auth/register").permitAll()

                        // Endpoints públicos para consultar médicos (sin autenticación)
                        .requestMatchers("/api/medicos", "/api/medicos/filtrar", "/api/medicos/{id}", "/api/medicos/{medicoId}/horarios").permitAll()

                        // Recursos estáticos públicos
                        .requestMatchers("/favicon.ico", "/", "/index.html", "/app.js", "/style.css", "/styles.css", "/script.js").permitAll()
                        .requestMatchers("/static/**", "/css/**", "/js/**", "/images/**").permitAll()

                        // Resto de endpoints requieren autenticación
                        .anyRequest().authenticated()
                )

                // Configurar manejo de sesiones (EN LUGAR DE STATELESS)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // Crear sesiones cuando sea necesario
                        .maximumSessions(1) // Máximo una sesión por usuario
                        .maxSessionsPreventsLogin(false) // Permitir nueva sesión, invalidar la anterior
                )

                // Configurar logout
                .logout(logout -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/auth/logout", "POST"))
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\":\"Logout exitoso\"}");
                        })
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                )

                // Configurar manejo de excepciones de autenticación
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"No autenticado\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"Acceso denegado\"}");
                        })
                )

                // Proveedor de autenticación
                .authenticationProvider(authenticationProvider());

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Handler para éxito de autenticación (opcional, para personalizar respuesta)
    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {
        return (request, response, authentication) -> {
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Login exitoso\"}");
        };
    }

    // Handler para fallo de autenticación (opcional, para personalizar respuesta)
    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler() {
        return (request, response, exception) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Credenciales inválidas\"}");
        };
    }
}