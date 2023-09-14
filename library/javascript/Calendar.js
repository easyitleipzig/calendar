const DIV_EVENT_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"><input type="datetime-local" id="evDateTime" value=""></div>';
//const DIV_EVENT_EDIT_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"><input type="datetime-local" id="evDateTime" value=""></div>';
const DIV_EVENT_NEW_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"></div>';
const calVar = "cal";

const DIV_EVENT_EDIT_HTML = `
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   

Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.   

Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer`




/* not good but nessecary */
const getDateRange = function (info) {
	// body...
	console.log( info );
}
const evaluateCalData = function( data ) {
		    console.log( data );
		    let jsonobject;
		    if( typeof data === "string" ) {
		        jsonobject = JSON.parse( data );
		    } else {
		        jsonobject = data;
		    }
		    if( !isJ( jsonobject ) ) {
		        throw "kein JSON-Objekt übergeben";
		    }
		    console.log( jsonobject );
			switch( jsonobject.command ) {
		        case "getEventsForView":
		                //showNewMessage("Erinnerung", jsonobject.success, jsonobject.message, [ {title: "Okay", action: "dM.hide()"}, {title: "Beenden", action: "location.reload()"} ] );
		                //dMNew.show( { title: "Erinnerung", type: jsonobject.success, text: jsonobject.message, buttons: [{"title": "Okay", action: function(){ dMNew.hide(); } }, {title: "Beenden", action: function(){ location.reload(); } } ] } );
		        		console.log( jsonobject );
		        break;
				
			}
}

/* */
class Calendar {
	constructor( setup ) {
		this.opt = {
			pVar:               "",
			evCalId: 			"",
			calView: 			'dayGridMonth', // timeGridWeek, timeGridDay, timeGridList ....,
			firstDay: 			1,
			currentUserId: 		1,

		}
		Object.assign( this.opt, setup );
		nj( this.opt.evCalId ).sDs("dvar", this.opt.pVar );
		nj( this.opt.evCalId ).sDs("ei_calendar", "" );
		this.evCal = new EventCalendar( nj().els( this.opt.evCalId ), {

				cVar: this.opt.pVar,

	    		view: this.opt.calView,

	    		firstDay: this.opt.firstDay, 

        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek, resourceTimeGridWeek, resourceTimeGridDay'
        },

		        buttonText: function (texts) {
		            texts.resourceTimeGridWeek = 'Res. Woche';
		            texts.resourceTimeGridDay = 'Res. Tag';
		            texts.dayGridMonth = "Monat";
		            texts.timeGridWeek = 'Woche';
		            texts.timeGridDay = "Tag";
		            texts.listWeek = "Liste";
		            texts.today = "heute";
		            return texts;
		        },
	    		events: [
	        		// your list of events
	        		{
    "allDay": false,
    "start": "2023-09-04T14:00:00.000Z",
    "end": "2023-09-05T06:00:00.000Z",
    "title":{html: "<span id='ev_1234'><b>test</b></span>" },
    "display": "auto",
    "extendedProps": {
                "test": 1,
                "id": 1234,
                "participate": true,
    },
    "backgroundColor": "#B29DD9",
    }
	    		],

		        dateClick: function( info ) {
		            if( info.jsEvent.ctrlKey ) {
		            	nj( info.dayEl ).Dia().onDateClickWithCtrl( info );
		            } else if( info.jsEvent.altKey ) {
		            	nj( info.dayEl ).Dia().onDateClickWithAlt( info );	
		            } else if( info.jsEvent.shiftKey ) {
		            	nj( info.dayEl ).Dia().onDateClickWithAlt( info );	
		            } else {
		            	nj( info.dayEl ).Dia().onDateClick( info );
		            }
		        },
		        eventClick : function( info ) {
		            nj( info.el ).Dia().onEventClick( info );
		        },
		        eventMouseEnter: function( info ) {
		            nj( info.el ).Dia().onEventMouseEnter( info );
		        },
		        eventMouseLeave: function( info ) {
		            nj( info.el ).Dia().onEventMouseLeave( info );
		        },
		        select: function( info ) {
		            // body...
		            console.log( info );
		        }
/*
		        datesSet: function ( info ) {
		        	console.log(  nj("*[data-dvar][data-ei_calendar]").atr("data-dvar")  );
		        	console.log( window[ nj("*[data-dvar][data-ei_calendar]").atr("data-dvar") ] );
		        },
*/



			});

