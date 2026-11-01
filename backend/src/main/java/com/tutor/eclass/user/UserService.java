package com.tutor.eclass.user;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.transaction.annotation.Transactional;



@Service 
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
        UserRepository userRepository, 
        PasswordEncoder passwordEncoder){
            this.userRepository = userRepository;
            this.passwordEncoder = passwordEncoder;
    }

    @Transactional 
    public StudentResponse createStudent(CreateStudentRequest request){
        String email = request.email().strip().toLowerCase(Locale.ROOT);

        if(userRepository.existsByEmail(email)){
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Υπάρχει ήδη χρήστης με αυτό το email"
            );
        }

        User student = User.createInvitedStudent(
            request.fullName().strip(), 
            email, 
            request.educationLevel()
        );

        User savedStudent = userRepository.save(student);

        return new StudentResponse(
            savedStudent.getId(),
            savedStudent.getFullName(),
            savedStudent.getEmail(),
            savedStudent.getStatus(),
            savedStudent.getEducationLevel()
        );
    }

    @Transactional 
    public void createInitialTeacher(
        String fullName,
        String email,
        String password){

            if(userRepository.existsByRole(Role.TEACHER)){
                return;
            }

            String normalizedEmail = 
                email.strip().toLowerCase(Locale.ROOT);
            
            if(userRepository.existsByEmail(normalizedEmail)){
                throw new IllegalStateException(
                    "Το email χρησιμοποιείται ήδη από άλλον λογαριασμό"
                );
            }

            String passwordHash = passwordEncoder.encode(password);

            User teacher = User.createTeacher(
                fullName.strip(), 
                normalizedEmail, 
                passwordHash
            );

            userRepository.save(teacher);
        }

    @Transactional(readOnly = true)
    public List<StudentResponse> getStudents(){
        return userRepository.findAllByRole(Role.STUDENT)
            .stream()
            .map(student -> new StudentResponse(
                student.getId(), 
                student.getFullName(), 
                student.getEmail(), 
                student.getStatus(), 
                student.getEducationLevel()
            ))
            .toList();
    }

    @Transactional
    @PreAuthorize("hasRole('TEACHER')")
    public StudentResponse updateStudent(
            UUID studentId,
            UpdateStudentRequest request) {

        User student = userRepository.findByIdForUpdate(studentId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Ο μαθητής δεν βρέθηκε"
            ));

        if (student.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Ο μαθητής δεν βρέθηκε"
            );
        }

        String email = request.email()
            .strip()
            .toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmailAndIdNot(email, studentId)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Υπάρχει ήδη χρήστης με αυτό το email"
            );
        }

        String educationLevel = request.educationLevel();

        if (educationLevel != null) {
            educationLevel = educationLevel.strip();

            if (educationLevel.isEmpty()) {
                educationLevel = null;
            }
        }

        student.updateStudentDetails(
            request.fullName().strip(),
            email,
            educationLevel
        );

        try {
            userRepository.flush();
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Δεν ήταν δυνατή η ενημέρωση. Το email μπορεί να χρησιμοποιείται ήδη.",
                exception
            );
        }

        return new StudentResponse(
            student.getId(),
            student.getFullName(),
            student.getEmail(),
            student.getStatus(),
            student.getEducationLevel()
        );
    }

    @Transactional 
    @PreAuthorize ("hasRole('TEACHER')")
    public StudentResponse disableStudent(UUID studentId){
        User student = userRepository.findByIdForUpdate(studentId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Ο μαθητής δεν βρέθηκε"
            ));

            if(student.getRole() != Role.STUDENT){
                throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Ο μαθητής δεν βρέθηκε"
                );
            }

            student.disableStudent();

            return new StudentResponse(
                student.getId(),
                student.getFullName(),
                student.getEmail(),
                student.getStatus(),
                student.getEducationLevel()
            );
    }

    @Transactional 
    @PreAuthorize ("hasRole('TEACHER')")
    public StudentResponse enableStudent(UUID studentId){
        User student = userRepository.findByIdForUpdate(studentId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Ο μαθητής δεν βρέθηκε"
            ));

        if (student.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Ο μαθητής δεν βρέθηκε"
            );
        }

        if(student.getStatus() != UserStatus.DISABLED){
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Ο μαθητής δεν είναι απενεργοποιημένος"
            );
        }

        student.enableStudent();

        return new StudentResponse(
            student.getId(),
            student.getFullName(),
            student.getEmail(),
            student.getStatus(),
            student.getEducationLevel()
        );
    }
}
