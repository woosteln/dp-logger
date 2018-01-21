const Logger = require('./logger');
const Util = require('./util');

const loggers = {};

function DPLog( config, map, tag ){
  let logger = new Logger( config, map );
  tag = tag || 'default';
  loggers[tag] = logger;
  if( tag !== 'default' && ! loggers.default ){
    loggers.default = logger;
  }
  return logger;
}

DPLog.get_default_logger = function(){
  return loggers.default;
}

DPLog.Util = Util;
DPLog.Logger = Logger;

module.exports = DPLog;
