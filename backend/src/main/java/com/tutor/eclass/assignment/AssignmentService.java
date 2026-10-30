package com.tutor.eclass.assignment;

import java.util.List;
import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tutor.eclass.course.CourseService;

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
        UUID courseId,
        String email){

            courseService.getCourse(courseId, email);

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
        CreateAssignmentRequest request,
        String email){

            courseService.getCourse(courseId, email);

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
}
