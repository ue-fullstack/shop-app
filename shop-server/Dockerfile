FROM openjdk:17-alpine
ADD target/shop-app-0.0.1-SNAPSHOT.jar shop-app.jar
ENTRYPOINT ["java","-jar","shop-app.jar"]
EXPOSE 8080