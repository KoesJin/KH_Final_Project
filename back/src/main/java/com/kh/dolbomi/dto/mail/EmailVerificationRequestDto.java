package com.kh.dolbomi.dto.mail;

import lombok.Getter;
import lombok.Setter;

public class EmailVerificationRequestDto {
    @Getter
    @Setter
    public static class Send {
        private String email;
    }

    @Getter
    @Setter
    public static class Verify {
        private String email;
        private String code;
    }
}