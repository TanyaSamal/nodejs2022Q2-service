# Home Library Service

# RSSchool PostgreSQL & ORM task

## Installation
```bash
git clone https://github.com/TanyaSamal/nodejs2022Q2-service
cd nodejs2022Q2-service
git checkout orm
```

Don't forget to change .env.example into .env

## Docker

Start Docker. Build image and start container in detouched mode:

```bash
npm run docker
```
or with logs

 ```bash
docker-compose up --build
```

Scanning built image:

```bash
npm run scan
```

## Tests

Start tests in another terminal using command

```bash
npm run test -- <path to suite>

Example:
npm run test -- test/favorites.e2e-spec.ts
```

## I recommend you to test each suite separately because I had a timeout error when start all tests at once.


After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

## Author

👤 **Tanya Samal**

- Discord: `Tanya Samal(@tanyasamal)`
