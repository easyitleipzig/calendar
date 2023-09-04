class Calendar {
	constructor( setup ) {
		this.opt = {
			pVar:               "",
			Id:                 undefined,
			cal: 				undefined,
			evCal: 				undefined,
			evCalId: 			"",
			calView: 			'timeGridWeek', // dayGridMonth ....
		}
		Object.assign( this.opt, setup );
		nj( this.opt.evCalId ).sDs("dvar", this.opt.evCal.toString() );
		this.opt.evCal = new EventCalendar( nj().els( this.opt.evCalId ), {
    		view: this.opt.calView,
    		events: [
        		// your list of events
    		],
	        dateClick: function(e) {
	            // body...
	            console.log( arguments.callee() );
	            console.log( e, evCal, window[ evCal ] );
	        },

		});
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
	onDayClick = function(argument) {
		// body...
		console.log( arguments );
	}
}	
