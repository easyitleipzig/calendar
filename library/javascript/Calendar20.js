const DIV_EVENT_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"><input type="datetime-local" id="evDateTime" value=""></div>';
//const DIV_EVENT_EDIT_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"><input type="datetime-local" id="evDateTime" value=""></div>';
const DIV_EVENT_NEW_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"></div>';
const calVar = "cal";
// standard event hour difference
const standardEventHourDiff = 1;
nj( document ).on( "keypress", function( e ) {
	e.stopImmediatePropagation();
	if( e.key = "y" && e.ctrlKey ) {
		console.log( cal.evCal );
		if( cal.evCal.getOption("duration").months === 1 ) {
			cal.evCal.setOption("duration", { year: 1 } );	
		} else {
			cal.evCal.setOption("duration", { months: 1 } );	
		}		
	}

})


class Calendar {
	constructor( setup ) {
		this.opt = {
			pVar:               "",
			evCalId: 			"",
			addClassFiles:		"calendar_evCal.css EventCalendar.css",
			calView: 			'dayGridMonth', // timeGridWeek, timeGridDay, timeGridList ....,
			type: 				true, // type of calendar, "editable" true/"noeditable" false 
			firstDay: 			1,
			currentUserId: 		1,
			divEvWidth:  		290,
			divEvHeight:  		440,

		}
		//let calEdit;
		//this.opt.type === "editable" ? this.calEdit = true : this.calEdit = false;
		Object.assign( this.opt, setup );
		let tmpCF = this.opt.addClassFiles.split( " " );
		let l = tmpCF.length;
		let i = 0;
		while ( i < l ) {
			loadCSS( PATH_TO_CSS + tmpCF[ i ] );
			i += 1;
		}
		nj( this.opt.evCalId ).sDs("dvar", this.opt.pVar );
		nj( this.opt.evCalId ).sDs("ei_calendar", "" );
		this.evCal = new EventCalendar( nj().els( this.opt.evCalId ), {

				cVar: this.opt.pVar,

	    		view: this.opt.calView,

	    		firstDay: this.opt.firstDay, 

	    		editable: true,


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
		        eventResize: function( info ) {
		            nj( info.jsEvent.target).Dia().onEventResize( info );
		        },
		        eventDidMount: function( info ) {
		        	nj( info.el ).aCl( info.event.extendedProps.class );
		        	if( info.event.extendedProps.participate ) {
		        		nj( info.el ).aCl( "fc-participate" );
		        	}
		        	if( info.event.extendedProps.appendix ) {
		        		nj( info.el ).aCl( "eventHasAppendix" );
		        	}
		        },
		        
		        dateFromPoint: function( x, y ) {
		        	console.log( arguments );
		        },
				

		        eventDragStart: function( info ) {
		        	nj( info.jsEvent.target ).Dia().onEventDragStart( info );
		        },
		        eventDragStop: function( info ) {
		        	console.log( nj( info.jsEvent.target ).gRO() );

		        	nj( info.jsEvent.target ).Dia().onEventDragStop( info );
		        },

		        eventDrop: function( info ) {
		        	//console.log( info );
		        	if( nj( info.jsEvent.target ).gRO().opt.type ) {
		        		nj( info.jsEvent.target ).gRO().saveEventByJson( info.event )
		        	}
		        	
		        },

		        select: function( info ) {
		            // body...
		            console.log( info );
		        },


			});
			this.divEvent = new DialogDR( { dVar: this.opt.pVar +  ".divEvent", id: "#editEvent", height: this.opt.divEvHeight, width: this.opt.divEvWidth, autoOpen: false, modal: false, hasHelp: true, width: 320, afterShow: function(){ nj( this.id).Dia().options('center')} } );
			this.dPartic = new DialogDR( { dVar: this.opt.pVar + ".dPartic", id: "#dPartic", modal: false, variables: {calendar: this }, onShow: function() {
				nj("#dPartic_box div" ).on( "mouseleave", function(e){ 
					e.stopImmediatePropagation();
					nj("#" + this.id ).Dia().hide();
				} );
				}
			 	/* onShow: function(){ nj( this.id).Dia().options('center') }*/ 
			} );
			this.showPart = new DialogDR( { dVar: this.opt.pVar +  ".showPart", id: "#showPart", height: this.opt.divEvHeight, width: this.opt.divEvWidth, autoOpen: false, modal: true, hasHelp: false } );
			this.evRequest = new DialogDR( { dVar: this.opt.pVar +  ".evRequest", id: "#evRequest", height: 300 , autoOpen: false, modal: true, hasHelp: false, width: 320, buttons: [
					{
						title: "Anfragen",
						action: function( args ) {
							console.log( nj( this ).gRO() );
							nj( this ).gRO().sendEvRequest();	
						}
					},
					{
						title: "Schließen",
						action: function( args ) {
							nj( this ).gRO().evRequest.hide();	
						}
					},

				] } );
		}
		// end constructor
		// variables declaration

