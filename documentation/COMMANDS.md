## Usefull Commands
### NestJS
#### Install Nest CLI

```bash
npm i -g @nestjs/cli
```

#### Project Creation
```bash
nest new djescape-cockpit-service
```

#### TypeORM with PostgreSQL (database migrations)
```bash
npm install @nestjs/typeorm typeorm pg
```

#### Authentication Libraries
```bash
npm install class-validator class-transformer
```

```bash
npm install @nestjs/passport
```

```bash
npm install passport passport-jwt
``` 

```bash
npm install @nestjs/throttler
```

```bash
npm install bcrypt
npm install -D @types/bcrypt
```

```bash
npm install @nestjs/jwt
```
### Docker

### Build the image
```bash
docker build -t emirant1/djescape-cockpit-service:1.0.1 .
```

### Run the container
```bash
docker run -p 3000:3000 emirant1/djescape-cockpit-service:1.0.1
```

### Publish to Docker Hub
```bash
docker push emirant1/djescape-cockpit-service:1.0.1
```

### Perform SQL actions

#### Access the bash command of the docker container
```bash
docker exec -it ds-postgres bash
```
#### Use the psql utility
```
psql -U postgres -d escape
```