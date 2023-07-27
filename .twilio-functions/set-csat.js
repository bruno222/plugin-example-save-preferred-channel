const { MongoClient } = require('mongodb');

exports.handler = async (context, event, callback) => {
  try {
    console.log('event: ', event);

    //
    // Save data within Mongo Database
    //
    const uri = `mongodb+srv://example:${context.MONGODB_PASS}@example.qc3hxb0.mongodb.net/customer-preferences?retryWrites=true&w=majority`;
    const mongoclient = await MongoClient.connect(uri);
    const db = mongoclient.db();
    const meetupCollection = db.collection('csat');
    const dataToSave = { ...event, datetime: new Date() };
    const result = await meetupCollection.insertOne(dataToSave);
    console.log('result', result);

    //
    // Response
    //
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/text');
    // response.setBody('OK');
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeaders({ Location: 'https://impacx.de/kontakt/' });
    response.setStatusCode(302);
    callback(null, response);
  } catch (e) {
    console.log(e);

    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/text');
    response.setBody('ERROR');
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
    callback(null, response);
  }
};
