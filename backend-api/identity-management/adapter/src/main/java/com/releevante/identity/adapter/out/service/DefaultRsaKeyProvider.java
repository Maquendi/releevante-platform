package com.releevante.identity.adapter.out.service;

import java.io.File;
import java.io.FileReader;
import java.security.KeyFactory;
import java.security.Security;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemReader;
import reactor.core.publisher.Mono;

public class DefaultRsaKeyProvider implements JwtRsaSigningKeyProvider {
  final String publicKeyFilePath;
  final String privateKeyFilePath;

  public DefaultRsaKeyProvider(String publicKeyFilePath, String privateKeyFilePath) {
    this.publicKeyFilePath = publicKeyFilePath;
    this.privateKeyFilePath = privateKeyFilePath;
    Security.addProvider(new BouncyCastleProvider());
  }

  @Override
  public Mono<RSAPublicKey> publicKey() {
    return Mono.fromCallable(
        () -> {
          KeyFactory factory = KeyFactory.getInstance("RSA");
          var file = new File(publicKeyFilePath);
          try (FileReader keyReader = new FileReader(file);
              PemReader pemReader = new PemReader(keyReader)) {
            PemObject pemObject = pemReader.readPemObject();
            byte[] content = pemObject.getContent();
            X509EncodedKeySpec pubKeySpec = new X509EncodedKeySpec(content);
            return (RSAPublicKey) factory.generatePublic(pubKeySpec);
          }
        });
  }

  @Override
  public Mono<RSAPrivateKey> privateKey() {
    return Mono.fromCallable(
        () -> {
          KeyFactory factory = KeyFactory.getInstance("RSA");
          var file = new File(privateKeyFilePath);
          try (FileReader keyReader = new FileReader(file);
              PemReader pemReader = new PemReader(keyReader)) {
            PemObject pemObject = pemReader.readPemObject();
            byte[] content = pemObject.getContent();
            PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(content);
            return (RSAPrivateKey) factory.generatePrivate(privateKeySpec);
          }
        });
  }
}
