package edu.cit.abadinas.campusgear.feature.user;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileUpdateRequest {

    private String firstname;
    private String lastname;
    private String phone;
    private String bio;
    private String currentPassword;
    private String newPassword;
}
