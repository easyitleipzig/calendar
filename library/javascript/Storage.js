class Storage{
	constructor( setup ) {
		store:  	{} 							// the store variable
	}
	addKey = function( key ){
		let vKey = new Array();
		store[ key ] = vKey


	} 
	addValue = function( key, value ){
		//let vKey = new Array();
		store[ key ] = value;
	} 
	getValue = function( key ){
		let vKey = new Array();
		return store[ key ];
	} 
	setStore = function( key, variable, value ){

	} 
	getStore = function( key, variable ){

	} 
} 