package com.tutor.eclass.storage;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.LinkOption;
import java.nio.file.NoSuchFileException;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

@Service
public class FileStorageService {

    private final Path rootDirectory;

    public FileStorageService(
            @Value("${app.storage.directory}") String directory)
            throws IOException {

        this.rootDirectory = Path.of(directory)
            .toAbsolutePath()
            .normalize();

        Files.createDirectories(this.rootDirectory);
    }

    public String store(MultipartFile file) throws IOException {
        String fileKey = UUID.randomUUID().toString();

        Path destination = Files.createFile(
            rootDirectory.resolve(fileKey)
        );

        try(InputStream input = file.getInputStream()){
            Files.copy(
                input,
                destination,
                StandardCopyOption.REPLACE_EXISTING
            );

            return fileKey;
        } catch(IOException exception){
            try{
                Files.deleteIfExists(destination);
            } catch(IOException cleanupException){
                exception.addSuppressed(cleanupException);
            }

            throw exception;
        }
    }

    public void delete(String fileKey) throws IOException {
        String validateKey = UUID.fromString(fileKey).toString();

        Path destination = rootDirectory.resolve(validateKey);

        Files.deleteIfExists(destination);
    }

    public Resource load(String fileKey) throws IOException {
        String validatedKey = UUID.fromString(fileKey).toString();

        Path source = rootDirectory.resolve(validatedKey);

        if(!Files.isRegularFile(source, LinkOption.NOFOLLOW_LINKS)){
            throw new NoSuchFileException(validatedKey);
        }

        return new UrlResource(source.toUri());
    }
}