package com.main.config.app;

import io.r2dbc.spi.ConnectionFactory;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.convert.WritingConverter;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;
import org.springframework.data.r2dbc.convert.R2dbcCustomConversions;
import org.springframework.r2dbc.connection.R2dbcTransactionManager;
import org.springframework.transaction.ReactiveTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.transaction.reactive.TransactionalOperator;

@Configuration
@EnableTransactionManagement
public class R2dbcConfig extends AbstractR2dbcConfiguration {

  @Override
  public ConnectionFactory connectionFactory() {
    return null;
  }

  //  @Bean
  //  public R2dbcTransactionManager transactionManager(ConnectionFactory connectionFactory) {
  //    return new R2dbcTransactionManager(connectionFactory);
  //  }

  @Bean
  ReactiveTransactionManager transactionManager(ConnectionFactory connectionFactory) {
    return new R2dbcTransactionManager(connectionFactory);
  }

  @Bean
  public TransactionalOperator transactionalOperator(R2dbcTransactionManager transactionManager) {
    return TransactionalOperator.create(transactionManager);
  }

  @Bean
  @Override
  public R2dbcCustomConversions r2dbcCustomConversions() {
    List<Object> converters = new ArrayList<>();
    converters.add(new LocalDateTimeToZonedDateTimeConverter());
    converters.add(new ZonedDateTimeToLocalDateTimeConverter());
    return new R2dbcCustomConversions(getStoreConversions(), converters);
  }

  @ReadingConverter
  public static class LocalDateTimeToZonedDateTimeConverter
      implements Converter<LocalDateTime, ZonedDateTime> {
    @Override
    public ZonedDateTime convert(LocalDateTime source) {
      return source.atZone(ZoneId.systemDefault());
    }
  }

  @WritingConverter
  public static class ZonedDateTimeToLocalDateTimeConverter
      implements Converter<ZonedDateTime, LocalDateTime> {
    @Override
    public LocalDateTime convert(ZonedDateTime source) {
      return source.toLocalDateTime();
    }
  }
}
