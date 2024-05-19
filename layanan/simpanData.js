const { Firestore } = require('@google-cloud/firestore');
 
class simpanData{
  static async simpanPredict(id, data) {
      const db = new Firestore();
      const predictCollection = db.collection('predictions').doc(id).set(data);
      return predictCollection;
  }

  static async ambilPredict(){
      const db = new Firestore();
      const predictCollection = db.collection('predictions');
      const response = await predictCollection.get();

      let responArr = [];
      response.forEach(doc =>{
        responArr.push({id: doc.data().id, history: doc.data()});
      })
      return responArr;
  }
}

module.exports = simpanData;