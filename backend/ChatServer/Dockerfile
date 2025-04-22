FROM openjdk:21-slim

WORKDIR /app
COPY . .

RUN chmod +x mvnw
RUN ./mvnw package -DskipTests

CMD ["java", "-jar", "target/protoChat-0.0.1-SNAPSHOT.jar"]