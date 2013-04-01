var fs = require( 'fs' );
dataByMonth = {};

raw = [
  "Year",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
]

var callback = function( error, data ) {
  if( !error ) {
    var JSONdata = JSON.parse( data );
    var biggest = 0;
    for( var i = 0; i < JSONdata.length; i++ ) {
      var yearsData = JSONdata[i];
      var year;
      for( var j = 0; j < raw.length; j++ ) {
        var item = yearsData [raw[j]];
        if( j == 0 ) {
          var year = item;
        } else {
          var dateString = j + "/" + year;
          dataByMonth[dateString] = parseFloat( item );
          if( parseFloat( item ) > biggest ) {
            biggest = parseFloat( item );
          }
        }
      }
    }
    fs.writeFile(
      'data/unemployment-by-month.js',
      JSON.stringify( dataByMonth, null, 2 ),
      function( error ) {
        if( error ) {
          console.log( error );
        } else {
          console.log( "Biggest: " + biggest );
        }
      }
    );
  } else { console.log( error ); }
}

fs.readFile( 'data/unemployment-list.js', callback );