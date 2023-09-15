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
    <link rel="manifest" href="library/ressources/site.webmanifest">
    <link rel="stylesheet" href="library/css/global.css">
    <link rel="stylesheet" href="library/css/EventCalendar.css">
    <style type="text/css">
        #dDia { background-color:lightblue }
        .fc-1 {
            background-color: orange;
            color: white;
        }
    </style>
</head>
<body>
<div id="editEvent" style="display: none;">
    <div class="accordion">          
       <div>
          <input type="radio" name="acc" id="usual1" checked>
          <div class="panelHL"><label for="usual1">Allgemein</label></div>
          <div class="panel">
     <input id="editId">
    <input id="editGroupId" value="0">
    <label>Titel</label>
    <input id="editTitle" type="text">
    <div>
    <label>Ort</label>
<?php
    $query = "SELECT * FROM event_place";
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    print_r( "<select id='meeting_point'>");
    for( $i = 0; $i < count( $result ); $i++ ) {
        echo "<option value='" . $result[$i]["id"] . "'>" . $result[$i]["place"] . "</option>";
    }     
    print_r( "</select></div><div><label>Kategorie</label>");
    $query = "SELECT * FROM event_format";
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    print_r( "<select id='editFormat'>");
    echo '<option value="fc-0" selected></option>';
    for( $i = 0; $i < count( $result ); $i++ ) {
        echo "<option value='fc-" . $result[$i]["id"] . "'>" . $result[$i]["name"] . "</option>";
    }     
    print_r( "</select></div>");
?>
    <label>Ansprechpartner</label>
<?php
    $query = "SELECT id, CONCAT( lastname, ', ', firstname ) AS name FROM user ORDER BY lastname";
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    print_r( "<select id='editCreator'>");
    for( $i = 0; $i < count( $result ); $i++ ) {
        echo "<option value='" . $result[$i]["id"] . "'>" . $result[$i]["name"] . "</option>";
    }     
    print_r( "</select>");
?>
         </div>
       </div>
       <div>
          <input type="radio" name="acc" id="usual2">
          <div class="panelHL"><label for="usual2">Datum/Zeit und Teilnahme</label></div>
          <div class="panel">
    <div class="startDateTime">    
        <div>Start</div>
        <div>Startzeit</div>
    </div>
    <div style="display: inline-flex;">
        <input type="date" id="editDetailDateFrom" class="date">
         <select id="editStartTimeHour">
            <option selected value="00">00</option>
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
        </select>
        <select id="editStartTimeMinutes">
            <option value="00" selected>00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
        </select>
        &nbsp;
        <label>Uhr</label>
    </div>
    <div class="startDateTime">    
        <div>Ende</div>
        <div>Endzeit</div>
    </div>
    <div style="display: inline-flex;">
        <input type="date" id="editDetailDateTo" class="date">
        <select id="editEndTimeHour">
            <option value="00" selected>00</option>
            <option value="01">01</option>
            <option value="02">02</option>
            <option value="03">03</option>
            <option value="04">04</option>
            <option value="05">05</option>
            <option value="06">06</option>
            <option value="07">07</option>
            <option value="08">08</option>
            <option value="09">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
            <option value="13">13</option>
            <option value="14">14</option>
            <option value="15">15</option>
            <option value="16">16</option>
            <option value="17">17</option>
            <option value="18">18</option>
            <option value="19">19</option>
            <option value="20">20</option>
            <option value="21">21</option>
            <option value="22">22</option>
            <option value="23">23</option>
        </select>
        <select id="editEndTimeMinutes">
            <option value="00" selected>00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
        </select>
        &nbsp;
        <label>Uhr</label>
    </div>
     <label>Anmeldeschluss</label>
    <input id="editDeadline" type="date" class="date">  <input type="button" id="editDeleteDeadline" class="cbDelete cbSizeMiddle" value="&nbsp;" title="Anmeldeschluss löschen"><br>
          </div>
       </div>
       <div>
          <input type="radio" name="acc" id="usual3">
          <div class="panelHL"><label for="usual3">Teilnahmeinformationen</label></div>
          <div class="panel">
    <label>teilnehmen als</label>
    <select id="editParticipateAs">
        <option value="0" selected="">ohne</option>
