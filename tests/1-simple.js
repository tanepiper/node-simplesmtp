var
  simplesmtp = require('../lib/simplesmtp'),
  sys = require('sys');


var options = {
  host      : "smtp.example.com",
  username  : "foo",
  password  : 'bar'
}

sys.print(JSON.stringify(options));



var message = [];
message.push("This is a test message from node-simplesmtp.\r\r");
message.push("NodeJS is the best framework for writing network applications.\n")

var mailClient = simplesmtp.createClient(options.host, options.username, options.password);
mailClient.sendMail('github@digitalspaghetti.me.uk', 'foo@example.com', 'Test Subject' + new Date(), message.join(''));
