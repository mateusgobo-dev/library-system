docker run --rm  --name library-db \
-p 5435:5432 \
-e POSTGRES_DB=library-db \
-e POSTGRES_USER=sa \
-e POSTGRES_PASSWORD=123 \
-e PGDATA=/var/lib/postgresql/data/pgdata \
-v /home/containers/library-db/mount:/var/lib/postgresql/data \
-d postgres