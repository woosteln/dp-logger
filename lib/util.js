

function mapData( map, data ){

  if( typeof map !== 'object' || typeof data !== 'object' ){
    throw new Error('Must have maps for map and data');
  }

  let out = {};
  let flattened = flatten( data );

  for( var prop in flattened ){
    let spec = map[prop];
    if( !! spec ){
      val = checkspec( map[prop], flattened[prop] );
      if( val === undefined ){
        continue;
      }
      let outprop = spec.mapTo || prop;
      out[outprop] = val;
    }
  }

  return out;

}

function checkspec( spec, val ){
  if( typeof val !== spec.type ){
    return undefined;
  }
  return val;
}

function flatten( data, prefix ){

  prefix = prefix || '';

  if( typeof data !== 'object' ){
    throw new Error('You can only flatten objects');
  }

  let out = {};

  for (let name in data){

    let val = data[name];

    if( typeof val === 'object' ){
      let flattened = flatten( val, prefix + name + '.' );
      for( var prop in flattened ){
        out[prop] = flattened[prop];
      }
    } else {
      out[prefix+name] = data[name]
    }

  }
  return out;

}

module.exports = {
  map : mapData,
  flatten: flatten
}