<?php
    $query = "SELECT role.id, role FROM role, account WHERE account.role_id = role.id AND user_id = " . $_SESSION["user_id"];
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    for( $i = 0; $i < count( $result ); $i++ ) {
        echo "<option value='" . $result[$i]["id"] . "'>" . $result[$i]["role"] . "</option>";
    }     
?>
    </select>
    <div>
        <a href="#" id="participate">Teilnehmen</a>erinnere mich&nbsp;&nbsp;<input id="remindMe" type="checkbox" style="margin-top: 0.5em">
    </div>
    <div id="divCountPart">
        Anzahl Teilnehmer&nbsp;&nbsp;<input id="count_part" type="number" min="1" step="1" value="1">
    </div>
    <div>
        <a href="#" id="deleteParticipation">Teilnahme löschen</a><br>
    </div>
    <a href="#" id="showParticipants">Teilnehmer/innen anzeigen</a>
    <div>&nbsp;</div>
    <a href="#" id="printParticipants" target="_blank">Teilnehmer drucken</a>
    <div>&nbsp;</div>
          </div>
       </div>
       <div>
          <input type="radio" name="acc" id="usual4">
          <div class="panelHL"><label for="usual4">Informiere Gr./TN</label></div>
          <div class="panel">
    <div>
        <label>informiere Gruppe</label>
        <select id="editInformRole">
            <option value="0" selected></option>
<?php
    $query = "SELECT * FROM role where id > 0";
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    $l = count( $result );
    $i = 0;
    while( $i < $l ) {
        echo "<option value='" . $result[$i]["id"] . "'>" . $result[$i]["role"] . "</option>";
        $i += 1;
    }
?>    
        </select>
    </div>
    <div>
        <label>informiere Nutzer</label>
        <select id="editInformUser" multiple>
<?php
    $query = "SELECT id, concat( lastname, ', ', firstname ) as name FROM user where id <> 0 order by lastname";
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    $l = count( $result );
    $i = 0;
    while( $i < $l ) {
        echo "<option value='" . $result[$i]["id"] . "'>" . $result[$i]["name"] . "</option>";
        $i += 1;
    }
?>    
        </select>
    </div>
          </div>
       </div>
       <div>
          <input type="radio" name="acc" id="usual5">
          <div class="panelHL"><label for="usual5">Beschreibung/Anhänge</label></div>
          <div class="panel">
     <label>Beschreibung</label>
    <textarea id="editDescription" placeholder="Beschreibung eingeben" maxlength="512"></textarea>
    <label>Notiz</label>
    <input id="editNotice" type="text">
    <label>Direktlink</label>
    <input id="editUrl" type="text"><input id="editInvalidUrl" type=checkbox>
    <label>interner Link</label>
    <input id="editInnerUrl" type="text"><input id="editInvalidInnerUrl" type=checkbox> <input type="button" id="editLoadAppendix" value="Anhang"> <input type="button" id="editDeleteAppendix" class="cbDelete cbSizeMiddle" value="&nbsp;" title="Anhang löschen">
    <label>Linktext</label>
    <input id="editInnerUrlText" type="text">
    <div id="divEditInnerUrl"></div>
    <div id="appendixLink">
    
        <a href="#" id="appendixLinkLink">www</a>
    
    </div>
          </div>
       </div>
    </div>

</div>
<div class="row">

    <div id="divCal" class="col"></div>

</div>

<script src="library/javascript/no_jquery.js"></script>
<script src="library/javascript/easyit_helper_neu.js"></script>
<script src="library/javascript/menu_calendar.js"></script>
<script src="library/javascript/DropResize.js"></script>
<script src="library/javascript/DialogDR.js"></script>
<script src="library/javascript/EventCalendar.js"></script>
<script src="library/javascript/Calendar.js"></script>
<script src="library/javascript/init_calendar.js"></script>
<script>
var cal = new Calendar({pVar: "cal", evCalId: "#divCal" } );
docReady(function() {
    init();
});
</script>
</body>
</html>
