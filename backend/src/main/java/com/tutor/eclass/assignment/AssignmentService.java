package com.tutor.eclass.assignment;

import java.util.List;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor.eclass.course.CourseService;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service 
public class AssignmentService {
    
    private final AssignmentRepository assignmentRepository;
    private final CourseService courseService;

    public AssignmentService(
        AssignmentRepository assignmentRepository,
        CourseService courseService){
            this.assignmentRepository = assignmentRepository;
            this.courseService = courseService;
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignments(
        UUID courseId){

            courseService.getCourse(courseId);

            return assignmentRepository
                .findAllByCourseIdOrderByCreatedAtDesc(courseId)
                .stream()
                .map(assignment -> new AssignmentResponse(
                    assignment.getId(), 
                    assignment.getCourseId(), 
                    assignment.getTitle(), 
                    assignment.getInstructions(), 
                    assignment.getDueAt()
                ))
                .toList();
    }

    @Transactional 
    @PreAuthorize("hasRole('TEACHER')")
    public AssignmentResponse createAssignment(
        UUID courseId,
        CreateAssignmentRequest request){

            courseService.getCourse(courseId);

            String instructions = request.instructions();

            if(instructions != null){
                instructions = instructions.strip();

                if(instructions.isEmpty()){
                    instructions = null;
                }
            }

            Assignment assignment = Assignment.create(
                courseId, 
                request.title().strip(), 
                instructions, 
                request.dueAt()
            );

            Assignment savedAssignment = assignmentRepository.save(assignment);

            return new AssignmentResponse(
                savedAssignment.getId(),
                savedAssignment.getCourseId(),
                savedAssignment.getTitle(),
                savedAssignment.getInstructions(),
                savedAssignment.getDueAt()
            );
    }

    @Transactional 
    @PreAuthorize("hasRole('TEACHER')")
    public AssignmentResponse updateAssignment(
        UUID courseId,
        UUID assignmentId,
        UpdateAssignmentRequest request){
            courseService.getCourse(courseId);

            Assignment assignment = assignmentRepository
                .findByIdAndCourseIdForUpdate(assignmentId, courseId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, 
                    "Η εργασία δεν βρέθηκε"
                ));

            Instant deadline = request.dueAt();

            if(deadline != null 
                && !deadline.equals(assignment.getDueAt())
                && !deadline.isAfter(Instant.now())) {
                    throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Η νέα προθεσμία πρέπει να είναι μελλοντική"
                    );
            }

            assignment.updateDetails(
                request.title(),
                request.instructions(),
                request.dueAt()
            );

            return new AssignmentResponse(
                assignment.getId(),
                assignment.getCourseId(),
                assignment.getTitle(),
                assignment.getInstructions(),
                assignment.getDueAt()
            );
            
        }
}
