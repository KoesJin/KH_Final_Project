package com.kh.dolbomi.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "LICENSE")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class License {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LICENSE_NO")
    private Long licenseNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_NO", nullable = false)
    private User user;

    @Column(name = "LICENSE_NAME", nullable = false, length = 10)
    private String licenseName;

    @Column(name = "LICENSE_PUBLISHER", nullable = false, length = 10)
    private String licensePublisher;

    @Column(name = "LICENSE_DATE", nullable = false)
    private LocalDateTime licenseDate;
}
