var fs = require( 'fs' );

var dataByMonth = {};
var dataMonths = [];


var callback = function( error, data ) {
  if( !error ) {
    
    // prep the data
    var jsonData = JSON.parse( data );
    sortedJsonData = jsonData.sort( function( a, b ) {
      return Date.parse( a["Closing Date"] ) - Date.parse( b["Closing Date"] );
    });

    // determine the first date, last date, and the month difference
    var first = new Date( sortedJsonData[0]["Closing Date"] );
    var last = new Date( sortedJsonData[sortedJsonData.length - 1]["Closing Date"] );
    var years = last.getFullYear() - first.getFullYear() + 1;
    var months = years * 12;
    monhts = months - first.getMonth();
    months = months - ( 12 - last.getMonth() );

    // prep the dataByMonth array
    var month = first.getMonth();
    var year = first.getFullYear();
    for( var i = 0; i <= months; i++ ) {
      dataMonths.push( month + '/' + year );
      dataByMonth[dataMonths[i]] = []; 
      month++;
      if( month > 12 ) {
        month = 1;
        year++;
      }
    }

    for( var i = 0; i < sortedJsonData.length; i++ ) {
      var item = sortedJsonData[i];
      var itemDate = new Date( item["Closing Date"] );
      
      // determine the item's month difference
      var itemYears = itemDate.getFullYear() - first.getFullYear() + 1;
      var itemMonths = itemYears * 12;
      itemMonths = itemMonths - first.getMonth();
      itemMonths = itemMonths - ( 12 - itemDate.getMonth() );

      // push it into the dataByMonth array
      if( itemMonths > -1 ) {
        dataByMonth[dataMonths[itemMonths]].push( item );
      }
    }
    fs.writeFile( 'data/banklist-by-month.js', JSON.stringify( dataByMonth, null, 2 ), function( error ) {
      if( !error ) {  
        fs.writeFile( 'data/months.js', JSON.stringify( dataMonths, null, 2 ), function( error ) {
          if( error ) { console.log( error ); }
          else{ console.log( "Success!"); }
        });
      } else { console.log( error ); }
    });
  } else { console.log( error ); }
}

fs.readFile( 'data/banklist.js', callback );