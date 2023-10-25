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
    <style>
/* start event formats */
<?php 
    $q = "select id, bckg_color, font from event_format where id > 0;";
    $s = $db_pdo -> query( $q );
    $r = $s -> fetchALL( PDO::FETCH_ASSOC );
    $l = count( $r );
    $i = 0;
    while ( $i < $l ) {
        print_r( ".fc-" . $r[$i]["id"] . " {background-color: " . $r[$i]["bckg_color"] . "; color: " . $r[$i]["font"] . "}" . "\n" );
        $i += 1;
    }
?>
/* end event formats */
    </style>
    <script>
        <?php
            echo "let optPlace = '";
            $query = "SELECT * FROM event_place";
            $stm = $db_pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            for( $i = 0; $i < count( $result ); $i++ ) {
                echo '<option value="' . $result[$i]["id"] . '">' . $result[$i]["place"] . "</option>";
            }
            echo ";'\n";
            echo "let optPattern = '<option value=\"0\" selected>ohne</option>";                        
            $query = "SELECT id, name FROM event_pattern where id > 0 order by name";
            $stm = $db_pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            for( $i = 0; $i < count( $result ); $i++ ) {
                echo '<option value="' . $result[$i]["id"] . '">' . $result[$i]["name"] . "</option>";
            }     
            echo ";'\n";
            echo "let optCategory = '<option value=\"0\" selected>ohne</option>";                        
            $query = "SELECT * FROM event_format";
            $stm = $db_pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            for( $i = 0; $i < count( $result ); $i++ ) {
                echo '<option value="' . $result[$i]["id"] . '">' . $result[$i]["name"] . '</option>';
            }     
            echo ";'\n";
            echo "let optContactPerson = '<option value=\"0\" selected>ohne</option>";                        
            $query = "SELECT id, CONCAT( lastname, ', ', firstname ) AS name FROM user ORDER BY lastname";
            $stm = $db_pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            for( $i = 0; $i < count( $result ); $i++ ) {
                echo '<option value="' . $result[$i]["id"] . '">' . str_replace("'", "“", $result[$i]["name"] )  . '</option>';
            }     
            echo ";'\n";
            echo "let optRoleUser = '<option value=\"0\" selected>ohne</option>";                        
            $query = "SELECT role.id, role FROM role, account WHERE account.role_id = role.id AND user_id = " . $_SESSION["user_id"];
            $stm = $db_pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            for( $i = 0; $i < count( $result ); $i++ ) {
                echo '<option value="' . $result[$i]["id"] . '">' . $result[$i]["role"] . "</option>";
            }     
            echo ";'\n";
            echo "let optInformRole = '";                        
            $query = "SELECT * FROM role";
            $stm = $db_pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $l = count( $result );
            $i = 0;
            while( $i < $l ) {
                echo '<option value="' . $result[$i]["id"] . '">' . $result[$i]["role"] . "</option>";
                $i += 1;
            }
            echo ";'\n";
            echo "let optInformUser = '";                        
            $query = "SELECT id, concat( lastname, ', ', firstname ) as name FROM user where id <> 0 order by lastname";
            $stm = $db_pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $l = count( $result );
            $i = 0;
            while( $i < $l ) {
                echo '<option value="' . $result[$i]["id"] . '">' . str_replace("'", "“", $result[$i]["name"] ) . "</option>";
                $i += 1;
            }
            echo ";'\n";
    ?>
    const getTime = function( idTime, idMinutes ) {
        let content = "";
        content += '<select id="' + idTime + '"><option selected value="00">00</option><option value="01">01</option><option value="02">02</option><option value="03">03</option><option value="04">04</option><option value="05">05</option><option value="06">06</option><option value="07">07</option><option value="08">08</option><option value="09">09</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option></select>';
        content += '<select id="' + idMinutes + '"><option value="00" selected>00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option></select>';
        content += '&nbsp;<label style="position: relative; top: 10px">Uhr</label>';
        return content;
    }     
    </script>
</head>
<body>
<a href="#" id="openDialog1">openDialog1</a>
<a href="#" id="openDialog2">openDialog2</a>
<a href="#" id="openMessage">openMessage</a>
<a href="#" id="openMessageNews">openMessageNews</a>

