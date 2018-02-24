var botBuilder = require('claudia-bot-builder'),
    excuse = require('huh'),
    AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1'
});
var docClient = new AWS.DynamoDB.DocumentClient();
var table = 'example';
var usage = 'Usage: put <key> <value> | get <key>';

module.exports = botBuilder(function (request, originalApiRequest) {
  var str = request.text;
  var words = str.split(" ");
  if (words.length < 2) {
    return usage;
  }
  var comm = words[0];
  if (comm == 'get') {
    if (words.length != 2) return usage;
    var key = words[1];
    var params = {
      TableName: table,
      Key: {
        'key': key
      }
    };
    return docClient.get(params).promise().then(function(response) {
      if (!response.Item) {
        return 'Error: key not found';
      }
      return 'key: ' + key + ', value: ' + response.Item.value;
    });
  } else if (comm == 'put') {
    if (words.length != 3) return usage;
    var key = words[1];
    var val = words[2];
    var params = {
      TableName: table,
      Item: {
        'key': key,
        'value': val
      }
    };
    return docClient.put(params).promise().then(function(response) {
      return 'saved: ' + key + ' - ' + val;
    });
  } else {
    return usage;
  }
});
