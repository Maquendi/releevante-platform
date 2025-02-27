package com.releevante.types;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Page<T> {
  int size;
  int page;
  List<T> data;
}
