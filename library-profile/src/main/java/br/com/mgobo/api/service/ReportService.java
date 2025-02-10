package br.com.mgobo.api.service;

import br.com.mgobo.api.entities.Livro;
import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.Connection;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final DataSource dataSource;

    public byte[] createReport(String reportName) {
        try (Connection connection = dataSource.getConnection()) {

            InputStream inputStream = new ClassPathResource("reports/" + reportName + ".jasper").getInputStream();
            JasperPrint jasperPrint = JasperFillManager.fillReport(inputStream, null, connection);

            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
