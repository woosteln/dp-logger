dp-logger
=========

### Logging utility for DevicePilot service

A singleton logging utility to easily allow sending data to DevicePilot's
metric collection service.

Install
-------

```
npm install git@github.com:woosteln/dp-logger.git
```

May come to npm soon

Usage
-----

Initialise it in your app bootstrap:

_index.js_

```js
const dp = require('dp-logger');

const config = {
  "token" : "AAAYYYCCC"
};

const map = {
  // Validates temp is a number
  "temp" : {
    "type" : "number"
  },
  // Validates status is a string
  "status" : {
    "type" : "string"
  },
  // Nested property from object like "meta" : { "name" : "thing" }
  "meta.name" : {
    "type" : "string"
  },
  "meta.timeupdated" : {
    "type" : "timestamp",
    "mapTo" : "$ts" // Map meta.timeupdated from input data to "timestamp"
                          // Property on output
  }
}

const dplogger = dp( config, map );

```

In the module you wish to log from:

_mymodule.js_

```js
const dplogger = require('dp-logger').get_default_logger();

const deviceId = 'XXX-YYY-ZZZ';

const data = { "temp" : 30, "status" : "happy", "meta" : { "$ts" : "2017-01-01T00:00:00.000Z"} };

dplogger.log( deviceId, data );
// Sends { "temp" : 30, "status" : "happy" : "timestamp" : "2017-01-01T00:00:00.000Z" } to DevicePilot

```
If you want to log batch data:

_mymodule.js_

```js

const data = [{ "$id" : "deviceId1", "temp" : 30, "status" : "happy", "meta" : { "$ts" : "2017-01-01T00:00:00.000Z"} },
              { "$id" : "deviceId2", "temp" : 35, "status" : "happy", "meta" : { "$ts" : "2017-01-01T00:00:00.000Z"} }];
const batchSize = 500;
const postInterval = 30;

dplogger.log( data, batchSize, postInterval );
// Sends data array to DevicePilot, with a batch size/number of updated devices of 500, and a POST request interval of 30 seconds;

```
#### Configure default logger

```js
const dp = require('dp-logger');
dp( { token:"YourDevicePilotToken" }, { "temp" : { "type": "number" } } );
```

#### Get the default logger

```js
const dp = require('dp-logger');
const dplogger = dp.get_default_logger();
```

#### Log something

```js
dplogger.log( 'deviceId', { temp: 100 } );
```

Sends `{"$id":"deviceId","temp":100}` to DevicePilot.

#### Log something with a custom mapping

```js
const data = {
  "temp_rpi_current" : 1000
}
const map = {
  "temp_rpi_current" : {
    "type" : "number",
    "mapTo" : "temp"
  }
}
dplogger.log( 'deviceId', data, map );
```

Sends `{"$id":"deviceId","temp":1000}` to DevicePilot.

#### Update the token at runtime

```js
dplogger.token(myNewToken);
```

#### Update the mapping at runtime

```js
dplogger.map(myNewMap);
```

#### Use a dummy / local url for testing

```js
const dpConfig = {
  "token" : "XXXXXX",
  "baseurl" : "http://localhost:8080"
};
const dpMap = {
  "key" : {
    "type" : "string"
  }
}
const logger = dp( dpConfig, dpMap );
// Logger set to default, and sends requests to http://localhost:8080
```

QA
--

### Why the mapping?

Often the data you are naturally handling in your app is not necesarily in the
key value format you need to send to DevicePilot.

Examples:
- you may have nested objects / data.
- you may use a particular set of keys that suits the domain of your db, but not
  your DevicePilot implementation.

The mapping allows for three things:
- It only copies data accross to DevicePilot that is of the correct type.
- It reduces nested data to a flat map that can be logged to DevicePilot.
- It allows you to remap keys to the format required for DevicePilot.

So the following mapping entry:

```json
{
  "state.temp_rpi_current" : {
    "type" : "number",
    "mapTo" : "temp"
  }
}
```

Given the data:

```
{
  "state" : {
    "temp_rpi_current" : 100
  }
}
```

Would transform it to a DevicePilot friendly:

```
{ "temp" : 100 }
```

Todos
-----

- Add better handling for bad data types.
- Allow empty map to pass data straight through, or expose `strict mode`.
- Reduce dependencies. Request is a little heavy on the libraries.
