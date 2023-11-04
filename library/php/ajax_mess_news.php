<?php
session_start();
define( "ROOT", "../../"); 
error_reporting( E_ALL ^E_NOTICE );
date_default_timezone_set('Europe/Berlin');
// fetch call to $_POST variables
$json = file_get_contents("php://input");
if (!empty($json)) {
    $data = json_decode($json, true);
    foreach ($data as $key => $value) {
        $_POST[$key] = $value;
    }
}
// end fetch

$return = new \stdClass();

$return -> command = $_POST["command"];
if( isset( $_POST["param"] ) ) {
    $return -> param = $_POST["param"];
}
$settings = parse_ini_file('../../ini/settings.ini', TRUE);

$dns = $settings['database']['type'] . 
            ':host=' . $settings['database']['host'] . 
            ((!empty($settings['database']['port'])) ? (';port=' . $settings['database']['port']) : '') . 
            ';dbname=' . $settings['database']['schema'];
try {
    $db_pdo = new \PDO( $dns, $settings['database']['username'], $settings['database']['password'], array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8') );
    $db_pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db_pdo -> setAttribute( PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false );
}
catch( \PDOException $e ) {
    $return -> command = "connect_error";
    $return -> message = $e->getMessage();
    print_r( json_encode( $return ));
    die;
}
require_once("functions.php"); 
foreach ( $_POST as &$str) {
    //var_dump($str);
    $str = replaceUnwantetChars($str);
}
$return -> dVar = $_POST["dVar"];
require_once( "classes/Message.php" );
require_once( "classes/News.php" );
$m = new \Message();
$n = new \News();

switch( $_POST["command"]) {
    case "init":
                $return -> count = getCountMessagesNews( $db_pdo, $m, $n );
                $return -> dVar = $_POST["dVar"];
                print_r( json_encode( $return ));
    break;
    case "next":
                if( $_POST["type"] == 1 ) {
                    if(boolval( $_POST["isRead"] ) ) {
                        $return -> isRead = $m -> setIsRead( $db_pdo, $_POST["dsPointer"] );
                    }
                    $return -> data = $m -> getMessageContentNew( $db_pdo, $_POST["dsPointer"], "ASC" );
                } else {
                    if(boolval( $_POST["isRead"] ) ) {
                        $return -> isRead = $n -> setIsRead( $db_pdo, $_POST["dsPointer"] );
                    }
                    $return -> data = $n -> getNewsContentNew( $db_pdo, $_POST["dsPointer"], "ASC" );                                
                }
                $return -> isRead = $_POST["isRead"];
                $return -> count = getCountMessagesNews( $db_pdo, $m, $n );
                print_r( json_encode( $return ));                               
    break;
    case "prev":
                if( $_POST["type"] == 1 ) {
                    if(boolval( $_POST["isRead"] ) ) {
                        $return -> isRead = $m -> setIsRead( $db_pdo, $_POST["dsPointer"] );
                    }
                    $return -> data = $m -> getMessageContentNew( $db_pdo, $_POST["dsPointer"], "DESC" );
                } else {
                    if(boolval( $_POST["isRead"] ) ) {
                        $return -> isRead = $n -> setIsRead( $db_pdo, $_POST["dsPointer"] );
                    }
                    $return -> data = $n -> getNewsContentNew( $db_pdo, $_POST["dsPointer"], "DESC" );         
                }
                $return -> isRead = $_POST["isRead"];
                $return -> count = getCountMessagesNews( $db_pdo, $m, $n );
                print_r( json_encode( $return ));                               
    break;
    case "get":
                if( $_POST["type"] == 1 ) {
                    $return -> data = $m -> getMessageContentNew( $db_pdo, 0, "ASC" );
                } else {
                    $return -> data = $n -> getNewsContentNew( $db_pdo, 0, "ASC" );                                
                }
                $return -> count = getCountMessagesNews( $db_pdo, $m, $n );
                
                print_r( json_encode( $return ));                               
    break;
    case "getList":
                $return -> type = $_POST["type"];
                if( $_POST["type"] == 1 ) {
                    $res = $m -> getList( $db_pdo );
                } else {
                    $res = $n -> getList( $db_pdo );
                }
                $return -> data = $res -> data;
                $return -> success = $res -> success;
                $return -> message = $res -> message;
                print_r( json_encode( $return ));
    
    break;
    case "readAll":
                $return -> type = $_POST["type"];
                $return -> dVar = $_POST["dVar"];
                if( $_POST["type"] == 1 ) {
                    $res = $m -> readAll( $db_pdo );
                } else {
                    $res = $n -> readAll( $db_pdo );
                }
                $return -> success = $res -> success;
                $return -> message = $res -> message;
                print_r( json_encode( $return ));
    
    break;
}
