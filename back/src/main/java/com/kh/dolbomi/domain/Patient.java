package com.kh.dolbomi.domain;

import com.kh.dolbomi.enums.StatusEnum;
import com.kh.dolbomi.enums.StatusEnum.Status;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "PATIENT")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAT_NO")
    private Long patNo;

    @ManyToOne
    @JoinColumn(name = "GUARDIAN_NO", nullable = false)
    private User guardian;

    @Column(name = "PROFILE_IMAGE", length = 100)
    private String profileImage;

    @Column(name = "PAT_PHONE")
    private String patPhone;

    @Column(name = "PAT_NAME", nullable = false, length = 10)
    private String patName;

    @Column(name = "PAT_ADDRESS", nullable = false, length = 50)
    private String patAddress;

    @Column(name = "PAT_AGE", nullable = false)
    private Integer patAge;

    @Column(name = "PAT_GENDER", nullable = false, length = 1)
    @Enumerated(EnumType.STRING)
    private StatusEnum.Gender patGender;

    @Column(name = "PAT_HEIGHT", nullable = false)
    private BigDecimal patHeight;

    @Column(name = "PAT_WEIGHT", nullable = false)
    private BigDecimal patWeight;

    @Column(name = "PAT_CONTENT", columnDefinition = "TEXT")
    private String patContent;

    @Column(name = "STATUS", nullable = false, length = 1)
    @Enumerated(EnumType.STRING)
    private StatusEnum.Status status;


    //양방향 설정 환자 삭제시 관련 환자에 대한 질병태그들도 삭제
    @Builder.Default
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)

    private List<DiseaseTag> diseaseTags = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (status == null) {
            this.status = StatusEnum.Status.Y;
        }
    }


    public void changePatPhone(String patPhone) {
        if (patPhone != null && !patPhone.isEmpty()) {
            this.patPhone = patPhone;
        }
    }

    // 수정관련 setter

    public void changePatName(String patName) {
        if (patName != null && !patName.isEmpty()) {
            this.patName = patName;
        }
    }


    public void changePatAge(Integer patAge) {
        if (patAge != null && patAge != 0) {
            this.patAge = patAge;
        }
    }

    public void changePatGender(StatusEnum.Gender patGender) {
        if (patGender != null) {
            this.patGender = patGender;
        }
    }

    public void changePatAddress(String patAddress) {
        if (patAddress != null && !patAddress.isEmpty()) {
            this.patAddress = patAddress;
        }
    }


    public void changePatWeight(BigDecimal patWeight) {
        if (patWeight != null) {
            this.patWeight = patWeight;
        }
    }

    public void changePatContent(String patContent) {
        if (patContent != null) {
            this.patContent = patContent;
        }
    }

    public void changePatHeight(BigDecimal patHeight) {
        if (patHeight != null) {
            this.patHeight = patHeight;
        }
    }

    public void changeStatus(String status) {
        if (status != null && !status.isEmpty()) {
            this.status = Status.valueOf(status);
        }

    }

}