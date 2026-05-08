package edu.cit.abadinas.campusgear.feature.order;

public class InvalidBookingException extends RuntimeException {
    public InvalidBookingException(String message) {
        super(message);
    }
}
