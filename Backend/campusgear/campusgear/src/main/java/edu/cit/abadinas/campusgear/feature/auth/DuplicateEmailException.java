package edu.cit.abadinas.campusgear.feature.auth;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}
