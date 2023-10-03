<?php
class Log {
    public function newLog( $pdo, $date, $modul, $log ) {
        $return = new \stdClass();
        $query = "INSERT INTO log ( date, modul, log ) VALUES ( '$date', '$modul', '$log' )";
        try {
            $pdo-> query( $query );
            $return -> success = true;
            $return -> message = "Der Logeintrag wurde erfolgreich geschrieben";                  
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Schreiben desLogeintrages ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;
    }
}  
?>
