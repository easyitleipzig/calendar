// Simple POST request with a JSON body using fetch
/*
const element = document.querySelector('#post-request .article-id');
const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Fetch POST Request Example' })
};
fetch('https://reqres.in/api/articles', requestOptions)
    .then(response => response.json())
    .then(data => element.innerHTML = data.id );
*/
const sendFetchPostPost = function( url, fetchData, callback ) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( fetchData )
    };
    fetch('library/php/fetch_post.php', requestOptions)
        .then(response => response.json())
        .then(data => callback( data ) );
}
const evaluateFetchPost = function( jsonobject ) {
    console.log( jsonobject );
    switch( jsonobject.command ) {
    case "testFetch":
        console.log( jsonobject );

        break;
    }
}


const initFetchPost  = function() {
    // body...
    nj( "#doFetch" ).on("click", function( args ) {
        data = {};
        data.command = "testFetch";
        data.value = "test";
        console.log( data );
        nj().fetchPostNew( 'library/php/fetch_post.php', data, evaluateFetchPost )        
    })
}
