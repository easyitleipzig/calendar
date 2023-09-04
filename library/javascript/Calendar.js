const DIV_EVENT_EDIT_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"><input type="datetime-local" id="evDateTime" value=""></div>';
const DIV_EVENT_NEW_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"></div>';
class Calendar {
	constructor( setup ) {
		this.opt = {
			pVar:               "",
			evCalId: 			"",
			calView: 			'timeGridWeek', // dayGridMonth ....,
			firstDay: 			1,
		}
		Object.assign( this.opt, setup );
		nj( this.opt.evCalId ).sDs("dvar", this.opt.pVar );
		this.evCal = new EventCalendar( nj().els( this.opt.evCalId ), {
	    		view: this.opt.calView,
	    		firstDay: this.opt.firstDay, 
	    		events: [
	        		// your list of events
	    		],
		        dateClick: function( info ) {
		            // body...
		            console.log( e, window[ getDVar( info.dayEl ) ] );
		            if( info.jsEvent.ctrlKey ) {
		            	console.log( "ctrlKey" );
		            	window[ getDVar( info.dayEl ) ].onDateClickWithCtrl( info );
		            } else if( info.jsEvent.altKey ) {
		            	console.log( "altKey" );	
		            	window[ getDVar( info.dayEl ) ].onDateClickWithAlt( info );	
		            } else if( info.jsEvent.shiftKey ) {
		            	console.log( "shiftKey" );	
		            	window[ getDVar( info.dayEl ) ].onDateClickWithAlt( info );	
		            } else {
		            	window[ getDVar( info.dayEl ) ].onDateClick( info );		
		            }
		        },

			});
		this.divEvent = new DialogNew( { dVar: this.opt.pVar +  ".divEditEvent", 
				id: "#divEditEvent", 
				autoOpen: false,
				modal: true,
				innerHTML: DIV_EVENT_EDIT_HTML,
			
			});
		/*
		this.divNewEvent = new DialogNew( { dVar: this.opt.pVar +  ".divNewEvent", 
				id: "#divEditEvent", 
				autoOpen: true,
				modal: true,
				innerHTML: DIV_EVENT_NEW_HTML,
			
			});
		*/
		}
		// end constructor
		// start functions
		onDateClickWithCtrl = function( info ) {
			console.log( "onDateClickWithCtrl", info );
		}
		onDateClickWithAlt = function( info ) {
			console.log( "onDateClickWithAlt", info );
		}
		onDateClickWithShift = function( info ) {
			console.log( "onDateClickWithShift", info );
		}
		onDateClick = function( info ) {
			console.log( "onDateClick", info );
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
		onDayClick = async function(argument) {
			// body...
			console.log( arguments );
		}
		/**
		 * get startdate and enddate for a given date, first day of week and viewtype 
		 * 
		 * return object { start: startdate, end: enddate}
		*/
		getDayForView = async function( cDate, fDayOfWeek, cView ) {

		}
		testFunction = async function(argument) {
				await wait( 5000 );
				console.log( "neueFunktion" );
		}
}	
