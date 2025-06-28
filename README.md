# 🤖 MyBot - Bot de Discord con Slash Commands y ChatGPT

Bienvenido a **MyBot**, un bot de Discord creado con Node.js y Discord.js que ofrece comandos divertidos, útiles y la posibilidad de conversar directamente con la inteligencia artificial de ChatGPT gracias a la API de OpenAI.

Este proyecto está diseñado para ser modular, escalable y fácil de personalizar, ideal para servidores que quieren tener funciones interactivas, dinámicas y visuales.

---

## ✨ Características principales

- 🎲 `/dado` — Lanza un dado virtual configurable.
- 🪙 `/moneda` — Lanza una moneda al aire (cara o cruz).
- 🎡 `/ruleta` — Gira una ruleta de 2 a 10 opciones.
- 🤣 `/broma` — Devuelve una broma aleatoria.
- 👤 `/perfil` — Muestra un perfil estético con avatar, banner, actividad en curso y fechas clave.
- 📋 `/ayuda` — Lista todos los comandos disponibles automáticamente.
- 💬 `/chat` — Comando experimental que permite hacer preguntas a ChatGPT desde el chat de Discord.

---

## 🚀 Instalación y uso

### 1. Clona este repositorio

```
git clone https://github.com/Kirigaya230/discord-bot.git
cd tu_repositorio
```

### 2. Instala las dependencias necesarias

```
npm install
```

**Esto instalará:**

- **discord.js** — Librería principal para interactuar con Discord.

- **dotenv** — Para manejar variables de entorno como tu token de bot.

- **openai** — Cliente oficial de la API de OpenAI (solo si usarás /chat).

### 3. Crea tu archivo .env

En la raíz del proyecto, crea un archivo llamado .env y agrega lo siguiente:

```
TOKEN=tu_token_de_discord
CLIENT_ID=tu_client_id_de_discord
OPENAI_API_KEY=tu_api_key_de_openai  # Solo si usarás el comando /chat
```

**⚠️ Importante: Nunca subas este archivo a GitHub. Está en el .gitignore por seguridad.**

### 4. Registra los comandos con Discord

```
npm run deploy
```

Los comandos globales pueden tardar hasta 1 hora en aparecer en Discord.
Si usas **Routes.applicationGuildCommands(...)** aparecerán al instante solo en un servidor específico.

### 5. Inicia el bot

```
npm start
```

Si todo está correcto, verás en la consola:
**✅ Bot conectado como MyBot#1234**

## 🗂️ Estructura del proyecto

```
mybot/
├── commands/            # Todos los comandos en archivos separados
│   ├── ayuda.js
│   ├── broma.js
│   ├── chat.js
│   ├── dado.js
│   ├── moneda.js
│   ├── perfil.js
│   ├── ping.js
│   └── ruleta.js
├── .env                 # Variables sensibles (nunca subir)
├── .gitignore           # Ignora .env y node_modules
├── deploy-commands.js   # Script para registrar comandos con Discord
├── index.js             # Lógica principal del bot
├── package.json         # Dependencias y scripts
└── README.md            # Este archivo
```

## ✅ Requisitos para usar este bot

- Node.js 18 o superior

- Cuenta de Discord y una app/bot creada en el Developer Portal

- (Opcional) Cuenta con créditos o plan activo en OpenAI si usarás el comando /chat.

## 💬 Notas sobre el comando /chat

Si no has activado un plan de pago en OpenAI o ya agotaste tus créditos gratuitos, verás un mensaje como:

```
🤖 Comando deshabilitado temporalmente (IA sin créditos).
```

Esto es normal. El comando funcionará automáticamente cuando tengas una API Key activa con saldo.

## 🛠️ Comandos útiles de desarrollo

**npm start** — Ejecuta el bot localmente (index.js)

**npm run deploy** — Registra o actualiza los comandos slash con Discord

**git add . && git commit -m "mensaje" && git push** — Sube cambios a GitHub (Railway detectará automáticamente y redeplegará)

## 🧠 ¿Por qué este bot?

Este proyecto está pensado como base sólida para bots modernos de Discord:

✔️ Usa comandos slash oficiales

✔️ Es fácil de expandir con nuevos módulos

✔️ Incluye funciones estéticas y útiles

✔️ Se integra fácilmente con Railway, Replit u otros servicios de hosting

## 🛡️ Licencia

Este proyecto está publicado bajo la licencia **MIT**.
Puedes usarlo, modificarlo y redistribuirlo libremente. Si lo haces público, ¡agradecería mucho el crédito! 😊

## 👤 Créditos

Desarrollado por: Kirigaya230
