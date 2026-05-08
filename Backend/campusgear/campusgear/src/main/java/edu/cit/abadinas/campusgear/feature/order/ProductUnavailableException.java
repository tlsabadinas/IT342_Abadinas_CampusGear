package edu.cit.abadinas.campusgear.feature.order;

public class ProductUnavailableException extends RuntimeException {
    public ProductUnavailableException(String message) {
        super(message);
    }
}
