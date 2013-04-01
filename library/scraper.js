var http = require( 'http' );
var fs = require( 'fs' );
var cheerio = require( 'cheerio' );

var Parser = function( s ) {
  var _this = this;
  var $ = cheerio.load( s );

  this.dataByMonthByState = {};
  this.dataByMonthTotal = {};
  this.months = [];

  this.prettifyAmount = function( amount ) {
    var intAmount = amount.replace( /,/g, "" );
    return parseInt( intAmount );
  }
  this.prettifyState = function( state ) {
    prettyState = state.replace( /\n/g, "" );
    prettyState = prettyState.replace( /\r/g, "" );
    prettyState = prettyState.replace( /\t/g, "" );
    return prettyState;
  }

  this.parseBig = function() {
    _this.table = $('table');
    _this.tbody = [];
    for( var i = 0; i < $('table').find('tr').length; i++ ) {
      var tr = $('table').find('tr').eq(i);
      if( i > 3 && i < $('table').find('tr').length - 3 ) {
        _this.tbody.push( tr );
      }
    }
  }

  this.establishHeader = function() {
    _this.thead = [
      "state",
      "2008",
      "2009",
      "2010",
      "2011",
      "2012"
    ];
  }

  this.parseTrs = function() {
    
    // for each year
    for( var i = 1; i < _this.thead.length; i++ ) {
      var year = _this.thead[i];
      
      // do it twelve times
      for( var j = 0; j < 12; j++ ) {
        var month = j + 1;
        var dateString = month + "/" + year;
        _this.months.push( dateString );
        var monthsEntries = [];

        // iterate over the tbody
        for( var k = 4; k < $('table').find('tr').length - 3; k++ ) {
          var tr = $('table').find('tr').eq(k);
          var tds = tr.find('td');
          var entry = {}
          entry['state'] = _this.prettifyState( tds.eq(0).html() );
          entry['amount'] = _this.prettifyAmount( tds.eq(i).html() );
          monthsEntries.push( entry );
          console.log( entry );
        }

        // push up the month's entries
        _this.dataByMonthByState[dateString] = ( monthsEntries ); 
      }
    }
  }

  this.makeReadyAWayInTheDesert = function() {
    for( var i = 0; i < _this.months.length; i++ ) {
      var month = _this.months[i];
      var monthsEntries = _this.dataByMonthByState[month];
      var monthTotal = 0;
      for( var j = 0; j < monthsEntries.length; j++ ) {
        monthTotal += monthsEntries[j]["amount"];
      }
      _this.dataByMonthTotal[month] = monthTotal;
    }
  }

  this.writeEm = function() {
    fs.writeFile(
      'data/snap-by-month-by-state.js',
      JSON.stringify( _this.dataByMonthByState, null, 2 ),
      function( error ) {
        if( error ) {
          console.log( error );
        } else {
          fs.writeFile(
            'data/snap-by-month-total.js',
            JSON.stringify( _this.dataByMonthTotal, null, 2 ),
            function( error ) {
              if( error ) {
                console.log( error );
              } else {
                console.log( 'Success!' );
              }
            }
          )
        }
      }
    );
  }

  this.init = function() {
    _this.parseBig();
    _this.establishHeader();
    _this.parseTrs();
    _this.makeReadyAWayInTheDesert();
    _this.writeEm();
  }

}

var options = {
  host: "www.fns.usda.gov",
  path: "/pd/15SNAPpartPP.htm"
}

var pageAsString = '';
var callback = function( response ) {
  response.on( 'data', function( chunk ) {
    pageAsString += chunk;
    console.log( "Chunk!" );
  });
  response.on( 'end', function() {
    console.log( "Begininning Parse...")
    var parser = new Parser( pageAsString );
    parser.init();  
  });
}
console.log( 'here' );
var request = http.get( options, callback );
request.end();


