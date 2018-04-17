const request = require('request');
const util = require('./util');
const extend = require('util')._extend;

const DEFAULT_URL = "https://api.devicepilot.com";

class Logger {

  constructor( config, map ){
    this.token( config.token );
    this.map( map );
    this.baseurl( config.baseurl || DEFAULT_URL );
  }

  log( deviceId, data, map, fn ){

    if( ! fn && typeof map === 'function' ){
      fn = map;
      map = undefined;
    };

    data = extend({}, data);

    let m = map || this.map();
    let d;
    if( m && Object.keys(m).length > 0 && m.constructor === Object ){
      d = util.map( m, data );
    } else {
      d = data;
    }

    d.$id = String(deviceId);
    let url = this.baseurl() + '/devices';
    let auth = 'Token ' + this.token();

    request({
      method: 'POST',
      url: url,
      json: d,
      headers: {
        Authorization: auth,
      },
    }, (err, response, body) => {
      if( ! err && response.statusCode !== 201 ){
        err = new Error( body );
      }
      fn && fn( err );
    });

  }

  logBatch( data, batchSize, postInterval, map, fn ){
    var nrOfRequests = Math.ceil( data.length / batchSize );
    var batch = [];
    var errors = [];

    if( ! fn && typeof map === 'function' ){
      fn = map;
      map = undefined;
    };

    let m = map || this.map();
    let url = this.baseurl() + '/devices';
    let auth = 'Token ' + this.token();

    data.forEach(function( item ){
      item = extend( {}, item );
      if( m && Object.keys(m).length > 0 && m.constructor === Object ){
        item = util.map( m, item );
      }
    });
    
    for( let i = 0; i < nrOfRequests; i++ ){
      setTimeout(function(){
        batch = data.slice( i * batchSize, ( i + 1 ) * batchSize );
        console.log( 'POST request for batch ' + i + ' with length', batch.length );
        request({
          method: 'POST',
          url: url,
          json: batch,
          headers: {
            Authorization: auth,
          },
        }, (err, response, body) => {
          if( ! err && response.statusCode !== 201 && response.statusCode !== 202 ){
            err = new Error( body );
          }
          if( err ){
            errors.push( err );
          }
          if( i == nrOfRequests - 1 ){
            errors =  errors.length == 0 ? null : errors;
            fn( errors, data );
          }
        });
      }, postInterval * i * 1000 );
    }
  }

  token( token ){
    if( token ){
      this._token = token;
      return this;
    }
    return this._token;
  }

  map( map ){
    if( map ){
      if( typeof map !== 'object' ){
        throw new Error( 'Logger.map must be called with an object');
      }
      this._map = map;
      return this;
    }
    return this._map;
  }

  baseurl( url ){
    if( url ){
      this._baseurl = url;
      return this;
    }
    return this._baseurl;
  }

}

module.exports = Logger;
