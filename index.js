import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/auth';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/auth', authRouter);

app.get('/api', (req, res) => {
    return res.status(200).json({ message: 'Welcome to Ztrans API' });
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use((req, res, next) => {
    console.log(`Unhandled request: ${req.method} ${req.url}`);
    next();
});

