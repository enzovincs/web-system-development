// index.js
import express from 'express';
import bookRouter from './src/routes/bookRoutes.js';
import { requestLogger } from './src/middlewares/requestLogger.js';
import { unknownEndpoint } from './src/middlewares/unknownEndpoint.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Configuración para __dirname en módulos ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Middleware para parsear JSON (Requerido por el ejercicio)
app.use(express.json());

// 2. Middleware Logger propio
app.use(requestLogger);

// 3. Servir archivos estáticos (HTML de bienvenida)
// Esto cumple el requisito: "Serve a static HTML file at /" 
app.use(express.static(path.join(__dirname, 'public')));

// 4. Rutas de la API
app.use('/books', bookRouter);

// 5. Middleware para rutas no encontradas (debe ir al final de las rutas)
app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});