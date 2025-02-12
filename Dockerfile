FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y openjdk-21-jdk && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt-get install -y nodejs && \
    mkdir library-system && \
    java -version && \
    node -v

COPY library-profile/target/library-profile-0.0.1-SNAPSHOT.jar library-system/library-system.jar
COPY library-system-client/build library-system/build

RUN printf 'cd library-system && java -jar library-system.jar && sleep 5000 && npm install -g serve && serve -s build' >> runnable.sh

ENTRYPOINT ["runnable.sh", "sh"]