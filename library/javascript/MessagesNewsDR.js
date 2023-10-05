//javascript
const MESS_NEWS_INNER_HTML = '<div id="[id]_id" style="display: none;"></div><div id="[id]_dsPointer" style="display: none;">0</div><div><select id="[id]_type"><option value="1">Meldungen</option><option value="2">News</option></select></div><div id="[id]_title" style="font-weight: bold"></div><div id="[id]_DivFromRole"><div class="description">von Gruppe</div><div id="[id]_fromRole"></div></div><div id="[id]_DivFromUser"><div class="description">von Nutzer</div><div id="[id]_fromUser"></div></div><div><div class="description">gelesen</div><input type="checkbox" id="[id]_isRead" checked></div><div><div class="description">Datum/Uhrzeit</div><div id="[id]_currDateTime"></div></div><div><div class="message_news_description">Inhalt</div></div><div id="[id]_content"></div>';
const MESS_NEWS_LIST_INNER_HTML = '<div><select id="[id]_typeList"><option value="1" selected>Meldungen</option><option value="2">News</option></select></div><div id="listContent"></div>';
var dialogList, dialogForm;
var evaluateMessNews = function( data ) {
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
    var JO = jsonobject;
    switch( jsonobject.command ) {
        case "init":
            nj( "#" + jsonobject.dVar + "_List_typeList").on( "change", function() {
                console.log( this.value, JO.dVar );
                let d = {};
                d.command = "getList";
                d.type = this.value;
                d.dVar = JO.dVar;
                console.log( d );
                nj().post("library/php/ajax_mess_news.php", d, evaluateMessNews );
            });
            setValueCountMessagesNews( jsonobject.count.countMessages, jsonobject.count.countNews );
        break;
        case "get":
        case "next":
        case "prev":
            let tmpCommand = jsonobject.command;
            fP = "#" + window[ jsonobject.dVar ].opt.fieldPraefix;
            if( jsonobject.data.messageUserId != 0 ) {
                nj( fP + "_id" ).htm( jsonobject.data.messageUserId ); 
                nj( fP + "_type" ).v( jsonobject.data.type );
                nj( fP + "_title" ).htm( jsonobject.data.title );
                if( jsonobject.data.roleName != "&nbsp;" ) {
                    nj( fP + "_fromRole" ).htm( jsonobject.data.roleName );
                    nj( fP + "_DivFromUser" ).sty( "display", "none" );
                    nj( fP + "_DivFromRole" ).sty( "display", "block" );
                }
                if( jsonobject.data.userName != "&nbsp;" ) {
                    nj( fP + "_fromUser" ).htm( jsonobject.data.userName );
                    nj( fP + "_DivFromUser" ).sty( "display", "block" );
                    nj( fP + "_DivFromRole" ).sty( "display", "none" );

                }
                nj( fP + "_content" ).htm( jsonobject.data.content );
                nj( fP + "_currDateTime" ).htm( jsonobject.data.currDateTime );

            } else {
                nj( fP + "_id" ).htm( "&nbsp;" ); 
                nj( fP + "_type" ).v( jsonobject.data.type );
                nj( fP + "_title" ).htm( "&nbsp;" );
                nj( fP + "_DivFromUser" ).sty( "display", "none" );
                nj( fP + "_DivFromRole" ).sty( "display", "none" );
                nj( fP + "_currDateTime" ).htm( "&nbsp;" );
                console.log( jsonobject.data.type );
                if( jsonobject.data.type == 1 ) {
                    nj( fP + "_content" ).htm( "Du hast keine weiteren Meldungen" );
                } else {
                    nj( fP + "_content" ).htm( "Du hast keine weiteren News" );
                }
            }
            setValueCountMessagesNews( jsonobject.count.countMessages, jsonobject.count.countNews );
            if( window[ jsonobject.dVar ].opt.track && tmpCommand != "get") {
                data.command = "setTrackAction";
                data.trackingPage = currentTrackId;
                data.pathname = window.location.pathname.substr( 1, window.location.pathname.length - 1 );
                data.action = tmpCommand + "MessageNews";
                console.log(data)
                nj().post("library/php/ajax_request.php", data, evaluateTracking );
            }
        break;
        case "getList":
            nj( "#listContent").htm( "" );
            let el, cont;
            let l = jsonobject.data.length;
            if( l === 0 ) {
                if( jsonobject.type === "1" ) {
                    nj( "#listContent" ).htm( "<div class='emptyData'>keine Meldungen vorhanden</div>" );
                } else {
                    nj( "#listContent" ).htm( "<div class='emptyData'>keine News vorhanden</div>" );
                }
            } else {
                let i = 0;
                while ( i < l ) {
                    cont = nj().cEl( "div" );
                    nj( cont ).htm( "" );
                    nj( cont ).aCl( "mn_list_container");
                    el = nj().cEl( "div" );
                    nj( el ).htm( jsonobject.data[i].curr_datetime );
                    nj( el ).aCl( "mn_list_datetime");
                    nj( "#listContent").aCh( cont );
                    nj( cont ).aCh( el );                
                    el = nj().cEl( "div" );
                    nj( el ).htm( jsonobject.data[i].fullname );
                    nj( el ).aCl( "mn_list_fullname");
                    nj( cont ).aCh( el );                
                    el = nj().cEl( "div" );
                    nj( el ).htm( jsonobject.data[i].title );
                    nj( el ).aCl( "mn_list_title");
                    nj( cont ).aCh( el );                
                    el = nj().cEl( "div" );
                    nj( el ).htm( jsonobject.data[i].content );
                    nj( el ).aCl( "mn_list_content");
                    nj( cont ).aCh( el );                
                    i += 1;
                }                
            }
        break;
    case "readAll":
            if( jsonobject.success ) {
                console.log( nj( "#count_mess_news" ).htm() );
                let tmp = nj( "#count_mess_news" ).htm().split( "/" );
                if( jsonobject.type == 1 ) {
                    nj( "#count_mess_news" ).htm( "0/" + tmp[1] );    
                    nj( "#listContent" ).htm( "<div class='emptyData'>keine Meldungen vorhanden</div>" );
                } else {
                    nj( "#count_mess_news" ).htm( tmp[0] + "/0" );                        
                    nj( "#listContent" ).htm( "<div class='emptyData'>keine News vorhanden</div>" );
                }
            } else {

            }
        break;
    }
}
var setValueCountMessagesNews = function( cMessages, cNews ) {
    if( isNaN( cMessages + cNews ) ) {
        location.href = "index.php?c=timeout";
    }
    // is inconsistent, ids come from header_intern.inc
    nj( "#count_mess_news, #count_mess_news_small" ).htm( cMessages + "/" + cNews );
}
var initShow = function( dF ) {
    nj( "#" + dF.opt.fieldPraefix + "_type" ).v( 1 );
    data.command = "get";
    data.dVar = dF.opt.dVar;
    data.type = 1;
    nj().post("library/php/ajax_mess_news.php", data, evaluateMessNews );
}
var getContent = function( e ) {
    if( typeof e === "undefined" ) return;
    data.command = "get";
    data.dVar = nj( nj().els( e.target ) ).gRO().opt.dVar;
    data.type = nj( "#" + nj( nj().els( e.target ) ).gRO().opt.fieldPraefix + "_type" ).v();
    nj().post("library/php/ajax_mess_news.php", data, evaluateMessNews );
}
var prevRecord = function( e ) {
    nj( nj().els( e.target )  ).gRO().prev();
}       
var nextRecord = function( e ) {
    nj( nj().els( e.target )  ).gRO().next();
}

