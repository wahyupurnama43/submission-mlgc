const express = require("express");
const prediksiController = require("./controller/prediksiController");
const handler = require('./middleware/handler')
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to handle prediction requests
app.post('/predict', handler.single('image'), prediksiController.predict);
app.get('/predict/histories', prediksiController.getPredict);
app.get('/', (req, res) =>{res.status(201).send({status: "server jalan"});});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log('port listening on http://localhost:'+port);
});