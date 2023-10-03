<?php
class ChatRoom {
    public $chatId;
    public $Members;
    public $message;
    public $newId;
    public $success;
    public $errorNumber;
    public function __construct($pdo, $name, $creator, $roleId, $toChat = 0, $public = true, $active = true, $permanent = 0 ) {
        if( $toChat == 0 ) {
            return $this;
        }
        $return = new \stdClass();
        
        $this -> success = true;
        $this -> message = "Der Chatraum wurde erfolgreich angelegt";
        $this -> newId = null;
        $this -> chatId = $toChat;
        try {
            $query = "INSERT INTO `chat_room` (chat_id, `name`, `active`, `public`, `permanent`, `current_datetime`, `creator`) VALUES 
             ( $toChat, '$name', $public, $active, $permanent, NOW(3), $creator)";
            
            $result = $pdo -> query( $query );
            $this -> newId = $pdo->lastInsertId();
            $this -> Message = "Der Chatraum wurde erfolgreich angelegt.";
        } catch ( Exception $e ) {
                $this -> success = false;
                if( $e -> getCode() == "23000" ) {
                    $this -> message = "Dieser Chatraum kann nicht verwendet werden, da er bereits in Verwendung ist,";    
                } else {
                    $this -> message = "Beim Anlegen des Chatraums ist folgender Fehler aufgetreten:" . $e -> getMessage();
                    $this -> errorNumber = $e -> getCode();                    
                }    
        }
        return $this;
    }
    public  function addMember ( $pdo, $roleId, $user_id ) {
        $roles = [
            1=>'Administratoren', 2=>'Webmaster', 8=>'Moderatoren', 4=>'Nutzer'
        ] ;
        $this -> Members = $roles;
        $this -> users[] = $user_id;
        $query = "SELECT * FROM user, account WHERE user.id = $user_id and user.id = account.user_id";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        return $this -> users;               
    } 
    public function removeMember( $user_array, $user_id ) {
        for( $i = 0; $i < count( $user_array ); $i++ ) {
            if( $user_array[$i] == $user_id ) {
                unset( $user_array[$i] );
            }    
        }
        return $user_array;
    }
    public function saveRoom( $pdo, $chatId, $roomName, $roleId, $description, $active = 1, $public = 1, $permanent = 1 ) {
        $return = new \stdClass();
        $return -> success = true;
        $return -> newId = false;
        $query = "INSERT INTO `chat_room` (`chat_id`, `name`, `active`, `public`, `permanent`, `current_datetime`, `creator`, `$description`) 
        VALUES ($chatId, '" . $roomName . "', '1', '1', '0', NOW(3), " . $_SESSION["user_id"] . ", '$description');";
        try {
            $result = $pdo -> query( $query );
            $return -> newId = $pdo->lastInsertId();
            $return -> message = "Der Chatraum wurde erfolgreich angelegt.";
        } catch ( Exception $e ) {
            $return -> success = false;
            if( $e -> getCode() == "23000" ) {
                $return -> message = "Dieser Chatraum darf nicht verwendet werden, da er bereits in Verwendung ist,";    
            } else {
                $return -> message = "Beim Anlegen des Chats ist folgender Fehler aufgetreten:" . $e -> getMessage();
                $return -> errorNumber = $e -> getCode();                    
            }    
        }
    return $return;
    }
    public static function getRoomDetails( $pdo, $roomId ) {
        $return = new \stdClass();
        $return -> success = true;
        $query = "SELECT * FROM chat_room WHERE id = $roomId;";
        try {
            $stm = $pdo -> query( $query );
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);               
            $return -> message = "Der Chatraum wurde erfolgreich gelesen.";
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Lesen des Chats ist folgender Fehler aufgetreten:" . $e -> getMessage();                   
        }
    return $return;
    }
    public static function saveRoomDetails( $pdo, $roomId, $active, $public, $permanent, $description ) {
        $return = new \stdClass();
        $return -> success = true;
        $query = "UPDATE chat_room SET active = $active, public = $public, permanent = $permanent, description = '$description' WHERE id = $roomId;";
        try {
            $pdo -> query( $query );
            $return -> message = "Der Chatraum wurde erfolgreich aktualisiert.";
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Aktualisieren des Chatraums ist folgender Fehler aufgetreten:" . $e -> getMessage();                    
        }
    return $return;
    }
}
?>
