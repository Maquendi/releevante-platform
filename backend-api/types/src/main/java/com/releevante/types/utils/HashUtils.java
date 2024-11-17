package com.releevante.types.utils;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashUtils {

  public static String createSHAHash(String input) {

    String hashtext = null;
    MessageDigest md = null;
    try {
      md = MessageDigest.getInstance("SHA-256");
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException(e);
    }
    byte[] messageDigest = md.digest(input.getBytes(StandardCharsets.UTF_8));

    hashtext = convertToHex(messageDigest);
    return hashtext;
  }

  private static String convertToHex(final byte[] messageDigest) {
    BigInteger bigint = new BigInteger(1, messageDigest);
    String hexText = bigint.toString(16);
    while (hexText.length() < 32) {
      hexText = "0".concat(hexText);
    }
    return hexText;
  }
}
