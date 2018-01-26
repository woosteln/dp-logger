const expect = require('chai').expect;
const Logger = require('./logger');
const http =  require('http');

const testUrl = "http://localhost:8080";
const testConfig = {
  "token" : "AAABBBCCC",
  "baseurl" : testUrl
};
const testMap = {
  "key" : {
    "type" : "number",
    "mapTo" : "mappedKey"
  }
};
const testData = {
  "key" : 4321
};

describe('The logger module', function () {

  it( 'sends log messages to the server', function(done) {

    let body;
    let auth;

    const handler = (request, response) => {
      let data = [];
      request.on( 'data', (chunk) => { data.push(chunk); })
      .on('end', () => {
        body = Buffer.concat(data).toString();
        body = JSON.parse(body);
        auth = request.headers.authorization;
        response.statusCode = 201;
        response.end('OK');
      });
    }
    const server = http.createServer(handler);
    server.listen(8080, (err) => {
      if (err) { console.log('Couldn\'t start server', err); }
    });

    var logger = new Logger( testConfig, testMap );
    logger.log( 12, testData, (err,success)=>{
      server.close();
      expect( body ).to.have.property( "mappedKey", testData.key );
      expect( body ).to.have.property( "$id", '12' );
      expect( auth ).to.contain( testConfig.token );
      done();
    });

  });

  it( 'sends log messages to the server which errors', function(done) {

    let body;
    let auth;

    const handler = (request, response) => {
      let data = [];
      request.on( 'data', (chunk) => { data.push(chunk); })
      .on('end', () => {
        body = Buffer.concat(data).toString();
        body = JSON.parse(body);
        auth = request.headers.authorization;
        response.statusCode = 500;
        response.end('ERROR');
      });
    }
    const server = http.createServer(handler);
    server.listen(8080, (err) => {
      if (err) { console.log('Couldn\'t start server', err); }
    });

    var logger = new Logger( testConfig, testMap );
    logger.log( 12, testData, (err,success)=>{
      server.close();
      expect( err ).to.exist;
      done();
    });

  });

});
