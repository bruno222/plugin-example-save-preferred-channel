const { MongoClient } = require('mongodb');
const sgMail = require('@sendgrid/mail');

exports.handler = async (context, event, callback) => {
  try {
    console.log('event: ', event);

    //
    // Save data within Mongo Database
    //
    const uri = `mongodb+srv://example:${context.MONGODB_PASS}@example.qc3hxb0.mongodb.net/customer-preferences?retryWrites=true&w=majority`;
    const mongoclient = await MongoClient.connect(uri);
    const db = mongoclient.db();
    const meetupCollection = db.collection('customer-preferences');
    const result = await meetupCollection.insertOne(event);
    console.log('result', result);

    //
    // Send SMS
    //
    const client = context.getTwilioClient();

    const message = await client.messages.create({
      body: 'Thank you for contacting us. Was your experience with our agent good? Reply with 1 to 5.',
      from: '+447360498352',
      to: '+4917672899431',
    });

    console.log('msg sent: ', message.sid);

    //
    // Send Email
    //
    sgMail.setApiKey(context.SENDGRID_API_KEY);
    console.log('Sending email...', context, event);

    const msg = {
      //...event,
      to: 'bruno@example.com',
      templateId: 'd-900d0c3ed35f46cf95a686b2a3a73593',
      from: 'bruno@example.com.br', //
    };

    await sgMail.send(msg);

    //
    // Response
    //
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/text');
    response.setBody('OK');
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
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
