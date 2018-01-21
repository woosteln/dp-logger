const expect = require('chai').expect;
const dplog = require('./index');
const Logger = require('./logger');

describe('The index module', function () {

  it( 'returns a logger on initialisation', function(done) {

    const conf = {"token" : "AAABBBCCC"};
    const map = {"key" : "value" };
    const logger = dplog( conf, map );

    expect( logger ).to.be.instanceOf(Logger);
    expect( logger ).to.respondTo('log');
    expect( logger ).to.respondTo('token');
    expect( logger ).to.respondTo('map');
    expect( logger.token() ).to.equal( conf.token );
    expect( logger.map() ).to.eql( map );

    done();

  });

  it( 'allows access to a default logger after initialisation', function(done) {

    const conf = {"token" : "AAABBBCCC"};
    const map = {"key" : "value" };
    const logger = dplog( conf );

    const otherlogger = dplog.get_default_logger();

    expect( logger ).to.equal( otherlogger );

    done();

  });

});
