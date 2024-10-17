FROM openjdk:23 

WORKDIR /releevante-platform

CMD ["./gradlew", "clean", "bootJar"]

COPY build/libs/*.jar backend-api.jar

COPY private.pem /releevante-platform/rsa_private_key.pem

COPY public.pem /releevante-platform/rsa_public_key.pem

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/releevante-platform/backend-api.jar"]