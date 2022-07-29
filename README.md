# Home Library Service

# RSSchool PostgreSQL & ORM task

## Installation
```bash
git clone https://github.com/TanyaSamal/nodejs2022Q2-service
cd nodejs2022Q2-service
git checkout logging
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

## I recommend you to test each suite separately because I had a timeout error when start all tests at once (thrown: "Exceeded timeout of 5000 ms for a test."). One by one they all pass.

After each request you can see its log in the "logs" folder. If there is an error it will be written in the error.log file inside.

You can change count of logging levels and max file size in the .env file. Log example:

```bash
{
  message: 'POST /user 201 - body: {"login":"TEST_LOGIN","password":"TEST_PASSWORD"} query params: {}',
  level: 'info',
  service: '',
  timestamp: '2022-07-26T11:46:51+00:00',
  ms: '+19ms'
}
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.

## Author

👤 **Tanya Samal**

- Discord: `Tanya Samal(@tanyasamal)`
