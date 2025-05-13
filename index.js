const express = require('express');
const app = express();
const port = 3000;

app.use('/api/v1/auth', require('./routes/auth'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