		divEventType = "";

		/**
		 * evArray
		 * 
		 * array  		contains the assignment between the calendar id and the evCalendar id ('{generated-[n]}')
		 * 
		*/
		evArray = [];
		// end variables declaration

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
    		let l, i, tmp, calendar;
		    let jsonobject;
		    if( typeof data === "string" ) {
		        jsonobject = JSON.parse( data );
		    } else {
		        jsonobject = data;
		    }
		    if( !isJ( jsonobject ) ) {
		        throw "kein JSON-Objekt übergeben";
		    }
		    if( typeof jsonobject.pVar !== "undefined" ) calendar = window[ jsonobject.pVar ]
		    console.log( jsonobject, calendar );
			switch( jsonobject.command ) {
		        case "getEventsForView":
	        		l = jsonobject.data.length;
	        		i = 0;
	        		while ( i < l ) {
	        			calendar.addEvent( jsonobject.data[i] )
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
				    	calendar.dPartic.show({innerHTML: tmp, x: jsonobject.x, y: jsonobject.y - 100 })
			    	}
			    break;
				case "deleteAppendix":
					console.log( jsonobject.message );
					nj( "#editAppendix" ).v( "" );
					nj( "#loadAppendix" ).v( null );
				break;
				
				case "showDialogParticipate":
					if( jsonobject.success ) {
						if( jsonobject.countPart === null ) {
								dMNew.show({title:"Teilnehmer anzeigen", type: "info", text: "Für diesen Termin gibt es keine Teilnehmer." } );
								return;
							} else {
								tmp = "";
								tmp += "<div><div>Teilnehmer</div><div>" + jsonobject.countPart + "</div></div>";
								l = jsonobject.participants.length;
								i = 0;
								while ( i < l ) {
									
									tmp += "<div><div>" + jsonobject.participants[i]["fullname"] + "</div><div>" + jsonobject.participants[i]["count_part"] + "</div></div>";
									i += 1;
								}
								calendar.showPart.show({title: "Terminteilnehmer", innerHTML:tmp, buttons:[
										{
											title: "Drucken",
											action: function() {
												open("calendar20_showPart.php?cal=" + nj( "#Id" ).v(), "_blank");	
											}
										},
										{
											title: "Okay",
											action: function() {
												calendar.showPart.hide();	
											}
										},
									]});

							}
						} 
					break;
					case "setParticipate":
						//if( jsonobject.elId === "")
						dMNew.show( {title:"Teilnahme", type: jsonobject.success, text: jsonobject.message } );
					break; 
				
			}
		}
		/**
		 * sendEvRequest
		 * 
		 * send request for event
		 *
		 * 
		 * return undefined
		 * 
		*/
		sendEvRequest = function() {
			data = {};
			data.command = "sendEvRequest";
			data.id = nj( "#Id" ).v();
			data.request = nj( "#contentRequest" ).v();
			console.log( data );
			nj().post("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );   
		}
		/**
		 * buildDateFromDialog
		 * 
		 * build Date from event dialog
		 *
		 * start 		boolean 	true -> startdate; false -> enddate
		 * 
		 * 
		 * return date 		date
		 * 
		*/
		buildDateFromDialog = function( start = true ) {
			if( start ) {
				return new Date( nj("#startDate").v() + "T" + nj("#startHour").v() + ":" + nj("#valStartMinutes").v() );
			} else {
				return new Date( nj("#endDate").v() + "T" + nj("#endHour").v() + ":" + nj("#valEndMinutes").v() );
			}
		}
		/**
		 * buildEventFromDialog
		 * 
		 * build a calendar event object from event dialog
		 * 
		 * 
		 * return object 		calendar event object
		 * 
		*/
		buildEventFromDialog = function( widthInnerId = false, display = true, ressources = true ) {
			let ev = {};
			ev.extendedProps = {};
			console.log( nj( "#innerId" ).v() );
			if( nj( "#innerId" ).v() !== "" && widthInnerId ) ev.id = nj( "#innerId" ).v();
			if( display ) ev.display = "auto";
			if( ressources ) ev.resourceIds = [];
			if( nj( "#innerId" ).v() !== "" && widthInnerId ) ev.id = nj( "#innerId" ).v();
			ev.allDay = nj( "#allDay" ).chk();
			if( ev.allDay ) {
				ev.start = nj( "#startDate" ).v() + "T00:00Z";
			} else {
				ev.start = nj( "#startDate" ).v() + "T" + nj( "#startHour" ).v() + ":" + nj( "#valStartMinutes" ).v() ;	
			}
			
			if( !ev.allDay ) ev.end = nj( "#endDate" ).v() + "T" + nj( "#endHour" ).v() + ":" + nj( "#valEndMinutes" ).v();
			ev.title = nj( "#title" ).v();
			ev.titleHTML = "";
			ev.extendedProps.id = nj( "#Id" ).v();;
			ev.extendedProps.groupId = nj( "#groupId" ).v();;
			ev.extendedProps.place = nj( "#place" ).v();;
			ev.extendedProps.class = "fc-" + nj( "#category" ).v();;
			ev.extendedProps.registration_deadline = nj( "#deadline" ).v();;
			ev.extendedProps.url = nj( "#Url" ).v();;
			ev.extendedProps.inner_url = nj( "#newInnerUrl" ).v();;
			ev.extendedProps.inner_url_text = nj( "#innerUrlText" ).v();;
			ev.extendedProps.description = nj( "#description" ).v();
			return ev;
		}
		/**
		 * getInternIdFromId
		 * 
		 * get intern Id from database id
		 * 
		 * internId 		string 	intern Id
		 * 
		 * return undefined
		 * 
		*/
		getInternIdFromId = function( id ) {
			let tmp = this.evCal.getEvents();
			let l = tmp.length;
			let i = 0;
			while ( i < l ) {
				if( tmp[i].extendedProps.id == id ) return tmp[i].id
				i += 1;
			}
			return false;
		}
		/**
		 * getIdFromInternId
		 * 
		 * get intern Id from database id
		 * 
		 * internId 		string 	intern Id
		 * 
		 * return undefined
		 * 
		*/
		getIdFromInternId = function( id ) {
			let tmp = this.evCal.getEventById( id );
			return tmp.extendedProps.id
		}
		/**
		 * saveEventByJson
		 * 
		 * save JSON event to database
		 * 
		 * return result
		 * 
		*/
		saveEventByJson = function( event, repeat = 0, repeatTo = "0000-00-00") {
			data = {};
			data.command = "saveEventByJson";
			data.pVar = this.opt.pVar;
			data.event = JSON.stringify( event );
			data.repeat = repeat;
			data.repeatTo = repeatTo;
			console.log( data );
			//nj().post("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );   

		}
		/**
		 * saveEvent
		 * 
		 * save event to database
		 * 
		 * return result
		 * 
		*/
		saveEvent = function() {
			data = {};
		    data.command = "saveEvent";
		    data.id = nj( "#Id").v();
		    data.group_id = nj( "#groupId").v();
		    data.title = nj( "#title").v();
		    data.place = nj( "#place").v();
		    data.format = nj( "#category").v();
		    data.creator = nj( "#creator").v();
		    data.informRole = nj( "#informRole").v();
		    data.informUser = nj( "#informUser").gSV();
		    data.fromDate = nj( "#startDate").v();
		    data.toDate = nj( "#endDate").v();
		    data.fromTime = nj( "#startHour").v() + ":" + nj( "#valStartMinutes").v();
		    data.toTime = nj( "#endHour").v() + ":" + nj( "#valEndMinutes").v();
		    data.deadline = nj( "#deadline").v();
			data.participateAs = nj( "#participateAs" ).v();
			data.participate = nj( "#participate" ).chk();
			data.countPart = nj( "#countPart" ).v();
			data.informRole = nj( "#informRole" ).v();
			data.informUser = nj( "#informUser" ).v();
		    data.url = nj( "#Url").v();
		    data.description = nj( "#Description").v().replace(/\n|\r/g, " * ");;
		    data.notice = nj( "#Notice").v();
		    data.innerUrl = nj( "#innerUrl").v();
		    data.innerUrlText = nj( "#innerUrlText").v();
		    if( nj( "#innerUrl").v() != "" && nj( "#editSendAppendix" ).chk() ) {
		    	data.sendAppendix = true;
		    } else {
		    	data.sendAppendix = false;
		    }
		    data.countPart = nj( "#count_part" ).v();
			nj().fetchPostNew("library/php/ajax_calendar_evcal.php", data, this.evaluateCalendar );
			
		}
		/**
		 * setEventNewValues
		 * 
		 * build field definitions from intern Id
		 * 
		 * data 			object 	dialog variables
		 * 
		 * return undefined
		 * 
		*/
		setEventNewValues = function( isBlocked = true, event = undefined ) {
				nj( "#editEvent" ).rCl( "cEdit" );
				nj( "#editEvent" ).aCl( "cNew" );
				nj( "#Id" ).v( "new" );
				nj( "#allDay" ).chk( event.allDay )
				nj( "#innerId" ).v( "" )
				nj( "#title" ).v( "" );
				nj( "#place" ).v( 0 );
				nj( "#category" ).v( 0 );
				nj( "#creator" ).v( currentUserId );

		}
		/**
		 * deleteAppendix
		 * 
		 * delete apendixes from intern Id
		 * 
		 * 
		 * return undefined
		 * 
		*/
		deleteAppendix = function( data, dialog ) {
			data = {};
			data.command = "deleteAppendix";
			data.id = nj( "#Id" ).v();
			nj().fetchPostNew("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );
		}
		/**
		 * setParticipate
		 * 
		 * switch participation
		 * 
		 * 
		 * return undefined
		 * 
		*/
		setParticipate = function( elId ) {
			data = {};
			data.command = "setParticipate";
			data.pVar = this.opt.pVar;
			data.id = nj( "#Id" ).v();
			data.elId = elId;
			data.userId = currentUserId;
			data.participate = nj( "#participate" ).chk();
			data.participateAs = nj( "#participateAs" ).v();
			data.remindMe = nj( "#remindMe" ).chk();
			data.countPart = nj( "#countPart" ).v();
			console.log( data );
			nj().fetchPostNew("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );
		}
		/**
		 * showDialogParticipate
		 * 
		 * shows the participation dialog
		 * 
		 * 
		 * return undefined
		 * 
		*/
		showDialogParticipate = function( calendar ) {
			data = {};
			data.command = "showDialogParticipate";
			data.pVar = calendar.opt.pVar;
			data.id = nj( "#Id" ).v();
			console.log( data );
			nj().fetchPostNew("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );
		}
		/**
		 * fillEditDialogForNew
		 * 
		 * build field definitions from intern Id
		 * 
		 * data 			object 	dialog variables
		 * 
		 * return undefined
		 * 
		*/
		fillEditDialogForNew = function( data, dialog ) {
			if( data.event.date < new Date() ) {			
				nj().els( dialog.opt.id + "_box div.d_HLTitle")[0].innerHTML = "Neuer Termin (gesperrt)";
				this.setEventNewValues( true, data.event );
				nj( "#startDate" ).v( "" );
				nj( "#endDate" ).v( "" );
				nj( "#startHour").v( "00" );
				nj( "#valStartMinutes").v( "00" );
				nj( "#endHour").v( "00" );
				nj( "#endStartMinutes").v( "00" );
				nj( "#deadline" ).v( "" );
				nj( "#participateAs" ).v( 0 );
				nj( "#remindMe" ).chk( false );
				nj( "#countPart" ).v( "1" );
				dialog.options( "buttons", [{title: "Schließen", action: function( e ) {
					console.log( e );
					nj( e.target ).Dia().hide();	
				} }] );
			} else {
				nj().els( dialog.opt.id + "_box div.d_HLTitle")[0].innerHTML = "Neuer Termin";
				let event = data.event;
				this.setEventNewValues( false, data.event );
				let tmpDateTime = event.dateStr.split( "T" );
				let endDate = event.date;
				//let endDate = new Date(  tmpDateTime[0] )
				if( event.allDay ) {
					endDate = endDate.addDays( 1 );
				} else {
				}
				let hour_minutes = tmpDateTime[1].split( ":" );
				nj( "#startDate" ).v( tmpDateTime[0] );
				nj( "#endDate" ).v( endDate.getMySQLDateString() );
				nj( "#startHour").v( hour_minutes[0] );
				nj( "#valStartMinutes").v( hour_minutes[1] );
				nj( "#deadline" ).v( "0000-00-00" );
				nj( "#participateAs" ).v( 0 );
				nj( "#remindMe" ).chk( false );
				nj( "#countPart" ).v( "1" );

				dialog.options( "buttons", [
				{
					title: "Schließen", action: function( e ) {
						e.stopImmediatePropagation();
						nj( e.target ).Dia().hide();
						if( nj("#Id").v() === "new" ) {
							nj( this ).gRO().deleteAppendix();
						}	
					} 
				},
				{
					title: "Speichern", action: function( e ) {
						console.log( nj( this ).Dia().opt.variables.calendar );
						nj( this ).Dia().opt.variables.calendar.getInternIdFromId();
						nj( e.target ).Dia().hide();	
					} 
				}				

				] );				
			}
		}
		fillEditDialogForEdit = function( data, dialog ) {
			let tmp, app, event = data.event;
			console.log( data.event.start );
			if( data.event.start < new Date() ) {			
				nj().els( dialog.opt.id + "_box div.d_HLTitle")[0].innerHTML = "Termin bearbeiten (gesperrt)";
				dialog.options( "buttons", [{title: "Schließen", action: function( e ) {
					console.log( e );
					nj( e.target ).Dia().hide();	
				} }] );
			} else {
				nj().els( dialog.opt.id + "_box div.d_HLTitle")[0].innerHTML = "Termin bearbeiten";
			}
			nj( "#editEvent" ).rCl( "cNew" );
			nj( "#editEvent" ).aCl( "cEdit" );
			nj( "#Id" ).v( event.extendedProps.id );
			nj( "#innerId" ).v( event.id );
			nj( "#groupId" ).v( event.extendedProps.groupId );
			nj( "#allDay" ).chk( event.allDay );
			nj( "#title" ).v( event.title );
			nj( "#place" ).v( event.extendedProps.place );
			// category must be class
			nj( "#category" ).v( event.extendedProps.class.replace("fc-", "") );
			nj( "#creator").v( event.extendedProps.creator )
			let tmpTime = event.start.getMySQLDateString( true ).split( " " );
			nj( "#startDate" ).v( tmpTime[0] );
			tmpTime = tmpTime[1].split( ":" );
			nj( "#startHour" ).v( tmpTime[0] );
			nj( "#valStartMinutes" ).v( tmpTime[1] );
			tmpTime = event.end.getMySQLDateString( true ).split( " " );
			nj( "#endDate" ).v( tmpTime[0] );
			tmpTime = tmpTime[1].split( ":" );
			nj( "#endHour" ).v( tmpTime[0] );
			nj( "#valEndMinutes" ).v( tmpTime[1] );
			nj( "#participate" ).chk( event.extendedProps.participate );
			nj( "#participateAs" ).v( event.extendedProps.participateAs );
			nj( "#remindMe" ).chk( event.extendedProps.remindMe );
			// set appendix
			if( event.extendedProps.appendix !== "" ) {
				app = event.extendedProps.appendix.split("|") ;
				let l = app.length;
				let i = 0;
				tmp = "";
				while ( i < l ) {
					tmp += "<a href='" + app[i] + "' target='_blank'>Anhang " + (i + 1 ) + "</a>&nbsp;"
					i += 1;
				}
				console.log( tmp );
				nj( "#editAppendix" ).htm( tmp );
			}
			// set behavior for participate
			nj( "#participate, #participateAs, #remindMe, #countPart" ).on( "change", function( e ) {
				e.stopImmediatePropagation();
				nj( this ).gRO().setParticipate( this.id );
			} );
			nj( "#showParticipants" ).on( "click", function( e ) {
				e.stopImmediatePropagation();
				nj( this ).gRO().showDialogParticipate( nj( this ).gRO() );
			});
			console.log( event.extendedProps );
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
			data.pVar = this.opt.pVar;
			data.startDate = info.startStr.replace( "T", " " );
			data.endDate = info.endStr.replace( "T", " " );
			data.userId = this.opt.currentUserId;
			data.isFetch = true;
			console.log( data );
    		nj().post("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );   
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
			console.log( "onDateClick", this.opt.type );
			if( this.opt.type !== "editable" ) return;
			this.divEvent.show( {variables: { event: info, calendar: this }, onShow: function( e ){
				console.log( this.variables.calendar );
				this.variables.calendar.fillEditDialogForNew( arguments[0].opt.variables, arguments[0] )
			}});
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
			//console.log( "onEventClick", info.jsEvent.ctrlKey );
			if( info.jsEvent.ctrlKey ) {
				dMNew.show({ title: "Termin löschen", type: "question", text: "Willst Du diesen Termin löschen?", width: 220, buttons: [ { title: "Ja", action: function () {dMNew.hide();} }, { title: "Nein", action: function () {dMNew.hide();} } ] } );
			} else {
				if( info.jsEvent.altKey ) {
					// show appendix
					window.open( info.event.extendedProps.inner_url, "_blank" );
				} else {
					if( this.opt.type ) {
						this.divEvent.show( {variables: { event: info.event, calendar: this }, onShow: function(){
								//let event = arguments[0].opt.variables.event;
								console.log( this );
								arguments[0].opt.variables.calendar.fillEditDialogForEdit( arguments[0].opt.variables, arguments[0] )
							},
						buttons: [
								{title: "Abbrechen", action: function( e ) {
									//console.log( nj( this ).Dia().opt.variables.cal.evCal );
									nj( e.target ).Dia().hide();
								}},
								{title: "Speichern", action: function( e ) {
									console.log( nj( e.target ).Dia().opt.variables );
									//nj( this ).Dia().hide();
									nj( e.target ).Dia().opt.variables.calendar.saveEvent();
									console.log( nj( e.target ).Dia().opt.variables.calendar.buildEventFromDialog( true ) );
									nj( e.target ).Dia().opt.variables.calendar.evCal.saveEventByJson( nj( e.target ).Dia().opt.variables.calendar.buildEventFromDialog( true ) )

								}},
								{title: "Löschen", action: function( e ) {
									console.log( nj( e.target ).Dia().opt.variables );
									//nj( this ).Dia().hide();
									//console.log( nj( e.target ).Dia().opt.variables.calendar.buildEventFromDialog( true ) );
									nj( e.target ).Dia().opt.variables.calendar.evCal.removeEventById( nj( "#innerId" ).v() )

								}},
							]
					});

					} else {
						this.divEvent.show( {variables: { event: info.event, calendar: this }, onShow: function(){
								//let event = arguments[0].opt.variables.event;
								console.log( this );
								arguments[0].opt.variables.calendar.fillEditDialogForEdit( arguments[0].opt.variables, arguments[0] )
							},
						buttons: [
								{title: "Schließen", action: function( e ) {
									//console.log( nj( this ).Dia().opt.variables.cal.evCal );
									nj( e.target ).Dia().hide();
								}},
								{title: "Anfragen", action: function( e ) {
									nj( this ).gRO().evRequest.show();
								}}
							]
					});

					}
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
			data.command = "showParticipants";
			data.pVar = this.opt.pVar;
			data.event_id = info.event.extendedProps.id;
			console.log( info.jsEvent.screenX, info.jsEvent.screenY );
			data.x = info.jsEvent.screenX;
			data.y = info.jsEvent.screenY;
			//console.log( info.jsEvent );
			nj().fetchPostNew("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );
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
			console.log( "onEventResize", info, this.opt );
			if( !this.opt.type ) {
				this.evCal.removeEventById( info.event.id );
				this.evCal.addEvent( info.oldEvent );
				return;
			}
			this.evCal.removeEventById( info.event.id );
			this.evCal.addEvent( info.event );
			this.saveEventByJson( info.event );
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
			if( !this.opt.type ) {
				this.evCal.removeEventById( info.event.id );
				this.evCal.addEvent( info.event );				
			} else {
				//console.log( info );
				//this.saveEventByJson( this.evCal.getEventById(info.event) );
			}
		}
		/**
		 * removeEvent
		 * 
		 * function 
		 * 
		 * remove all events from calendar
		 * 
		 * return undefined
		 * 
		*/
		removeEvent = function( innerId ) {
			this.evCal.removeEventById( innerId );	
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
				this.evCal.removeEventById( this.evCal.getEvents()[0].id)
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
}	
