<?php
session_start();
error_reporting(E_ALL ^ E_NOTICE);
$settings = parse_ini_file( 'ini/settings.ini', TRUE );
$session_timeout = $settings['logout']['automatic_timeout'] * 60;
$role_id = 5;
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
require_once( "library/php/classes/CalendarEventEvCal.php" );
$ev = new \CalendarEvent();
$res = $ev ->showDialogParticipate( $db_pdo, $_GET["cal"] );
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Expires" content="Fri, Jan 01 1900 00:00:00 GMT">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Cache-Control" content="no-cache">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="Lang" content="en">
<meta name="author" content="Dipl. Ing. Olaf Thiele">
<meta name="description" content="">
<meta name="keywords" content="">
<meta name="creation-date" content="03/03/2024">
<meta name="revisit-after" content="15 days">
<title>Terminteinhemer</title>
<link rel="stylesheet" type="text/css" href="library/css/main.css">
<style>
body>div:nth-child(2) {
    border-bottom: 2px black solid;
    width: 360px;
}
div>div {
    display: inline-block;
}
div>div:nth-child(1) {
    width: 300px;
}
div>div:nth-child(2) {
    width: 60px;
    text-align: right;
}

</style>
</head>
<body>
<?php
    print_r( "<h3>Teilnehmerliste Termin '" . $res -> title . "'</h3>");
    print_r( "<div><div>Teilnehmer</div><div>" . $res -> countPart . "</div></div>" );
    $l = count( $res -> participants );
    $i = 0;
    while( $i < $l ) {
        print_r( "<div><div>" . $res -> participants[$i]["fullname"] . "</div><div>" . $res -> participants[$i]["count_part"] . "</div></div>" );
        $i += 1;
    }
    
?>
</body>
</html>
