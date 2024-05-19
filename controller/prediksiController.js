const {v4 : uuidv4} = require('uuid')
const tfjs = require('@tensorflow/tfjs-node');
const simpanData = require('../layanan/simpanData');
class prediksiController {
 
    static async predict(req, res) {
      const img = req.file.buffer;
      if(req.file.size > 1000000){
        return res.status(413).send(
          {
            "status": "fail",
            "message": "Payload content length greater than maximum allowed: 1000000"
         });
      }

      try {
        const modelUrl = "https://storage.googleapis.com/submissionmlgc-purnamawahyup.appspot.com/submissions-model/model.json";
        // const modelUrl = "file://models/model.json";
        const model = await tfjs.loadGraphModel(modelUrl);
        const tensor = tfjs.node
          .decodeJpeg(img)
          .resizeNearestNeighbor([224, 224])
          .expandDims()
          .toFloat()

        const predictions = model.predict(tensor);

        const score = await predictions.data();
              
        const classes = ['Cancer', 'Non-cancer'];
      
        const classResult = tfjs.argMax(predictions, 1).dataSync()[0];
        const label = classes[classResult];
        let  suggestion;
  
        if (label === 'Cancer') {
          suggestion = "Segera periksa ke dokter!"
        }
      
        if (label === 'Non-cancer') {
          suggestion = "Anda sehat!"
        }

        const id = uuidv4();
        const createdAt = new Date().toISOString();
       
        const data = {
          "id": id,
          "result": label,
          "suggestion": suggestion,
          "createdAt": createdAt
        }

        await simpanData.simpanPredict(id, data);

        return res.status(201).send(
          { 
            status: 'success',
            message: 'Model is predicted successfully',
            data
          });

      } catch (error) {
        return res.status(400).send(
          {
            "status": "fail",
            "message": "Terjadi kesalahan dalam melakukan prediksi"
          }
        );
      }
      
    }

    static async getPredict(req, res){
      const result = await storeData.ambilPredict();
      return res.status(200).send(
        { 
          status: 'success',
          data :  result
        });

    }
}
module.exports = prediksiController;