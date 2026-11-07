package com.tutor.eclass.storage;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final String SUPABASE_PREFIX = "supabase:";

    private final Path rootDirectory;
    private final SupabaseStorageClient supabaseClient;

    public FileStorageService(
            @Value("${app.storage.directory}") String directory,
            @Value("${app.storage.provider:local}") String provider,
            ObjectProvider<SupabaseStorageClient> supabaseProvider)
            throws IOException {

        if (!provider.equals("local") && !provider.equals("supabase")) {
            throw new IllegalArgumentException(
                "Ο πάροχος αποθήκευσης πρέπει να είναι local ή supabase"
            );
        }

        this.rootDirectory = Path.of(directory)
            .toAbsolutePath()
            .normalize();

        Files.createDirectories(this.rootDirectory);

        this.supabaseClient = supabaseProvider.getIfAvailable();

        if (provider.equals("supabase") && supabaseClient == null) {
            throw new IllegalStateException(
                "Δεν έχει ρυθμιστεί το Supabase Storage"
            );
        }
    }

    public String store(MultipartFile file) throws IOException {
        if (supabaseClient != null) {
            return SUPABASE_PREFIX + supabaseClient.store(file);
        }

        String fileKey = UUID.randomUUID().toString();

        Path destination = Files.createFile(
            rootDirectory.resolve(fileKey)
        );

        try (InputStream input = file.getInputStream()) {
            Files.copy(
                input,
                destination,
                StandardCopyOption.REPLACE_EXISTING
            );

            return fileKey;
        } catch (IOException exception) {
            try {
                Files.deleteIfExists(destination);
            } catch (IOException cleanupException) {
                exception.addSuppressed(cleanupException);
            }

            throw exception;
        }
    }

    public void delete(String fileKey) throws IOException {
        if (fileKey.startsWith(SUPABASE_PREFIX)) {
            requireSupabaseClient().delete(
                fileKey.substring(SUPABASE_PREFIX.length())
            );
            return;
        }

        String validatedKey = UUID.fromString(fileKey).toString();
        Files.deleteIfExists(rootDirectory.resolve(validatedKey));
    }

    public Resource load(String fileKey) throws IOException {
        if (fileKey.startsWith(SUPABASE_PREFIX)) {
            return requireSupabaseClient().load(
                fileKey.substring(SUPABASE_PREFIX.length())
            );
        }

        String validatedKey = UUID.fromString(fileKey).toString();
        Path source = rootDirectory.resolve(validatedKey);

        if (!Files.isRegularFile(source, LinkOption.NOFOLLOW_LINKS)) {
            throw new NoSuchFileException(validatedKey);
        }

        return new UrlResource(source.toUri());
    }

    private SupabaseStorageClient requireSupabaseClient()
            throws IOException {

        if (supabaseClient == null) {
            throw new IOException(
                "Χρειάζεται ενεργοποίηση του Supabase για αυτό το αρχείο"
            );
        }

        return supabaseClient;
    }
}