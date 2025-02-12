FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y openjdk-21-jdk && \
    mkdir library-system && \
    java -version

COPY library-profile/target/library-profile-0.0.1-SNAPSHOT.jar library-system/library-system.jar

RUN printf 'cd library-system && java -jar library-system.jar' >> runnable.sh

ENTRYPOINT["sh", "runnable.sh"]