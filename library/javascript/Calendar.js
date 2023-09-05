const DIV_EVENT_EDIT_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"><input type="datetime-local" id="evDateTime" value=""></div>';
const DIV_EVENT_NEW_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"></div>';
const calVar = "cal";
/* not good but nessecary */
const getDateRange = function (info) {
	// body...
	console.log( info );
}

/* */
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

        buttonText: function (texts) {
            texts.resourceTimeGridWeek = 'Res. Woche';
            texts.resourceTimeGridDay = 'Res. Tag';
// dayGridMonth: 'month', listDay: 'list', listMonth: 'list', listWeek: 'list', listYear: 'list', resourceTimeGridDay: 'day', resourceTimeGridWeek: 'week', timeGridDay: 'day'
            texts.dayGridMonth = "Monat";
            texts.timeGridWeek = 'Woche';
            texts.timeGridDay = "Tag";
            texts.listWeek = "Liste";
            texts.today = "heute";
            return texts;
        },
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

		        datesSet: function ( info ) {
		        	console.log( window[ calVar ] );
		        	getDateRange( info );
		        	return info;
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

		/**
		 * evaluateData
		 * 
		 * basic processing for ajax request
		 * 
		 * data 			json string 	valid json string
		 * 
		 * return undefined
		 * 
		*/
		evaluateData = async function( data ) {
			
		}
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
			/*
			data.startDate = info.startStr.replace( "T", "" );
			data.endDate = info.endStr.replace( "T", "" );
			return data;
			*/
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
