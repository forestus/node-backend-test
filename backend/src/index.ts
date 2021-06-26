import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import { errorMiddleware } from '@middlewares/errorMiddleware';
import cors from 'cors';
import createConnection from '@database/index';
import routes from '@routes/index';
import swaggerJsDoc, { Options } from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import helmet from 'helmet';

const PORT = process.env.PORT || 3000;

const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: '3.0.2',
    info: {
      title: 'Swagger Petstore',
      description: 'This is a sample server Petstore server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.',
      termsOfService: 'http://',
      contact: {
        email: 'apiteam@swagger.io',
      },
      license: {
        name: 'Version Name',
        url: 'http://',
      },
      version: '1.0.0',
    },
    externalDocs: {
      description: 'Find out more about',
      url: 'http://',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./docs/user/*.yml'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// db connection
createConnection();

// app config
const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(routes);
app.use(errorMiddleware);

// server
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}`);
});
