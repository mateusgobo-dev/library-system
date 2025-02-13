FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y openjdk-21-jdk && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt-get install -y nodejs && \
    mkdir library-system && \
    java -version && \
    node -v && \
    cd /usr/lib/jvm/java-21-openjdk-amd64/lib && \
    mkdir fonts

COPY Chococooky.ttf /usr/lib/jvm/java-21-openjdk-amd64/lib/fonts/
COPY library-profile/target/library-profile-0.0.1-SNAPSHOT.jar library-system.jar
COPY library-system-client/build build
RUN npm install -g serve