package com.releevante.core.adapter.service.google;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class GoogleSheetService extends GoogleService<Sheets> implements GoogleSpreadSheetService {
  public GoogleSheetService(String applicationName, String credentialsFilePath) {
    super(applicationName, credentialsFilePath);
  }

  @Override
  protected Sheets buildGoogleService() {
    try {
      return new Sheets.Builder(
              GoogleNetHttpTransport.newTrustedTransport(),
              jsonFactory,
              new HttpCredentialsAdapter(googleCredentials))
          .setApplicationName(applicationName)
          .build();
    } catch (GeneralSecurityException | IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public <T> Flux<T> readFrom(String sheetId, String range, Function<List<Object>, T> rowMapper) {
    return Mono.fromCallable(
            () ->
                this.googleService
                    .spreadsheets()
                    .values()
                    .get(sheetId, range)
                    .setMajorDimension("ROWS")
                    .setDateTimeRenderOption("FORMATTED_STRING")
                    .execute())
        .filter(results -> Objects.nonNull(results.getValues()))
        .flatMapIterable(ValueRange::getValues)
        .map(rowMapper);
  }
}
