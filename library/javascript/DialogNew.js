//javascript
//var oldY = 0, oldX = 0;
var TEST_INNER_HTML ="<p><input value='abcd'></p>"; 
var setDialogPosOnScroll = function() {
    let els = nj().els( ".dialogBox:not(.boxHide)" );
    let l = els.length;
    let i = 0;
    while( i < l ) {
        let df = getDialogVar( nj( els[i] ).atr( "data-dVar" ) );
        
        if( typeof df === "undefined" ) return;
        if( nj( df.opt.id + "_box").hCl( "minimized" ) ) return;
        if( df.opt.center ) {
            df.options("center");
        } else {
            //let res = {};
            //let pos = nj( df.opt.id + "_box").gRe();
        }
        i += 1;    
    }    
}
registerOnResize( setDialogPosOnScroll );
const getRootObject = function( el ) {
    return window[ getDVar( el ).split(".")[0] ];
}
const getDialogVar = function( dVar ) {
    let tmp = dVar.split( "." );
    let m = tmp.length;
    let j = 1;
    let tmpVar = window[ tmp[0] ];
    while( j < m ) {
        tmpVar = tmpVar[tmp[j]];
        j += 1;
    }
    return tmpVar;
}
const getDVar = function( el ) {
    let x = 1;
    while (x == 1 ) {
        if( nj( el ).hAt( "data-dVar" ) ) {
            x = 0;
            return nj( el ).atr( "data-dVar" )
        } else {
            el = nj( el ).p();
        }
    }
}
/* end dialog helper */
class DialogNew {
      constructor( param ) {
        this.opt = {
            id:                 "", // necessary - id of dialog; if the element does not exists a new element will be created with this id
            boxId:              "", // id without # - do not set; is created by class
            innerHTML:          undefined, // optional - the start inner html; if the element of id not exists, this value is the content else it is the content of existing element with id
            target:             document.body, // optional - the target element
            menu:               undefined, // the html of the menu object
            classPraefix:       "d_", // optional - praefix for all classes
            dVar:               "", // necessary - must by the name of the object
            waitForShow:        1000, // wait time for show in ms
            height:             undefined, // optional - can be a value for standard height or "dynamic" for dynamic according to the content size
            maxHeight:          undefined, // optional - can be a value for maximum height
            width:              undefined, // optional - can be a value for standard width
            maxWidth:           undefined, // optional - can be a value for maximum width
            minHeight:          150, // min height for resizing
            minWidth:           300, // min width for resizing
            headlineHeight:     undefined, // do not use - is set by class
            menuHeigh:          undefined, // do not use - is set by class
            dialogHeight:       undefined, // do not use - is set by class
            footerHeight:       undefined, // do not use - is set by class
            modal:              true, // optional - true/false
            autoOpen:           false, // optional - true/false
            center:             true, // optional - true/false
            remindCenter:       undefined, // a temporary value for saving start center
            title:              "Titel",  // necessary - string
            addClasses:         undefined, // optional - additional classes divide by " "
            addClassFiles:      "dialog.css main.css", // optional - additional class files divide by " "
            hasIcon:            false, // optional - true/false
            hasInfo:            false, // optional - true/false
            hasHelp:            false, // optional - true/false
            divHelp:            undefined, // do not set
            divInfo:            undefined, // do not set
            hasMin:             false,
            hasMax:             false,
            hasSticky:          false,
            hasClose:           true,
            canMove:            true,
            canResize:          false,
            buttons:            [],// {title: "Okay", action: function(){ let df = getDVar( this ); window[ df ].hide() } ],
            isOpen:             false,
            selectFirstButton:  true,
            selectFirstInput:   true,
            onShow:             undefined,
            afterShow:          undefined,
            onHide:             undefined,
            onSticky:           undefined,
            onRefreshHTML:      undefined,
            variables:          undefined,
        }
        Object.assign( this.opt, param );
        if( this.opt.id === "" ) {
            let el = nj().cEl( "div" );
            el.id = this.opt.dVar;
            nj( this.opt.target ).aCh( el );
            this.opt.id = "#" + this.opt.dVar;
        }
        if( nj( this.opt.id + "_box" ).isE() ) return;
        this.opt.remindCenter = this.opt.center;
        loadCSS( PATH_TO_CSS + DEFAULT_CSS_FILE );
        let el = null;
        if( typeof this.opt.addClassFiles !== "undefined" ) {
            el = this.opt.addClassFiles.split( " " );
            let l = el.length;
            let i = 0;
            while( i < l ) {
                loadCSS( PATH_TO_CSS + el[i] );
                i += 1;    
            }
        }
        this.opt.boxId = this.opt.id.substr( 1, this.opt.id.length - 1 );
        el = nj().cEl( "div" );
        if( nj().els( "#dialogMinimizeArea" )  === null ) {
            el.id = "dialogMinimizeArea";
            document.body.appendChild( el );            
        }
        el = null;
        if( typeof this.opt.buttons !== "undefined" ) {
            if( this.opt.buttons.length == 0 ) {
                b = {};
                b.title = "Okay";
                b.action = function( el ){
                    //console.log( getDVar( nj().els( el.target ) ) );
                    getDialogVar( getDVar( nj().els( el.target ) ) ).hide();
                };
                this.opt.buttons.push( b ); 
            }   
        }
        el = nj().cEl( "div" );
        nj( el ).aCl( this.opt.classPraefix + "HL" );
        el.id = this.opt.boxId + "_headline";
        nj( el ).on( "click", function( el ) {
            getDialogVar( getDVar( nj().els( el.target ) ) ).setMaxZIndex();
        });
        let el_add  = nj().cEl( "div" );
        nj( el_add ).aCl( this.opt.classPraefix + "HLIcon" );
        nj( el ).aCh( el_add );
        el_add = null;
        el_add = nj().cEl( "div" );
        nj( el_add ).aCl( this.opt.classPraefix + "HLTitle" );
        nj( el_add ).txt( this.opt.title );
        nj( el ).aCh( el_add );
        el_add = null;
        let el_ctrl = nj().cEl( "div" );
        el_add = nj().cEl( "div" );
        if( this.opt.hasSticky ) {
            nj( el_add ).aCl( this.opt.classPraefix + "HLSticky" );
            nj( el_add ).on( "click", function( el ) {
                if( typeof getDialogVar( getDVar( nj().els( el.target ) ) ).opt.onSticky === "function" ) {
                    getDialogVar( getDVar( nj().els( el.target ) ) ).opt.onSticky();
                }    
            })
            nj( el_ctrl ).aCh( el_add );
        }
        el_add = null;
        el_add = nj().cEl( "div" );
        if( this.opt.hasHelp ) {
            nj( el_add ).aCl( "cbHelp iconButtMin " + this.opt.classPraefix + "HLHelp");
            nj( el_add ).on( "click", function( e ) {
                e.stopPropagation();
                getDialogVar( getDVar( nj().els( e.target ) ) ).opt.divHelp.show();    
            });
            nj( el_ctrl ).aCh( el_add );
        }
        el_add = null;
        el_add = nj().cEl( "div" );
        if( this.opt.hasInfo ) {
            nj( el_add ).aCl( "cbInfo iconButtMin " + this.opt.classPraefix + "HLInfo");
            nj( el_add ).on( "click", function( e ) {
                e.stopPropagation();
                getDialogVar( getDVar( nj().els( e.target ) ) ).opt.divInfo.show();    
            });
            nj( el_ctrl ).aCh( el_add );
        }
        el_add = null;
        el_add = nj().cEl( "div" );
        if( this.opt.hasMin ) {
            nj( el_add ).aCl( "cbMinimize iconButtMin " + this.opt.classPraefix + "HLMin" );
            nj( el_add ).on( "click", function( el ) {
                let df = getDialogVar( getDVar( nj().els( el.target ) ) );
                if( nj( df.opt.id + "_box" ).hCl( "minimized" ) ) {
                    df.restoreMin()
                } else {
                    df.minimize();        
                }                
            });
            nj( el_ctrl ).aCh( el_add );
        }
        el_add = null;
        el_add = nj().cEl( "div" );
        if( this.opt.hasMax ) {
            nj( el_add ).aCl( this.opt.classPraefix + "HLMax cbMax iconButtMin" );
            nj( el_add ).on( "click", function( el ) {
                let df = getDialogVar( getDVar( nj().els( el.target ) ) );
                if( nj( df.opt.id + "_box" ).hCl( "maximized" ) ) {
                    df.restoreMax()
                } else {
                    df.maximize();        
                }
            });
            nj( el_ctrl ).aCh( el_add );
        }
        el_add = null;
        el_add = nj().cEl( "div" );
        if( this.opt.hasClose ) {
            nj( el_add ).aCl( "cbClose iconButtMin " + this.opt.classPraefix + "HLClose" );
            nj( el_add ).on( "click", function( el ) {
                getDialogVar( getDVar( nj().els( el.target ) ) ).hide();    
            });
            nj( el_ctrl ).aCh( el_add );
        }
        nj( el ).aCh( el_ctrl );
        
        let box = nj().cEl( "div" );
        box.id = this.opt.boxId + "_box";
        nj( box ).atr( "data-dVar", this.opt.dVar );
        nj( box ).aCh( el );
        el_add = nj().cEl( "div" );
        el_add.id = this.opt.boxId + "_menu";
        nj( el_add ).aCl( this.opt.classPraefix + "Menu " + CLASS_DIALOG_MENU );
        if( typeof this.opt.menu !== "undefined" ) nj( el_add ).htm( this.opt.menu );
        nj( box ).aCh( el_add );
        let el_dia;
        if( nj( this.opt.id ).isE() ) {
            el_dia = nj().els( this.opt.id );
            if( nj( el_dia ).htm() === "" && this.opt.innerHTML !== "" )                 
                nj( el_dia ).htm( this.opt.innerHTML );
        } else {
            el_dia = nj().cEl( "div");
            el_dia.id = this.opt.id.substr( 1, this.opt.id.length );
            if( typeof this.opt.innerHTML !== "undefined" ) {
                nj( el_dia ).htm( this.opt.innerHTML );
            }
        }
        nj( el_dia ).aCl( CLASS_DIALOG_CONTENT );
        if( typeof this.opt.addClasses !== "undefined" ) {
            nj( el_dia ).aCl( this.opt.addClasses );
        }    
        if( typeof this.opt.height !== "undefined" ) {
            if( parseInt( this.opt.height ) == this.opt.height ) {
                nj( el_dia ).sty( "height", this.opt.height + "px" );
            } else {
                nj( el_dia ).sty( "height", this.opt.height );
            }
        }
        if( typeof this.opt.maxHeight !== "undefined" ) {
            if( parseInt( this.opt.maxHeight ) == this.opt.maxHeight ) {
                nj( el_dia ).sty( "max-height", this.opt.maxHeight + "px" );
            } else {
                nj( el_dia ).sty( "height", this.opt.maxHeight );
            }
        }
        if( typeof this.opt.maxWidth !== "undefined" ) {
            if( parseInt( this.opt.maxWidth ) == this.opt.maxWidth ) {
                nj( el_dia ).sty( "max-width", this.opt.maxWidth + "px" );
            } else {
                nj( el_dia ).sty( "max-width", this.opt.maxWidth );
            }
        }
        nj( box ).aCh( el_dia );
        el_add = null;
        el_add = nj().cEl( "div" );
        el_add.id = this.opt.boxId + "_footer"
        nj( el_add ).aCl( this.opt.classPraefix + "Footer " + CLASS_DIALOG_FOOTER);
        if( this.opt.buttons ) {
            let l = this.opt.buttons.length;
            let i = 0;
            while( i < l ) {
                let b = nj().cEl( "button" );
                //console.log(typeof this.opt.buttons[i] );
                if( typeof this.opt.buttons[i] !== "undefined" ) {
                    nj( b ).htm( this.opt.buttons[i].title );
                    nj( b ).on( "click", this.opt.buttons[i].action );
                    nj( el_add ).aCh( b );
                }
                i += 1;    
            }            
        }
        if( typeof this.opt.width !== "undefined" ) {
            if( parseInt( this.opt.width ) == this.opt.width ) {
                nj( box ).sty( "width", this.opt.width + "px" );    
            } else {
                nj( box ).sty( "width", this.opt.width );
            }         
        }
        nj( box ).aCh( el_add );
        nj( box ).atr( "tabindex", "0" );
        nj( box ).on( "keydown", function(e){
            if( e.keyCode == 27 ) {
                getDialogVar( getDVar( nj().els( e.target ) ) ).hide();
            }
        });
        nj( box ).aCl( "boxHide " + this.opt.classPraefix + "Box " + CLASS_DIALOG_BOX );
        if( this.opt.modal ) {
            let el_wr = nj().cEl( "div" );
            el_wr.id = this.opt.boxId + "_wrapper";
            nj( el_wr ).aCl( CLASS_DIALOG_WRAPPER + " dialogWrapper" );
            document.body.appendChild( el_wr );
        }
        if( this.opt.hasHelp ) {
            let el_he = nj().cEl( "div" );
            nj( el_he ).htm('<iframe src="' + PATH_TO_HELP + "help_" + this.opt.boxId + '.php"></iframe>')
            el_he.id = this.opt.boxId + "_help";
            nj( el_he ).aCl( CLASS_DIALOG_HELP );
            document.body.appendChild( el_he );
            this.opt.divHelp = new DialogNew( { dVar: this.opt.dVar + ".opt.divHelp", id: "#" + el_he.id, title: "Hilfe", modal: true, autoOpen: false, center: false })
        }
        if( this.opt.hasInfo ) {
            let el_i = nj().cEl( "div" );
            nj( el_i ).htm('<iframe src="' + PATH_TO_INFO + "info_" + this.opt.boxId + '.php"></iframe>')
            el_he.id = this.opt.boxId + "_info";
            nj( el_i ).aCl( CLASS_DIALOG_INFO );
            document.body.appendChild( el_i );
            this.opt.divInfo = new DialogNew( { dVar: this.opt.dVar + ".opt.divInfo", id: el_i.id, title: "Information", modal: true, autoOpen: false, center: false })
        }
        nj( this.opt.target ).aCh( box );
        if( this.opt.canMove ) {
            moverClass.init( "body", this.opt.id + "_headline" );
        }
        if( this.opt.canResize ) {
            let dummyRes = nj().cEl("div");
            dummyRes.id = this.opt.boxId +  "_dummyRes";
            nj( dummyRes ).aCl( "dummyRes" );
            const boxEl = nj().els( box );
            nj( boxEl ).aCh( dummyRes );
            resizeClass.init( document.getElementById( this.opt.id.substr( 1, this.opt.id.length - 1 ) + "_dummyRes" ) );
        }
        if( this.opt.autoOpen ) this.show();
    }
    setMaxZIndex = function() {
        let mI = maxZIndex();
        if( this.opt.modal ) {
            nj( this.opt.id + "_wrapper" ).sty( "z-index", ++mI )
        }
        nj( this.opt.id + "_box" ).sty( "z-index", ++mI )       
    }
    show = function( args ) {
        let mZI = maxZIndex();
        if( this.opt.modal ) {
            nj( this.opt.id + "_wrapper" ).rCl( "wrapperHide");
            nj( this.opt.id + "_wrapper" ).aCl( "wrapperShow dialogWrapper");
            nj( this.opt.id + "_wrapper" ).sty( { "z-index": ++mZI } );
        }
        nj( this.opt.id + "_box" ).rCl( "boxHide");
        nj( this.opt.id + "_box" ).aCl( "boxHidden");

        let x, y;
        if( this.opt.center ) {
            x = this.center().x; 
            y = this.center().y; 
        } else { 
                x = "0px";
                y = "0px";
        }
        if( typeof this.opt.onShow === "function" ) this.opt.onShow( this );
        if( typeof args !== "undefined") {
            if( typeof args.title !== "undefined" ) {
                this.options( "title", args.title );
            }
            if( typeof args.innerHTML !== "undefined" ) {
                nj( this.opt.id ).htm( args.innerHTML );
                if( typeof this.opt.onRefreshHTML === "function" ) this.opt.onRefreshHTML();
            }
            if( typeof args.buttons === "undefined" ) {
                this.options( "buttons", this.opt.buttons );
            } else {
                this.options( "buttons", args.buttons );
            }
            if( typeof args.width === "undefined" ) {
                if( parseInt( args.width ) === args.width ) {
                    nj( this.opt.id + "_box" ).sty( "width", args.width + "px" );    
                } else {
                    nj( this.opt.id + "_box" ).sty( "width", args.width );   
                }
            }
            if( typeof args.height === "undefined" ) {
                if( parseInt( args.height ) === args.height ) {
                    nj( this.opt.id ).sty( "height", args.height + "px" );    
                } else {
                    nj( this.opt.id ).sty( "height", args.height );   
                }
            }

            if( typeof args.x !== "undefined" ) {
                x = args.x;
            }
            if( typeof args.y !== "undefined" ) {
                y = args.y;
            }
            if( typeof args.variables !== "undefined" ) {
                this.opt.variables = args.variables;
            } 
        }
        let boxDim = nj( this.opt.id + "_box" ).gRe();
        this.opt.headlineHeight = nj( this.opt.id + "_headline" ).gRe().height;
        this.opt.menuHeight = nj( this.opt.id + "_menu" ).gRe().height;
        this.opt.dialogHeight = nj( this.opt.id ).gRe().height;
        this.opt.footerHeight = nj( this.opt.id + "_footer" ).gRe().height;
        this.opt.remindCenter = this.opt.center;
        //wait( this.opt.waitForShow );
        nj( this.opt.id + "_box" ).rCl( "boxHidden");
        nj( this.opt.id + "_box" ).sty( { "left": x, "top": y, "z-index": ++mZI } );
        nj( this.opt.id + "_box" ).aCl( "boxShow");

        if( typeof this.opt.afterShow === "function" ) this.opt.afterShow( this );
    }
    hide = function() {
        if( this.opt.modal ) {
            nj( this.opt.id + "_wrapper" ).rCl( "wrapperShow");
            nj( this.opt.id + "_wrapper" ).aCl( "wrapperHide");
        }
        //if( typeof this.opt.remindCenter !== "undefined" ) {
            this.opt.center = this.opt.remindCenter;
        //}
        nj( this.opt.id + "_box" ).rCl( "boxShow");
        nj( this.opt.id + "_box" ).aCl( "boxHide");
        //this.opt.center = this.opt.rootCenter;
        if( typeof this.opt.onHide === "function" ) this.opt.onHide( this );
    }
    savePosDim = function() {
        let vPosDimDia = nj( this.opt.id ).gRe();
        let oPosDim = {};
        oPosDim.wD = vPosDimDia.width;
        oPosDim.hD = vPosDimDia.height;
        let vPosDimBox = nj( this.opt.id + "_box" ).gRe();
        oPosDim.x = vPosDimBox.x;
        oPosDim.y = vPosDimBox.y;
        oPosDim.w = vPosDimBox.width;
        oPosDim.h = vPosDimBox.height;
        nj( this.opt.id + "_box" ).atr( "data-PosDim", JSON.stringify( oPosDim ) );
    }
    restorePosDim = function() {
        if( !nj( this.opt.id + "_box" ).hAt( "data-PosDim") ) return false;
        let vPosDim = JSON.parse( nj( this.opt.id + "_box" ).atr( "data-PosDim" ) );
        nj( this.opt.id ).sty( { "width": vPosDim.wD + "px", "height": vPosDim.hD + "px" } );
        nj( this.opt.id + "_box" ).sty( { "width": vPosDim.w + "px", "height": vPosDim.h + "px", "top": vPosDim.y + "px", "left": vPosDim.x + "px" } );
        nj( this.opt.id + "_box" ).rAt( "data-PosDim" );
    }
    center = function() {
        let scrLeft = +( document.documentElement.style.getPropertyValue('--scrollbar-width') );
        let wW = +( document.documentElement.style.getPropertyValue('--window-width') );
        wW = wW - scrLeft;
        let dW = nj( this.opt.id + "_box" ).gRe().width;
        let scrTop = +( document.documentElement.style.getPropertyValue('--scrollbar-height') );
        let wH = +( document.documentElement.style.getPropertyValue('--window-height') );
        wH = wH - scrTop;
        let dH = nj( this.opt.id + "_box" ).gRe().height;
        let ret = {};
        ret.x = wW / 2 - dW / 2 + "px";
        ret.y = wH / 2 - dH / 2 + "px"
        return ret; 
    }
    reorganizeMinimized = function() {
        let els = nj().els( ".minimized" );
        let l = els.length;
        let i = 0;
        while( i < l ) {
            nj( els[i] ).sty( { "top": "-20px", "left": 150 * i -38 + "px", "width": "150px" } );
            i += 1;    
        }        
    }
    restoreMin() {
        if( this.opt.modal ) {
            nj( this.opt.id + "_wrapper" ).rCl( "wrapperHide" ); 
            nj( this.opt.id + "_wrapper" ).aCl( "wrapperShow" ); 
        }
        nj( this.opt.id + "_box" ).m( this.opt.target );
        nj( this.opt.id + "_box" ).rCl( "minimized" );
        nj( this.opt.id + "_box" ).sty( {"position": ""} );
        this.restorePosDim();
    }
    minimize = function(){
        if( !nj( this.opt.id + "_box" ).hCl( "maximized" ) ) {
            this.savePosDim();
        }
        if( this.opt.modal ) {
            nj( this.opt.id + "_wrapper" ).rCl( "wrapperShow" ); 
            nj( this.opt.id + "_wrapper" ).rPr( "style" );
        }
        nj( this.opt.id + "_box" ).aCl( "minimized" );
        nj( this.opt.id + "_box" ).m( "#dialogMinimizeArea" );
        nj( this.opt.id + "_box" ).sty( {"position": "relative"} );
        this.reorganizeMinimized()
    }
    restoreMax = function() {
        nj( this.opt.id + "_box > div ." + this.opt.classPraefix + "HLMax" ).aCl( "cbMax" );
        nj( this.opt.id + "_box > div ." + this.opt.classPraefix + "HLMax" ).rCl( "cbMaximized" );
        this.restorePosDim();
    }
    maximize = function() {
        this.savePosDim();
        let hlSize = nj( this.opt.id + "_headline").gRe();
        let menSize = nj( this.opt.id + "_menu").gRe();
        let fooSize = nj( this.opt.id + "_footer").gRe();
        let minArea = nj("#dialogMinimizeArea").gCS( "bottom");
        nj( this.opt.id + "_box" ).sty( { "left": "3px", "top": "3px", "width": window.innerWidth - getScrollbarWidth() - 7 + "px"/*, "height": window.innerHeight - getScrollbarHeight() - parseInt( minArea ) - 15 + "px"*/ } )
        let v = parseInt( hlSize.height + menSize.height + fooSize.height );
        let diaH = parseInt( nj( this.opt.id + "_box" ).gCS( "height") ) - v- 10;
        nj( this.opt.id + "_box" ).sty( { "height": window.innerHeight - 8 + "px"});
        let boxSize = nj( this.opt.id + "_box").gRe();
        nj( this.opt.id ).sty( "height", boxSize.height - v - 11 + "px" );
        nj( this.opt.id + "_box > div ." + this.opt.classPraefix + "HLMax" ).rCl( "cbMax" );
        nj( this.opt.id + "_box > div ." + this.opt.classPraefix + "HLMax" ).aCl( "cbMaximized" );
        nj( this.opt.id + "_box" ).aCl( "maximized" );
    }
    options = function( p, v ) {
        switch( p ) {
            case "correctCenterMaxZI":
                let mi = maxZIndex();
                console.log( this.opt.modal, mi );
                if( this.opt.modal ) {
                    nj( this.opt.id + "_wrapper" ).sty( { "z-index" : mi + 1 } );
                    nj( this.opt.id + "_box" ).sty( { "z-index" : mi + 2 } );
                } else {
                    nj( this.opt.id + "_box" ).sty( { "z-index" : mi + 1 } );
                }
                if( this.opt.center ) {
                    let res = this.center();
                    nj( this.opt.id + "_box" ).sty( { "left" : res.x, "top": res.y } );                    
                }
            break;
            case "center":
                let res = this.center();
                nj( this.opt.id + "_box" ).sty( { "left" : res.x, "top": res.y } );
            break;
            case "scroll":
                x = window.scrollX + "px";
                y = nj().els( this.opt.id + "_box>div:first-child" )[0].getBoundingClientRect().height + window.scrollY + "px";
                nj( this.opt.id + "_box" ).sty( { "left": x, "top": y, "z-index": ++mZI } );
            break;
            case "title":
                if( typeof v === "undefined" ) {
                    return nj( this.opt.id + "_box>div:nth-child(1)>div:nth-child(2)" ).htm();
                } else {
                    nj( this.opt.id + "_box>div:nth-child(1)>div:nth-child(2)" ).htm( v );
                }
            case "html":
                if( typeof v === "undefined" ) {
                    return nj( this.opt.id ).htm();
                } else {
                    nj( this.opt.id ).htm( v );
                    if( typeof this.opt.onRefreshHTML === "function" ) this.opt.onRefreshHTML();
                }
            break;
            case "buttons":
                if( typeof v === "undefined" ) {
                    v = [];
                    v[0] = {};
                    v[0].title = "Okay";
                    v[0].action = function(){
                        //console.log( getDVar( nj().els( this ) )  );
                        let df = getDVar( nj().els( this ) );
                        console.log( df.split( "." )[0] );
                        window[ df.split( "." )[0] ].opt.divVar.hide();
                    }
                }
                nj( this.opt.id + "_footer" ).htm( "" );
                //console.log( v );
                let l = v.length;
                let i = 0;
                while( i < l ) {
                    let b = nj().cEl( "button" );
                    nj( b ).htm( v[i].title );
                    nj( b ).on( "click", v[i].action );
                    nj( this.opt.id + "_footer" ).aCh( b );
                    i += 1;    
                }
                if( this.opt.canResize ) {
                    let el_res = nj().cEl( "div" );
                    el_res.id = this.opt.boxId + "_resizer";
                    nj( el_res ).aCl( this.opt.classPraefix + "Resizer " + CLASS_DIALOG_RESIZER );
                    nj( this.opt.id + "_footer" ).aCh( el_res );
                    resizeClass.init( el_res, this.opt.id + "_box_resizer_img" );
                }

            break;
            case "position":
                nj( this.opt.id + "_box" ).sty( { "left": v.x, "top": v.y } );
            break;
            case "isOpen":
                if( nj( this.opt.id + "_box").hCl( "boxShow" ) ) {
                    return true;
                } else {
                    return false;
                }
            break;
        }
    }
}
registerOnScroll( setDialogPosOnScroll);
