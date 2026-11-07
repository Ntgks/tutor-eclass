package com.tutor.eclass.storage;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.NoSuchFileException;
import java.time.Duration;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service 
@ConditionalOnProperty(
    name = "app.storage.provider",
    havingValue = "supabase"
)
public class SupabaseStorageClient {

    private final HttpClient httpClient;
    private final String baseUrl;
    private final String secretKey;
    private final String bucket;

    public SupabaseStorageClient(
        @Value("${app.supabase.url}") String url,
        @Value("${app.supabase.secret-key}") String secretKey,
        @Value("${app.supabase.storage-bucket}") String bucket) {
            URI projectUri = URI.create(url.strip());

            if (!"https".equals(projectUri.getScheme())
                || projectUri.getHost() == null
                || !projectUri.getHost().endsWith(".supabase.co")
                || projectUri.getRawUserInfo() != null
                || projectUri.getRawQuery() != null
                || projectUri.getRawFragment() != null
                || (projectUri.getPort() != -1
                    && projectUri.getPort() != 443)
                || (!projectUri.getPath().isEmpty()
                    && !projectUri.getPath().equals("/"))) {

                        throw new IllegalArgumentException(
                            "Απαιτείται έγκυρο HTTPS Project URL του Supabase"
                        );
            }

            if(!secretKey.startsWith("sb_secret_")){
                throw new IllegalArgumentException(
                    "Απαιτείται Supabase secret key"
                );
            }

            if(!bucket.matches("[a-z0-9][a-z0-9_-]*")){
                throw new IllegalArgumentException(
                    "Μη έγκυρο όνομα bucket"
                );
            }

            this.baseUrl = url.strip().replaceAll("/+$", "");
            this.secretKey = secretKey;
            this.bucket = bucket;

            this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .followRedirects(HttpClient.Redirect.NEVER)
                .build();
                
        }

        public String store(MultipartFile file) throws IOException{
            String fileKey = UUID.randomUUID().toString();
            byte[] content = file.getBytes();

            HttpRequest request = requestFor(fileKey)
                .header("Content-Type", "application/octet-stream")
                .header("x-upsert", "false")
                .POST(HttpRequest.BodyPublishers.ofByteArray(content))
                .build();

            try{
                requireSuccess(send(request));
                return fileKey;
            }catch (IOException exception){
                // Αν η απάντηση χάθηκε μετά το ανέβασμα,
                // επιχειρούμε να καθαρίσουμε το αρχείο.
                try{
                    delete(fileKey);
                } catch (IOException cleanupException){
                    exception.addSuppressed(cleanupException);
                }

                throw exception;
            }
        }

        public Resource load(String fileKey) throws IOException{
            HttpRequest request = requestFor(fileKey)
                .GET()
                .build();

            HttpResponse<byte[]> response = send(request);

            if (response.statusCode() == 404) {
                throw new NoSuchFileException(fileKey);
            }

            requireSuccess(response);

            return new ByteArrayResource(response.body());
        }

        public void delete(String fileKey) throws IOException{
            HttpRequest request = requestFor(fileKey)
                .DELETE()
                .build();

            HttpResponse<byte[]> response = send(request);

            if (response.statusCode() == 404) {
                return;
            }

             requireSuccess(response);
        }

        private HttpRequest.Builder requestFor(String fileKey){
            String validatedKey = UUID.fromString(fileKey).toString();

            URI uri = URI.create(
                baseUrl + "/storage/v1/object/" + bucket + "/" + validatedKey
            );

            return HttpRequest.newBuilder(uri)
                .timeout(Duration.ofSeconds(60))
                .header("apikey", secretKey);
        }

        private HttpResponse<byte[]> send(HttpRequest request)
            throws IOException{

                try{
                    return httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofByteArray()
                    );
                } catch( InterruptedException exception){
                    Thread.currentThread().interrupt();

                    throw new IOException(
                        "Η επικοινωνία με το Supabase διακόπηκε",
                        exception
                    );
                }
        }
        
        private void requireSuccess(HttpResponse<byte[]> response)
            throws IOException {

                if (response.statusCode() < 200
                    || response.statusCode() >= 300) {

                        throw new IOException(
                            "Το Supabase Storage επέστρεψε HTTP "
                                + response.statusCode()
                        );
                    }
        }
    
}
