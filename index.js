const axios = require('axios');

const send = data =>
  axios.request({
    url: process.env.SLACK_WEBHOOK_URL,
    method: 'POST',
    contentType: 'application/json',
    { data }
  });

const toMessage = record => {
  const subject = record.Sns.Subject;
  const message = JSON.parse(record.Sns.Message);
  return {
    text: subject,
    attachments: [{
      text: message.NewStateReason,
      fallback: message.NewStateReason,
      fields: [{
        title: 'Time',
        value: message.StateChangeTime,
        short: true,
      }, {
        title: 'Alarm',
        value: message.AlarmName,
        short: true,
      }, {
        title: 'Account',
        value: message.AWSAccountId,
        short: true,
      }, {
        title: 'Region',
        value: message.Region,
        short: true,
      }],
    }],
  };
};

exports.handler = (event, context, callback) => {
  const messages = event.Records.map(toMessage);
  Promise.all(messages.map(send)).then(callback(null)).catch(callback);
}
