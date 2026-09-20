require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieparser = require('cookie-parser');
const connectDB = require('./src/config/db');
const app = express();
const authRoutes = require('./src/routes/auth.routes')

app.use(cors({origin: process.env.CLIENT_URL || 'http://localhost:5173, credentails: true'}));

app.use(express.json());
app.use(cookieparser());

app.get('/api/health', (req,res) => {
    res.json({status: 'ok'});
});

app.use('/api/auth', authRoutes);


app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(err.statusCode || 500).json({error: err.message || 'server error'});
})
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
})

