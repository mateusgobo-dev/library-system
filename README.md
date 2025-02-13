# library-system

### Sistema de biblioteca online   
Dividido em 2 partes:
1. library-profile = Microserviço utilizado na gestão da informação
2. library-system-client = Frontend escrito em React que interage com as API's Rest.

### library-profile:
**Microserviço** escrito em Java com SpringBoot.   
A porta padrão de execução do serviço é a 8080.   
O relatório foi desenvolvido em JasperReports e utiliza a uma View para a extração dos dados.   
Toda a validação é feita no backend com **Java Bean**   
O banco de dados utilizado na solução foi o postgresql. É possível utilizá-lo em container, basta executar o script:
```
docker run --rm  --name library-db \
-p 5435:5432 \
-e POSTGRES_DB=library-db \
-e POSTGRES_USER=sa \
-e POSTGRES_PASSWORD=123 \
-e PGDATA=/var/lib/postgresql/data/pgdata \
-v /home/containers/library-db/mount:/var/lib/postgresql/data \
-d postgres
```

### library-system-client
Escrito em React com Javascript e Typescript   
Os plugins necessários para execução da solução estão na raíz da aplicação, dentro do arquivo **react-plugins**   
A porta padrão de execução do serviço é a 3000, pois roda em um servidor **node.js**   
Para compilar a aplicação, execute o comando:
```
npx react-scripts build
```
Rodando a aplicação local:
```
npm install -g serve
serve -s build
```

### Rodando a aplicação standalone
Execute o comando da raíz do projeto:
```
sh docker-build.sh
```
A aplicação responde na porta **3001**, portanto, http://localhost:3001

