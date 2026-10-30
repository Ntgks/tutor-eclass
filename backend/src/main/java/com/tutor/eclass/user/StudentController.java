package com.tutor.eclass.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.UUID;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;



@RestController 
@RequestMapping("/api/students") 
public class StudentController {
    
    private final UserService userService;

    public StudentController(UserService userService){
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('TEACHER')")
    public StudentResponse createStudent(
        @Valid @RequestBody CreateStudentRequest request){

            return userService.createStudent(request);
        }

    @GetMapping
    @PreAuthorize("hasRole('TEACHER')")
    public List<StudentResponse> getStudents(){
        return userService.getStudents();
    }

    @PutMapping("/{studentId}")
    @PreAuthorize("hasRole('TEACHER')")
    public StudentResponse updateStudent(
        @PathVariable UUID studentId,
        @Valid @RequestBody UpdateStudentRequest request){
            return userService.updateStudent(studentId, request);
        }
    
}
