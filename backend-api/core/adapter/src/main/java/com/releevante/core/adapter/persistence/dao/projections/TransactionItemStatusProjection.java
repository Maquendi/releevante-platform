package com.releevante.core.adapter.persistence.dao.projections;

import com.releevante.core.domain.TransactionItemStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionItemStatusProjection {
  String cpy;
  TransactionItemStatusEnum status;
}
