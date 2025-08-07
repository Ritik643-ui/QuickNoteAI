package com.quicknoteai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SummarizeResponse {
    private String title;
    private String summary;
    private List<String> tags;
    private String sentiment;
}
