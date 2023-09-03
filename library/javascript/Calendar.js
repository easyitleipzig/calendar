class Calendar {
	constructor( setup ) {
		this.opt = {
			pVar:               "Publisher",
			Id:                 undefined,
			cal: 				undefined,
			calId: 				"",
			calView: 			undefined,
		}
		Object.assign( this.opt, setup );
	}
	function refreshView( calArgs ) {
		nj( this.opt.calId ).htm( "" );
		this.opt.cal = new EventCalendar(document.getElementById( this.opt.calId ), {
		    view: 'timeGridWeek',
		    events: [
		        // your list of events
		    ]
		});
	}
}	
