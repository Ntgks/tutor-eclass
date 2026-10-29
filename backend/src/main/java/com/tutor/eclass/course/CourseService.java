package com.tutor.eclass.course;

import com.tutor.eclass.user.Role;
import com.tutor.eclass.user.User;
import com.tutor.eclass.user.UserRepository;
import com.tutor.eclass.user.UserStatus;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseService(
            CourseRepository courseRepository,
            UserRepository userRepository) {

        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Transactional 
    public CourseResponse createCourse(
        UUID studentId,
        CreateCourseRequest request){
            User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Ο μαθητής δεν βρέθηκε"
                ));

            if(student.getRole() != Role.STUDENT
                || student.getStatus() == UserStatus.DISABLED){
                    throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Δεν μπορεί να δημιουργηθεί μάθημα για αυτόν τον λογαριασμό"
                    );
            }

            String description = request.description();

            if(description != null){
                description = description.strip();

                if(description.isEmpty()){
                    description = null;
                }
            }

            Course course = Course.create(
                student.getId(), 
                request.title().strip(), 
                description
            );

            Course savedCourse = courseRepository.save(course);

            return new CourseResponse(
                savedCourse.getId(),
                savedCourse.getStudentId(),
                savedCourse.getTitle(),
                savedCourse.getDescription()
            );
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getStudentCourses(UUID studentId){
        User student = userRepository.findById(studentId)
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

        return courseRepository.findAllByStudentId(studentId)
            .stream()
            .map(course -> new CourseResponse(
                course.getId(), 
                course.getStudentId(), 
                course.getTitle(), 
                course.getDescription()
            ))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getMyCourses(String email){
        User student = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Ο λογαριασμός δεν βρέθηκε"
            ));
        
        if(student.getRole() != Role.STUDENT
            || student.getStatus() != UserStatus.ACTIVE){
                throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Δεν επιτρέπεται η πρόσβαση στα μαθήματα"
                );
        }

        return courseRepository.findAllByStudentId(student.getId())
            .stream()
            .map(course -> new CourseResponse(
                course.getId(), 
                course.getStudentId(), 
                course.getTitle(), 
                course.getDescription()
            ))
            .toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse getCourse(UUID courseId, String email){
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Ο λογαριασμός δεν βρέθηκε"
            ));

        if(user.getStatus() != UserStatus.ACTIVE){
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Ο λογαριασμός δεν είναι ενεργός"
            );
        }

        Course course = (
            user.getRole() == Role.TEACHER
                ? courseRepository.findById(courseId)
                : courseRepository.findByIdAndStudentId(
                    courseId, user.getId()
                )
        ).orElseThrow(() -> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Το μάθημα δεν βρέθηκε"
        ));

        return new CourseResponse(
            course.getId(),
            course.getStudentId(),
            course.getTitle(),
            course.getDescription()
        );
    }
}