package com.quicknoteai.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 3000)
    private String summary;

    private String sentiment;

    @ElementCollection
    private List<String> tags;

    private LocalDateTime createdAt = LocalDateTime.now();
}
