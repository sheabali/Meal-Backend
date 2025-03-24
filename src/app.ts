import cors from 'cors';
import express, { Application, Request, Response } from 'express';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'] }));

// application routes
// app.use('/api/v1', router);

const test = async (req: Request, res: Response) => {
  Promise.reject();
  //  const a = 10;
  // res.send(a);
};

// It features a modern, animated UI to greet users in style! 🚀🔥
app.get('/', (req: Request, res: Response) => {
  res.send(`
    <html>
      <head>
        <title>Meal Box API</title>
        <style>
          body { font-family: 'Arial', sans-serif; text-align: center; padding: 50px; background-color: #222; color: white; }
          h1 { font-size: 3em; color: #ffcc00; animation: pulse 1.5s infinite; }
          p { font-size: 1.5em; color: #ddd; }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        </style>
      </head>
      <body>
        <h1>🍕 Meal Box API 🚀</h1>
        <p>Fresh & customized meals delivered to your doorstep!</p>
      </body>
    </html>
  `);
});

export default app;
