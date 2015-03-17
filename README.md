### THIS MODULE IS NOW ABANDONED AND UNPUBLISHED FROM NPM. It is kept here for archive purposes only.

If you want a simple SMTP/Mail client module for nodejs, check out node-pony (https://github.com/substack/node-pony) instead.


Real Simple NodeJS SMTP
This module provides a real simple SMTP client.  It provides no error checking or
callbacks, it just lets you provide connection settings to a client handler which you
can then use throughout your own module.
Handy for debugging

Some code based on node_mailer by Marak Squires - http://github.com/marak/node_mailer
=====================================================================================

Install
-------

npm install simplesmtp

OR

git clone http://github.com/tanepiper/node-simplesmtp.git
cd node-simplesmtp
npm install .

Useage:
-------

  var simplesmtp = require('simplesmtp');
  var mailClient = simplesmtp.createClient(host, username, password [,port, domain, authentication, encoding]);
  mailClient.sendMail(to, from, subject, body)

