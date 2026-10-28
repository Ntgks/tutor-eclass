package com.tutor.eclass.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean 
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http) throws Exception{
            http
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                        HttpMethod.GET,
                        "/api/auth/csrf",
                        "/actuator/health",
                        "/login"
                    ).permitAll()
                    .requestMatchers(
                        HttpMethod.POST,
                        "/api/auth/activate"
                    ).permitAll()
                    .anyRequest().authenticated()
                )
                .exceptionHandling(errors -> errors
                    .defaultAuthenticationEntryPointFor(
                        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED), 
                        request -> request.getServletPath().startsWith("/api/")
                    )   
                )
                .formLogin(form -> form
                    .loginProcessingUrl("/api/auth/login")
                    .successHandler((request, response, authentication) -> 
                        response.setStatus(204)
                    )
                    .failureHandler((request, response, exception) -> 
                        response.setStatus(401)
                    ) 
                    .permitAll()      
                )
                .logout(logout -> logout
                    .logoutUrl("/api/auth/logout")
                    .logoutSuccessHandler((request, response, authentication) ->
                        response.setStatus(204)
                    )
                    .invalidateHttpSession(true)
                    .deleteCookies("JSESSIONID")
                );

            return http.build();
        }
}