const DIV_EVENT_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"><input type="datetime-local" id="evDateTime" value=""></div>';
//const DIV_EVENT_EDIT_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"><input type="datetime-local" id="evDateTime" value=""></div>';
const DIV_EVENT_NEW_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"></div>';
const calVar = "cal";

const DIV_EVENT_EDIT_HTML = `
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   

Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.   

Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer`

nj( document ).on( "keypress", function( e ) {
	e.stopImmediatePropagation();
	if( e.key = "y" && e.ctrlKey  && e.altKey ) {
		console.log( cal.evCal );
		if( cal.evCal.getOption("duration").months === 1 ) {
			cal.evCal.setOption("duration", { year: 1 } );	
		} else {
			cal.evCal.setOption("duration", { months: 1 } );	
		}		
	}

})


/* not good but nessecary */
/*
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
			divEvWidth:  		290,
			divEvHeight:  		440,
        	displayEventEnd: 	false,

		}
		Object.assign( this.opt, setup );
		nj( this.opt.evCalId ).sDs("dvar", this.opt.pVar );
		nj( this.opt.evCalId ).sDs("ei_calendar", "" );
		this.evCal = new EventCalendar( nj().els( this.opt.evCalId ), {

				cVar: this.opt.pVar,

	    		view: this.opt.calView,

	    		firstDay: this.opt.firstDay, 

	    		editable: true,

        		displayEventEnd: this.opt.displayEventEnd, 
        
        dayMaxEvents: true,
        nowIndicator: true,
        selectable: true,

		        headerToolbar: {
		            start: 'prev,next today',
		            center: 'title',
		            end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
		            //end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek, resourceTimeGridWeek, resourceTimeGridDay'
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
	    		events: [],

		        eventClick : function( info ) {
		            nj( info.el ).Dia().onEventClick( info );
		        },
		        eventMouseEnter: function( info ) {
		            nj( info.el ).Dia().onEventMouseEnter( info );
		        },
		        eventMouseLeave: function( info ) {
		            nj( info.el ).Dia().onEventMouseLeave( info );
		        },
		        eventResize: function( info ) {
		            nj( info.jsEvent.target).Dia().onEventResize( info );
		        },
		        eventDidMount: function( info ) {
		        	nj( info.el ).aCl( info.event.extendedProps.class );
		        	if( info.event.extendedProps.participate ) {
		        		nj( info.el ).aCl( "fc-participate" );
		        	}
		        	if( info.event.extendedProps.inner_url ) {
		        		nj( info.el ).aCl( "eventHasAppendix" );
		        	}
		        },
		        /*
		        dateFromPoint(x,y) {
		        	console.log( x,y );
		        },
				*/

		        eventDragStart: function( info ) {
		        	nj( info.jsEvent.target ).Dia().onEventDragStart( info );
		        },
		        eventDragStop: function( info ) {
		        	nj( info.jsEvent.target ).Dia().onEventDragStop( info );
		        },


		        select: function( info ) {
		            // body...
		            console.log( info );
		        },


			});
			this.divEvent = new DialogDR( { dVar: this.opt.pVar +  ".divEvent", id: "#editEvent", height: this.opt.divEvHeight, width: this.opt.divEvWidth, autoOpen: false, afterShow: function(){ nj( this.id).Dia().options('center')} } );
			this.dPartic = new DialogDR( { dVar: this.opt.pVar + ".dPartic", id: "#dPartic", modal: false, /* onShow: function(){ nj( this.id).Dia().options('center') }*/ } );
		}
