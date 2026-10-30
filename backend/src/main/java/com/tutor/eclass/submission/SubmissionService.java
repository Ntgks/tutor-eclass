package com.tutor.eclass.submission;

import com.tutor.eclass.assignment.AssignmentRepository;
import com.tutor.eclass.course.CourseService;
import com.tutor.eclass.storage.FileStorageService;
import com.tutor.eclass.user.CurrentUserService;

import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.tutor.eclass.user.Role;
import com.tutor.eclass.user.User;

import java.time.Instant;
import java.util.UUID;

import com.tutor.eclass.assignment.Assignment;

import java.util.ArrayList;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.NoSuchFileException;



@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionFileRepository submissionFileRepository;
    private final AssignmentRepository assignmentRepository;
    private final CurrentUserService currentUserService;
    private final CourseService courseService;
    private final FileStorageService fileStorageService;

    private static final Logger log =
        LoggerFactory.getLogger(SubmissionService.class);

    public SubmissionService(
            SubmissionRepository submissionRepository,
            SubmissionFileRepository submissionFileRepository,
            AssignmentRepository assignmentRepository,
            CurrentUserService currentUserService,
            CourseService courseService,
            FileStorageService fileStorageService) {

        this.submissionRepository = submissionRepository;
        this.submissionFileRepository = submissionFileRepository;
        this.assignmentRepository = assignmentRepository;
        this.currentUserService = currentUserService;
        this.courseService = courseService;
        this.fileStorageService = fileStorageService;
    }

    @Transactional 
    @PreAuthorize("hasRole('STUDENT')")
    public SubmissionResponse createSubmission(
        UUID courseId,
        UUID assignmentId,
        CreateSubmissionRequest request,
        List<MultipartFile> files,
        String email){

            User student = getActiveStudent();

            courseService.getCourse(courseId, email);
            validateFiles(files);

            Assignment assignment = getAssignmentForSubmission(
                courseId, 
                assignmentId
            );

            String comment = request.studentComment();

            if(comment != null){
                comment = comment.strip();

                if(comment.isEmpty()){
                    comment = null;
                }
            }

            List<String> storedKeys = new ArrayList<>();
            deleteFilesOnRollback(storedKeys);

            Submission submission = Submission.create(
                assignment.getId(), 
                student.getId(), 
                comment
            );

            Submission savedSubmission = 
                submissionRepository.saveAndFlush(submission);

            List<SubmissionFileResponse> fileResponses = new ArrayList<>();

            for(MultipartFile file : files){
                SubmissionFile savedFile = saveSubmissionFile(
                    savedSubmission.getId(), 
                    file, 
                    storedKeys
                );

                fileResponses.add(new SubmissionFileResponse(
                    savedFile.getId(),
                    savedFile.getOriginalFilename(),
                    savedFile.getContentType(),
                    savedFile.getSizeBytes()
                ));
            }

            return new SubmissionResponse(
                savedSubmission.getId(),
                savedSubmission.getAssignmentId(),
                savedSubmission.getStudentId(),
                savedSubmission.getStudentComment(),
                savedSubmission.getSubmittedAt(),
                savedSubmission.getFeedback(),
                savedSubmission.getReviewedAt(),
                List.copyOf(fileResponses)
            );
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('TEACHER', 'STUDENT')")
    public SubmissionResponse getSubmission(
        UUID courseId,
        UUID assignmentId,
        String email){

            courseService.getCourse(courseId, email);

            assignmentRepository.findByIdAndCourseId(assignmentId, courseId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Η εργασία δεν βρέθηκε"
                ));

            Submission submission = submissionRepository
                .findByAssignmentId(assignmentId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Δεν έχει καταχωριστεί ακόμη υποβολή"
                ));

            List<SubmissionFileResponse> files = submissionFileRepository
                .findAllBySubmissionIdOrderByCreatedAtAsc(submission.getId())
                .stream()
                .map(file -> new SubmissionFileResponse(
                    file.getId(), 
                    file.getOriginalFilename(), 
                    file.getContentType(), 
                    file.getSizeBytes()
                ))
                .toList();
            
            return new SubmissionResponse(
                submission.getId(),
                submission.getAssignmentId(),
                submission.getStudentId(),
                submission.getStudentComment(),
                submission.getSubmittedAt(),
                submission.getFeedback(),
                submission.getReviewedAt(),
                files
            );
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('TEACHER', 'STUDENT')")
    public SubmissionFileDownload downloadSubmissionFile(
        UUID courseId,
        UUID assignmentId,
        UUID fileId,
        String email){
            SubmissionResponse submission = getSubmission(
                courseId, 
                assignmentId, 
                email
            );

            SubmissionFile file = submissionFileRepository
                .findByIdAndSubmissionId(fileId, submission.id())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Το συνημμένο δεν βρέθηκε"
                ));
            
            try{
                return new SubmissionFileDownload(
                    fileStorageService.load(file.getFileKey()),
                    file.getOriginalFilename()
                );
            } catch (NoSuchFileException exception){
                throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Το αρχείο δεν βρέθηκε"
                );
            } catch (IOException exception){
                throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Δεν ήταν δυνατή η ανάκτηση του αρχείου",
                    exception
                );
            }
            
    }

    @Transactional 
    @PreAuthorize("hasRole('TEACHER')")
    public void reviewSubmission(
        UUID courseId,
        UUID assignmentId,
        ReviewSubmissionRequest request,
        String email){
            courseService.getCourse(courseId, email);

            assignmentRepository.findByIdAndCourseId(assignmentId, courseId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Η εργασία δεν βρέθηκε"
                ));
            
            Submission submission = submissionRepository
                .findByAssignmentId(assignmentId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Δεν έχει καταχωριστεί ακόμη υποβολή"
                ));

            submission.review(request.feedback(), Instant.now());
        }

    private void validateFiles(List<MultipartFile> files){
        if (files == null || files.isEmpty() || files.size() > 5){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Επίλεξε από 1 έως 5 αρχεία"
            );
        }

        for(MultipartFile file : files){
            if(file == null || file.isEmpty()){
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Τα αρχεία δεν μπορούν να είναι κενά"
                );
            }

            if(file.getSize() > 10L * 1024 * 1024){
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Κάθε αρχείο πρέπει να είναι έως 10 MB"
                );
            }

            String filename = file.getOriginalFilename();

            if(filename == null
                || filename.isBlank()
                || filename.length() > 255){
                    throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Κάθε όνομα αρχείου πρέπει να έχει έως 255 χαρακτήρες"
                    );
                }
        }
    }

    private void deleteFilesOnRollback(List<String> fileKeys){
        TransactionSynchronizationManager.registerSynchronization(
            new TransactionSynchronization() {
                
                @Override 
                public void afterCompletion(int status){
                    if(status != TransactionSynchronization.STATUS_ROLLED_BACK) {
                        return ;
                    }

                    for(String fileKey : fileKeys){
                        try{
                            fileStorageService.delete(fileKey);
                        } catch (IOException exception){
                            log.error(
                                "Αποτυχία καθαρισμού συνημμένου μετά από rollback: {}",
                                fileKey, 
                                exception
                            );
                        }
                    }
                }
            }
        );
    }

    private User getActiveStudent(){
        User student = currentUserService.getCurrentUser();

        if (student.getRole() != Role.STUDENT) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Η υποβολή επιτρέπεται μόνο σε ενεργό μαθητή"
            );
        }
        
        return student;
    }

    private Assignment getAssignmentForSubmission(
        UUID courseId,
        UUID assignmentId){

            Assignment assignment = assignmentRepository
                .findByIdAndCourseIdForUpdate(assignmentId, courseId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Η εργασία δεν βρέθηκε"
                ));
            
            if(submissionRepository.existsByAssignmentId(assignmentId)){
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Έχει ήδη καταχωριστεί υποβολή για αυτή την εργασία"
                );
            }

            Instant deadling = assignment.getDueAt();

            if(deadling != null && !Instant.now().isBefore(deadling)){
                throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Η προθεσμία υποβολής έχει λήξει"
                );
            }

            return assignment;
    }

    private SubmissionFile saveSubmissionFile(
        UUID submissionId,
        MultipartFile file,
        List<String> storedFileKeys){

            String fileKey;

            try{
                fileKey = fileStorageService.store(file);
            } catch (IOException exception){
                throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Δεν ήταν δυνατή η αποθήκευση συνημμένου",
                    exception
                );
            }

            storedFileKeys.add(fileKey);

            String contentType = file.getContentType();

            if(contentType == null 
                || contentType.isBlank()
                || contentType.length() > 127){
                    contentType = "application/octet-stream";
            }

            SubmissionFile attachment = SubmissionFile.create(
                submissionId, 
                fileKey, 
                file.getOriginalFilename(), 
                contentType, 
                file.getSize()
            );

            return submissionFileRepository.save(attachment);
        }
}