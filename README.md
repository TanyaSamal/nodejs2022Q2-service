# Home Library Service

# RSSchool Containerization task

## Installation
```bash
git clone https://github.com/TanyaSamal/nodejs2022Q2-service
cd nodejs2022Q2-service
git checkout docker
```

Don't forget to change .env.example into .env

## Docker

Build image and start container in detouched mode:

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

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
You can check live reloading by changing returned text into getHello() function 
in app.service.ts.

## Author

👤 **Tanya Samal**

- Discord: `Tanya Samal(@tanyasamal)`
