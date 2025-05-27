FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
CMD ["mvn", "spring-boot:run", "-Dspring-boot.run.fork=false"]