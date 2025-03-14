package com.releevante.core.domain;

public enum BookCopyStatus {
  SOLD,
  LOST,
  BORROWED,
  DAMAGED,
  AVAILABLE;

  public static BookCopyStatus from(TransactionItemStatusEnum status) {
    switch (status) {
      case LOST -> {
        return BookCopyStatus.LOST;
      }
      case CHECK_OUT_SUCCESS -> {
        return BORROWED;
      }

      case SOLD -> {
        return SOLD;
      }

      case DAMAGED -> {
        return DAMAGED;
      }

      default -> {
        return AVAILABLE;
      }
    }
  }
}
