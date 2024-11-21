package com.releevante.core.adapter.service.google;

import java.util.List;
import java.util.function.Function;
import reactor.core.publisher.Flux;

public interface GoogleSpreadSheetService {
  <T> Flux<T> readFrom(String sheetId, String range, Function<List<Object>, T> rowMapper);
}
