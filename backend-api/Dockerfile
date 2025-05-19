FROM openjdk:25

WORKDIR /app

# Copy the pre-built jar file
# Note: Build the jar locally first with: ./gradlew clean bootJar
COPY build/libs/*.jar backend-api.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/backend-api.jar"]