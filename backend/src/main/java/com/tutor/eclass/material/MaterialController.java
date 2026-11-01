package com.tutor.eclass.material;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;

import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import jakarta.validation.Valid;
import org.springframework.http.MediaType;


@RestController
@RequestMapping("/api/courses/{courseId}/materials")
@PreAuthorize("hasAnyRole('TEACHER', 'STUDENT')")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping
    public List<MaterialResponse> getMaterials(
            @PathVariable UUID courseId) {

        return materialService.getMaterials(courseId);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('TEACHER')")
    public MaterialResponse uploadMaterials(
        @PathVariable UUID courseId,
        @Valid @RequestPart("metadata") CreateMaterialRequest request,
        @RequestPart("file") MultipartFile file){
            return materialService.uploadMaterial(
                courseId, 
                request, 
                file
            );
    }

    @GetMapping("/{materialId}/download")
    public ResponseEntity<Resource> downloadMaterial(
        @PathVariable UUID courseId,
        @PathVariable UUID materialId){

            MaterialDownload download = materialService.downloadMaterial(
                courseId, 
                materialId
            );

            String disposition = ContentDisposition.attachment()
                .filename(download.originalFilename(), StandardCharsets.UTF_8)
                .build()
                .toString();

            return ResponseEntity.ok()  
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .cacheControl(CacheControl.noStore())
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition)
                .body(download.resource());
        }
    
}