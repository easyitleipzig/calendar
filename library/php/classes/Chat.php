<?php
class Chat {
    public function checkForExistingNickname( $pdo, $chatId, $nickName ) {
        /*
        $query = "SELECT count( chat_user.id ) AS count_id FROM chat, chat_user WHERE chat_user.chat_id = chat.id and chat_user.nickname = '" . $nickName . "'";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return =  $result[0]["count_id"];
        */
        $query = "SELECT * FROM chat_user, chat WHERE nickname = '$nickName'";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return = count( $result );        
        return $return;
    }
    public function setChatContent( $pdo, $chatId, $roomId, $userId, $content ) {
        require_once( "functions_badword.php" );
        require_once( "classes/Message.php" );
        $return = new \stdClass();
        $query = "INSERT INTO chat_content ( chat_id, room_id, user_id, content, curr_datetime ) VALUES ( $chatId, $roomId, $userId, '$content', NOW())";
        try{ 
            $result = $pdo -> query( $query );
            $chatContentId = $pdo -> lastInsertId();
            $return -> success = true;
            $return -> message = "Inhalt erfolgreich übermittelt.";
            $test = filterBadwords( $content );
            if( $test > -1 ) {
                // set suspect
                $query = "SELECT chat.name as chatName, chat_room.name AS roomName FROM chat, chat_room, chat_content WHERE chat_content.chat_id = chat.id AND chat_content.room_id = chat_room.id AND chat_content.id = $chatContentId"; 
                $stm = $pdo -> query( $query );
                $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $chatName = $result[0]["chatName"];
                $roomName = $result[0]["roomName"];
                $query = "INSERT INTO chat_suspect ( chat_name, room_name ) VALUES ( '$chatName', '$roomName' )";
                $pdo -> query( $query );
                $suspectId = $pdo -> lastInsertId();
                $query = "SELECT chat_user.user_id, content FROM chat_user, chat_content WHERE chat_content.user_id = chat_user.id ORDER BY chat_content.id DESC LIMIT 5";
                $stm = $pdo -> query( $query );
                $return -> dataSuspect = $stm -> fetchAll(PDO::FETCH_ASSOC);
                for( $i = 0; $i < count( $return -> dataSuspect ); $i++ ) {
                    $query = "INSERT INTO chat_suspect_content ( chat_suspect_id, user_id, content) VALUES ( $suspectId, " . $return -> dataSuspect[$i]["user_id"] . ", '<span>" . $return -> dataSuspect[$i]["content"] . "</span>')";
                    $pdo -> query( $query );
                }
                // get user name
                $query = "SELECT CONCAT( firstname, ' ', lastname) as userName FROM user WHERE id = " . $return -> dataSuspect[0]["user_id"];
                $stm = $pdo -> query( $query );
                $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $userName = $result[0]["userName"];
                // end user name
                $m = new \Message();
                $m -> newMessage( $pdo, "Chatinhaltsverletzung", date("d.m.Y H:i", time() ) . " kam es durch $userName zu einer möglichen Chatinhaltsverletzung", 1, 0, 8, 0);
                $return -> isSuspect = true;
            } else {
                $return -> isSuspect = false;
            }
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Einfügen des Inhaltes ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
        }
        return $return;
    }
    public function deleteChat( $pdo, $chatId ) {
        $return = new \stdClass();
        $query = "DELETE FROM chat WHERE id = $chatId";
        try{ 
            $result = $pdo -> query( $query );
            $query = "DELETE FROM chat_room WHERE chat_id = $chatId";
            $result = $pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Chat erfolgreich gelöscht.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Löschen des Chats ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
        }
        return $return;
    }
    public function getChats( $pdo, $active = true, $permanent = true ) {
        $return = new \stdClass();
        try{
            if( $active ) {
                $stm = $pdo -> query("SELECT * FROM `chat` WHERE active = $active");
            } else {
                $stm = $pdo -> query("SELECT * FROM `chat`");
            }
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> success = true;
            // get count user
            for( $i = 0; $i < count( $return -> data ); $i++ ) {
                $stm = $pdo -> query("SELECT COUNT(user_id) AS count_user FROM `chat_user` WHERE chat_id = " . $return -> data[$i]["id"]);
                $test = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $tn = $test[0]["count_user"];
                $return -> data[$i]["tn"] = $tn;                
            }
            // get nickname from session variables
            $query = "SELECT nickname FROM chat_user WHERE user_id = " . $_SESSION["user_id"];
            $stm = $pdo -> query( $query );
            $return -> user = $stm -> fetchAll(PDO::FETCH_ASSOC);
            if( count( $return -> user ) == 0 ) {
                $return -> nickname = $_SESSION["firstname"] . " " . strtoupper( substr( $_SESSION["lastname"], 0, 1 ) ) . ".";                    
            } else {
                $return -> nickname = $return -> user[0]["nickname"];
            }          
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Chats ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
        }
        return $return;                            
    }
    public function getChatDetails( $pdo, $chatId ) {
        $return = new \stdClass();
        $stm = $pdo -> query("SELECT NOW(3) AS CURR_DATATIME");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC); 
        $return -> date_time = $result[0]['CURR_DATATIME'];
        try{
            $stm = $pdo -> query("SELECT name, active, public, permanent, description FROM `chat` WHERE id = $chatId");
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> success = true;
            $return -> message = "Die Chatdetails wurden erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Chatdetails ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
        }
        return $return;                            
    }
    public function refreshChat( $pdo, $chatId, $room_id, $settings ) {
        $return = new \stdClass();
        $query = "SELECT last_content_id FROM chat_user WHERE user_id = " . $_SESSION["user_id"];
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $query = "select chat_content.* from chat_content WHERE room_id = $room_id AND id > " . $result[0]["last_content_id"] . " ORDER BY chat_content.id DESC LIMIT " . $settings["chat"]["count_records_chat_content"];        
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return -> content = $result;
            if( count( $result ) > 0 ) {
            $query = "UPDATE chat_user SET last_content_id = " . $result[0]["id"] . " WHERE user_id = " . $_SESSION["user_id"];
            $pdo -> query( $query );
        }
        $query = "SELECT chat_invitation.id, chat_invitation.chat_id, chat_invitation.chat_id, chat_invitation.room_id, chat_invitation.repeated, chat_invitation.from_user, chat.name AS chatName, chat_room.name as roomName FROM `chat_invitation`, chat, chat_room WHERE chat_invitation.chat_id = chat.id AND chat_invitation.room_id = chat_room.id AND chat_invitation.to_user = " . $_SESSION["user_id"];
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        for( $i = 0; $i < count( $result ); $i++ ) {
            if( $result[$i]["repeated"] > $settings["chat"]["repeat_invitation_message"] ) {
                
            } else {
                $update_query = "UPDATE chat_invitation SET repeated = " . ( $result[$i]["repeated"] + 1 ) . " WHERE id = " . $result[$i]["id"];
                $pdo -> query( $update_query );
                $new_row = new \stdClass();
                $new_row -> id = 0;
                $new_row -> chat_id = $result[$i]["chat_id"];
                $new_row -> room_id = $result[$i]["room_id"];
                $new_row -> user_id = $_SESSION["user_id"];
                $new_row -> curr_datetime = date("Y-m-d H:i:s",time() );
                $new_row -> invitationId = $result[$i]["id"]; 
                $new_row -> content = '<span class="userInvitation">' . $result[$i]["from_user"] . '</span> hat Sie im Chat "' . $result[$i]["chatName"] . '" in den Raum "' . $result[$i]["roomName"] . '" eingeladen</span>';
                $new_row -> content .= '&nbsp;&nbsp;<a href="#" onclick="acceptInvitation( true,' . $new_row -> invitationId . ' )">Einladung annehmen</a>&nbsp;&nbsp;';
                $new_row -> content .= '<a href="#" onclick="acceptInvitation( false,' . $new_row -> invitationId . ' )">Einladung ablehnen</a>';
                $return -> content = array_reverse( $return -> content );
                $return -> content[] = $new_row;
                $return -> content = array_reverse( $return -> content );
            }
            
        }
        return $return;
    }
    public function acceptInvitation( $pdo, $parameter, $invitationId ) {
        $return = new \stdClass();
        $return -> parameter = $parameter;
        if( $parameter ) {
            $query = "SELECT room_id, chat_invitation.chat_id, chat_room.name FROM chat_invitation, chat_room WHERE chat_invitation.room_id = chat_room.id AND chat_invitation.id = $invitationId";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> roomId = $result[0]["room_id"];
            $return -> chatId = $result[0]["chat_id"];
            $return -> roomName = $result[0]["name"];
            $query = "UPDATE chat_user SET chat_id = " . $return -> chatId . " WHERE user_id = " . $_SESSION["user_id"];
            $pdo -> query( $query ); 
        } else {
            $return -> roomId = null;
        }
        $query = "DELETE FROM chat_invitation WHERE id = $invitationId";
        $pdo -> query( $query );
        $return -> success = true;
        $return -> message = "Die Einladung wurde korrekt bearbeitet";
        return $return;        
    }
    public function enterChat( $pdo, $chatId, $nickName, $fontColor, $settings ) {
        $return = new \stdClass();
        $return -> chatId = $chatId;
        // get room number for chat and "Zentrale"
        $query = "SELECT id FROM chat_room WHERE chat_id = $chatId AND name = 'Zentrale'";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC); 
        $return -> roomId = $result[0]['id'];
        // create user

        $query = "INSERT INTO `chat_user` ( chat_id, room_id, user_id, `nickname` ) VALUES ( $chatId, " . $return -> roomId . ", " . $_SESSION["user_id"] . ", '" . $nickName . "');";
        try {
            $result = $pdo -> query( $query );
            $return -> userId = $pdo -> lastInsertId();
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Anlegen des Chatnutzers ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
            return $return;
        }
        // get user_id for nickname