		this.divEvent = new DialogDR( { dVar: this.opt.pVar +  ".divEvent", 
				id: "#divEvent", 
				autoOpen: false,
				modal: true,
				height: 400,
				width: 300,
				innerHTML: DIV_EVENT_EDIT_HTML,
			
			});
		this.divNewEvent = new DialogDR( { dVar: this.opt.pVar +  ".divNewEvent", 
				id: "#divEditEvent", 
				autoOpen: false,
				modal: true,
				innerHTML: DIV_EVENT_NEW_HTML,
			
			});
		}
		// end constructor
		// start functions

		/**
		 * evaluateCalData
		 * 
		 * basic processing for ajax request
		 * 
		 * data 			json string 	valid json string
		 * 
		 * return undefined
		 * 
		*/
		evaluateCalData = function( data ) {
		    console.log( data );
		    let jsonobject;
		    if( typeof data === "string" ) {
		        jsonobject = JSON.parse( data );
		    } else {
		        jsonobject = data;
		    }
		    if( !isJ( jsonobject ) ) {
		        throw "kein JSON-Objekt übergeben";
		    }
		    console.log( jsonobject );
			switch( jsonobject.command ) {
		        case "getEventsForView":
		                //showNewMessage("Erinnerung", jsonobject.success, jsonobject.message, [ {title: "Okay", action: "dM.hide()"}, {title: "Beenden", action: "location.reload()"} ] );
		                //dMNew.show( { title: "Erinnerung", type: jsonobject.success, text: jsonobject.message, buttons: [{"title": "Okay", action: function(){ dMNew.hide(); } }, {title: "Beenden", action: function(){ location.reload(); } } ] } );
		        		console.log( jsonobject );
		        break;
				
			}
		}
		/**
		 * onDateClickWithCtrl
		 * 
		 * date click event with pressed Ctrl key
		 * 
		 * info 			info var 	info var from EventCalendar
		 * 
		 * return undefined
		 * 
		*/
		onDateClickWithCtrl = function( info ) {
			console.log( "onDateClickWithCtrl", info );
		}
		/**
		 * onDateClickWithAlt
		 * 
		 * date click event with pressed Alt key
		 * 
		 * info 			info var 	info var from EventCalendar
		 * 
		 * return undefined
		 * 
		*/
		onDateClickWithAlt = function( info ) {
			console.log( "onDateClickWithAlt", info );
		}
		/**
		 * onDateClickWithShift
		 * 
		 * date click event with pressed Shift key
		 * 
		 * info 			info var 	info var from EventCalendar
		 * 
		 * return undefined
		 * 
		*/
		onDateClickWithShift = function( info ) {
			console.log( "onDateClickWithShift", info );
		}
		/**
		 * onDateClickWithShift
		 * 
		 * date click event with pressed Shift key
		 * 
		 * info 			info var 	info var from EventCalendar
		 * 
		 * return undefined
		 * 
		*/
		onDateClick = function( info ) {
			console.log( "onDateClick", info );
		}
		/**
		 * onEventClick
		 * 
		 * event click 
		 * 
		 * info 			info var 	info var from EventCalendar
		 * 
		 * return undefined
		 * 
		*/
		onEventClick = function( info ) {
			console.log( "onEventClick", info );
			this.divEvent.show();
		}
		/**
		 * onEventMouseEnter
		 * 
		 * event mouse enter 
		 * 
		 * info 			event var 	event var from EventCalendar
		 * 
		 * return undefined
		 * 
		*/
		onEventMouseEnter = function( info ) {
			console.log( "onEventMouseEnter", info );
		}
		/**
		 * onEventMouseLeave
		 * 
		 * event mouse leave 
		 * 
		 * info 			event var 	event var from EventCalendar
		 * 
		 * return undefined
		 * 
		*/
		onEventMouseLeave = function( info ) {
			console.log( "onEventMouseLeave", info );
		}
		refreshView = function( calArgs ) {
			/*
				calArgs: {
					id: 	"#cal" 		// id of calendar
					events: [ {....}, {....}, {....}, ],
						// an event is a kind of
						{
						    "allDay": false,
						    "start": "2023-09-04T14:00:00.000Z",
						    "end": "2023-09-05T06:00:00.000Z",
						    "title":{html: "<span id='ev_1234'><b>test</b></span>" },
						    "display": "auto",
						    "extendedProps": {
						        "test": 1,
								"id": 1234,
								"participate": true,
							    },
							    "backgroundColor": "#B29DD9",
						}
						// end event object
					view:
				}




			*/
			let options = {};
			options.view = 'dayGridMonth';
			options.events = [];
			this.opt.cal.destroy();
			/* original

			let ec = new EventCalendar(document.getElementById('ec'), {
	    		view: 'timeGridWeek',
	    		events: [
	        		// your list of events
	    		]
			});

			*/
			this.opt.cal = new EventCalendar( nj().els( calArgs.id ), options);
		}
		/**
		 * getDayForView
		 * 
		 * get startdate and enddate for a given date, first day of week and viewtype
		 * 
		 * cDate 			date 			date in the current view
		 * cView 			string 			current view
		 * 
		 * return object { start: startdate, end: enddate}
		*/
		getDaysForView = function( info ) {
			data = {};
			data.command = "getEventsForView"; 
			data.startDate = info.startStr.replace( "T", " " );
			data.endDate = info.endStr.replace( "T", " " );
			data.currentUser = this.currentUser;
			data.isFetch = true;
			console.log( data );
    		nj().post("library/php/ajax_calendar.php", data, this.evaluateCalData );   
		}
		/**
		 * switchHeadline
		 * 
		 * switch the headline between easy and detailed
		 * 
		 * isEasy 			boolean 		true -> easy view, else detailed view
		 * 
		 * return boolean
		*/
		switchHeadline = function( isEasy ) {
			if( isEasy ) {
				this.evCal.setOption( "headerToolbar", {
                        start: "title",
                        center: "",
                        end: "today prev,next"
                    });
			} else {
				this.evCal.setOption( "headerToolbar", {
		            start: 'prev,next today',
		            center: 'title',
		            end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek, resourceTimeGridWeek, resourceTimeGridDay'
		        });

			}
		}
		/**
		 * testfunction for async 
		 * 
		 * 
		*/
		testFunction = async function(argument) {
				await wait( 5000 );
				console.log( "neueFunktion" );
		}
}	
