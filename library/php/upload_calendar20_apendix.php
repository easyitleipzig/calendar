<?php
session_start();
require_once("functions.php");
$filename = $_POST["filename"];
if( $_POST["id"] === "new" ) {
    // all new files
    $glob = glob( "../cal/cal_new_" . $_SESSION["user_id"] . "_*.*" );
} else {
    // all existing files
    $glob = glob( "../cal/cal_" . $_POST["id"] . "_*.*" );
}
for( $i = 0; $i < count( $glob ); $i++ ) {
    if( file_exists( $glob[$i] ) ) {
        unlink( $glob[$i] );
    }    
}
if( $_FILES[$filename]['size']>  5000000) {
    //do something
}
$l = count( $_FILES );
$i = 0;
while( $i < $l ) {
    if( $_POST["id"] === "new" ) {
        $fExt = getFileExt( $_FILES["file_" . $i]["name"] );
        $fName = "cal_new_" . $_SESSION[ "user_id" ] . "_$i." . $fExt;
    } else {
        $fExt = getFileExt( $_FILES["file_" . $i]["name"] );
        $fName = "cal_" . $_POST["id"] . "_$i." . $fExt;
    }
    $result = move_uploaded_file( $_FILES["file_" . $i]['tmp_name'], "../cal/" . $_FILES["file_" . $i]["name"] );  
    $result = rename( "../cal/" . $_FILES["file_" . $i]["name"],"../cal/" . $fName ); 
    $i += 1;
}
/*
if( $_FILES ) {
$result = move_uploaded_file( $_FILES['file']['tmp_name'], "../ads/" . $_FILES['file']["name"] );  
$result = rename( "../ads/" . $_FILES['file']["name"],"../ads/" . $fName ); 
$result = new stdClass();
$result -> success = true;
print_r( json_encode( $return ));   
   
//header("Location: ../../profile.php");
} else {
    //header("Location: ../../profile.php?error=filesize&form=user");
    die;
    
}
*/
?>
