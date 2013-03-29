var fs = require( 'fs' );
var csv = require( 'csv' );

var jsonReadyData = [];

csv()
  .from.stream( fs.createReadStream( 'data/banklist.csv') )
  .to( console.log )
  .transform( function( row ) {
    return row;
  });



/*
var callback = function( error, data ) {
  if( !error ) {
    readyData = JSON.parse( data );
    var entries = readyData.split( "\n" );
    var headers = [];
    for( var i = 0; i < entries.length; i++ ) {
      var entry = entries[i];
      var entryObject = {};
      entryObject[''];
      if( i > 0 ) {
        var entryArray = entry.split( ',' );
        for( var j = 0; j < headers.length; j++ ) {
          entryObject[headers[j]] = entryArray[j];
        }
        jsonReadyData.push( entryObject );
      } else {
        var header = entry.split( ',' );
      }
    }
    fs.writeFile( 'data/banklist-parsed.js', JSON.stringify( jsonReadyData, null, 2 ), function( error ) {
      if( error ) {
        console.log( error );
      } else {
        console.log( jsonReadyData.length );
      }
    })
  } else { console.log( error ); }
}

fs.readFile( 'data/banklist.js', callback );
*/