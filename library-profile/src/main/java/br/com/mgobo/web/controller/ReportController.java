package br.com.mgobo.web.controller;

import br.com.mgobo.api.service.ReportService;
import br.com.mgobo.web.advices.HandlerError;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/{reportName}")
    public ResponseEntity<Object> getReport(@PathVariable String reportName) {
        try {
            byte[] pdf = reportService.createReport(reportName);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + reportName + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(List.of(HandlerError.instanceOf(HttpStatus.BAD_REQUEST.toString(),e.getMessage())));
        }
    }
}
