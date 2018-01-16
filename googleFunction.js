var googleAuth = require('google-auth-library');
const myModule = require('./googleFunction');

module.exports = {
   hello: function() {
   	console.log('hello~~~~~~~~~~~~~~~~~~~~');
      return "Hello";
   }
}