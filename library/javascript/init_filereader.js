// javascript
//const dDia1 = new DialogDR( { dVar: "dDia1", id: "#dDia1", modal: false, hasMin: true, hasMax: true, hasInfo: true, hasHelp: true } );
class FileReader {
    constructor( param ) {
        this.opt = {
            dVar: "",
            divFR: undefined,
        }
        let showOnInit = true,
        boxId = "",
        tmpClasses = "";
        loadCSS( "library/css/MessageNew.css")
        Object.assign( this.opt, param );
        this.opt.divFR = new DialogDR({dVar: this.opt.dVar + ".opt.divFR" } );
    }
}
const f = new FileReader({ dVar: "f" } );
const init = function() {
    nj( "#openMessageNews" ).on( "click", function(){ f.opt.divFR.show() } );
    //dM = new MessageDR();
}