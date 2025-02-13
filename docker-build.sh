echo 'Empacotando o projeto'
cd library-profile
./mvnw clean install -DskipTests=true

cd ../

echo 'Construindo app'
cd library-system-client
npx react-scripts build

cd ../

echo 'Criando container'
docker build -t library-profile:v1 .

echo 'Subindo containers'
docker compose -f docker-compose.yaml up -d