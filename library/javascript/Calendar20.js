const NOT_TRACK_ACTIONS = "showParticipants";
const DIV_EVENT_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"><input type="datetime-local" id="evDateTime" value=""></div>';
const DIV_EVENT_NEW_HTML = '<div><label>[evId]</label><label>Titel</label><input id="evTitle" value="[evTitle]"></div>';
const DIV_EXPORT = `<div style="display: flex;">
        <div>
            <label>System</label>
            <select id="system">
                <option value="Windows" selected>Windows/macOS/Android/iOS</option>
                <!--
                <option value="csv">Google Kalender</option>
                -->
            </select>
        </div>
        <div>
            <label>Typ</label>
            <select id="Type">
                <option value="PRIVATE" selected>Privat</option>
                <option value="PUBLIC">öffentlich</option>
            </select>
        </div>
    </div>
    <label>Art (Mehrfachauswahl möglich)</label>
    <select id="exportArt"  multiple>
    </select>
    <label>eigene Termine</label>
    <select id="own_evs">
        <option value="all" selected>Alle</option>
        <option value="own_evs">nur mit eigener Teilnahme</option>
    </select>
    <label>Zeitraum</label>
    <select id="Zeitraum">
        <option value="all" selected>Alle</option>
        <option value="currWeek">aktuelle Woche</option>
        <option value="nextWeek">nächste Woche</option>
        <option value="currMonth">aktueller Monat</option>
        <option value="nextMonth">nächster Monat</option>
    </select>   
    <div style="display: flex;">
        <div>
        <label>Erinnerung</label>
        <select id="Erinnerung">
            <option value="" selected>keine</option>
            <option value="AUDIO">Alarm</option>
            <option value="DISPLAY">Fenster</option>
            <option value="EMAIL">E-Mail</option>
        </select>
        </div>
        <div>
        <label>Erinnerungszeit</label>
        <select id="Erinnerungsintervall">
            <option value="" selected>keine</option>
            <option value="-PT10M">10 Minuten vorher</option>
            <option value="-PT60M">1 Stunde vorher</option>
            <option value="-PT1D">1 Tag vorher</option>
            <option value="-PT7D">1 Woche vorher</option>
        </select>
        </div>
    </div>
    <div style="text-align: right; margin-top: 1em;">
        <a id="exportLink" href="#" style="display: none;">Datei herunterladen</a>
    </div>
    <div style="text-align: right; margin-top: 1em;">
        <a id="emailLink" href="#" style="display: none;">Datei als E-Mail senden</a>
    </div>
`;
const MAX_FILESIZE_APENDIX = 5000000;
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

	    		displayEventEnd: true,

	    		dayMaxEvents: 3,

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
		            	nj( info.dayEl ).Dia().onDateClickWithShift( info );	
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
		        },
				

		        eventDragStart: function( info ) {
		        	nj( info.jsEvent.target ).Dia().onEventDragStart( info );
		        },
		        eventDragStop: function( info ) {
		        	nj( info.jsEvent.target ).Dia().onEventDragStop( info );
		        },

		        eventDrop: function( info ) {
		        	if( nj( info.jsEvent.target ).gRO().opt.type ) {
		        		data = {};
		        		data.command = "changeDateTime";
		        		data.pVar = window[ nj( "body" ).ds( "dvar" ) ].opt.pVar;
		        		data.eventId = info.event.extendedProps.id;
		        		data.startDate = info.event.start.getMySQLDateString();
		        		data.startTime = info.event.start.getMySQLDateString( true ).split( " " )[1];
		        		data.endDate = info.event.end.getMySQLDateString();
		        		data.endTime = info.event.end.getMySQLDateString( true ).split( " " )[1];
		        		if( data.endTime === "00:20" ) data.endTime = "00:00"
		        		console.log(  data );
	                    nj().post("library/php/ajax_calendar_evcal.php", data, window[ nj( "body" ).ds( "dvar" ) ].evaluateCalData );
		        	}
		        	
		        },

		        select: function( info ) {
		            // body...
		            console.log( info );
		        },


			});
			let appendixHasChanged = false;
			nj( "body" ).sDs( "dvar", this.opt.pVar );
			this.divEvent = new DialogDR( 
				{ 
					dVar: this.opt.pVar +  ".divEvent", 
					id: "#editEvent", 
					height: this.opt.divEvHeight, 
					width: this.opt.divEvWidth, 
					autoOpen: false, 
					modal: false, 
					hasClose: false, 
					hasHelp: true, 
					width: 320, 
					afterShow: function(){ nj( this.id).Dia().options('center')} 
				} );
			this.dPartic = new DialogDR( { dVar: this.opt.pVar + ".dPartic", id: "#dPartic", modal: false, variables: {calendar: this }, onShow: function() {
				nj("#dPartic_box div" ).on( "mouseleave", function(e){ 
					e.stopImmediatePropagation();
					nj("#" + this.id ).Dia().hide();
				} );
				}
			 	/* onShow: function(){ nj( this.id).Dia().options('center') }*/ 
			} );
			this.showPart = new DialogDR( { dVar: this.opt.pVar +  ".showPart", id: "#showPart", height: this.opt.divEvHeight, width: this.opt.divEvWidth, autoOpen: false, modal: true, hasHelp: false } );
			this.exportEv =  new DialogDR( 
				{ 
					dVar: this.opt.pVar +  ".exportEv", 
					id: "#exportEv", 
					innerHTML: DIV_EXPORT, 
					height: this.opt.divEvHeight, 
					width: this.opt.divEvWidth, 
					autoOpen: false, 
					modal: true, 
					hasHelp: false, 
					buttons: [
							{
								title: "Exportieren",
								action: function() {
									nj( this ).gRO().exportEvents()
								}
							},
							{
								title: "Schließen",
								action: function() {
									nj( this ).gRO().exportEv.hide();	
								}
							}
						]
				} );
			this.dAppendixNames = new DialogDR(
		    {
		        dVar: this.opt.pVar +  ".dAppendixNames",
		        id: "#dAppendixNames",
		        onShow: function( args ) {
		        	nj( "#dAppendixNames" ).htm( "" );
		            let l = nj().els( "#editAppendix" ).children.length;
		            let i = 0, el, eldiv,tmp,aNames = "";
		            while ( i < l ) {
		                tmp = nj().els( "#editAppendix" ).children[i].getAttribute("href");
		                eldiv = nj().cEl( "div" );
		                eldiv.id = "div_appendix_link_" + i;
		                nj( "#dAppendixNames" ).aCh( eldiv );
		                el = nj().cEl( "a" );
		                el.id = "appendix_link_" + i;
		                nj( "#div_appendix_link_" + i  ).aCh( el );
		                nj( "#" + el.id ).atr( "href", tmp );
		                nj( "#" + el.id ).atr( "target", "_blank" );
		                nj( "#" + el.id ).txt( "Anhang " + ( i + 1 ) + "." + getFileExtAndName( tmp ).Ext );
		                aNames += "Anhang " + ( i + 1 ) + "|";
		                el = nj().cEl( "input" );
		                el.id = "appendix_name_" + i;
		                nj( "#div_appendix_link_" + i ).aCh( el );
		                nj( "#appendix_name_" + i ).atr( "type", "text" );
		                nj( "#appendix_name_" + i ).atr( "maxlength", "29" );
		                nj( "#appendix_name_" + i ).v( "Anhang " + ( i + 1 ) );
		                nj( "#appendix_name_" + i ).on( "blur", function() {
		                	if( nj( this ).v() === "" ) {
		                		nj( this ).v( "Anhang " + ( parseInt( getIdAndName( this.id ).Id ) + 1 ) );
		                		nj( this ).s();
		                		dMNew.show({title: "Fehler", type: false, text: "Der Anhangtext kann nicht leer sein."})
		                	}
		                });
		                i += 1;
		            }
		            nj( "#appendixNames").v( aNames.substring( 0, aNames.length - 1 ) );
		        }
		    });
			if( !this.opt.type ) {
				this.evRequest = new DialogDR( 
					{ 
						dVar: this.opt.pVar +  ".evRequest", 
						id: "#evRequest",
						title: "Anfrage", 
						height: 300 , 
						autoOpen: false, 
						modal: true, 
						hasHelp: false, 
						width: 320,
						innerHTML: '<div id="evRequest"><label>Anfrage</label><textarea id="contentRequest"></textarea></div>',
						buttons: [
							{
								title: "Anfragen",
								action: function( args ) {
									nj( this ).gRO().sendEvRequest();	
									nj( this ).gRO().evRequest.hide();	
								}
							},
							{
								title: "Schließen",
								action: function( args ) {
									nj( this ).gRO().evRequest.hide();	
								}
							},

					] 
				} );
			}
			nj( "#exportEvents" ).sDs( "dvar", this.opt.pVar );
			nj( "#exportEvents" ).on( "click", function( pVar) {
				//console.log(  );
				nj( this ).Dia().exportEv.show();	
			});
			this.evCal.setOption( "datesSet", function ( info ) {
		        window[ nj( "body" ).ds("dvar") ].removeAllEventsFromView();
		        window[ nj( "body" ).ds("dvar") ].getDaysForView( info );
    		});

		}
		// end constructor
		// variables declaration
		appendixHasChanged = false;
		// end variables declaration

		// start functions
		uploadAppendixFile = async function ( path, el, id ) {
		    let formData = new FormData();
		    formData.append( "id", id );
		    let l = el.length;
		    let i = 0;
		    while ( i < l ) {
		        formData.append(`file_${i}`, el[i] );
		        i += 1;
		    }
		    
		    await fetch( path , {
		      method: "POST", 
		      body: formData
		    })
		  .then( data => { 
		    let tmp = "";
		    console.log( el.length );
		    if( id === "new") {
		        l = el.length;

		        i = 0;
		        while ( i < l ) {
		            tmp += "<a href='library/cal/cal_new_" + currentUserId + "_" + i + "." + getFileExtAndName(el[i].name).Ext + "' target='_blank'>Anhang " + ( i + 1 ) + "</a>&nbsp;&nbsp;"
		            i += 1;
		        }
		        nj( "#loadAppendix" ).v( null );
		        nj( "#editAppendix" ).htm( tmp );
		        this.dAppendixNames.show({buttons: [
		        		{
		        			title: "Speichern",
		        			action: function() {
		        				let els = nj().els( "input[id^=appendix_name_]" );		        				
		        				let l = els.length;
		        				let i = 0, aNames = "";
		        				while ( i < l ) {
		        					aNames += nj( els[i] ).v() + "|";
		        					nj().els("div[id=editAppendix]>a:nth-child(" + ( i + 1 ) + ")")[0].innerHTML = nj( els[i] ).v();
		        					i += 1;
		        				}
		        				nj( "#appendixNames" ).v( aNames.substring( 0, aNames.length - 1 ) );
		        				nj( this ).Dia().hide();
		        			}
		        		},
		        		{
		        			title: "Abbrechen",
		        			action: function() {
		        				nj( this ).Dia().hide();
		        			}
		        		}
		        	],
		        });
		    }
		  } )
		  .catch( data => { 
		    console.log(data);
		    })   
		}
		uploadAppendix = function(evt) {
			console.log( nj().els("#loadAppendix").files );
		    let files = evt.files;
		    console.log( this );
		    let l = files.length;
		    if( l > 3 ) {
		        dMNew.show( { title:"Fehler", type: false, text: "Es können maximal 3 Dateien übertragen werden. Beschränke deine Auswahl."} );
		        nj( "#loadAppendix" ).v( null );
		        return;        
		    }
		    let i = 0;
		    while ( i < l ) {
		        if( files[i].size > MAX_FILESIZE_APENDIX ) {
		            dMNew.show( { title:"Fehler", type: false, text: "Der Upload kann nicht durchgeführt werden, da mindestens eine Datei größer als 5MB ist."} );
		            nj( "#loadAppendix" ).v( null );
		            return;
		        }
		        i += 1;
		    }
		    this.uploadAppendixFile("library/php/upload_calendar20_apendix.php", files, nj( "#Id" ).v())
		}
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
		        case "saveEventByJson":
	        		if( jsonobject.success ) {
	        			dMNew.show( {title:"Termin anlegen", type: true, text: jsonobject.message } );
	        			calendar.refreshView();
	        		} else {
	        			dMNew.show( {title:"Fehler", type: false, text: jsonobject.message } );
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
						if( jsonobject.success ) {
							if( jsonobject.elId === "participate" && jsonobject.participate === "1" ) {
								if( nj( "#groupId" ).v() !== "0" ) jsonobject.message += " Bei diesem Termin handelt es sich um einen Serientermin. Du musst deine Teilnahme für jeden Termin einzeln setzen."
								dMNew.show( {title:"Teilnahme", type: jsonobject.success, text: jsonobject.message, variables: {calendar: calendar }, buttons: [
									{
										title: "Okay",
										action: function() {
											dMNew.hide();
										}
									},
									{
										title: "Beenden",
										action: function() {
											nj(this).Dia().opt.variables.calendar.divEvent.hide();
											dMNew.hide();
										}
									}
								] } );
							}
							if( jsonobject.elId === "participate" && jsonobject.participate === "" ) {
								dMNew.show( {title:"Teilnahme", type: jsonobject.success, text: jsonobject.message, variables: {calendar: calendar }, buttons: [
									{
										title: "Okay",
										action: function() {
											dMNew.hide();
										}
									},
									{
										title: "Beenden",
										action: function() {
											nj(this).Dia().opt.variables.calendar.divEvent.hide();
											dMNew.hide();
										}
									}
								] } );
							}
							if( jsonobject.elId === "remindMe" && jsonobject.participate === "1" && jsonobject.remindMe === "1" ) {
								dMNew.show( {title:"Teilnahme", type: jsonobject.success, text: "Die Erinnerung wurde erfolgreich gespeichert.", variables: {calendar: calendar }, buttons: [
									{
										title: "Okay",
										action: function() {
											dMNew.hide();
										}
									},
									{
										title: "Beenden",
										action: function() {
											nj(this).Dia().opt.variables.calendar.divEvent.hide();
											dMNew.hide();
										}
									}
								] } );
							}
							if( jsonobject.elId === "remindMe" && jsonobject.participate === "1" && jsonobject.remindMe === "" ) {
								dMNew.show( {title:"Teilnahme", type: jsonobject.success, text: "Die Erinnerung wurde erfolgreich gelöscht.", variables: {calendar: calendar }, buttons: [
									{
										title: "Okay",
										action: function() {
											dMNew.hide();
										}
									},
									{
										title: "Beenden",
										action: function() {
											nj(this).Dia().opt.variables.calendar.divEvent.hide();
											dMNew.hide();
										}
									}
								] } );
							}
							calendar.evCal.removeEventById( nj("#innerId").v() );
							calendar.addEvent( calendar.buildEventFromDialog() );
						} else {
							dMNew.show({title:"Fehler", type: false, text: jsonobject.message })
						}
					break; 
				case "removeEvent":
						if( jsonobject.success ) {
							if( jsonobject.mailSuccess ) {
								tmp = "Der Termin wurde erfolgreich gelöscht und die Teilnehmer sind erfolgreich darüber informiert worden."
							} else {
								tmp = "Der Termin wurde erfolgreich gelöscht. Allerdings sind beim Benachrichtigen der Nutzer Fehler aufgetreten."
							}
							dMNew.show({title: "Termin löschen", type: true, text: tmp, variables: { calendar: calendar, innerId: jsonobject.innerId, deleteSerie: jsonobject.deleteSerie}, buttons: [{
								title: "Okay",
								action: function() {
									nj( this ).Dia().opt.variables.calendar.divEvent.hide();
									dMNew.hide();	
									if( nj( this ).Dia().opt.variables.deleteSerie === "" ) {
										nj( this ).Dia().opt.variables.calendar.evCal.removeEventById( nj( this ).Dia().opt.variables.innerId );
									} else {
										nj( this ).Dia().opt.variables.calendar.refreshView();
										//location.reload();
									}							
								}
							}]});
						} else {
							dMNew.show( {title: "Termin löschen", type: false, text: jsonobject.message } );
						}
					break;
				case "exportEvents":
   						if( jsonobject.success ) {
                        //showNewMessage("Exportieren", jsonobject.success, "Klicke nun auf den Link “Datei herunterladen”, um deine Termine zu exportieren." );    
	                        dMNew.show( { title: "Exportieren", type: jsonobject.success, text: "Klicke nun auf den Link “Datei herunterladen”, um deine Termine zu exportieren oder auf “E-Mail senden”, um dir deine Termine per EMail zuzusenden." } );
	                        nj( "#exportLink" ).atr( "href", "library/php/" + jsonobject.fileName );
	                        nj( "#exportLink" ).sty( "display", "block" );
	                        nj( "#emailLink" ).sty( "display", "block" );
	                        nj( "#emailLink" ).on("click", function() {
	                            let data = {};
	                            data.command = "sendEventsEmail";
	                            nj().post("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );
	                        });
	                    } else {
	                        //showNewMessage("Exportieren", jsonobject.success, jsonobject.message );
	                        dMNew.show( { title: "Exportieren", type: jsonobject.success, text: jsonobject.message } );
	                    }

					break;
				case "changeDateTime":
   						if( !jsonobject.success ) {
	                        dMNew.show( { title: "Fehler", type: false, text: jsonobject.message } );
	                        calendar.refreshView();
	                    }

					break;
			        case "usePattern":
			                if( jsonobject.success ) {
			                    nj( "#title" ).v( jsonobject.data[0].title );    
			                    nj( "#creator" ).v( jsonobject.data[0].creator );
			                    let tmpDate = new Date( nj( "#startDate" ).v() );
			                    nj( "#endDate" ).v( tmpDate.addDays( parseInt( jsonobject.data[0].day_diff ) ).getMySQLDateString() );
			                    if( jsonobject.data[0].deadline_diff != "0" ) {
			                        nj( "#deadline" ).v( tmpDate.addDays( parseInt( jsonobject.data[0].deadline_diff ) ).getMySQLDateString() );
			                    }
			                    nj( "#startHour" ).v( jsonobject.data[0].start_time.split(":")[0] );                    
			                    nj( "#valStartMinutes" ).v( jsonobject.data[0].start_time.split(":")[1] );                    
			                    nj( "#endHour" ).v( jsonobject.data[0].end_time.split(":")[0] );                    
			                    nj( "#valEndMinutes" ).v( jsonobject.data[0].end_time.split(":")[1] );                    

			                    nj( "#Description" ).v( jsonobject.data[0].description );                    
			                    nj( "#informRole" ).v( jsonobject.data[0].inform_role );                    
			                    nj( "#place" ).v( jsonobject.data[0].place );
			                    nj( "#category" ).v( jsonobject.data[0].class );
			                    nj( "#innerUrl" ).v( jsonobject.data[0].url_landing_page );
			                    nj( "#innerUrlText" ).v( jsonobject.data[0].url_text );
			                } else {
				                dMNew.show( { title: "Fehler", type: false, text: jsonobject.message } );
			                }
			        break;
			}
			tmp = NOT_TRACK_ACTIONS.split( "," );
			if( tmp.indexOf( jsonobject.command ) === -1 ) {
				tmp = jsonobject.command;
				data = {};
				data.command = "trackAction";
				data.trackingPage = currentTrackId;
				data.pathname = window.location.pathname.substr( 1, window.location.pathname.length - 1 );
				data.action = tmp;
				nj().post("library/php/ajax_request.php", data, evaluateTracking );				
			}
		}
		/**
		 * exportEvents
		 * 
		 * export events for selected settings
		 *
		 * 
		 * return undefined
		 * 
		*/
		exportEvents = function() {
		    let data = {};
		    data.command = "exportEvents";
		    data.system = nj( "#system" ).v();
		    data.type = nj( "#Type" ).v();
		    data.art = nj( "#Art" ).gSV();
		    data.ownEvs = nj( "#own_evs" ).v();
		    data.zeitraum = nj( "#Zeitraum" ).v();
		    data.reminder = nj( "#Erinnerung" ).v();
		    data.reminder_intervall = nj( "#Erinnerungsintervall" ).v();
		    nj().post("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );
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
			if( nj( "#innerId" ).v() !== "" && widthInnerId ) ev.id = nj( "#innerId" ).v();
			if( display ) ev.display = "auto";
			if( ressources ) ev.resourceIds = [];
			if( nj( "#innerId" ).v() !== "" && widthInnerId ) ev.id = nj( "#innerId" ).v();
			ev.allDay = nj( "#allDay" ).chk();
			if( ev.allDay ) {
				ev.start = nj( "#startDate" ).v() + "T00:00";
			} else {
				ev.start = nj( "#startDate" ).v() + "T" + nj( "#startHour" ).v() + ":" + nj( "#valStartMinutes" ).v() ;	
			}
			//if( !ev.allDay ) 
			ev.end = nj( "#endDate" ).v() + "T" + nj( "#endHour" ).v() + ":" + nj( "#valEndMinutes" ).v();
			ev.title = nj( "#title" ).v();
			ev.titleHTML = "";
			ev.extendedProps.id = nj( "#Id" ).v();;
			ev.extendedProps.groupId = nj( "#groupId" ).v();;
			ev.extendedProps.place = nj( "#place" ).v();;
			ev.extendedProps.class = "fc-" + nj( "#category" ).v();;
			ev.extendedProps.creator = nj( "#creator" ).v();;
			ev.extendedProps.registration_deadline = nj( "#deadline" ).v();
			ev.extendedProps.repeat = nj( "#repeat" ).v();
			ev.extendedProps.repeatTo = nj( "#repeatTo" ).v();
			ev.extendedProps.participate = nj( "#participate" ).chk();
			ev.extendedProps.participateAs = nj( "#participateAs" ).v();
			ev.extendedProps.remindMe = nj( "#remindMe" ).chk();
			ev.extendedProps.countPart = nj( "#countPart" ).v();
			ev.extendedProps.url = nj( "#Url" ).v();
			ev.extendedProps.appendixNames = nj( "#appendixNames" ).v();
			ev.extendedProps.inner_url = nj( "#innerUrl" ).v();
			ev.extendedProps.inner_url_text = nj( "#innerUrlText" ).v();
			ev.extendedProps.description = nj( "#Description" ).v();
			ev.extendedProps.notice = nj( "#Notice" ).v();
			ev.extendedProps.appendix = "";
			let appendix = nj().els( "#editAppendix a" );
			let l = appendix.length;
			let i = 0;
			while ( i < l ) {
				ev.extendedProps.appendix += appendix[i].getAttribute( "href" ) + "|";
				i += 1;
			}
			if( ev.extendedProps.appendix.length > 0 ) {
				ev.extendedProps.appendix = ev.extendedProps.appendix.substring(0, ev.extendedProps.appendix.length - 1 );
			}
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
		 * checkValidity
		 * 
		 * checks an event of validity
		 * 
		 * return object res 		res.success
		 *							res.message 
		 *					 
		*/
		checkValidity = function( event ) {
			let res = {};
			res.success = true;
			res.message = "";
			if( event.title === "" ) {
				res.success = false;
				res.message += "Der Titel darf nicht leer sein. ";				
			}
			if( event.Description === "" ) {
				res.success = false;
				res.message += "Die Beschreibung darf nicht leer sein. ";				
			}
			if( new Date( event.startDate + " " + event.startTime ) <= new Date() ) {
				res.success = false;
				res.message += "Das Startdatum/-zeit muss größer als heute sein. ";				
			}
			if( new Date( event.endDate + " " + event.endTime ) < new Date( event.startDate + " " + event.startTime ) ) {
				res.success = false;
				res.message += "Das Enddatum/-zeit muss größer als das Startdatum/-zeit sein. ";				
			}
			return res;
		}
		/**
		 * saveEventByJson
		 * 
		 * save JSON event to database
		 * 
		 * return result
		 * 
		*/
		saveEventByJson = function( event, saveSerieEvent = false ) {
			let res = this.checkValidity( event );;
			console.log( event, res );
			data = {};
			data.command = "saveEventByJson";
			data.pVar = this.opt.pVar;
			data.event = JSON.stringify( event );
			data.saveSerieEvent = saveSerieEvent;
			nj().post("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );   

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
				nj( "#groupId" ).v( 0 )
				nj( "#usePattern" ).v( "0" )
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
			if( new Date() > new Date( nj( "#deadline" ).v() ).addDays( 1 ) ) {
				dMNew.show( {title: "Fehler", type: false, text: "Eine Anmeldung ist nicht mehr möglich, da der Anmeldeschluss überschritten ist." } );
				return;
			}
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
			nj( dialog.opt.id ).rCl( "cEditable" );
			if( data.event.date < new Date() ) {			
				nj().els( dialog.opt.id + "_box div.d_HLTitle")[0].innerHTML = "Neuer Termin (gesperrt)";
				this.setEventNewValues( true, data.event );
				nj( "#startDate" ).v( "" );
				nj( "#endDate" ).v( "" );
				nj( "#startHour").v( "00" );
				nj( "#valStartMinutes").v( "00" );
				nj( "#endHour").v( "00" );
				nj( "#valEndMinutes").v( "00" );
				nj( "#deadline" ).v( "" );
				nj( "#repeat").v( 0 );
				nj( "#repeatTo").v( "0000-00-00" );
				nj( "#participateAs" ).v( 0 );
				nj( "#remindMe" ).chk( false );
				nj( "#countPart" ).v( "1" );
				dialog.options( "buttons", [{title: "Schließen", action: function( e ) {
					nj( e.target ).Dia().hide();	
				} }] );
			} else {
				nj().els( dialog.opt.id + "_box div.d_HLTitle")[0].innerHTML = "Neuer Termin";
				let event = data.event;
				this.setEventNewValues( false, data.event );
				let tmpDateTime = event.dateStr.split( "T" );
				let endDate = event.dateStr.split( "T" );
				//let endDate = new Date(  tmpDateTime[0] )
				if( event.allDay ) {
					//endDate = endDate.addDays( 1 );
				} else {
				}
				let hour_minutes = tmpDateTime[1].split( ":" );
				nj( "#startDate" ).v( tmpDateTime[0] );
				nj( "#endDate" ).v( endDate[0] );
				nj( "#startHour").v( hour_minutes[0] );
				nj( "#valStartMinutes").v( hour_minutes[1] );
				if( hour_minutes[0] !== "00" ) hour_minutes[0] = "0" + (parseInt( hour_minutes[0] ) + 1);
				if( hour_minutes[0].length === 3 ) hour_minutes[0] = hour_minutes[0].substring(1);
				nj( "#endHour").v( hour_minutes[0] );
				nj( "#valEndMinutes").v( hour_minutes[1] );
				nj( "#deadline" ).v( "0000-00-00" );
				nj( "#repeat").v( 0 );
				nj( "#repeatTo").v( "0000-00-00" );
				nj( "#participateAs" ).v( 0 );
				nj( "#participate" ).chk( false );
				nj( "#remindMe" ).chk( false );
				nj( "#countPart" ).v( "1" );
				nj( "#Description").v( "" );
				nj( "#notice").v( "" );
				nj( "#Url").v( "" );
				nj( "#appendixNames" ).v( "" );
				nj( "#editAppendix" ).htm( "" );
				nj( "#innerUrl").v( "" );
				nj( "#innerUrlText").v( "" );
				nj( "#buttPart" ).v( "Teilnehmen" );
				nj( "#buttPart" ).aCl( "buttActive" );
				nj( "#buttPart" ).rCl( "buttInactive" );
				dialog.options( "buttons", [
				{
					title: "Speichern", action: function( e ) {
						nj( e.target ).Dia().opt.variables.calendar.saveEventByJson( nj( e.target ).Dia().opt.variables.calendar.buildEventFromDialog( true ) );						nj( e.target ).Dia().hide();	
					} 
				},				
				{
					title: "Schließen", action: function( e ) {
						e.stopImmediatePropagation();
						nj( e.target ).Dia().hide();
						if( nj("#Id").v() === "new" ) {
							nj( this ).gRO().deleteAppendix();
						}	
					} 
				},

				] );				
			}
		}
		fillEditDialogForEdit = function( data, dialog ) {
			let tmp, app, event = data.event;
			if( data.event.start < new Date() ) {			
				nj().els( dialog.opt.id + "_box div.d_HLTitle")[0].innerHTML = "Termin bearbeiten (gesperrt)";
				dialog.options( "buttons", [{title: "Schließen", action: function( e ) {
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
			nj( "#deadline" ).v( event.extendedProps.registration_deadline );
			nj( "#participate" ).chk( event.extendedProps.participate );
			if( event.extendedProps.participate ) {
				nj( "#buttPart" ).rCl( "buttActive" );
				nj( "#buttPart" ).aCl( "buttInactive" );
				nj( "#buttPart" ).v( "Absagen" );
			} else {
				nj( "#buttPart" ).rCl( "buttInactive" );
				nj( "#buttPart" ).aCl( "buttActive" );
				nj( "#buttPart" ).v( "Teilnehmen" );
			}
			nj( "#participateAs" ).v( event.extendedProps.participateAs );
			nj( "#remindMe" ).chk( event.extendedProps.remindMe );
			if( event.extendedProps.remindMe ) {
				nj( "#buttRemindMe" ).rCl( "buttActive" );
				nj( "#buttRemindMe" ).aCl( "buttInactive" );
				nj( "#buttRemindMe" ).v( "Er. löschen" );
			} else {
				nj( "#buttRemindMe" ).rCl( "buttInactive" );
				nj( "#buttRemindMe" ).aCl( "buttActive" );
				nj( "#buttRemindMe" ).v( "Erinnern" );
			}
			nj( "#countPart" ).v( event.extendedProps.countPart );
			nj( "#Description").v( event.extendedProps.description );
			nj( "#notice").v( event.extendedProps.notice );
			nj( "#Url").v( event.extendedProps.url );
			nj( "#appendixNames" ).v( event.extendedProps.appendixNames );
			nj( "#innerUrl").v( event.extendedProps.inner_url );
			nj( "#innerUrlText").v( event.extendedProps.inner_url_text );
			// set print part
			let href = "calendar20_showPart.php?cal=" + nj( "#Id" ).v();
			nj( "#printPart" ).atr( "href", href );
			// set headlines for paragraphs noedit
			if( !this.opt.type ) {
				nj( "label[for=usual1]").txt("Details");
				nj( "label[for=usual3]").txt("Anmeldung");
				nj( "label[for=usual5]").txt("Inhalt");
				}
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
				nj( "#editAppendix" ).htm( tmp );
			}
			if( new Date() < new Date( nj( "#startDate" ).v() ) ) {
				nj( "#editEvent input[type=checkbox], #editEvent input[type=button], #participateAs, #countPart").rAt( "disabled" );
			} else {
				nj( "#editEvent input[type=checkbox], #editEvent input[type=button], #participateAs, #countPart").atr( "disabled", true );
			}
			if( new Date() > new Date( nj( "#deadline" ).v() ) ) {
				nj( "#editEvent input[type=checkbox], #participateAs, #countPart").atr( "disabled", true );
			}
			// additional Text for cNotEditable
			nj().els( "#dateTextDiv" ).innerHTML = "beginnt am " + new Date( nj( "#startDate" ).v() ).getGermanDateString() + " um " + nj( "#startHour" ).v() + ":" + nj( "#valStartMinutes" ).v() + " Uhr und endet am " + new Date( nj( "#endDate" ).v() ).getGermanDateString() + " um " + nj( "#endHour" ).v() + ":" + nj( "#valEndMinutes" ).v() + " Uhr";
			if( event.extendedProps.registration_deadline !== "0000-00-00" ) {
				nj().els( "#deadlineTextDiv" ).innerHTML = "Anmeldeschluss: " + new Date( event.extendedProps.registration_deadline ).getGermanDateString()
			}
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
			data.pVar = this.opt.pVar;
			data.startDate = info.startStr.replace( "T", " " );
			data.endDate = info.endStr.replace( "T", " " );
			data.userId = this.opt.currentUserId;
			data.isFetch = true;
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
		}
		/**
		 * onDateClick
		 * 
		 * date click event
		 * 
		 * info 			info var 	info var from EventCalendar
		 * 
		 * return undefined
		 * 
		*/
		onDateClick = function( info ) {
			if( this.opt.type !== true ) return;
			this.divEvent.show( {variables: { event: info, calendar: this }, onShow: function(){
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
						console.log( this );
			if( info.jsEvent.altKey ) {
				dMNew.show({ title: "Termin löschen", type: "question", text: "Willst Du diesen Termin löschen?", width: 220, buttons: [ { title: "Ja", action: function () {dMNew.hide();} }, { title: "Nein", action: function () {dMNew.hide();} } ] } );
			} else {
				if( info.jsEvent.shiftKey ) {
					// show appendix
					window.open( info.event.extendedProps.inner_url, "_blank" );
				} else {
					if( this.opt.type ) {
						nj( "#editEvent" ).aCl( "cEditable" );
						nj( "#editEvent" ).rCl( "cNotEditable" );
						this.divEvent.show( {variables: { event: info.event, calendar: this }, onShow: function(){
								arguments[0].opt.variables.calendar.fillEditDialogForEdit( arguments[0].opt.variables, arguments[0] )
							},
						buttons: [
								{title: "Speichern", action: function( e ) {
									if( nj("#group_id") !== "0" ) {
										dMNew({title: "Serientermin", type: "question", text: "Was willst du speichern?", variables: {calendar: nj( e.target ).Dia().opt.variables.calendar }, buttons: [
												{
													title: "Serientermin",
													action: function( args ) {
													}
												}
											]})
									} else {
										nj( e.target ).Dia().opt.variables.calendar.saveEventByJson( nj( e.target ).Dia().opt.variables.calendar.buildEventFromDialog( true ) );
									}
								}},
								{title: "Löschen", action: function( e ) {
									if( nj( "#groupId" ).v() === "0") {
										nj( e.target ).gRO().removeEvent( false );
									} else {
										dMNew.show( { 
											title: "Termin löschen", 
											type: "question", 
											text: "Bei diesem Termin handelt es sich um einen Serientermin. Was möchtest du löschen",
											variables: { calendar: nj( e.target ).Dia().opt.variables.calendar },
											buttons: [
													{
														title: "Einzeltermin",
														action: function() {
															nj( this ).Dia().opt.variables.calendar.removeEv( false );
														}
													},
													{
														title: "Serie",
														action: function() {
															nj( this ).Dia().opt.variables.calendar.removeEv( true );
														}
													}
								
												]
										})
									}

								}},
								{title: "Abbrechen", action: function( e ) {
									nj( e.target ).Dia().hide();
								}},
							]
					});

					} else {
						nj( "#editEvent" ).rCl( "cEditable" );
						nj( "#editEvent" ).aCl( "cNotEditable" );
						nj( "#editEvent input:not([type=radio]), #editEvent textarea, #editEvent select" ).atr( "disabled", true );
						this.divEvent.show( {variables: { event: info.event, calendar: this }, onShow: function(){
								arguments[0].opt.variables.calendar.fillEditDialogForEdit( arguments[0].opt.variables, arguments[0] )
							},
						buttons: [
								{title: "Schließen", action: function( e ) {
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
			data.x = info.jsEvent.screenX;
			data.y = info.jsEvent.screenY;
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
			if( !this.opt.type ) {
				this.evCal.removeEventById( info.event.id );
				this.evCal.addEvent( info.oldEvent );
				return;
			} else {
		        		data = {};
		        		data.command = "changeDateTime";
		        		data.pVar = this.opt.pVar;
		        		data.eventId = info.event.extendedProps.id;
		        		data.startDate = info.event.start.getMySQLDateString();
		        		data.startTime = info.event.start.getMySQLDateString( true ).split( " " )[1];
		        		data.endDate = info.event.end.getMySQLDateString();
		        		data.endTime = info.event.end.getMySQLDateString( true ).split( " " )[1];
		        		if( data.endTime === "00:20" ) data.endTime = "00:00"
		        		console.log(  data );
	                    nj().post("library/php/ajax_calendar_evcal.php", data, window[ nj( "body" ).ds( "dvar" ) ].evaluateCalData );

			}
			this.evCal.removeEventById( info.event.id );
			this.evCal.addEvent( info.event );
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
			}
		}
		/**
		 * removeEv
		 * 
		 * function 
		 * 
		 * remove single events from calendar
		 * 
		 * deleteSerie 		bool 	true -> delete serie; false -> delete single
		 * 
		 * return undefined
		 * 
		*/
		removeEv = function( deleteSerie ) {
			data = {};
			data.command = "removeEvent";
			data.pVar = this.opt.pVar;
			data.id = nj( "#Id" ).v();
			data.innerId = nj( "#innerId" ).v();
			data.informRole = nj( "#informRole" ).v();
			data.informUser = nj( "#informUser" ).gSV();
			data.deleteSerie = deleteSerie;
			nj().fetchPostNew("library/php/ajax_calendar_evcal.php", data, this.evaluateCalData );

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
			dMNew.show({title: "Termin löschen", type: "question", text: "Willst du diesen Termin wirklich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.", variables: {calendar: this}, buttons: [
					{
						title: "Ja",
						action: function( args ) {
							nj( this ).Dia().opt.variables.calendar.removeEv( false );
						}
					},
					{
						title: "Nein",
						action: function( args ) {
							dMNew.hide();	
						}

					}
				]});
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
			this.removeAllEventsFromView();
			let tmp = this.evCal.getView();
			let res = {};
			res.startStr = tmp.activeStart.getMySQLDateString( true );
			res.endStr = tmp.activeEnd.getMySQLDateString( true );
			this.getDaysForView( res );
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
		 * initDialogBehavior
		 * 
		 * init the behavior of event elements dialog
		 * 
		 * 
		*/
		initDialogBehavior = function() {
			let v;
			nj( "#loadAppendix" ).on( "change", function( e ) {
				nj(this).gRO().uploadAppendix( nj().els("#loadAppendix") );
			} );
			nj( "#startDate" ).on( "change", function() {
				if( new Date( nj(this).v() ) < new Date() ) {
					dMNew.show( {title: "Fehler", type: false, text: "Das Startdatum kann nicht kleiner als heute sein."} );
					nj(this).v( new Date().addDays( 1 ).getMySQLDateString() );
					v = nj(this).v();
					nj( "#endDate" ).v( v );
				}
			});
			nj( "#endDate" ).on( "change", function() {
				if( new Date( nj(this).v() ) < new Date( nj( "#startDate" ).v() ) ) {
					dMNew.show( {title: "Fehler", type: false, text: "Das Enddatum kann nicht kleiner als heute sein."} );
					v = nj( "#startDate" ).v();
					nj( "#endDate" ).v( v );
				}
			});
			nj( "#deadline" ).on( "change", function() {
				if( new Date( nj(this).v() ) >= new Date( nj( "#startDate" ).v() ) ) {
					dMNew.show( {title: "Fehler", type: false, text: "Der Anmeldeschluss kann nicht größer als das Startdatum sein."} );
					nj( "#deadline" ).v( "0000.00.00" );
				}
			});
			nj( "#repeat" ).on( "change", function( args ) {
				if( this.value === "0" ) {
					nj( "#repeatTo" ).v( "0000-00-00" );
				} else {
					v = new Date( nj( "#startDate" ).v() ).addDays( repeatDateDength ).getMySQLDateString();
					nj( "#repeatTo" ).v( v );
				}
			})
			nj( "#repeatTo" ).on( "change", function() {
				if( new Date( nj(this).v() ) < new Date( nj( "#startDate" ).v() ).addDays( 1 ) ) {
					dMNew.show( {title: "Fehler", type: false, text: "Das Wiederholungsdatum kann nicht kleiner oder gleich als das Startdatum sein."} );
					nj( "#deadline" ).v( "0000.00.00" );
				}
			});
			nj( "#startHour" ).on( "change", function() {
				v = parseInt( nj( "#startHour" ).v() );
				v = "0" + ( v + 1 );
				if( v.length > 2 ) {
					v = v.substring( 1, v.length - 1 );
				}
				if( v === "01" ) v = "00";
				if( v === "24" ) {
					v = "23";
					nj( "#valEndMinutes" ).v( "45" );
				} 
				nj( "#endHour" ).v( v )
			});
			nj( "#valEndMinutes" ).on( "change", function() {
				v = new Date( nj( "#endDate" ).v() + " " + nj( "#endHour" ).v() + ":" + nj( "#valEndMinutes" ).v() );
				console.log( v );
			});
			nj( "#deleteDeadline" ).on( "click", function() {
				nj( "#deadline" ).v( "0000-00-00" );
			});
			nj( "#deadline" ).on( "change", function() {
				if( nj( "#deadline" ).v() === "") {
					nj( "#deadline" ).v( "0000-00-00" );
				}
			});
			nj( "#countPart" ).on( "blur", function() {
				if( parseInt( nj( "#countPart" ).v() ) < 1 || parseInt( nj( "#countPart" ).v() ) > 40 ) {
					dMNew.show( {title: "Fehler", type: false, text: "Der Wert muss zwischen 1 und 40 liegen."} );
					nj( "#countPart" ).v( 1 );
				}
			});
			nj( "#title" ).on( "change", function() {
				if( nj( "#Description" ).v() === "" ) {
					v = nj( "#title" ).v();
					nj( "#Description" ).v( v );
				}
			});
			nj( "#innerUrl" ).on( "change", function() {
				if( nj( "#Description" ).v() === "" ) {
					v = nj( "#title" ).v();
					nj( "#Description" ).v( v );
				}
			});
			// set behavior for participate
			nj( "#participate, #participateAs, #remindMe, #countPart" ).on( "change", function( e ) {
				e.stopImmediatePropagation();
				if( nj( "#Id" ).v() === "new" ) return;
				if( "#" + this.id === "#remindMe" && !nj( "#participate").chk() ) {
					nj( "#remindMe" ).chk( false );
					nj( "#buttRemindMe" ).aCl( "buttActive" );
					nj( "#buttRemindMe" ).rCl( "buttInactive" );
					nj( "#buttRemindMe" ).v( "Erinnern" );
					return;
				}
				nj( this ).gRO().setParticipate( this.id );
			} );
			//
			nj( "#showParticipants" ).on( "click", function( e ) {
				e.stopImmediatePropagation();
				nj( this ).gRO().showDialogParticipate( nj( this ).gRO() );
			});
			nj( "#buttPart" ).on( "click", function() {
				if( new Date() > new Date( nj( "#deadline" ).v() ).addDays( 1 ) ) {
					dMNew.show( {title: "Fehler", type: false, text: "Eine Änderung der Abmeldung ist nicht mehr möglich, da der Anmeldeschluss überschritten ist." } );
				} else {
					if( nj( "#participate" ).chk() ) {
						nj( "#participate" ).chk( false );
						nj( this ).aCl( "buttActive" );
						nj( this ).rCl( "buttInactive" );
						nj( this ).v( "Teilnehmen" );
					} else {
						nj( "#participate" ).chk( true )
						nj( this ).rCl( "buttActive" );
						nj( this ).aCl( "buttInactive" );
						nj( this ).v( "Absagen" );
					}
					nj( "#participate" ).tri( "change" );
				}
			});
			nj( "#buttRemindMe" ).on( "click", function() {
				if( nj( "#remindMe" ).chk() ) {
					nj( "#remindMe" ).chk( false );
					nj( this ).aCl( "buttActive" );
					nj( this ).rCl( "buttInactive" );
					nj( this ).v( "Erinnern" );
				} else {
					nj( "#remindMe" ).chk( true )
					nj( this ).rCl( "buttActive" );
					nj( this ).aCl( "buttInactive" );
					nj( this ).v( "Er. löschen" );
				}
				nj( "#remindMe" ).tri( "change" );
			});
			nj( "#usePattern" ).on( "change", function() {
				console.log( this );
				data.command = "usePattern";
				data.id = nj( "#usePattern" ).v();
				nj().fetchPostNew("library/php/ajax_calendar_evcal.php", data, nj( this ).gRO().evaluateCalData );
			} );
		}
		/**
		 * addEvent
		 * 
		 * add event to view
		 * 
		 * ev 			object 		event object
		 * 
		*/
		addEvent = function(ev) {
			this.evCal.addEvent( ev );
			nj( "#innerId" ).v( this.evCal.getEvents()[this.evCal.getEvents().length - 1].id );
		}
		/**
		 * init
		 * 
		 * init of calendar
		 * 
		 * ev 			object 		event object
		 * 
		*/
		init = function() {
			this.initDialogBehavior();
		    data = {};
		    data.command = "getEventsForView";
		    data.pVar = this.opt.pVar; 
		    data.startDate = this.evCal.view.activeStart.addDays(1).toISOString().split("T")[0];
		    data.endDate = this.evCal.view.activeEnd.addDays(1).toISOString().split("T")[0];
		    data.userId = currentUserId;
		    nj().fetchPostNew("library/php/ajax_calendar_evcal.php", data, cal.evaluateCalData );   
		}

}	
