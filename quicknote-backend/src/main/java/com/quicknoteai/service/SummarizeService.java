package com.quicknoteai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quicknoteai.dto.SummarizeRequest;
import com.quicknoteai.dto.SummarizeResponse;
import com.quicknoteai.model.Note;
import com.quicknoteai.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class SummarizeService {

    @Value("${huggingface.api.key}")
    private String hfApiKey;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private RestTemplate restTemplate;

    public SummarizeResponse summarize(SummarizeRequest request) {
        try {
            // Build request to Hugging Face
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.set("Authorization", "Bearer " + hfApiKey);

            Map<String, String> body = new HashMap<>();
            body.put("inputs", request.getText());

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                    entity,
                    String.class
            );

            // Parse Hugging Face response
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, String>> result = mapper.readValue(response.getBody(), List.class);
            String summary = result.get(0).get("summary_text");

            // For now, dummy tags and sentiment
            List<String> tags = List.of("general", "summary");
            String sentiment = "neutral";
            String title = "Auto-generated Summary";

            // Save note to DB
            Note note = new Note();
            note.setTitle(title);
            note.setSummary(summary);
            note.setTags(tags);
            note.setSentiment(sentiment);
            noteRepository.save(note);

            // Return to frontend
            return new SummarizeResponse(title, summary, tags, sentiment);

        } catch (Exception e) {
            e.printStackTrace();
            return new SummarizeResponse(
                    "Error",
                    "There was a problem summarizing the note.",
                    List.of("error"),
                    "neutral"
            );
        }
    }
}
