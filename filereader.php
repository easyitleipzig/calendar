<?php
session_start();
$_SESSION["user_id"] = 1;
error_reporting(E_ALL ^ E_NOTICE);
date_default_timezone_set('Europe/Berlin');
$settings = parse_ini_file( 'ini/settings.ini', TRUE );
$dns = $settings['database']['type'] . 
            ':host=' . $settings['database']['host'] . 
            ((!empty($settings['database']['port'])) ? (';port=' . $settings['database']['port']) : '') . 
            ';dbname=' . $settings['database']['schema'];
try {
    $db_pdo = new \PDO( $dns, $settings['database']['username'], $settings['database']['password'], array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8') );
    $db_pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch( \PDOException $e ) {
    $result = new \stdClass();
    $result -> success = false;
    $result -> message = $e->getMessage();
    var_dump( $result );
    exit;
}
require_once("library/php/classes/CalendarEvent.php");
$event = new \CalendarEvent();
/*
$dates = $event -> getStartEnd( $db_pdo, $_SESSION["calInitialDate"], $_SESSION["calInitialView"]);
$events = $event -> getEvents( $db_pdo, $dates );
$event_string = "";
for( $i = 0; $i < count( $events -> data); $i++ ) {
    $ev = $event -> buildEvent( $db_pdo, $events -> data[$i] );
    $event_string .= $ev -> string;
}
$event_string = substr( $event_string, 0, -1 ); 
 
*/
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <title>My Event Calendar</title>

    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="stylesheet" href="library/css/global.css">
    <link rel="stylesheet" href="library/css/EventCalendar.css">
    <link rel="stylesheet" href="library/css/calendar.css">
    <link rel="stylesheet" href="library/css/global.css">
    <style type="text/css">
        #dDia { background-color:lightblue }
        .fc-1 {
            background-color: orange;
            color: white;
        }
        .fc-participate {
            border: 1px black solid;
            box-shadow: 5px 5px 10px 1px #737373;
            margin-bottom: 5px;
        }
        .eventHasAppendix {
            background-image: url(library/css/icons/bueroklammer.png);
            background-repeat: no-repeat;
            background-size: 12px 20px;
            background-position-x: right;
        }
#dPartic {
    background-color: #333;
    color: #E086D3;
    border-radius: 9px;
    padding: 5px;
    width: 200px;
}
#dPartic::before {
  content: " ";
  width: 0;
  height: 0;
  
  border-style: solid;
  border-width: 12px 12.5px 0 12.5px;
  border-color: #333 transparent transparent transparent;

  position: absolute;
  left: 5px;
  top: -5px;
  transform: rotate(180deg);
}
#dPartic_box {
    box-shadow: unset;
    background-color: transparent;    
    border: none !important;
}
.dParticBox {
}
.dParticHL, .dParticMenu {
    display: none !important;
}
#dPartic_headline, #dPartic_menu, #dPartic_footer {
    display: none !important;
}
.accordion>div>input{
  display: none;
}

.accordion .panel {
  margin: 0 auto;
  height: 0;
  overflow:hidden;
  background-color: white;
  line-height: 1.4;
  padding: 0 20px;
  box-sizing: border-box;
  transition: all 0.5s;
}

.accordion input:checked~.panel {
  height: auto;
  color: #333;
  padding: 10px;
  transition: all 0.5s;
  min-height: 280px;
}
.panelHL {
    border-radius: 5px;
    padding-left: 0.3em;
    border-color: aliceblue;
    border: 3px solid #0c97e2;
}
.panelHL > label {
    z-index: 1;
    position: relative;
    cursor: pointer;
    color: #0c97e2;
    font-size: 14px;
    font-weight: 600;
    top: -1px;
}
/* styles event dialog */
    #editEvent label {
        display: block;
    }
    #editId, #editGroupId {
        display: none;
    }
/* end styles event dialog */

    </style>
    <script>
    </script>
</head>
<body>
<a href="#" id="openMessageNews">openMessageNews</a>
<div class="row">

    <div id="divCal" class="col"></div>

</div>
<script src="library/javascript/no_jquery.js"></script>
<script src="library/javascript/easyit_helper_neu.js"></script>
<script src="library/javascript/menu_calendar.js"></script>
<script src="library/javascript/DropResize.js"></script>
<script src="library/javascript/DialogDR.js"></script>
<!--
<script src="library/javascript/touchmove.js"></script>
-->
<script src="library/javascript/init_filereader.js"></script>
<script>
docReady(function() {
    init();
});
</script>
</body>
</html>
