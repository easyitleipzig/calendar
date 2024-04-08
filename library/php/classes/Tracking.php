<?php
class Tracking {
    private $id;
    private $ip;
    private $email;
    private $password;
    private $datetime;
    private $active;
    private $pdo;
    public function __construct( $pdo ) {
        $this -> pdo = $pdo;
    }
    public function setTracking( $email, $password, $active ) {
        $ip = $_SERVER['REMOTE_ADDR'];
        $query = "INSERT INTO `tracking_login` (`ip`, `email`, `password`, `active`) VALUES ( '$ip', '$email', '$password', '$active')";
        try {
            $this -> pdo -> query( $query );
            $this -> id = $this -> pdo -> lastInsertId();
            return $this -> id;     
        } catch( Exception $e ) {
            return false;
        }
    }
    public function delTracking( $id ) {
        $query = "DELETE FROM `tracking_login` WHERE id = " . $id;
        try {
            $this -> pdo -> query( $query );
            return true;
        } catch( Exception $e ) {
            return false;
        }
       
    }
    public function setActive( $active ) {
        if( $id ) {
            $query = "UPDATE `tracking_login` SET `active` = '$active' WHERE `tracking_login`.`id` = " . $this -> id;
            try {
                $this -> pdo -> query( $query );
                return true;
            } catch( Exception $e ) {
                return false;
            }
        }
      
    }
    public function setTrack( $type, $pathname, $currentTrackId ) {
        $return = new \stdClass();
        $ip = $_SERVER["REMOTE_ADDR"];  
        $host = gethostbyaddr($ip);
        try {
            if( $type == "load" ) {
                if( !isset( $_SESSION["trackingPage"] ) || $_SESSION["trackingPage"] == "0" ) {
                    $query = "INSERT INTO `track_pages` (`ip`, `host`, type, user_id, `path`) VALUES ( '$ip', '$host','$type', " . $_SESSION["user_id"] . ", '$pathname')";
                    $this -> pdo -> query( $query );
                    $this -> id = $this -> pdo -> lastInsertId();
                    $return -> id = $this -> id;
                    $return -> success = true;
                    $return -> message = "Das Tracking der Seite war erfolgreich.";
                    $_SESSION["trackingPage"] = $this -> id;
                    return $return;     
                } else {
                    $query = "SELECT id, path FROM track_pages WHERE id = " . $_SESSION["trackingPage"] . " AND path = '$pathname' AND ip = '$ip' AND user_id = " . $_SESSION["user_id"];
                    $stm = $this -> pdo -> query( $query );
                    $r = $stm -> fetchAll( PDO::FETCH_ASSOC );
                    if( count( $r ) == 0 ) {
                        $query = "INSERT INTO `track_pages` (`ip`, `host`, type, user_id, `path`) VALUES ( '$ip', '$host','$type', " . $_SESSION["user_id"] . ", '$pathname')";
                        $this -> pdo -> query( $query );
                        $this -> id = $this -> pdo -> lastInsertId();
                        $_SESSION["trackingPage"] = $this -> id;
                        $return -> id = $this -> id;
                        $return -> success = true;
                        $return -> message = "Das Tracking der Seite war erfolgreich.";
                        return $return;     
                    } else {
                        $return -> id = $_SESSION["trackingPage"];
                        $return -> success = true;
                        $return -> message = "Das Tracking der Seite war erfolgreich.";
                        return $return;     
                    }
                    } 
            } else {
                $query = "UPDATE track_pages SET type = 'unload', curent_datetime_end = NOW() WHERE id = " . $_SESSION["trackingPage"];
                $this -> pdo -> query( $query );
                $return -> id = $_SESSION["trackingPage"];
                $return -> success = true;
                $return -> message = "Das Tracking der Seite war erfolgreich.";
            } 
                
            } catch( Exception $e ) {
                $return -> id = 0;
                $return -> success = false;
                $return -> message = "Beim Tracking der Seite ist folgender Fehler aufgetreten:" . $e -> getMessage();
            }
        return $return;
    }
    public function setTrackAction( $tracking_page, $path, $action ) {
        $return = new \stdClass();
        $query = "INSERT INTO `track_action` (`ip`,  `tracking_page`, `path`, `action`, `datetime`, user_id ) VALUES ('" . $_SERVER["REMOTE_ADDR"] . "', $tracking_page, '$path', '$action', current_timestamp(), " . $_SESSION["user_id"] . ")";            
        try {
            $this -> pdo -> query( $query );
            $this -> id = $tracking_page;
            $return -> id = $this -> id;
            $return -> success = true;
            $return -> message = "Das Tracking der Aktion war erfolgreich.";
        } catch( Exception $e ) {
            $return -> id = 0;
            $return -> success = false;
            $return -> message = "Beim Tracking der Aktion ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
}
?>
