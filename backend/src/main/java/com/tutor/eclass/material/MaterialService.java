package com.tutor.eclass.material;

import com.tutor.eclass.course.CourseService;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.tutor.eclass.storage.FileStorageService;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import org.springframework.security.access.prepost.PreAuthorize;

import java.nio.file.NoSuchFileException;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CourseService courseService;
    private final FileStorageService fileStorageService;

    private static final Logger log = 
        LoggerFactory.getLogger(MaterialService.class);

    public MaterialService(
            MaterialRepository materialRepository,
            CourseService courseService,
            FileStorageService fileStorageService) {

        this.materialRepository = materialRepository;
        this.courseService = courseService;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public List<MaterialResponse> getMaterials(UUID courseId) {

            courseService.getCourse(courseId);

            return materialRepository
                .findAllByCourseIdOrderByCreatedAtDesc(courseId)
                .stream()
                .map(material -> new MaterialResponse(
                    material.getId(), 
                    material.getCourseId(), 
                    material.getTitle(), 
                    material.getOriginalFilename(), 
                    material.getContentType(), 
                    material.getSizeBytes()
                ))
                .toList();
    }

    @Transactional 
    @PreAuthorize("hasRole('TEACHER')")
    public MaterialResponse uploadMaterial(
        UUID courseId,
        CreateMaterialRequest request,
        MultipartFile file){

            courseService.getCourse(courseId);
            validateFile(file);

            String contentType = file.getContentType();

            if(contentType == null
                || contentType.isBlank()
                || contentType.length() > 127){
                    contentType = "application/octet-stream";
            }

            String fileKey;

            try{
                fileKey = fileStorageService.store(file);
            } catch (IOException exception){
                throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Δεν ήταν δυνατή η αποθήκευση του αρχείου",
                    exception
                );
            }

            deleteFileOnRollback(fileKey);

            Material material = Material.create(
                courseId, 
                request.title().strip(), 
                fileKey, 
                file.getOriginalFilename(), 
                contentType, 
                file.getSize()
            );

            Material savedMaterial = materialRepository.save(material);

            return new MaterialResponse(
                savedMaterial.getId(),
                savedMaterial.getCourseId(),
                savedMaterial.getTitle(),
                savedMaterial.getOriginalFilename(),
                savedMaterial.getContentType(),
                savedMaterial.getSizeBytes()
            );
    }

    @Transactional(readOnly = true)
    public MaterialDownload downloadMaterial(
        UUID courseId,
        UUID materialId){

            courseService.getCourse(courseId);

            Material material = materialRepository
                .findByIdAndCourseId(materialId, courseId)
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Το υλικό δεν βρέθηκε"
                ));

            try{
                return new MaterialDownload(
                    fileStorageService.load(material.getFileKey()),
                    material.getOriginalFilename()
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

    private void validateFile(MultipartFile file){
        if(file == null || file.isEmpty()){
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Επίλεξε ένα αρχείο που δεν είναι κενό"
            );
        }

        String filename = file.getOriginalFilename();

        if(filename == null
            || filename.isBlank()
            || filename.length() > 255){
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Το όνομα του αρχείου πρέπει να έχει έως 255 χαρακτήρες"
                );
            }
    }

    private void deleteFileOnRollback(String fileKey){
        TransactionSynchronizationManager.registerSynchronization(
            new TransactionSynchronization() {
                @Override 
                public void afterCompletion(int status){
                    if(status == TransactionSynchronization.STATUS_ROLLED_BACK){
                        try{
                            fileStorageService.delete(fileKey);
                        } catch (IOException exception){
                            log.error(
                                "Αποτυχία καθαρισμού αρχείου μετά από rollback: {}",
                                fileKey,
                                exception
                            );
                        }
                    }
                }
            }
        );
    }
}