import express from 'express';
import colors from 'colors';
import cors, {CorsOptions} from 'cors';
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec, {swaggerUiOptions} from './config/swagger';
import router from './router';
import db from './config/db';


export async function connectDB () {
    try {
        await db.authenticate();
        db.sync()
        // console.log(colors.blue('Database connected successfully!'));
    } catch (error) {
        console.log( colors.red.bold('Error connecting to the database'));
    }
}
connectDB()

// Instancia de Express
const server = express();

// Configuración de CORS
const corsOptions : CorsOptions = {
    origin: function (origin, callback) {
        if(origin === process.env.FRONTEND_URL || !origin) { // Permitir solicitudes sin origen (como Postman)
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    }
}
server.use(cors(corsOptions));

// Leer JSON
server.use(express.json());

server.use(morgan('dev'));
server.use('/api/products', router);

server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions)
)

export default server;