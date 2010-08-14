/**
 *  @author Tane Piper <github@digitalspaghetti.me.uk>
 *  Real Simple NodeJS SMTP
 *  This module provides a real simple SMTP client.  It provides no error checking or
 *  callbacks, it just lets you provide connection settings to a client handler which you
 *  can then use throughout your own module.
 *  Handy for debugging
 *
 *  Some code based on node_mailer by Marak Squires - http://github.com/marak/node_mailer
 *
 *  Useage:
 *
 *  var simplesmtp = require('node-simplesmtp/lib/simplesmtp');
 *  var mailClient = simplesmtp.createClient(host, username, password [,port, domain, authentication, encoding]);
 *  mailClient.sendMail(to, from, subject, body)
 *
 *
 */

var
  sys = require('sys'),
  tcp = require('net'),
  base64 = require('./dep/base64');

/**
 *  mixin function taken from node-couchdb
 */
function mixin() {
  // copy reference to target object
  var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, source;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !(typeof target === 'function') )
    target = {};

  // mixin process itself if only one argument is passed
  if ( length == i ) {
    target = GLOBAL;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (source = arguments[i]) != null ) {
      // Extend the base object
      Object.getOwnPropertyNames(source).forEach(function(k){
        var d = Object.getOwnPropertyDescriptor(source, k) || {value: source[k]};
        if (d.get) {
          target.__defineGetter__(k, d.get);
          if (d.set) {
            target.__defineSetter__(k, d.set);
          }
        }
        else {
          // Prevent never-ending loop
          if (target === d.value) {
            continue;
          }

          if (deep && d.value && typeof d.value === "object") {
            target[k] = mixin(deep,
              // Never move original objects, clone them
              source[k] || (d.value.length != null ? [] : {})
            , d.value);
          }
          else {
            target[k] = d.value;
          }
        }
      });
    }
  }
  // Return the modified object
  return target;
}

exports.createClient = function(host, username, password, port, domain, authentication, encoding) {

  var client = new MailSend();
  
  var settings = {
    host            : host || "localhost",
		port            : port || 25,
		username        : base64.encode(username),
		password        : base64.encode(password),
		domain          : domain || "localhost",
		authentication  : authentication || "login",
		encoding        : encoding || "utf8"
	}

  client.__setSettings(settings);
  return client;
}


var MailSend = exports.MailSend = function(){};

MailSend.prototype.settings = {};

MailSend.prototype.__setSettings = function(settings) {
  mixin(this.settings, settings);
}



MailSend.prototype.sendMail = function(to, from, subject, body) {
  var options = mixin(this.settings, {
    to      : to,
    from    : from,
    subject : subject,
    body    : body
  });
  
  function parseResponse(data) {
    var d = data.split("\r\n");
    d.forEach(function(itm){
      if(itm.indexOf("250 OK id=") != -1){
        return true;
      }
    });
    return false;
  }
  
  var self = this;

  this.connection = tcp.createConnection(options.port, options.host);
  this.connection.setEncoding(options.encoding);
  this.connection.addListener("connect", function () {
    self.connection.write("helo " + options.domain + "\r\n");
    if(options.authentication === "login") {
      self.connection.write("auth login\r\n");
      self.connection.write(options.username + "\r\n");
      self.connection.write(options.password + "\r\n");
    }
    self.connection.write("mail from: " + options.from + "\r\n");
    self.connection.write("rcpt to: " + options.to + "\r\n");
    self.connection.write("data\r\n");
    self.connection.write("From: " + options.from + "\r\n");
    self.connection.write("To: " + options.to + "\r\n");
    self.connection.write("Subject: " + options.subject + "\r\n");
    self.connection.write("Content-Type: text/html\r\n");
    self.connection.write(options.body + "\r\n");
    self.connection.write(".\r\n");
    self.connection.write("quit\r\n");
    self.connection.end();
  });

  this.connection.addListener("data", function (data) {
    if(email.parseResponse(data)){
      sys.puts("SUCC");
    } else{
      sys.puts("ERR");
    }
    sys.puts(data);
  });
}