/*
        $query = "SELECT id FROM chat_user WHERE nickname = '$nickName'";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC); 
        $return -> userId = $result[0]['id'];
*/        
        // 1. insert content "[nickname] betritt Raum Zentrale"
        $query = "INSERT INTO `chat_content` ( chat_id, `room_id`, `user_id`, `curr_datetime`, `content`) VALUES ( $chatId, " . $return -> roomId . ", " . $return -> userId . ", NOW(), '<span style=\"color: $fontColor\">$nickName</span> betritt den Raum')";
        $result = $pdo -> query( $query );
        $return -> success = true;
        $return -> message = "Raum erfolgreich betreten.";
        /*
        // 2. Rooms im Chat
        $query = "Select id, name from chat_room WHERE chat_id = $chatId AND public = true AND active = 1 ";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return -> rooms = $result;
        $query = "Select id as user_id, nickname from chat_user WHERE chat_id = $chatId";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return -> user = $result;
        */  
        $query = "select DISTINCT( chat_content.id) as id, chat_content.chat_id, chat_content.room_id, chat_content.user_id, chat_content.curr_datetime, 
                    chat_content.content from chat_content, chat_room WHERE chat_content.chat_id = $chatId AND chat_room.name = 'Zentrale' 
                    ORDER BY chat_content.id DESC LIMIT " . $settings["chat"]["count_records_chat_content"]; 
        $stm = $pdo -> query( $query );
        $return -> content = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $query = "select chat_room.id from chat_room WHERE chat_id = $chatId AND chat_room.name = 'Zentrale'"; 
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return -> roomId = $result[0]["id"];
        
        return $return;
    }
    public function switchRoom( $pdo, $userId, $nickname, $chatId, $oldRoomId, $newRoomId, $fontColor ) {
        $return = new \stdClass();
        $return -> success = true;
        $return -> message = "Der Chatraum wurde erfolgreich gewechselt";
        $query = "INSERT INTO `chat_content` (`chat_id`, `room_id`, `user_id`, `curr_datetime`, `content`) 
                    VALUES ( $chatId, $oldRoomId, $userId, NOW(3), '<span style=\"color: " . $fontColor . "\">$nickname</span> verlässt den Raum')";                
        try {
            $result = $pdo -> query( $query );
            $query = "INSERT INTO `chat_content` (`chat_id`, `room_id`, `user_id`, `curr_datetime`, `content`) 
                        VALUES ( $chatId, $newRoomId, $userId, NOW(3), '<span style=\"color: " . $fontColor . "\">$nickname</span> betritt den Raum')";                
            $result = $pdo -> query( $query );
            $query = "UPDATE chat_user SET room_id = $newRoomId WHERE id = $userId";
            $result = $pdo -> query( $query );
            $query = "select chat_content.* from chat_content WHERE room_id = $newRoomId ORDER BY chat_content.id DESC LIMIT 20"; 
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> content = $result;
            $return -> success = true;
            $return -> message = "Das Wechseln des Chatraums war erfolgreich.";
            
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Wechseln des Chatraums ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }        
        return $return;
    }
    public function leftChat( $pdo, $chatId, $roomId, $userId, $nickName ) {
        $return = new \stdClass();
        $return -> chat_id = $chatId;
        $query = "INSERT INTO chat_content ( chat_id, room_id, user_id, curr_datetime, content ) VALUES ( $chatId, $roomId, $userId, NOW(3), '<span style=\"color: " . $_SESSION["chatFontColor"] . "\">$nickName</span> verlässt den Raum')";
        $result = $pdo -> query( $query );
        $return -> success = true;
        $return -> message = "Raum erfolgreich verlassen.";
        $query = "DELETE FROM chat_user WHERE id = $userId";
        $result = $pdo -> query( $query );
        return $return;
    }
    public function newChat( $pdo, $chatName, $creator, $roleId, $description= "", $active = true, $permanent = 0 ) {
        $return = new \stdClass(); 
        if( $roleId == 1 || $roleId == 2 || $roleId == 8  ) {
            $query = "INSERT INTO `chat` (`name`, `active`, `permanent`, `current_datetime`, `description`) VALUES ('$chatName', $active, 1, NOW(), '$description')";
        } else {
            $query = "INSERT INTO `chat` (`name`, `active`, `permanent`, `current_datetime`, `description`) VALUES ('$chatName', $active, $permanent,  NOW(), '$description')";    
        }
        try {
            $result = $pdo -> query( $query );
            $return -> newChatId = $pdo -> lastInsertId();
            $query = "INSERT INTO `chat_room` (`chat_id`, `name`, `active`, `public`, `permanent`, `current_datetime`, `creator`) VALUES (" . $return -> newChatId . ", 'Zentrale', true, true, true, NOW(), " . $_SESSION["user_id"] . " );";
            $result = $pdo -> query( $query );
            $return -> newRoomId = $pdo -> lastInsertId();
            $return -> success = true;
            $query = "UPDATE `chat_room` SET `creator` = " . $_SESSION["user_id"] . " WHERE `chat_room`.`id` = " . $return -> newRoomId;
            $result = $pdo -> query( $query );            
            $query = "UPDATE `chat` SET `creator` = " . $_SESSION["user_id"] . " WHERE `chat`.`id` =" . $return -> newChatId;
            $result = $pdo -> query( $query );
        $query = "select DISTINCT( chat_content.id) as id, chat_content.chat_id, chat_content.room_id, chat_content.user_id, chat_content.curr_datetime, 
                    chat_content.content from chat_content, chat_room WHERE chat_content.chat_id = " . $return -> newChatId . " AND chat_room.name = 'Zentrale' 
                    ORDER BY chat_content.id DESC LIMIT 20;"; 
        $stm = $pdo -> query( $query );
        $return -> content = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> message = "Der Chat wurde erfolgreich angelegt.";
            $return -> success = true;
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> errorNumber = $e -> getCode();
            if( $e -> getCode() == "23000" ) {
                $return -> message = "Dieser Chatname wird bereits verwendet und kann nicht noch einmal vergeben werden!";    
            } else {
                $return -> message = "Beim Anlegen des Chats ist folgender Fehler aufgetreten: " . $e -> getMessage();
            }
        }        
        return $return;
    }
    public function saveChatDetails( $pdo, $chatId, $active, $public, $permanent, $description ) {
        $return = new \stdClass();
        $query = "UPDATE `chat` SET `description` = '$description', `active` = $active, `public` = $public, `permanent` = $permanent WHERE `chat`.`id` = $chatId";
        try {
            $result = $pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Die Chatdetails wurden erfolgreich gespeichert";
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> errorNumber = $e -> getCode();
            $return -> message = "Beim Anlegen des Chats ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }        
        return $return;
    }
    public function getRooms( $pdo, $chatId, $active, $public ) {
        $return = new \stdClass();
        try {
            $query = "SELECT chat_room.* FROM chat_room, chat_invitation WHERE room_id = chat_room.id AND to_user = " . $_SESSION["user_id"];
            $stm = $pdo -> query( $query );            
            $return -> data_forInvitation = $stm -> fetchAll(PDO::FETCH_ASSOC);
            
             
            $query = "SELECT chat_room.* FROM chat_room WHERE chat_id = $chatId AND active = $active AND public = $public AND creator <> " . $_SESSION["user_id"];
            $stm = $pdo -> query( $query );            
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            //$return -> data = array_diff( $return -> data, $return -> data_forInvitation );

            for( $i = 0; $i < count( $return -> data ); $i++ ) {
                for( $j = 0; $j < count( $return -> data ); $j++ ) {
                    if( isset( $return -> data[$i]["id"] ) && isset( $return -> data_forInvitation[$j]["id"] ) ) {
                        if( $return -> data[$i]["id"] == $return -> data_forInvitation[$j]["id"] ) {
                            unset( $return -> data[$i] );
                        }                        
                    }
                }
            }
            $query = "SELECT chat_room.* FROM chat_room WHERE chat_id = $chatId AND active = $active AND public = $public AND creator = " . $_SESSION["user_id"];
            $stm = $pdo -> query( $query );            
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> data_forCreator = $result;
            $return -> success = "true";
            $return -> message = "Die Daten wurden erfolgreich geladen.";
             
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> errorNumber = $e -> getCode();
            $return -> message = "Beim Anlegen des Chats ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }        
        return $return;
    }
    public function setChatRoom( $pdo, $toChat, $active, $public, $permanent ) {
        require_once("\classes\ChatRoom");
        return new \ChatRoom( $pdo, $name, $toChat, $public, $active, $permanent );
    }  
    public function getCountParticipants( $pdo, $toChat ) {
        $return = new \stdClass();
        $query = "SELECT count(user_id) as count_user FROM chat_user WHERE chat_id = $toChat";
        try {
            $stm = $pdo -> query( $query );            
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> countParticipants = $result[0]["count_user"];
            $query = "SELECT permanent FROM chat WHERE id = $toChat";
            $stm = $pdo -> query( $query );            
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> permanent = $result[0]["permanent"];
            $return -> success = true;
            $return -> message = "Die Chatteilnehmer wurden erfolgreich gelesen.";
        
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> errorNumber = $e -> getCode();
            $return -> message = "Beim Lesen der Chatteilnehmer ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;
    }        
    public function getParticipants( $pdo, $toChat, $toRoom, $toUserId, $timeOut ) {
        $return = new \stdClass();
        $return -> success = true;
        $return -> message = "Die Chatteilnehmer wurden erfolgreich gelesen";
        try {
            $query = "SELECT user_id FROM chat_user WHERE id = $toUserId";
            $stm = $pdo -> query( $query );            
            $toUserId = $stm -> fetchAll(PDO::FETCH_ASSOC)[0]["user_id"];
            $query = "SELECT id, user_id, nickname FROM chat_user WHERE room_id = $toRoom AND user_id <> $toUserId";
            $stm = $pdo -> query( $query );            
            $return -> forRoom = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $query = "SELECT id, user_id, nickname FROM chat_user WHERE chat_id = $toChat AND room_id <> $toRoom";
            $stm = $pdo -> query( $query );            
            $return -> forChat = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $query = "SELECT id, user_id, nickname FROM chat_user WHERE chat_id <> $toChat";
            $stm = $pdo -> query( $query );            
            $return -> forOtherChat = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $query = "SELECT id, id as user_id, concat(firstname,' ', lastname) as nickname FROM user WHERE TIMESTAMPDIFF( MINUTE, `last_activity`, NOW() ) < $timeOut AND id <> $toUserId";
            $stm = $pdo -> query( $query );            
            $return -> forActiveParticipants = $stm -> fetchAll(PDO::FETCH_ASSOC);
            for( $i = 0; $i < count( $return -> forRoom ); $i++ ) {
                for( $j = 0; $j < count( $return -> forActiveParticipants ); $j++ ) {
                    if( isset( $return -> forRoom[$i]["user_id"] ) && isset( $return -> forActiveParticipants[$j]["user_id"] ) ) {
                        if( $return -> forRoom[$i]["user_id"] == $return -> forActiveParticipants[$j]["user_id"] ) {
                            unset( $return -> forActiveParticipants[$j] );
                        }
                    }
                }    
  
            }           
            for( $i = 0; $i < count( $return -> forChat ); $i++ ) {
                for( $j = 0; $j < count( $return -> forActiveParticipants ); $j++ ) {
                    if( $return -> forChat[$i]["user_id"] == $return -> forActiveParticipants[$j]["user_id"] ) {
                        unset( $return -> forActiveParticipants[$j] );
                    }
                }    
            }
            $tmp = [];
            $x = 0;
            foreach ( $return -> forActiveParticipants as $val ) {
                $tmp[$x] = $val;
                $x++;
            }
            $return -> forActiveParticipants = $tmp;
            for( $i = 0; $i < count( $return -> forOtherChat ); $i++ ) {
                for( $j = 0; $j < count( $return -> forActiveParticipants ); $j++ ) {
                    if( isset( $return -> forOtherChat[$i]["user_id"] ) && isset( $return -> forActiveParticipants[$j]["user_id"] ) ) {
                        if( $return -> forOtherChat[$i]["user_id"] == $return -> forActiveParticipants[$j]["user_id"] ) {
                            unset( $return -> forActiveParticipants[$j] );
                        }                       
                    }
                }    
            }            
            $tmp = [];
            $x = 0;
            foreach ( $return -> forOtherChat as $val ) {
                $tmp[$x] = $val;
                $x++;
            }
            $return -> forOtherChat = $tmp;
            $query = "SELECT id, id as user_id, concat(firstname,' ', lastname) as nickname FROM user WHERE ( TIMESTAMPDIFF( MINUTE, `last_activity`, NOW() ) > $timeOut OR `last_activity` IS NULL ) AND id <> $toUserId AND opt_in = 1";
            $stm = $pdo -> query( $query );            
            $return -> forInactiveParticipants = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> message = "Die Chatteilnehmer wurden erfolgreich gelesen.";        
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> errorNumber = $e -> getCode();
            $return -> message = "Beim Lesen der Chatteilnehmer ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;        
    }
    public function inviteUser( $pdo, $toUser, $fromUser, $toChat, $toRoom, $invitation_until_interval, $section ) {
        $return = new \stdClass();
            switch( $section ) {
                case "forRoom":
                case "forChat":
                case "forOtherChat":
                    try {
                        $query = "SELECT user_id, room_id, nickname FROM chat_user WHERE id = $fromUser";            
                        $stm = $pdo -> query( $query );            
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $return -> toRoomId = $result[0]["room_id"];
                        //$return -> fromUserId = $result[0]["user_id"];
                        $return -> nicknameFromUser = $result[0]["nickname"];
                        $query = "SELECT user_id FROM chat_user WHERE id = $toUser";            
                        $stm = $pdo -> query( $query );            
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $return -> toUserId = $result[0]["user_id"];
                        $query = "SELECT room_id,  nickname, chat.name as chatName, chat_room.name as roomName FROM chat_user, chat, chat_room 
                                    WHERE chat_user.chat_id = chat.id AND  chat_user.room_id = chat_room.id AND 
                                    chat_user.id = $fromUser";            
                        $stm = $pdo -> query( $query );            
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $return -> fromRoomId = $result[0]["room_id"];
                        //$return -> fromUserId = $result[0]["user_id"];
                        //$return -> nicknameFromUser = $result[0]["nickname"];
                        $datetime = date("Y-m-d H:i:s", time() + $invitation_until_interval * 60 );
                        $query = "INSERT INTO `chat_invitation` (`chat_id`, `room_id`, `from_user`, `to_user`, `valid_until`) 
                                    VALUES ($toChat, $toRoom, '" . $return -> nicknameFromUser . "', " . $return -> toUserId . ", '" . $datetime . "')";
                        $pdo -> query( $query );
                        $return -> success = true;
                        $return -> message = "Der Nutzer wurde erfolgreich eingeladen.";
                    } catch ( Exception $e ) {
                        $return -> success = false;
                        $return -> message = "Beim Einladen der Nutzer ist folgender Fehler aufgetreten: " . $e -> getMessage();
                    }
                        
                
                break;
                case "forActiveParticipants":
                        // get nickname from user
                        $query = "SELECT nickname, user_id FROM chat_user WHERE id = $fromUser";
                        $stm = $pdo -> query( $query );            
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $fromNickname = $result[0]["nickname"];
                        $fromUserId = $result[0]["user_id"];
                        //
                        // get chat name
                        $query = "SELECT name FROM chat WHERE id = $toChat";
                        $stm = $pdo -> query( $query );            
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $fromChatname = $result[0]["name"];
                        //
                        // get room name
                        $query = "SELECT name FROM chat_room WHERE id = $toRoom";
                        $stm = $pdo -> query( $query );            
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $fromRoomname = $result[0]["name"];
                        //
                        require_once( "Message.php" );
                        $message = new \Message();
                        $messageText = $fromNickname . " hat Dich im Chat '" . $fromChatname . "' in den Raum '" . $fromRoomname . "' eingeladen. Diese Einladung ist bis zum " . date("d.m.Y H:i", time() + $invitation_until_interval * 60 ) . " gültig.";
                        $message -> newMessage( $pdo, "Chateinladung", $messageText, 0, $_SESSION["user_id"], 0, $toUser );                               
                        $query = "INSERT INTO `chat_invitation` (`chat_id`, `room_id`, `from_user`, `to_user`, `valid_until`) 
                                    VALUES ($toChat, $toRoom, '$fromNickname', $toUser, '" . date("Y-m-d H:i:s", time() + $invitation_until_interval * 60 ) . "')";
                        try {
                            $pdo -> query( $query );
                            $return -> success = true;
                            $return -> message = "Der Nutzer wurde erfolgreich eingeladen.";
                        } catch ( Exception $e ) {
                            $return -> success = false;
                            if( $e -> getCode() == "23000" ) {
                                $return -> message = "Du hast diesen Nutzer bereits eingeladen.";    
                            } else {
                                $return -> message = "Beim Einladen der Nutzer ist folgender Fehler aufgetreten: " . $e -> getMessage();
                            }
                        }
                        
                break;
                case "forInactiveParticipants":
                        require_once( "PHPMailer/PHPMailer/PHPMailer.php" );                
                        require_once( "PHPMailer/PHPMailer/Exception.php" );                
                        require_once( "functions.php" );                
                        // get nickname from user
                        $query = "SELECT nickname, user_id FROM chat_user WHERE id = $fromUser";
                        $stm = $pdo -> query( $query );            
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $fromNickname = $result[0]["nickname"];
                        $fromUserId = $result[0]["user_id"];
                        //
                        // get chat name
                        $query = "SELECT name FROM chat WHERE id = $toChat";
                        $stm = $pdo -> query( $query );            
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $fromChatname = $result[0]["name"];
                        //
                        // get room name
                        $query = "SELECT name FROM chat_room WHERE id = $toRoom";
                        $stm = $pdo -> query( $query );            
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $fromRoomname = $result[0]["name"];
                        //
                        require_once( "Message.php" );
                        $message = new \Message();
                        $messageText = $fromNickname . " hat Dich im Chat '" . $fromChatname . "' in den Raum '" . $fromRoomname . "' eingeladen. Diese Einladung ist bis zum " . date("d.m.Y H:i", time() + $invitation_until_interval * 60 ) . " gültig.";
                        $message -> newMessage( $pdo, "Chateinladung", $messageText, 0, $_SESSION["user_id"], 0, $toUser );                               
                        $query = "INSERT INTO `chat_invitation` (`chat_id`, `room_id`, `from_user`, `to_user`, `valid_until`) 
                                    VALUES ($toChat, $toRoom, '$fromNickname', $toUser, '" . date("Y-m-d H:i:s", time() + $invitation_until_interval * 60 ) . "')";
                        try {
                            $pdo -> query( $query );
                            $return -> success = true;
                            $return -> message = "Der Nutzer wurde erfolgreich eingeladen.";
                        } catch ( Exception $e ) {
                            $return -> success = false;
                            if( $e -> getCode() == "23000" ) {
                                $return -> message = "Du hast diesen Nutzer bereits eingeladen.";    
                            } else {
                                $return -> message = "Beim Einladen der Nutzer ist folgender Fehler aufgetreten: " . $e -> getMessage();
                            }
                        }
                        // get name and email from user
                        $query = "SELECT concat(firstname, ' ', lastname) as name, email FROM user WHERE id = $toUser";
                        $stm = $pdo -> query( $query );            
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        //                        
                        $mail = new \PHPMailer\PHPMailer\PHPMailer();
                        $ex = new \PHPMailer\PHPMailer\Exception();
                        $messageText = $fromNickname . " hat Dich im Chat \"" . $fromChatname . "\" in den Raum \"" . $fromRoomname . "\" eingeladen. Diese Einladung ist bis zum " . date("d.m.Y H:i", time() + $invitation_until_interval * 60 ) . " gültig.";
                        $mail->CharSet = "UTF-8";
                        $mail->setFrom( "info@suchtselbsthilfe-regenbogen.de", "Suchtselbsthilfe „Regenbogen”");
                        $mail->addAddress( $result[0]["email"], $result[0]["name"] );    

                        $mail->Subject = 'Chateinladungs-E-Mail - Suchtselbsthilfe „Regenbogen”';

                        $mail->isHtml(true);
                        $mail->AddEmbeddedImage('../images/logo.png', 'TBP', 'logo.png');
                            $content = '
                                    <html>
                                    <head>
                                        <title>Chateinladungs-E-Mail der Suchtselbsthilfe „Regenbogen”</title>
                                    </head>

                                    <body>

                                    <img src="cid:TBP" alt="Logo" width="100">
                                    
                                    <h3>Chateinladungs-E-Mail</h3>
                                    <p>' . $messageText . ' </p>
                                    
                                    <p>&nbsp;</p>
                                    <p>Ihr "Suchtselbsthilfe-Regenbogen"-Team</p>
                                    <address>
                                        <dl>
                                            <dt>E-Mail: info@suchtselbsthilfe-regenbogen.de</dt>
                                            <dt>Telefon: +49 341 444 232 2</dt>
                                            <dt>Adresse:</dt><dd>Demmeringstraße 47-49</dd>
                                            <dd>D-04177 Leipzig</dd>
                                            <dd>Germany</dd>
                                        </dl>
                                    </address>
                                            ' . getEmailSignature() . '
                               </body>
                                    </html>                                
                        ';                                        
                        $mail->Body = $content;
                        $mail->Send();
                break;
            }
        return $return;        
                
    }
    public function getUsersForChats( $pdo ) {
        $return = new \stdClass();
        $query = "SELECT chat_user.*, chat_room.name as roomName, chat.name as chatName, email FROM chat_user, 
                    chat_room, chat, user WHERE chat_user.room_id = chat_room.id
                    AND chat_user.chat_id = chat.id AND chat_user.user_id = user.id";
        try {
            $stm = $pdo -> query( $query );            
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> success = true;
            $return -> message = "Die Nutzer wurden erfolgreich gelesen.";
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Lesen der Nutzer ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;        
    }
    public function saveAdminChat( $pdo, $chatId, $active, $public, $permanent, $name, $description ) {
        $return = new \stdClass();
        try {
            $query = "UPDATE chat SET active = $active, public = $public, permanent = $permanent, name = '$name',
                    description = '$description' WHERE id = $chatId";
            $pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Der Chat wurde erfolgreich aktualisiert.";                                
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Aktualisieren des Chats ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;
    }
    public function saveAdminRoom( $pdo, $roomId, $active, $public, $permanent, $name, $description ) {
        $return = new \stdClass();
        try {
            $query = "UPDATE chat_room SET active = $active, public = $public, permanent = $permanent, name = '$name',
                    description = '$description' WHERE id = $roomId";
            $pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Der Raum wurde erfolgreich aktualisiert.";                                
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Aktualisieren des Raumes ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;
    }
    public function getAdminChatContent( $pdo ) {
        require_once( "functions.php" );
        $return = new \stdClass();
        $roomConentArray = [];
        $query = "SELECT id FROM chat_room";
        try {
            $stm = $pdo -> query( $query );            
            $rooms = $stm -> fetchAll(PDO::FETCH_ASSOC);
            for( $i = 0; $i < count( $rooms ); $i++ ) {
                $query = "select curr_datetime, content from chat_content WHERE room_id = " . $rooms[$i]["id"] . " ORDER BY id DESC LIMIT 5";
                $roomConent = new \stdClass();
                $stm = $pdo -> query( $query );
                $roomConent -> id = $rooms[$i]["id"];            
                $roomConent -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $roomConentArray[$i] = $roomConent;    
            }
            $return -> data = $roomConentArray;
            $return -> success = true;
            $return -> message = "Der Rauminhalt wurde erfolgreich gelesen.";                                
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Lesen der Räume ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        
        return $return;    
    }
    public function getAdminRoomsChats( $pdo ) {
        $return = new \stdClass();
        $query = "SELECT chat_room.id, chat_room.name as roomName, chat.name as chatName FROM `chat_room`, chat WHERE chat_room.chat_id = chat.id ORDER BY id";
        try {
            $stm = $pdo -> query( $query );            
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> success = true;
            $return -> message = "Die Räume wurden erfolgreich gelesen.";                                
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Lesen der Räume ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;    
    }
    public function showBlacklist( $pdo ) {
        $return = new \stdClass();
        $query = "SELECT * FROM chat_badwords ORDER BY badword";
        try {
            $stm = $pdo -> query( $query );            
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $query = "SELECT * FROM chat_badwords_critical";
            $stm = $pdo -> query( $query );            
            $return -> data_critical = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> success = true;
            $return -> message = "Die Blacklist wurde erfolgreich gelesen.";                                
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Lesen der Blacklist ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;    
    }
    public function saveAdminBadword( $pdo, $id, $badword, $critical ) {
        require_once( "functions_badword.php" );
        $return = new \stdClass();
        if( $id != "new" ) {
            $query = "UPDATE chat_badwords SET badword = '$badword', critical = $critical WHERE id = $id";            
        } else {
            $query = "INSERT INTO chat_badwords (badword, critical) VALUES ('$badword', $critical)";
        }
        try {
            $pdo -> query( $query );            
            $return -> success = true;
            if( $id != "new" ) {
                $return -> newId = null;            
            } else {
                $return -> newId = $pdo -> lastInsertId();            
            }
            $return -> message = "Die Blacklist wurde erfolgreich aktualisiert.";                                
            setBadwordContent( $pdo );
        } catch ( Exception $e ) {
            $return -> success = false;
            if( $e -> getCode() == "23000" ) {
                $return -> message = "Dieses Badword ist bereits vorhanden.";
            } else {
                $return -> message = "Beim Aktualisieren der Blacklist ist folgender Fehler aufgetreten: " . $e -> getMessage();
            }
        }
        return $return;    
    }
    public function deleteAdminBadword( $pdo, $id ) {
        $return = new \stdClass();
        $query = "DELETE FROM chat_badwords WHERE id = $id";
        try {
            $pdo -> query( $query );            
            $return -> success = true;
            $return -> message = "Das Badword wurde erfolgreich gelöscht.";                                
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Löschen des Badword ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;    
    }
    public function getSuspect( $pdo ) {
        $return = new \stdClass();
        $query = "SELECT id, chat_name, room_name, curr_datetime FROM chat_suspect ORDER BY chat_suspect.id DESC";
        try {
            $stm = $pdo -> query( $query );            
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> success = true;
            $return -> message = "Die Verdachtsfälle wurden erfolgreich gelesen.";                                
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Lesen der Verdachtsfälle ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;    
    }
    public function deleteAdminSuspect( $pdo, $id ) {
        $return = new \stdClass();
        $query = "DELETE FROM chat_suspect_content WHERE chat_suspect_id = $id";
        try {
            $pdo -> query( $query );            
            $query = "DELETE FROM chat_suspect WHERE id = $id";
            $pdo -> query( $query );            
            $return -> success = true;
            $return -> message = "Der Verdachtsfall wurden erfolgreich gelöscht.";                                
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Löschen des Verdachtsfalls ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;    
    }
    public function showAdminSuspectDetails( $pdo, $id ) {
        $return = new \stdClass();
        $query = "SELECT chat_suspect_content.id, chat_suspect_content.content, CONCAT( user.firstname, ' ', user.lastname ) AS userName, user.id AS userId FROM chat_suspect_content, user WHERE chat_suspect_content.user_id = user.id AND chat_suspect_id = $id ORDER BY chat_suspect_id ASC";
        try {
            $stm = $pdo -> query( $query );            
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> userId = $return -> data[0]["userId"];
            $return -> success = true;
            $return -> message = "Die Verdachtsfallinhalte wurden erfolgreich gelesen.";                                
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Lesen der Verdachtsfallinhalte ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;    
    }
}
?>
