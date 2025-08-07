package com.quicknoteai.controller;

import com.quicknoteai.dto.SummarizeRequest;
import com.quicknoteai.dto.SummarizeResponse;
import com.quicknoteai.service.SummarizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class SummarizeController {

    @Autowired
    private SummarizeService summarizeService;

    @PostMapping("/summarize")
    public SummarizeResponse summarize(@RequestBody SummarizeRequest request) {
        return summarizeService.summarize(request);
    }
}
