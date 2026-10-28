package com.tutor.eclass.config;

import com.tutor.eclass.user.UserService;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component 
@ConditionalOnProperty(
    name = "app.bootstrap.enabled",
    havingValue = "true"
)
public class TeacherBootstrap implements ApplicationRunner{

    private final UserService userService;
    private final Environment environment;

    public TeacherBootstrap(
        UserService userService,
        Environment environment){
            this.userService = userService;
            this.environment = environment;
        }

    @Override 
    public void run(ApplicationArguments args){
        String fullName = 
            environment.getRequiredProperty("BOOTSTRAP_TEACHER_NAME");

        String email = 
            environment.getRequiredProperty("BOOTSTRAP_TEACHER_EMAIL");

        String password = 
            environment.getRequiredProperty("BOOTSTRAP_TEACHER_PASSWORD");

        userService.createInitialTeacher(fullName, email, password);
    }
}