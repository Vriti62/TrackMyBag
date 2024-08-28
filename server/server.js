const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const luggageRoutes = require('./routes/luggageRoutes');
const userRoutes = require('./routes/userRoutes');
const config = require('./config/config');

const app = express();
const PORT = config.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/luggage', luggageRoutes);
app.use('/api/user', userRoutes);

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error(err));
