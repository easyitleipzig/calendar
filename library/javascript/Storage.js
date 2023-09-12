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
/*
Hash Tables
A hash table is a data structure that maps keys to values, using a hash function to compute an index into an array of buckets or slots, from which the desired value can be found.

class HashTable {
  constructor() {
    this.keys = new Array(this.size);
    this.values = new Array(this.size);
  }

  put(key, data) {
    let index = this.hashFunction(key);
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        this.values[index] = data;
        return;
      }
      index++;
      index %= this.size;
    }
    this.keys[index] = key;
    this.values[index] = data;
  }

  get(key) {
    let index = this.hashFunction(key);
    while (this.keys[index] !== undefined) {
      if (this.keys[index] === key) {
        return this.values[index];
      }
      index++;
      index %= this.size;
    }
    return undefined;
  }

  hashFunction(key) {
    let sum = 0;
    for (let i = 0; i < key.length; i++) {
      sum += key.charCodeAt(i);
    }
    return sum % this.size;
  }
}

const t = new HashTable();
t.put("apple", 10);
t.put("orange", 20);
t.put("banana", 30);
console.log(t.get("orange"));

The hash table implementation uses a class HashTable with put and get methods to insert and retrieve key-value pairs respectively. 
The class also defines a hashFunction method to compute the index in the internal arrays where the key-value pairs are stored.
*/ 