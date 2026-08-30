package com.john.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWithKeyDTO {
    private String username;
    private String role;
    private String publicKey;
    private String privateKey;
}