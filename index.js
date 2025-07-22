import express from 'express';
import cors from 'cors';

// file imports
import signupRoute from './routes/user/signup.js'; 
import loginRoute from './routes/user/login.js';

// Middleware setup
const app = express();
app.use(express.json()); // allows us to access req.body
app.use(cors());

////////////
// ROUTES //
////////////

// register & login routes
app.use('/api/user/signup', signupRoute);
app.use('/api/user/login', loginRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});