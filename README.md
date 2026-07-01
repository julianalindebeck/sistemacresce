<p align="left">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS Logo" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Logo" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Logo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Logo" />
</p>

# Sistema CRESCE

Trabalho da disciplina de Modelagem de Sistemas.

## Integrantes

- Breno Loureiro
- Fernanda Coutinho
- Isabelly Silva
- Juliana Lindebeck

## Instruções para executar

Após clonar o repositório, será necessário baixar algumas dependências antes de rodar o código.

Certifique-se que esteja na raiz do projeto e dê:

```bash
cd frontend
npm install react-icons
npm install react-select
```

Depois:

```bash
cd ..
cd backend
npm install nodemailer
npm install express pdfkit axios cors
npm install -D @types/nodemailer
```

Para rodar, execute os seguintes comandos na raiz do projeto:

```bash
cd frontend
npm run dev
```

Depois:
```bash
cd ..
cd backend
npm run json-server
npm run start:dev
node server.js
```

Para os 3 últimos comandos, abra 3 terminais diferentes para cada um.
