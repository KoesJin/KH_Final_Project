package com.kh.dolbomi.repository;

import com.kh.dolbomi.domain.Board;
import com.kh.dolbomi.domain.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File, Long> {
    void deleteAllByBoard(Board board);
}
