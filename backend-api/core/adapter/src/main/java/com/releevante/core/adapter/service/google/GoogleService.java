package com.releevante.core.adapter.service.google;

import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.auth.oauth2.GoogleCredentials;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;

public abstract class GoogleService<S> {
  protected final String applicationName;
  protected final GoogleCredentials googleCredentials;
  protected static final JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
  protected final S googleService;

  protected GoogleService(String applicationName, String credentialsFilePath) {
    this.applicationName = applicationName;
    try (InputStream credentialsStream = getClass().getResourceAsStream(credentialsFilePath)) {
      if (credentialsStream == null) {
        throw new IOException("Resource not found: credentials.json");
      }
      this.googleCredentials =
          GoogleCredentials.fromStream(credentialsStream)
              .createScoped(Collections.singletonList(SheetsScopes.SPREADSHEETS_READONLY));
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    this.googleService = buildGoogleService();
  }

  protected abstract S buildGoogleService();
}
