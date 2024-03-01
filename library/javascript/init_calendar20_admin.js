// javascript
const dDia1 = new DialogDR( { dVar: "dDia1", id: "#dDia1", modal: false, hasMin: true, hasMax: true, hasInfo: true, hasHelp: true } );
const dDia2 = new DialogDR( { dVar: "dDia2", id: "#dDia2", modal: false  } );
const init = function() {
    nj( "#openDialog1" ).on( "click", function(){dDia1.show() } );
    nj( "#openDialog2" ).on( "click", function(){dDia2.show() } );
    nj( "#openMessage" ).on( "click", function(){dMNew.show() } );
    nj( "#openMessageNews" ).on( "click", function(){dMN.show() } );
    //dM = new MessageDR();
    // set select options
        nj( "#place" ).htm( optPlace );
        nj( "#usePattern" ).htm( optPattern );
        nj( "#category" ).htm( optCategory );
        nj( "#creator" ).htm( optContactPerson );
        nj( "#participateAs" ).htm( optRoleUser );
        nj( "#informRole" ).htm( optInformRole );
        nj( "#informUser" ).htm( optInformUser );
        // times
        nj( "#startMinutes").htm( getTime( "startHour", "valStartMinutes" ) );
        nj( "#endMinutes").htm( getTime( "endHour", "valEndMinutes" ) );
    // end set select options and times
    nj( "dPartic" ).on( "mouseleave", function() {
        console.log( this );
    });
    cal.evCal.setOption( "datesSet", function ( info ) {
        cal.removeAllEventsFromView();
        cal.getDaysForView( info )
    });
    data = {};
    data.command = "getEventsForView"; 
    data.startDate = cal.evCal.view.activeStart.addDays(1).toISOString().split("T")[0];
    data.endDate = cal.evCal.view.activeEnd.addDays(1).toISOString().split("T")[0];
    data.userId = currentUserId;
    data.isFetch = true;
    console.log( data );
    nj().post("library/php/ajax_calendar.php", data, cal.evaluateCalData );   
}