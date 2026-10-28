package com.tutor.eclass.user;

import java.util.Locale;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service 
public class EclassUserDetailsService implements UserDetailsService{
    
    private final UserRepository userRepository;

    public EclassUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override 
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username){
        String email = username.strip().toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> 
                new UsernameNotFoundException("Μη έγκυρα στοιχεία σύνδεσης")
            );
        
        if(user.getStatus() != UserStatus.ACTIVE
            || user.getPasswordHash() == null){
                throw new UsernameNotFoundException(
                    "Μη έγκυρα στοιχεία σύνδεσης"
                );
            }

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPasswordHash())
            .roles(user.getRole().name())
            .build();
    }
}
