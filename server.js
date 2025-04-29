const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/articles', require('./routes/articles'));
app.use('/categories', require('./routes/categories'));
app.use('/gallery', require('./routes/gallery'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));