<div id="editEvent" style="display: none;">
    <div class="accordion">          
        <div>
            <input type="radio" name="acc" id="usual1" checked>
            <div class="panelHL"><label for="usual1">Allgemein</label></div>
            <div class="panel">
                <input id="Id">
                <input id="innnerId">
                <input id="allDay" type="checkbox">
                <input id="groupId" value="0">
                <select id="usePattern"></select>
                <label>Titel</label>
                <input id="title" type="text">
                <label>Ort</label>
                <select id="place"></select>
                <label>Kategorie</label>
                <select id="category"></select>
                <label>Ansprechpartner</label>
                <select id='creator'></select>
            </div>
       </div>
       <div>
            <input type="radio" name="acc" id="usual2">
            <div class="panelHL"><label for="usual2">Datum/Zeit</label></div>
            <div class="panel">
                <div class="startDateTime">    
                    <div>Start</div>
                    <div>Startzeit</div>
                </div>
                <div style="display: inline-flex;">
                    <input type="date" id="startDate" class="date">
                    <div id="startMinutes" style="display: inline-flex;"></div>
                </div>
                <div class="startDateTime">    
                    <div>Ende</div>
                    <div>Endzeit</div>
                </div>
                <div style="display: inline-flex;">
                    <input type="date" id="endDate" class="date">
                    <div id="endMinutes" style="display: inline-flex;"></div>
                </div>
                 <label>Anmeldeschluss</label>
                <input id="deadline" type="date" class="date">&nbsp;<input type="button" id="deleteDeadline" class="cbDelete cbSizeMiddle" value="&nbsp;" title="Anmeldeschluss löschen"><br>
                <label>Wiederholen</label>
                <select id="repeat">
                    <option value="0" selected=""></option>
                    <option value="1">täglich</option>
                    <option value="5">wochentags</option>
                    <option value="7">wöchentlich</option>
                    <option value="14">aller 2 Wochen</option>
                    <option value="28">aller 4 Wochen</option>
                    <option value="31">monatlich</option>
                    <option value="2">1./3./5. Wochentag des Monats</option>
                    <option value="3">2./4. Wochentag des Monats</option>
                </select>
                <label>Wiederholen bis</label>
                <input type="date" id="repeatTo" class="date"> <input type="button" id="deleteRepeatTo" class="cbDelete cbSizeMiddle" value="&nbsp;" title="Wiederholung löschen">
          </div>
        </div>
        <div>
            <input type="radio" name="acc" id="usual3">
            <div class="panelHL"><label for="usual3">Teilnahmeinformationen</label></div>
            <div class="panel">
                <label>teilnehmen als</label>
                <select id="participateAs"></select>
                <div>
                    <a href="#" id="participate">Teilnehmen</a>&nbsp;&nbsp;erinnere mich&nbsp;&nbsp;<input id="remindMe" type="checkbox" style="margin-top: 0.5em">
                </div>
                <div id="divCountPart">
                    Anzahl Teilnehmer&nbsp;&nbsp;<input id="countPart" type="number" min="1" step="1" value="1">
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
        <select id="informRole"></select>
    </div>
    <div>
        <label>informiere Nutzer</label>
        <select id="informUser" multiple></select>
    </div>
          </div>
       </div>
       <div>
          <input type="radio" name="acc" id="usual5">
          <div class="panelHL"><label for="usual5">Beschreibung/Anhänge</label></div>
          <div class="panel">
     <label>Beschreibung</label>
    <textarea id="Description" placeholder="Beschreibung eingeben" maxlength="512"></textarea>
    <label>Notiz</label>
    <input id="Notice" type="text">
    <label>Direktlink</label>
    <input id="Url" type="text"><input id="editInvalidUrl" type=checkbox>
    <label>interner Link</label>
    <input id="newInnerUrl" type="text" placeholder="Link eingeben" maxlength="255">
    <img src="library/css/icons/AppEmpty.png" data-filesrc id="imgFileAppendix" class="imgFileAppendix">
    <input type="button" id="loadAppendix" value="Anhang"> 
    <input type="button" id="deleteAppendix" class="cbDelete cbSizeMiddle" value="&nbsp;" title="Anhang löschen">
    <input type="checkbox" id="sendAppendix" title="Anhang mitsenden">senden
    <label>Linktext</label>
    <input id="innerUrlText" type="text">
<!--
    <div id="divInnerUrl"></div>
-->
    <div id="divAppendixLink">
    
        <a href="#" id="appendixLink">www</a>
    
    </div>
          </div>
       </div>
    </div>

</div>
<section id="divCalendar">
    <article>
        <div class="row">

            <div id="divCal" class="col"></div>

        </div>
    </article>
    <article id="legende">
        <h1>Legende</h1>
        <div>&nbsp;</div>
        <div>
        <?php
            $query = "SELECT * FROM event_format";
            $stm = $db_pdo -> query( $query );
            $result_format = $stm -> fetchAll(PDO::FETCH_ASSOC);
            for( $i = 0; $i < count( $result_format ); $i++) {
                print_r( '<div><div>' . $result_format[$i]["name"] . '</div><div style="background-color: ' . $result_format[$i]["bckg_color"] . '; color: ' . $result_format[$i]["font"] . ';">Termin</div></div>');    
            }
                        
        ?>
        </div>
        <h1>Termine exportieren</h1>
        <div>&nbsp;</div>
        <div style="text-align: center; margin-bottom: 1em;">
            <input id="exportEvents" type="button" value="Exportieren">
        </div>
    </article>
</section>
<!-- nessecary for MessagesNewsDR as bell elment -->
<input id="test">
<input id="test_small">
<!-- -->
<script src="library/javascript/no_jquery.js"></script>
<script src="library/javascript/easyit_helper_neu.js"></script>
<script src="library/javascript/menu_calendar.js"></script>
<script src="library/javascript/DropResize.js"></script>
<script src="library/javascript/DialogDR.js"></script>
<script src="library/javascript/MessagesNewsDR.js"></script>
<script src="library/javascript/MessageDR.js"></script>
<script src="library/javascript/EventCalendar.js"></script>
<script src="library/javascript/Calendar.js"></script>
<script src="library/javascript/init_calendar.js"></script>
<script>
<?php
    echo "var currentUserId = " . $_SESSION['user_id'] . ";\n";
?>
var cal = new Calendar({pVar: "cal", evCalId: "#divCal", type: "editable" } );
docReady(function() {
    init();
});
</script>
</body>
</html>
