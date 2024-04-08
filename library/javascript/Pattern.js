// javascript
const STANDARD_TEMPLATE = "onlyText";
/*
const TEMPLATES = [];
TEMPLATES["entry"] = {
        content: "<div><h1 contenteditable tabindex='0' id='entryH1_[id]'>[headline]</h1><div class='[cStatus]'>[date]</div></div><div>&nbsp;</div>"
    };
TEMPLATES["content"] = {
        content: "<div><div id='pElement_[id]' style='background-image: url(\"[bckgimage]\");'></div><div id='divP_[entryId]'>[paragraphs]<div><a id='pElement_[linkid]' href='[href]' target='[target]'>[text]</a></div></div></div>"
    };
*/
const evaluatePattern = function( data ) {
    let i, l;
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
    JO = jsonobject;
    let pub = window[ jsonobject.pVar ];
    switch( jsonobject.command ) {
	    case "initPattern": 
	    break;
	    case "newPatternEntry": 
	    break;
        case "getAllContent":
            l = jsonobject.result.entries.length;
            i = 0;
            while ( i < l ) {
                pub.showEntry( jsonobject.result.entries[i] );    
                i += 1;
            }
            pub.getMaxSpanId();
            break;
        case "deletePatternChildren":

            break;
    }
}
class Pattern {
    constructor( setup ) {
        this.opt = {
            pVar:               "Pattern",
            Id: 				undefined,
            cEl: 				undefined,
            cEn: 				undefined,	
        }
        Object.assign( this.opt, setup );
        this.init();
	}
    init = function() {
    	data.command = "initPattern";
    	//$title, $status, $createdOn, $publishedOn, $pubId = 0, $type = 0, $classList = "", $template = ""
    	data.Id = this.opt.Id;
    	nj().post("library/php/ajax_pattern.php", data, evaluatePattern );
    }
    initBehavior = function(  ) {
    	
    }
    static async initCtrl( el, fStr ) {
        console.log( fStr );
        return fStr;	
    }
	showEntry = function( entry ) {
        let contentHTML, html, secEntry, entryCtrl, el;
        html = TEMPLATES["entry"].content
            .replace( "[id]", entry.id )
            .replace("[headline]", entry.title );
        if( entry.status == 0 ) {
            html = html.replace( "[date]", new Date( entry.published_on ).getGermanDateString() ).replace( "[cStatus]", "cPublished");;
        } else {
            html = html.replace( "[date]", new Date( entry.created_on ).getGermanDateString() ).replace( "[cStatus]", "cCreated");
        }
        let l = entry.elements.length;
        let i = 0;
        let h = TEMPLATES["content"].content;
        h = h.replace( "[entryId]", entry.id );
        let p = "";
        let t;
        while ( i < l ) {
            entry.elements[i].type = "" + entry.elements[i].type;
            h = h.replaceAll( "[id]", entry.elements[i].id );
            switch( entry.elements[i].type ) {
            case "1":
                h = h.replace( "[bckgimage]", entry.elements[i].content );
                break;
            case "2":
                p += "<p tabindex=0 contenteditable id='pElement_" + entry.elements[i].id + "' style='"+ entry.elements[i].styles + "'>" + entry.elements[i].content + "</p>";
                break;
            case "3":
                t = entry.elements[i].content.split( "|" );
                h = h.replace( "[linkid]", entry.elements[i].id ).replace( "[href]", t[0] ).replace( "[target]", t[1] ).replace( "[text]", t[2] );
                break;
            case "100":
                t = entry.elements[i].content.split( "|" );
                h = h.replace( "[linkid]", entry.elements[i].id ).replace( "[href]", t[0] ).replace( "[target]", t[1] ).replace( "[text]", t[2] );
                break;
            case "4":
                //ordered list
                p += "<ol id='oList_" + entry.elements[i].id + "'></ol>";                 
                break;
            case "5":
                //ordered list
                p += "<ul id='oList_" + entry.elements[i].id + "'></ul>";                 
                break;
            }

            i += 1;
        }
        h = h.replace( "[paragraphs]", p);
        let sec = nj().cEl( "section" );
        sec.id = this.opt.praefixEntry + "entry_" + entry.id;
        nj( sec ).htm(  CTRL_HTML.replace( "[dPub]", this.opt.pVar ) + "<div>" + DIV_FORMAT + "<article data-template='" + entry.template + "' data-dvar='" + this.opt.pVar + "' id='artP_" + entry.id + "'>" + html + h + "</div></div>" );
        nj( this.opt.target ).aCh( sec );
        // append list elemnts
        l = entry.elements.length;
        i = 0;
        while ( i < l ) {
            switch( entry.elements[i].type ) {
            case "6":
                // list element
                let vals = entry.elements[i].content.split( "|");
                let el = nj().cEl( "li" );
                el.id = "pElement_" + entry.elements[i].id;
                nj( el ).htm( vals[1] );
                nj( el ).atr( "style", entry.elements[i].styles );
                nj( el ).atr( "contenteditable", true );
//                if( nj( "#oList_" + vals[0] ).isE() ) {
                    nj( "#oList_" + vals[0] ).aCh( el );
//                } else {
//                    nj( "#uList_" + vals[0] ).aCh( el );
//                }
                break;
            }

            i += 1;
        }
        this.initBehavior();
        this.initCtrl();
    }

}