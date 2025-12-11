import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', routes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en puerto ${PORT}`);
});