package com.tutor.eclass.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal()
                    instanceof EclassUserDetails details)) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Χρειάζεται να συνδεθείς ξανά"
            );
        }

        User user = userRepository.findById(details.getUserId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Ο λογαριασμός δεν βρέθηκε"
            ));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Ο λογαριασμός δεν είναι ενεργός"
            );
        }

        return user;
    }
}