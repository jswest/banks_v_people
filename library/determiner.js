var fs = require( 'fs' );

var months = [];
fs.readFile( 'data/months.js', function( error, data ) {
  if( !error ) {
    months = JSON.parse( data );
  }
});

fs.readFile( 'data/banklist-by-month.js', function( error, data ) {
  if( !error ) {
    jsonData = JSON.parse( data );
    var biggest = 0;
    for( var i = 0; i < months.length; i++ ) {
      var month = jsonData[months[i]];
      if( month.length > biggest ) {
        biggest = month.length
      }
    }
    console.log( biggest );
  } else { console.log( error ); }
});