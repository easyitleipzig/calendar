<?php
class SAndA{
    public function getSAndACategories( $pdo ) {
        $return = new \stdClass();
        try{
            $query = "SELECT * FROM s_and_a_category";
            $stm = $pdo -> query( $query );
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> success = true;
            $return -> message = "Die Kategorien wurden erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Kategorien ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;        
    }
    public function getSAndAs( $pdo ) {
        $return = new \stdClass();
        try{
            $query = "SELECT * FROM s_and_a";
            $stm = $pdo -> query( $query );
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> success = true;
            $return -> message = "Die Daten wurden erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Daten ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;        
    }
    public function newEntry( $pdo, $userId, $toRole, $creationDate, $eventDate, $eventDeadline, $eventTime, $endTime, $place, $category, $image, $title, $description, $longDescription, $link, $linktext, $appendix, $message_behavior ) {
        $return = new \stdClass();
        require_once( "CalendarEvent.php" );
        $ev = new \CalendarEvent();
        if( $eventTime == "00:00" ) {
            $stop_date = new DateTime($eventDate . " " . $eventTime );
            $stop_date->modify('+1 day');
            $eventEndDate = $stop_date->format('Y-m-d H:i');
        } else {
            $eventEndDate = $eventDate;
        }
        try {
            $result = $ev -> newEvent( $pdo, 0, $title, $eventDate, $eventEndDate, $eventTime, $endTime, '', $description,'', 0,'', $place, "fc-9", $eventDeadline, $link, $linktext, $_SESSION["user_id"]  );    
            
            $query = "INSERT INTO `s_and_a` ( `user_id`, `to_role`, `event_date`, `category`, `image`, `title`, 
            `desc`, `long_description`, `link`, `linktext`, `event_id`, appendix ) VALUES 
            ( " . $_SESSION["user_id"] . ", $toRole, '" . $eventDate . "', $category, '$image', '$title', 
            '$description', '$longDescription', '$link', '$linktext', " . $result -> lastEventId . ", '$appendix')";
            $pdo -> query( $query );
            $newSandAId = $pdo -> lastInsertId();
            if( $link == "show_s_and_a_info.php?id=new" ) {
                $link = substr( $link, 0, strlen( $link) - 3 );
                $query = "UPDATE s_and_a SET link = '$link" . $newSandAId . "' WHERE id = " . $newSandAId;
                $pdo -> query( $query ); 
                $query = "UPDATE event SET inner_url = '$link" . $newSandAId . "', inner_url_text = '$linktext' WHERE id = " . $result -> lastEventId ;
                $pdo -> query( $query ); 
            }
            $tmpFileName = explode( "/", $image );
            $fName = $tmpFileName[ count($tmpFileName) - 1 ];
            if( substr( $fName, 0, 3 ) != "cat") {
                $tmpExt = explode( ".",  $fName );
                $ext = $tmpExt[ count($tmpExt) - 1 ];
                rename( "../images/s_and_a/$fName", "../images/s_and_a/cat_ev_" . $newSandAId . "." . $ext );
                $query = "UPDATE s_and_a SET image = 'library/images/s_and_a/cat_ev_" . $newSandAId . "." . $ext . "' WHERE id = $newSandAId";
                $pdo -> query( $query );
            }
            $result = $ev -> participate( $pdo, $_SESSION["user_id"], $result -> lastEventId, false );
            require_once( "Message.php" );
            require_once( "functions.php" );
            $message = "Unter „Spontan und Aktiv” wurde das Ereignis „" . $title . "” angelegt.";
            switch( $message_behavior ) {
                case "message":
                    $m = new \Message();
                    $m -> newMessage( $pdo, "Spontan und Aktiv", $message, 0, $_SESSION["user_id"], $toRole, 0 );
                break;
                case "email": 
                    $query = "SELECT CONCAT( firstname, ' ', lastname ) AS name, email FROM user, account WHERE  account.user_id = user.id AND role_id = " . $toRole;
                    $stm = $pdo -> query( $query );
                    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                    $l = count( $result );
                    $i = 0;
                    while( $i < $l ) {
                        sendInformCreatorSAndAEmail( $result[$i]["name"], $result[$i]["email"], $message );    
                        $i += 1;
                    }
                break;
                case "both":
                    $m = new \Message();
                    $m -> newMessage( $pdo, "Spontan und Aktiv", $message, 0, $_SESSION["user_id"], $toRole, 0 );
                    $query = "SELECT CONCAT( firstname, ' ', lastname ) AS name, email FROM user, account WHERE  account.user_id = user.id AND role_id = " . $toRole;
                    $stm = $pdo -> query( $query );
                    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                    $l = count( $result );
                    $i = 0;
                    while( $i < $l ) {
                        sendInformCreatorSAndAEmail( $result[$i]["name"], $result[$i]["email"], $message );    
                        $i += 1;
                    }
                break;
                case "intelligent":
                    if( $result[$i]["opt_in"] == 1 ) {
                        $query = "SELECT CONCAT( firstname, ' ', lastname ) AS name, email FROM user, account WHERE  account.user_id = user.id AND role_id = " . $toRole;
                        $stm = $pdo -> query( $query );
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $l = count( $result );
                        $i = 0;
                        while( $i < $l ) {
                            sendInformCreatorSAndAEmail( $result[$i]["name"], $result[$i]["email"], $message );    
                            $i += 1;
                        }
                    } else {
                        $m = new \Message();
                        $m -> newMessage( $pdo, "Spontan und Aktiv", $message, 0, $_SESSION["user_id"], $toRole, 0 );
                    }
                break;
            }                    
           
            $return -> success = true;
            $return -> message = "Das Ereignis wurde erfolgreich angelegt.";
        } catch( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Anlegen des Ereignisses ist folgender Fehler aufgetreten: " . $e -> getMessage() . ".";
        }
        return $return;        
    }
    public function saveEntry( $pdo, $eventId, $toRole, $creationDate, $eventDate, $eventDeadline, $eventTime, $endTime, $place, $category, 
            $image, $title, $description, $longDescription, $link, $linkText, $appendix, $message_behavior ) {
            if( $longDescription != "" && ( $link == "" && $linkText == "" ) ) {
                $link = "show_s_and_a_add_info.php?id=" . $eventId;
                $linkText = "Zusatzinfo";    
            }
        $return = new \stdClass();
        try {
            $tmpFileName = explode( "/", $image );
            $fName = $tmpFileName[ count($tmpFileName) - 1 ];
            if( substr( $fName, 0, 3 ) != "cat") {
                $tmpExt = explode( ".",  $fName );
                $ext = $tmpExt[ count($tmpExt) - 1 ];
                rename( "../images/s_and_a/$fName", "../images/s_and_a/cat_ev_" . $eventId . "." . $ext );
                $image = "library/images/s_and_a/cat_ev_" . $eventId . "." . $ext;
            }
            $query = "UPDATE `s_and_a` SET `to_role` = $toRole, `event_date` = '$eventDate', `category` = $category, 
            `image` = '$image', `title` = '$title', `desc` = '$description', 
            `long_description` = '$longDescription', `link` = '$link', `linktext` = '$linkText', appendix='$appendix' WHERE `s_and_a`.`id` = " . $eventId;
            $pdo -> query( $query );            
            $return -> success = true;
                
            $return -> message = "Das Speichern des Ereignisses war erfolgreich.";
        } catch ( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Speichern des Ereignisses ist folgender Fehler aufgetreten:" . $e -> getMessage();
            
        }
        $query = "SELECT event_id FROM s_and_a WHERE id = " . $eventId;
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);        
        require_once( "CalendarEvent.php" );
        if( $eventTime == "00:00" ) {
            $stop_date = new DateTime($eventDate . " " . $eventTime );
            $stop_date->modify('+1 day');
            $eventEndDate = $stop_date->format('Y-m-d H:i');
        } else {
            $eventEndDate = $eventDate;
        }
        $ev = new \CalendarEvent();
        $result = $ev -> saveEvent( $pdo, $result[0]["event_id"], 0, $title, $eventDate, $eventEndDate, $eventTime, $endTime, '', $description, '', $place,"fc-9", $eventDeadline, $link, $linkText, $_SESSION["user_id"] );    
        return $return;        
    }
    public function deleteEntry( $pdo, $id, $message_behavior, $cal_message_behavior ) {
        $return = new \stdClass();        
        try {
            $query = "SELECT event_id, appendix FROM s_and_a WHERE id = " . $id;
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            if( $result[0]["appendix"] != "" ) unlink( "../../" . $result[0]["appendix"] );
            require_once( "CalendarEvent.php" );
            $ev = new \CalendarEvent();
            $ev -> deleteEvent( $pdo, $result[0]["event_id"], $cal_message_behavior );
            $query = "DELETE FROM s_and_a WHERE id = " . $id;
            $pdo -> query( $query );        
            $return -> success = true;
            $return -> message = "Das Ereignisses wurde erfolgreich gelöscht.";
        } catch ( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Löschen des Ereignisses ist folgender Fehler aufgetreten:" . $e -> getMessage();
            
        }
        return $return;
    }
}  
?>