//		console.log( this );
		//this.evCal.setOption( "dateClick", function(e){console.log(e)} );
		// end constructor
		// variables declaration
		//evCal.setOption( "dateClick", function(e){console.log(e)} );
		divEventType = "";

		// end variables declaration

		// start functions
		/**
		 * evArray
		 * 
		 * array  		contains the assignment between the calendar id and the evCalendar id ('{generated-[n]}')
		 * 
		*/
		evArray = [];
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
    		let l, i, tmp;
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
				case "getDaysForView":
					l = jsonobject.data.length;
					i = 0;
					while ( i < l ) {
						console.log( jsonobject.data[i] );
						i += 1;
					}
					break;
		        case "getEventsForView":
	        		l = jsonobject.data.length;
	        		i = 0;
	        		while ( i < l ) {
	        			//console.log( jsonobject.data[i] );
	        			cal.addEvent( jsonobject.data[i] )
	        			i += 1;
	        		}
		        break;
		    case "showParticipants":
		    	if( jsonobject.data.length > 0 ) {
			    	tmp = "";
			    	l = jsonobject.data.length;
			    	i = 0;
			    	while ( i < l ) {
			    		tmp += "<div>" + jsonobject.data[i].participant + "</div>"
			    		i += 1;
			    	}
			    	cal.dPartic.show({innerHTML: tmp, x: jsonobject.x, y: jsonobject.y - 100 })
		    	}
			}
		}
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
			console.log( "onEventClick", info.jsEvent.ctrlKey );
			if( info.jsEvent.ctrlKey ) {
				dMNew.show({ title: "Termin löschen", type: "question", text: "Willst Du diesen Termin löschen?", width: 220, buttons: [ { title: "Ja", action: function () {dMNew.hide();} }, { title: "Nein", action: function () {dMNew.hide();} } ] } );
			} else {
				if( info.jsEvent.altKey ) {
					window.open( info.event.extendedProps.inner_url, "_blank" );
				} else {
					this.divEvent.show( {variables: { divType: "edit", event: info.event }, onShow: function(){
						console.log( arguments );
						if( arguments[0].divType === "edit" ) {
							console.log( "editDialog" );
						}
					}});
				}
			}

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
			data.command = "showParticipants";
			data.event_id = info.event.extendedProps.id;
			console.log( this );
			data.x = info.jsEvent.screenX;
			data.y = info.jsEvent.screenY;
			nj().post("../../regenbogen/library/php/ajax_calendar.php", data, this.evaluateCalData );
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
			cal.dPartic.hide();
		}
		/**
		 * onEventResize
		 * 
		 * event is resized
		 * 
		 * info 			event var 	event var from EventCalendar
		 * 
		 * return undefined
		 * 
		*/
		onEventResize = function( info ) {
			console.log( "onEventResize", info );
		}
		/**
		 * onEventDidMount
		 * 
		 * event 
		 * 
		 * info 			event var 	Callback function that is triggered right after the element has been added to the DOM. If the event data changes, this is not called again.
		 * 
		 * return undefined
		 * 
		*/
		onEventDidMount = function( info ) {
			console.log( "onEventDidMount", info );
		}
		/**
		 * onEventDragStart
		 * 
		 * event 
		 * 
		 * info 			event var 	fires if event is drag start
		 * 
		 * return undefined
		 * 
		*/
		onEventDragStart = function( info ) {
			console.log( "onEventDragStart", info );
		}
		/**
		 * onEventDragStop
		 * 
		 * event 
		 * 
		 * info 			event var 	fires if event is drag end
		 * 
		 * return undefined
		 * 
		*/
		onEventDragStop = function( info ) {
			console.log( "onEventDragStart", info );
		}
		/**
		 * getInternIdForDatabaseId
		 * 
		 * function 
		 * 
		 * remove a events for a database event id
		 * 
		 * return undefined
		 * 
		*/
		getInternIdForDatabaseId = function( id ) {
			let tmp = this.evCal.getEvents();
			let l = tmp.length;
			let i = 0;
			while( i < l ) {
				if( this.evCal.getEvents()[i].extendedProps.id == id ) return this.evCal.getEvents()[i].id;
				i += 1;
			}
		}
		/**
		 * removeEventForDatabaseId
		 * 
		 * function 
		 * 
		 * remove a events for a database event id
		 * 
		 * return undefined
		 * 
		*/
		removeEventForDatabaseId = function( id ) {
			let tmp = this.evCal.getEvents();
			let l = tmp.length;
			let i = 0;
			while( i < l ) {
				console.log( typeof this.evCal.getEvents()[i].extendedProps.id );
				if( this.evCal.getEvents()[i].extendedProps.id == id ) {
					this.evCal.removeEventById( this.evCal.getEvents()[i].id );
					i = l;
				}
				i += 1;
			}
			//this.evCal.removeEventById( getInternIdForDatabaseId( id ) );
			// delete database event
			data.command = "deleteCalEvent";
			data.id = id;
			console.log( data );
			nj().post("library/php/ajax_calendar.php", data, this.evaluateCalData );
			// end delete database event
		}
		/**
		 * removeAllEventsFromView
		 * 
		 * function 
		 * 
		 * remove all events from calendar
		 * 
		 * return undefined
		 * 
		*/
		removeAllEventsFromView = function() {
			let tmp = this.evCal.getEvents();
			let l = tmp.length;
			let i = 0;
			while ( i < l ) {
				console.log( this.evCal.getEvents()[0].id );
				this.evCal.removeEventById( this.evCal.getEvents()[0].id)
				i += 1;
			}		
		}
		/**
		 * getInternIdFromId
		 * 
		 * function 
		 * 
		 * gets the intern Id for database Id
		 * 
		 * return string 	intern Id
		 * 
		*/
		getInternIdFromId = function( id ) {
			let tmp = this.evCal.getEvents();
			//console.log( "hier" );
			
			let l = tmp.length;
			let i = 0;
			while ( i < l ) {
				if( this.evCal.getEvents()[i].extendedProps.id == id ) {
					return this.evCal.getEvents()[i].id;	
	
				} 
				i += 1;
			}
		}
		/**
		 * refreshView
		 * 
		 * 
		 * 
		 * 
		 * 
		 * 
		 * 
		*/
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
			console.log( this.opt.currentUserId );
			data = {};
			data.command = "getEventsForView"; 
			data.startDate = info.startStr.replace( "T", " " );
			data.endDate = info.endStr.replace( "T", " " );
			data.userId = this.opt.currentUserId;
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
		addEvent = function(ev) {
			/*
			ev = {
				    "allDay": false,
				    "start": "2023-09-14T14:00:00.000Z",
				    "end": "2023-09-14T16:00:00.000Z",
				    "title":{html: "<span id='1235'><b>test</b></span>" },
				    "display": "auto",
				    "extendedProps": {
				        "test": 2,
						"id": 1235,
						"participate": true,
						"format": "fc-1",
					    },
				}
			*/
			this.evCal.addEvent( ev )
			/*
			let hinweis = document.getElementById(ev.extendedProps.id);
    hinweis.classList.add("fc-1");
			//console.log( document.getElementById(  ).classList );
			//nj( "#" + ev.extendedProps.id ).aCl("fc-1");
			//document.getElementById( ev.extendedProps.id ).classList.add(  );
			let el = nj().els("#" + ev.extendedProps.id );
			console.log( el );
			*/
		}
		removeEvent = function( Id ) {
			this.evCal.removeEventById( Id );	
		}
}	
