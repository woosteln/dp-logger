const expect = require('chai').expect
const util = require('./util')

describe('The util module', function () {

  it( 'exposes map and flatten methods', function() {
    expect( util ).to.respondTo( 'map' );
    expect( util ).to.respondTo( 'flatten' );
  });

  it( 'can flatten object keys', function(){
    const obj = {"this" : { "is" : { "a" : "nested object" } } };
    const ret = util.flatten( obj );
    expect( ret ).to.have.property( "this.is.a", "nested object" );
  });

  it( 'only maps objects', function() {
    const err = function(){ util.map( {}, "not an object" ) }
    const err2 = function(){ util.map( "not an object", "" ) }
    expect( err ).to.throw();
    expect( err2 ).to.throw();
  });

  it( 'typechecks and removes invalid input data ', function() {

    const map = {"m1key" : {"type":"number"}};
    const data1 = {"m1key" : "string" };
    const data2 = {"m1key" : 1 };

    const err1 = util.map( map, data1 );
    expect( err1 ).to.not.have.property( "m1key" );

    const succ1 = util.map( map, data2 );
    expect( succ1 ).to.have.property( "m1key", data2.m1key );

    const map2 = {"m2key" : {"type":"boolean"}, "m2key2" : { "type":"boolean"}};
    const data3 = {"m2key" : "string", "m2key2" : 1 };
    const data4 = {"m2key" : false, "m2key2" : true };

    const err2 = util.map( map2, data3 );
    expect( err2 ).to.not.have.property( "m2key" );
    expect( err2 ).to.not.have.property( "m2key2" );

    const succ2 = util.map( map2, data4 );
    expect( succ2 ).to.have.property( "m2key", data4.m2key );
    expect( succ2 ).to.have.property( "m2key2", data4.m2key2 );

    const map3 = {"m3key" : {"type":"string"}};
    const data5 = {"m3key" : 1 };
    const data6 = {"m3key" : "hello" };

    const err3 = util.map( map3, data5 );
    expect( err3 ).to.not.have.property( "m3key" );

    const succ3 = util.map( map3, data6 );
    expect( succ3 ).to.have.property( "m3key", data6.m3key );

  });

  it( 'accepts flattened map keys', function() {

    const map = {"this.is.a" : {"type" : "string" } };
    const obj = {"this" : { "is" : { "a" : "nested object" } } };
    const ret = util.map( map, obj );
    expect( ret ).to.have.property( "this.is.a", "nested object" );

  });

  it( 'maps input keys to output keys', function() {

    const map = {"this.is.a" : {"type" : "string", "mapTo" : "key" } };
    const obj = {"this" : { "is" : { "a" : "nested object" } } };
    const ret = util.map( map, obj );
    expect( ret ).to.have.property( "key", "nested object" );
    expect( ret ).to.not.have.property( "this.is.a" );

  });

  it( 'maps mixed keys without a problem', function() {
    const map = {"scale.connected.value" : {"type" : "boolean", "mapTo" : "value"}, "scale.connected.name":{"type":"string","mapTo":"key"}};
    const obj = {"scale.connected":{"name":"thing","value":true}};
    const ret = util.map( map, obj );
    expect( ret ).to.have.property( "key", obj["scale.connected"].name );
    expect( ret ).to.have.property( "value", obj["scale.connected"].value );
  });

});