class MessagesNewsDR {
    constructor( param ) {
        this.opt = {
            dVar:               undefined, // necessary - must by the name of the object
            id:                 "#mess_news", // necessary - id of dialog; if the element does not exists a new element will be created with this id
            fieldPraefix:       "dMN_", // optional - praefix for all element ids
            classPraefix:       "dMN_", // optional - praefix for all classes
            title:              "Meldungen/News", // dialog title
            height:             400,
            bellElement:        undefined, // necessary - must by the id of the counter (big) / small will be automatically set
            currentRecord:      undefined,
            divVar:             undefined, // new DialogNew({...})
            divVarList:         undefined, // new DialogNew({...})
            addClassFiles:      "messages_news.css dialog.css",
            modal:              false,
            autoOpen:           false,
            onShow:             undefined,
            addClassFiles:      "",
            track:              false, // if is true, ations will be tracked
        }
        Object.assign( this.opt, param );
        if( typeof this.opt.dVar === "undefined" ) {
            throw "Fehler bei der Initialisierung. Der Name des Objekts muss übergeben werden.";
        }
        if( typeof this.opt.bellElement === "undefined" ) {
            throw "Fehler bei der Initialisierung. Die ID des Zählerelements muss übergeben werden.";
        } else {
            nj( this.opt.bellElement ).atr("data-dVar", this.opt.dVar );
            nj( this.opt.bellElement + "_small" ).atr("data-dVar", this.opt.dVar );
        }
        this.opt.divVar = new DialogDR( {
            dVar: this.opt.dVar + ".opt.divVar", 
            id: this.opt.id, 
            title: "Meldungen/News", 
            classPraefix: this.opt.classPraefix,
            fieldPraefix: this.opt.fieldPraefix, 
            modal: this.opt.modal,
            height: this.opt.height, 
            hasHelp: true, 
            innerHTML: MESS_NEWS_INNER_HTML.replaceAll( "[id]", this.opt.fieldPraefix ),  
            addClassFiles: this.opt.addClassFiles, 
            autoOpen: this.opt.autoOpen,
            onShow: this.opt.onShow, 
            buttons: [{
                    title:'<div class="cbLeft iconButtMicro"></div>', 
                    action:function(e){ prevRecord(e);} }
                , { 
                    title:'<div class="cbRight iconButtMicro"></div>', 
                    action:function(e){ nextRecord(e);} }, 
                , {
                    title:'Liste', 
                    action:function(e){ 
                        nj( this ).Dia().hide();
                        nj( this ).gRO().opt.divVarList.show();
                        } 
                    } 
                , {
                    title:'Schließen', 
                    action:function(){ nj( this ).gRO().hide();} } 
                    ] 
            } );
        this.opt.divVarList =new DialogDR({
            dVar: this.opt.dVar + ".opt.divVarList", 
            id: this.opt.id + "_list",
            title: "Meldungen/News",
            width: 320,
            height: 400,
            classPraefix: this.opt.classPraefix + "List",
            fieldPraefix: this.opt.fieldPraefix + "List", 
            innerHTML: MESS_NEWS_LIST_INNER_HTML.replaceAll( "[id]", this.opt.fieldPraefix + "List" ),
            onShow: function() {
//                console.log( "show list", window[ this.dVar.split(".")[0] ].opt.divVarList.opt.fieldPraefix );
                data.command = "getList";
                data.type = 1;
                nj().post("library/php/ajax_mess_news.php", data, evaluateMessNews );
            },
            onHide: function( e ) {
                nj( "#" + window[ this.dVar.split(".")[0] ].opt.divVarList.opt.fieldPraefix + "_typeList" ).v( 1 );   
            },  
            buttons: [{
                    title:'Formular', 
                    action:function(e){ 
                        nj( nj().els( e.target ) ).gRO().opt.divVarList.hide();
                        nj( nj().els( e.target ) ).gRO().opt.divVar.show();

                        } 
                    } 
                , {
                    title:'Gelesen', 
                    action:function(e){
                        data.command = "readAll";
                        data.dVar = nj( nj().els( e.target ) ).gRO().opt.dVar;
                        data.type = nj( "#" + nj( nj().els( e.target ) ).gRO().opt.divVarList.opt.fieldPraefix + "_typeList" ).v();
                        nj().post("library/php/ajax_mess_news.php", data, evaluateMessNews);
                    } 
                }                
                , {
                    title:'Schließen', 
                    action:function(e){
                        nj( nj().els( e.target ) ).gRO().opt.divVarList.hide();
                    } 
                } ]

        });
        nj( this.opt.bellElement ).on( "click", function( args ) {
                window[ nj( this ).atr("data-dVar") ].show();
            } );
        nj( this.opt.bellElement + "_small" ).on( "click", function( args ) {
                window[ nj( this ).atr("data-dVar") ].show();
            } );
        nj( "#" + this.opt.fieldPraefix + "_type" ).on( "change", function(e) {
            getContent(e);
        } );
        data.command = "init";
        data.dVar = this.opt.dVar;
        nj().post("library/php/ajax_mess_news.php", data, evaluateMessNews);
    }
    prev = function() {
        data.command = "prev";
        data.dVar = this.opt.dVar;
        data.type = nj( "#" + this.opt.fieldPraefix + "_type" ).v();
        data.isRead = nj( "#" + this.opt.fieldPraefix + "_isRead" ).chk();
        data.dsPointer = nj( "#" + this.opt.fieldPraefix + "_id" ).htm();
        nj().post("library/php/ajax_mess_news.php", data, evaluateMessNews);
    }
    next = function() {
        data.command = "next";
        data.dVar = this.opt.dVar;
        data.type = nj( "#" + this.opt.fieldPraefix + "_type" ).v();
        data.isRead = nj( "#" + this.opt.fieldPraefix + "_isRead" ).chk();
        data.dsPointer = nj( "#" + this.opt.fieldPraefix + "_id" ).htm();
        nj().post("library/php/ajax_mess_news.php", data, evaluateMessNews);
    }
    show = function( args ) {
        if( this.opt.track ) {
            data.command = "setTrackAction";
            data.trackingPage = currentTrackId;
            data.pathname = window.location.pathname.substr( 1, window.location.pathname.length - 1 );
            data.action = "showDialogMessageNews";
            console.log(data)
            nj().post("library/php/ajax_request.php", data, evaluateTracking );
        }
        //this.opt.divVar.options( "correctCenterMaxZI" );
        this.opt.divVar.show( args );
    }
    hide = function( args ) {
        this.opt.divVar.hide( args );
    }
}
dMN = new MessagesNewsDR( {dVar: "dMN", bellElement: "#test", modal: false, center: true, addClasses: "diaMess" } );