import express from 'express';
import cors from 'cors';


// Middleware setup
const app = express();
app.use(express.json()); // allows us to access req.body
app.use(cors());

// Routes

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});