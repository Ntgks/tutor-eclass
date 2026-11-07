package com.tutor.eclass.storage;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
    name = "app.storage.migrate-local",
    havingValue = "true"
)
public class LocalStorageMigration implements ApplicationRunner {

    private static final Logger log =
        LoggerFactory.getLogger(LocalStorageMigration.class);

    private final JdbcTemplate jdbcTemplate;
    private final FileStorageService fileStorageService;
    private final SupabaseStorageClient supabaseClient;

    public LocalStorageMigration(
            JdbcTemplate jdbcTemplate,
            FileStorageService fileStorageService,
            SupabaseStorageClient supabaseClient) {

        this.jdbcTemplate = jdbcTemplate;
        this.fileStorageService = fileStorageService;
        this.supabaseClient = supabaseClient;
    }

    @Override
    public void run(ApplicationArguments args) throws IOException {
        migrateTable("materials");
        migrateTable("submission_files");

        log.info("Η μεταφορά των τοπικών αρχείων ολοκληρώθηκε.");
    }

    private void migrateTable(String table) throws IOException {
        // Το όνομα πίνακα προέρχεται μόνο από τις παραπάνω σταθερές κλήσεις.
        String selectSql = """
            SELECT id, file_key, size_bytes
            FROM %s
            WHERE file_key NOT LIKE 'supabase:%%'
            ORDER BY id
            """.formatted(table);

        List<StoredFile> files = jdbcTemplate.query(
            selectSql,
            (row, rowNumber) -> new StoredFile(
                row.getObject("id", UUID.class),
                row.getString("file_key"),
                row.getLong("size_bytes")
            )
        );

        for (StoredFile file : files) {
            migrateFile(table, file);
        }

        log.info("Μεταφέρθηκαν {} αρχεία από τον πίνακα {}.",
            files.size(), table);
    }

    private void migrateFile(String table, StoredFile file)
            throws IOException {

        Resource localResource = fileStorageService.load(file.fileKey());

        if (localResource.contentLength() != file.sizeBytes()) {
            throw new IOException(
                "Το μέγεθος του τοπικού αρχείου δεν συμφωνεί με τη βάση: "
                    + file.id()
            );
        }

        byte[] localContent;

        try (InputStream input = localResource.getInputStream()) {
            localContent = input.readAllBytes();
        }

        String remoteKey = supabaseClient.store(localContent);

        try {
            verifyUpload(remoteKey, localContent);
        } catch (IOException exception) {
            try {
                supabaseClient.delete(remoteKey);
            } catch (IOException cleanupException) {
                exception.addSuppressed(cleanupException);
            }

            throw exception;
        }

        String updateSql = """
            UPDATE %s
            SET file_key = ?
            WHERE id = ? AND file_key = ?
            """.formatted(table);

        int updated = jdbcTemplate.update(
            updateSql,
            "supabase:" + remoteKey,
            file.id(),
            file.fileKey()
        );

        if (updated != 1) {
            throw new IOException(
                "Η εγγραφή άλλαξε κατά τη μεταφορά: " + file.id()
            );
        }

        log.info("Μεταφέρθηκε το αρχείο {} από τον πίνακα {}.",
            file.id(), table);
    }

    private void verifyUpload(String remoteKey, byte[] expected)
            throws IOException {

        Resource remoteResource = supabaseClient.load(remoteKey);
        byte[] actual;

        try (InputStream input = remoteResource.getInputStream()) {
            actual = input.readAllBytes();
        }

        if (!Arrays.equals(expected, actual)) {
            throw new IOException(
                "Το ανεβασμένο αρχείο δεν συμφωνεί με το τοπικό"
            );
        }
    }

    private record StoredFile(
        UUID id,
        String fileKey,
        long sizeBytes
    ) {
    }
}