<?php
define( "PATH_ENVELOP", "library/images/books/envelop_");
class Book {
    private $pdo;
    private $messageBehavior;
    private $lendDays;
    private $reservationDays;
    private $extendDays;
    public function __construct() {
        $settings = parse_ini_file('../../ini/settings.ini', TRUE);
        $this -> messageBehavior = $settings["admin_book"]["message_behavior"];
        $this -> lendDays = $settings["admin_book"]["standard_lend_days"];
        $this -> reservationDays = $settings["admin_book"]["standard_reserve_days"];
        $this -> extendDays = $settings["admin_book"]["standard_reserve_days"];
    }
    // works
    public function updateBook( $pdo, $book_id, $status, $category, $exemplar, $isbn, $author, $title, $content ) {
        $return = new \stdClass();
        $q = "UPDATE `book` SET status=$status, category=$category, exemplar=$exemplar, isbn='$isbn', author='$author', title='$title', content='$content', envelop = '" . PATH_ENVELOP . "$book_id.jpg' WHERE id=$book_id;"; 
        try {
            $pdo ->query( $q );      
            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich gespeichert.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Speichern des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
    // works
    public function getBookInfo( $pdo, $id ){
        $q = "select id, status, title, change_status from book where id = $id";
        $s = $pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        return $r[0];
    }
    // works
    public function getStatusInfoForLendId( $pdo, $id ){
        $q = "select book_lend.id, book_id, book_lend.status, user.id as user_id, concat( firstname, ' ', lastname ) as fullname, email, change_status_on, from_date, to_date from book_lend, user 
            where user_id = user.id and book_lend.id = $id";
        $s = $pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        $q = "select status from book_status where id = " . $r[0]["status"];
        $s = $pdo -> query( $q );
        $r_status = $s -> fetchAll( PDO::FETCH_ASSOC );
        $r[0]["statusText"] = $r_status[0]["status"];
        return $r[0];
    }
    // works
    public function getStatusInfo( $pdo, $id ){
        $q = "select book_lend.id, book_id, book_lend.status, user.id as user_id, concat( firstname, ' ', lastname ) as fullname, email, change_status_on, from_date, to_date from book_lend, user 
            where user_id = user.id and book_lend.status = $id";
        $s = $pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        $q = "select status from book_status where id = " . $r[0]["status"];
        $s = $pdo -> query( $q );
        $r_status = $s -> fetchAll( PDO::FETCH_ASSOC );
        $r[0]["statusText"] = $r_status[0]["status"];
        return $r[0];
    }
    // works
    public function getNextRequest( $pdo, $id ){
        $q = "select user_id, change_status_on, concat( firstname, ' ', lastname ) as name from book_lend, user where book_lend.user_id = user.id and status = 3 and book_id = $id order by book_lend.id";
        $s = $pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        if( count( $r ) === 0 ) {
            return [];
        } else {
            return $r[0];
        }
    }
    // works
    public function updateShortBook( $pdo, $book_id, $status, $category, $isbn, $title, $author ) {
        $return = new \stdClass();
        $query = "UPDATE `book` SET status=$status, category=$category, isbn='$isbn', title='$title', author='$author' WHERE id=$book_id;"; 
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich gespeichert.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Speichern des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return; 
    }
    public function newBook( $pdo, $status, $category, $exemplar, $isbn, $author, $title, $content ) {
        $return = new \stdClass();
        $query = "INSERT INTO `book` (status, category, exemplar, isbn, author, title, content ) VALUES ($status, $category, $exemplar, '$isbn', '$author', '$title', '$content' )"; 
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich angelegt.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Anlegen des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage();
                $return -> errorNumber = $e -> getCode();
        }
        return $return;
    }
    // works
    public function newShortBook( $pdo, $category, $status, $exemplar, $isbn, $author, $title ) {
        $return = new \stdClass();
        $query = "INSERT INTO `book` (status, category, isbn, title, author, exemplar ) VALUES ($status, $category, '$isbn', '$title', '$author', $exemplar )"; 
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich angelegt.";
            $newId = $pdo -> lastInsertId();
            copy(  "../images/books/envelop_dummy.jpg", "../images/books/envelop_" . $newId . ".jpg" );    
            
            $return -> errorNumber = 0;
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Anlegen des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage();
                $return -> errorNumber = $e -> getCode();
        }
        return $return;   
    }
    // works
    public function deleteBook( $pdo, $id ) {
        $return = new \stdClass();
        $query = "DELETE FROM `book` WHERE id =$id"; 
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich gelöscht.";
            if( file_exists( "../images/books/envelop_" . $id . ".jpg" ) ) {
                unlink(  "../images/books/envelop_" . $id . ".jpg" );    
            }
            if( file_exists( "../images/books/content_" . $id . ".jpg" ) ) {
                unlink(  "../images/books/content_" . $id . ".jpg" );    
            }
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;   
    }
    // works
    public function duplicateBook( $pdo, $id, $title ) {
        $return = new \stdClass();
        $stm = $pdo -> query("SELECT max(exemplar) as maxEx FROM `book` WHERE title = '$title';");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $exemplar =  $result[0]["maxEx"] + 1;
        
        $query = "INSERT INTO `book` ( status, category, exemplar, isbn, author, title, content ) SELECT 4, category, " . $exemplar . ", isbn, author, title, content FROM `book` WHERE id =$id"; 
        try {
            $pdo->query( $query );
            $newId = $pdo -> lastInsertId();

            if( file_exists( "../images/books/envelop_" . $id . ".jpg" ) ) {

                if ( !copy("../images/books/envelop_" . $id . ".jpg", "../images/books/envelop_" . $newId . ".jpg")) {
                    $return -> success = false;    
                    $return -> message = "Beim Duplizieren der Buchtitelvorschau ist ein Fehler aufgetreten.";
                } else {
                    $return -> success = true;    
                    $return -> message = "Das Buch wurde erfolgreich dupliziert.";                    
                }               
            } else {      
                $return -> success = true;    
                $return -> message = "Das Buch wurde erfolgreich dupliziert.";
            }
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Duplizieren des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;   
    }
    // works
    public function updateNameEnvelop( $pdo,  $id ) {
        $return = new \stdClass();
        $q = "UPDATE `book` SET `envelop` = '" . PATH_ENVELOP . "$id.jpg' WHERE `book`.`id` = $id";
        try {
            $pdo -> query( $q );    
            $return -> success = true;    
            $return -> message = "Der Buchumschlagsname wurde erfolgreich aktualisiert.";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Aktualisieren des Buchumschlagsname ist folgender Fehler aufgetreten: " .  $e -> getMessage();
            
        }
        return $return;   
    }
    // end standard functions
    
    // start actions
    //
    private function setStatus( $pdo, $date, $book_id, $user_id, $status_action, $status_status, $updateBook = true ) {
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $book_id, $user_id, $status_action, '$date', '', '')";
            $pdo -> query( $q );
            // save lend
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $book_id, $user_id, $status_status, '$date', '', '')";
            $pdo -> query( $q );
            if( $updateBook ) {
                $q = "UPDATE `book` SET `status` = $status_status, change_status = '$date' WHERE `book`.`id` = $book_id";
                $pdo -> query( $q );                
            }

    }
    public function takeBack( $pdo, $id ) {
        $return = new \stdClass();
        try {
            // get userId of lender
            $q = "SELECT id, book_id, user_id, change_status_on FROM book_lend WHERE status = 1 AND book_id = $id ORDER BY id DESC";
            $s = $pdo -> query( $q );
            $r = $s -> fetchAll(PDO::FETCH_ASSOC);
            $userId = $r[0]["user_id"];
            $changeDate = $r[0]["change_status_on"];
            $status = $this -> getStatusInfoForLendId( $pdo, $r[0]["id"] );
            // delete book_lend entries
            $q = "delete from book_lend where change_status_on = '" . $changeDate . "' and status = 1 or status = 7 or status = 6 or status = 9";
            $pdo -> query( $q );
            // TODO: check for requests
            $nRequester = $this -> getNextRequest( $pdo, $r[0]["book_id"] );
            if( count( $nRequester ) > 0 ) {
                
            }
            // take back book
            $date = date('Y-m-d H:i:s');
            if( count( $nRequester ) > 0 ) {
                $q = "UPDATE `book` SET `status` = 3, change_status = '$date' WHERE `book`.`id` = $id";    
            } else {
                $q = "UPDATE `book` SET `status` = 4, change_status = '$date' WHERE `book`.`id` = $id";
            }
            $pdo -> query( $q );
            // save change status in book lend
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $id, " . $_SESSION["user_id"] . ", 8, '$date', '', '')";
            $pdo -> query( $q );
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $id, " . $_SESSION["user_id"] . ", 14, '$date', '" . $status["from_date"] . "', '" . $status["to_date"] . "')";
            $pdo -> query( $q );
            $return -> nextLend = $nRequester;
            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich zurückgenommen";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Zurücknehmen des Buches ist folgender Fehler aufgetreten: " .  $e -> getMessage();
            
        }
        return $return;   
    }
    //
    public function extend( $pdo, $id, $days ) {
        $return = new \stdClass();
        try {
            // gete change time from book
            $q = "select change_status, title from book where id = $id";
            $s = $pdo -> query( $q );
            $r_book = $s -> fetchAll(PDO::FETCH_ASSOC);
            $old_change_time = $r_book[0]["change_status"];
            $cbt =  $r_book[0]["title"];
            // get userId of lender
            $q = "SELECT user_id, from_date, to_date FROM book_lend WHERE status = 1 AND book_id = $id ORDER BY id DESC";
            $s = $pdo -> query( $q );
            $r = $s -> fetchAll(PDO::FETCH_ASSOC);
            $userId = $r[0]["user_id"];
            $lendStartDate = $r[0]["from_date"];
            $newLendEnd = date( "Y-m-d", strtotime( $r[0]["to_date"] ) + $days * 3600 * 24 ) ;
            $newLendEndGerman = date( "d.m.Y", strtotime( $r[0]["to_date"] ) + $days * 3600 * 24 ) ;
            // delete old lend data
            $q = "delete from book_lend where change_status_on = '" . $old_change_time . "'";
            $pdo -> query( $q );
            //
            // save action
            $date = date('Y-m-d H:i:s');
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $id, " . $_SESSION["user_id"] . ", 9, '$date', '$lendStartDate', '$newLendEnd')";
            $pdo -> query( $q );
            // TODO: save renewal lendtime
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $id, $userId, 1, '$date', '" . $old_change_time . "', '$newLendEnd' )";
            $pdo -> query( $q );
            $q = "UPDATE `book` SET change_status = '$date' WHERE `book`.`id` = $id";
            $pdo -> query( $q );
            // send mail to user
            require_once( "classes/InformUser.php");
            $iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 9, 0 );
            //$iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 0, $userId );
            $iTitleEmail = "Buchverlängerungs-E-Mail der Bibliothek Suchtselbsthilfe-„Regenbogen”"; 
            $iTitleMessage = "Buchverlängerung Bibliothek Suchtselbsthilfe-„Regenbogen”";
            $iContentEmail = "Wir bestätigen dir hiermit, dass wir die Ausleihfrist für das Buch „" . $cbt . "” verlängert haben. Bitte gib das Buch nun bis spätestens $newLendEndGerman zurück.";
            $iContentMessage = "Wir bestätigen dir hiermit, dass wir die Ausleihfrist für das Buch „" . $cbt . "” verlängert haben. Bitte gib das Buch nun bis spätestens $newLendEndGerman zurück.";
            $iu -> sendUserInfo( $iTitleEmail, $iTitleMessage, $iContentEmail, $iContentMessage );
            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich verlängert";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Verlängern des Buches ist folgender Fehler aufgetreten: " .  $e -> getMessage();
            
        }
        return $return;   
    }
    //
    public function lend( $pdo, $id, $userId ) {
        $return = new \stdClass();
        try {
            // delete entries from book_lend
            // requested
            $book = $this -> getBookInfo($pdo, $id );
            $q = "delete from book_lend where change_status_on = '" . $book["change_status"] . "' and status <> 8"; 
            $pdo -> query( $q );
            // end delete entries from book_lend
            // save action
            $date = date('Y-m-d H:i:s');
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $id, " . $_SESSION["user_id"] . ", 7, '$date', '', '')";
            $pdo -> query( $q );
            // save lend
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $id, $userId, 1, '$date', '$date', DATE_ADD(NOW(), INTERVAL " . $this -> lendDays . " DAY))";
            $pdo -> query( $q );
            // set book
            $q = "UPDATE `book` SET `status` = '1', change_status = '$date' WHERE `book`.`id` = $id";
            $pdo -> query( $q );
            // send email to lender about lend days
            $lend_date = date("d.m.Y", time() + 86400 * $this -> lendDays );
            require_once( "classes/InformUser.php");
            $iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 0, $userId );
            //$iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 0, $userId );
            $rb = $this -> getBookInfo( $pdo, $id );
            $iTitleEmail = "Buchverleih-E-Mail der Bibliothek Suchtselbsthilfe-„Regenbogen”"; 
            $iTitleMessage = "Buchverleih Bibliothek Suchtselbsthilfe-„Regenbogen”";
            $iContentEmail = "Du hast dir das Buch „" . $rb["title"] . "” ausgeliehen. Bitte gib das Buch bis spätestens $lend_date zurück.";
            $iContentMessage = $iContentEmail;
            $iu -> sendUserInfo( $iTitleEmail, $iTitleMessage, $iContentEmail, $iContentMessage );

            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich ausgeliehen";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Ausleihen des Buches ist folgender Fehler aufgetreten: " .  $e -> getMessage();
            
        }
        return $return;   
    }
    //
    public function reserve( $pdo, $id, $userId ) {
        $return = new \stdClass();
        $book = $this -> getBookInfo( $pdo, $id );
        try {
            // delete request
            $rb = $this -> getBookInfo( $pdo, $id );
            $q = "delete from book_lend where change_status_on = '" . $rb["change_status"] . "'";
            $pdo -> query( $q );
            // save action
            $date = date('Y-m-d H:i:s');
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $id, " . $userId . ", 10, '$date', '', '')";
            $pdo -> query( $q );
            // save lend
            $newReserveEndGerman = date( "d.m.Y", strtotime( $date ) + $this -> reservationDays * 86400 ) ; // is eqal to 3600 * 24
            $newReserveEndMySQL = date( "Y-m-d", strtotime( $date ) + $this -> reservationDays * 86400 ) ;
            
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $id, " . $_SESSION["user_id"] . ", 2, '$date', '', '$newReserveEndMySQL')";
            $pdo -> query( $q );
            $q = "UPDATE `book` SET `status` = '2', change_status = '$date' WHERE `book`.`id` = $id";
            $pdo -> query( $q );
            /* start inform user about succesfull reservation */
            require_once( "classes/InformUser.php");
            $iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 0, $userId );
            $iTitleEmail = "Buchreservierungs-E-Mail der Bibliothek Suchtselbsthilfe-„Regenbogen”"; 
            $iTitleMessage = "Buchreservierungs Bibliothek Suchtselbsthilfe-„Regenbogen”";
            $iContentEmail = "Wir haben das Buch „" . $book["title"] . "” für dich reserviert. Du kannst das Buch bis $newReserveEndGerman in der Bibliothek ausleihen.";
            $iContentMessage = $iContentEmail;
            $iu -> sendUserInfo( $iTitleEmail, $iTitleMessage, $iContentEmail, $iContentMessage );
            /* end inform user about succesfull reservation */
            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich reserviert.";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Reservieren des Buches ist folgender Fehler aufgetreten: " .  $e -> getMessage();
            
        }
        return $return;   
    }
    public function extendLeadTime( $pdo, $id ) {
        $return = new \stdClass();
        try {
            $q = "select title, change_status from book where id = $id";
            $s = $pdo -> query( $q );
            $r_book = $s -> fetchAll( PDO::FETCH_ASSOC );
            $q = "select book_lend.status from book_lend, book_status where book_lend.status = book_status.id and book_status.type = 0 and change_status_on = '" . $r_book[0]["change_status"] . "' and book_id = $id";
            $s = $pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            if( $r[0]["status"] == 9 ) {
                $return -> success = false;    
                $return -> message = "Du kannst ein Buch nur einmal verlängern!";    
                return $return;
            } else {
                // send email to bibliothekar
                require_once "PHPMailer/PHPMailer/Exception.php";
                require_once "PHPMailer/PHPMailer/PHPMailer.php";
                $mail = new \PHPMailer\PHPMailer\PHPMailer();
                $exeption = new \PHPMailer\PHPMailer\Exception();
                $mail->CharSet = "UTF-8";
                $mail->Subject = 'Reservierungs-E-Mail von der Suchtselbsthilfe-„Regenbogen”-Bibliothek';

                $mail->isHtml(true);
                $mail->AddEmbeddedImage('../images/logo.png', 'TBP', 'logo.png');
                                
                $mail -> setFrom( "info@suchtselbsthilfe-regenbogen.de", "Suchtselbsthilfe „Regenbogen”");
                $mail -> addAddress( "bibliothek@suchtselbsthilfe-regenbogen.de", "Bibliothek Suchtselbsthilfe „Regenbogen”" );
                $content = '
                            <html>
                            <head>
                                <title>Bitte um Buchverlängerung-E-Mail für die Bibliothek der Suchtselbsthilfe-„Regenbogen”-</title>
                            </head>

                            <body>

                            <img src="cid:TBP" alt="Logo" style="width: 100px;">
                            
                            <h3>Bitte um Buchverlängerung</h3>

                                <p>Dies ist eine automatisch erzeugte E-Mail. Bitte antworte nicht darauf.</p>

                                <h4>Bitte um Buchverlängerung</h4>
                                <p>Der Nutzer ' . $_SESSION["firstname"] . " " .  $_SESSION["lastname"] . ' würde gern die Ausleihfrist das 
                                ausgeliehene Buch -„' . $r_book[0]["title"] . '” verlängern. Bitte prüfe, ob das möglich ist</p>
                                    <p>&nbsp;</p>
                                    <p>Dein "Suchtselbsthilfe-Regenbogen"-Team</p>
                                    <address>
                                        <dl>
                                            <dt>E-Mail: info@suchtselbsthilfe-regenbogen.de</dt>
                                            <dt>Telefon: +49 341 444 232 2</dt>
                                            <dt>Adresse:</dt><dd>Demmeringstraße 47-49</dd>
                                            <dd>D-04177 Leipzig</dd>
                                            <dd>Germany</dd>
                                        </dl>
                                    </address>
                       </body>
                            </html>                                
                            ';                                        
                            $mail->Body = $content;
                            $result = $mail->Send();
                
                                
                // end send mail
                
            }
            $return -> success = true;    
            $return -> message = "Wir haben deinen Verlängerungswunsch entgegengenommen und den Bibliothekar informiert. Du erhälst in Kürze eine Information zur Verlängerung des Buches.";
            
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Versuch das Buche zu verlängern, ist folgender Fehler aufgetreten: " .  $e -> getMessage();
            
        }
        return $return;  
    }
    public function requestFromBook( $pdo, $id ) {
        $return = new \stdClass();
        $return -> otherStatus = 0;
        try {
            require_once( "classes/InformUser.php");
            $book = $this -> getBookInfo( $pdo, $id );
            $date = date('Y-m-d H:i:s');
            // check stus for active user
            // check for already reservated
            $q = "select user_id, book_lend.status from book_lend, book_status where user_id = " . $_SESSION["user_id"] . " and book_lend.status = book_status.id and change_status_on ='" . $book["change_status"] . "' and book_status.type = 0";
            $s = $pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            if( count( $r ) > 0 ) {
                if( $r[0]["status"] == "3" ) {
                    $return -> success = false;
                    $return -> message = "Du hast dieses Buch bereits angefordert.";
                    return $return;
                }
                if( $r[0]["user_id"] == $_SESSION["user_id"] && $r[0]["status"] == 1 ) {
                    $return -> success = false;
                    $return -> message = "Du hast dieses Buch ausgeliehen und kannst es deshalb nicht mehr anfordern.";
                    return $return;
                }
                if( $r[0]["user_id"] == $_SESSION["user_id"] && $r[0]["status"] == 2 ) {
                    $return -> success = false;
                    $return -> message = "Das Buch ist bereits für dich reserviert und kannst es deshalb nicht mehr anfordern.";
                    return $return;
                }
                                
            }
            // check status for other user
            // all status type = 0 without 8 (zurückgenommen)
                $q = "select user_id, book_id, book_lend.status as book_lend_status, book_status.status, to_date from book_lend, book_status where user_id <> " . $_SESSION["user_id"] . " and book_lend.status = book_status.id and change_status_on ='" . $book["change_status"] . "' and book_status.type = 0 and book_lend.status <> 8 order by book_lend.id";
                $s = $pdo -> query( $q );
                $r = $s -> fetchAll( PDO::FETCH_ASSOC );
                if( count( $r )  > 0 && $r[0]["book_lend_status"] != 3 && $r[0]["book_lend_status"] != 2 ) {
                    $rS = $this -> setStatus( $pdo, $date, $id, $_SESSION["user_id"], 12, 3, false );
                    $return -> otherStatus = $r[0]["status"];
                    $date = getGermanDateFromMysql( $r[0]["to_date"] );
                    $book = $this -> getBookInfo( $pdo, $r[0]["book_id"] );
                    $iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 0,  $r[0]["user_id"] );
                    $iTitleEmail = "Buchinformations-E-Mail der Bibliothek Suchtselbsthilfe-„Regenbogen”"; 
                    $iTitleMessage = "Buchinformation Bibliothek Suchtselbsthilfe-„Regenbogen”";
                    $iContentEmail = "Du hast das Buch „" . $book["title"] . "” ausgeliehen. Es gibt einen weiteren Nutzer, der das Buch angefragt hat. 
                        Du kannst deshalb das Buch nicht verlängern. Bitte gib das Buch bis $date zurück.";
                    $iContentMessage = $iContentEmail;
                    $iu -> sendUserInfo( $iTitleEmail, $iTitleMessage, $iContentEmail, $iContentMessage );
                    
                    
                } else {
                    $return -> otherStatus = "";
                }
                
                /* set user to waitlist */                
                if( isset( $r ) && count( $r ) > 0 ) {
                    //$rS = $this -> setStatus( $pdo, $date, $id, $_SESSION["user_id"], 12, 3, false );
                    $iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 0, $_SESSION["user_id"] );
                    $iTitleEmail = "Buchanfrage-E-Mail der Bibliothek Suchtselbsthilfe-„Regenbogen”"; 
                    $iTitleMessage = "Buchanfrage Bibliothek Suchtselbsthilfe-„Regenbogen”";
                    $iContentEmail = "Du hast das Buch „" . $book["title"] . "” erfolgreich angefragt. Da das Buch derzeit aber " . $return -> otherStatus . " ist, haben wir dich auf die Warteliste gesetzt. 
                                        Sobald das Buch wieder verfügbar ist, informieren wir dich.";
                    if( $r[0]["status"] === "ausgeliehen" || $r[0]["status"] === "verlängert" ) {
                        $iContentEmail .=  " Vorrausichtlich ist das Buch ab $date wieder verfügbar.";   
                    }
                    $iContentMessage = $iContentEmail;
                    $iu -> sendUserInfo( $iTitleEmail, $iTitleMessage, $iContentEmail, $iContentMessage );
                    //$q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) VALUES (" . $r[0]["book_id"] . ", " . $_SESSION["user_id"] . ", 3, '$date', '$date', '')";
                    //$pdo -> query( $q );
                    $return -> success = true;    
                    $return -> message = $iContentMessage;
                    //return $return;
                }
                /* end set user to waitlist */                
            //}
            
            
            
            // save action
            //$date = date('Y-m-d H:i:s');
            //                    $r = $this -> setStatus( $pdo, $date, $id, $_SESSION["user_id"], 12, 3 );
/*$q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $id, " . $_SESSION["user_id"] . ", 12, '$date', '', '')";
            $pdo -> query( $q );
            // save lend
            $q = "INSERT INTO `book_lend` (`book_id`, `user_id`, `status`, `change_status_on`, `from_date`, `to_date`) 
                VALUES ( $id, " . $_SESSION["user_id"] . ", 3, '$date', '', '')";
            $pdo -> query( $q );
            */
            $q = "UPDATE `book` SET `status` = '3', change_status = '$date' WHERE `book`.`id` = $id";
            $pdo -> query( $q );
            /* start inform user about succesfull reservation */
            $rS = $this -> setStatus( $pdo, $date, $id, $_SESSION["user_id"], 12, 3, false );
            $iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 0, $_SESSION["user_id"] );
            $iTitleEmail = "Buchanfrage-E-Mail der Bibliothek Suchtselbsthilfe-„Regenbogen”"; 
            $iTitleMessage = "Buchanfrage Bibliothek Suchtselbsthilfe-„Regenbogen”";
            $iContentEmail = "Du hast das Buch „" . $book["title"] . "” erfolgreich angefragt. Du erhälst in Kürze eine Information der Bibliothek, wann du das Buch abholen kannst.";
            $iContentMessage = $iContentEmail;
            $iu -> sendUserInfo( $iTitleEmail, $iTitleMessage, $iContentEmail, $iContentMessage );
            /* end inform user about succesfull reservation */
            /* start inform bibliothekar about succesfull reservation */

            $iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 9, 0 );
            $q = "select concat( firstname, ' ', lastname) as name from user where id = " . $_SESSION["user_id"];
            $s = $pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $cu = $r[0]["name"];
            $iTitleEmail = "Buchanfrage-E-Mail der Bibliothek Suchtselbsthilfe-„Regenbogen”"; 
            $iTitleMessage = "Buchanfrage Bibliothek Suchtselbsthilfe-„Regenbogen”";
            $iContentEmail = "Der Nutzer $cu hat das Buch „" . $book["title"] . "” angefragt. Bitte prüfe, ob das Buch für diesen Nutzer reserviert werden kann.";
            $iContentMessage = $iContentEmail;
            $iu -> sendUserInfo( $iTitleEmail, $iTitleMessage, $iContentEmail, $iContentMessage );

            /* end inform bibliothekar about succesfull reservation */
            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich angefordert. Du erhälst in Kürze durch die Bibliothek die Information, wann du das Buch abholen kannst.";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Reservieren des Buches ist folgender Fehler aufgetreten: " .  $e -> getMessage();
            
        }
        return $return;   
    }
    public function evaluate( $pdo, $bookId, $eval, $notice ) {
        $return = new \stdClass();
        $q = "INSERT INTO `book_evaluate` (`curr_date`, `book_id`, `user_id`, `text`, `evaluate`) 
            VALUES (NOW(), $bookId, " . $_SESSION["user_id"] . ", '$notice', $eval)";
        try {
            $pdo -> query( $q );
            $return -> success = true;
            $return -> message = "Die Bewertung wurde erfolgreich gespeichert.";
            $q = "SELECT COUNT( id ) AS count_id, ROUND( AVG( evaluate ), 2 ) AS avg_eval FROM `book_evaluate` WHERE book_id = $bookId";        
            $s = $pdo -> query( $q );
            $r = $s -> fetchAll(PDO::FETCH_ASSOC);
            $q = "UPDATE `book` SET `count_eval` = " . $r[0]["count_id"] . ", `avg_eval` = '" . $r[0]["avg_eval"] . "' WHERE `book`.`id` = $bookId";
            $pdo -> query( $q );
        } catch ( PDOException $e ) {
            $return -> success = false;
            $return -> message = "Bei der Speicherung der Bewertung ist folgender Fehler aufgetreten: ." . $e -> getMessage();
        }
        return $return;   
        /*
        $return = new \stdClass();
        try {
            $q = "INSERT INTO `book_evaluate` (`book_id`, `user_id`, `text`, `evaluate`) VALUES ($id, " . $_SESSION["user_id"] . ", '" . $text . "', $ev)";
            $pdo -> query( $q );
            $return -> success = true;    
            $return -> message = "Die Buchbewertung wurde erfolgreich gespeichert.";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Speichern der Buchbewertung ist folgender Fehler aufgetreten: " .  $e -> getMessage();
            
        }
        return $return;
        */   
    }
    
    
    public function checkForLendBooks( $pdo, $ids ) {
        $a = json_decode( $ids );
        $return = new \stdClass();
        try {
            $l = count( $a );
            $i = 0;
            $t = "";
            while( $i < $l ) {
                 $t .= $a[$i] . ",";
                $i += 1;
            }
            $t = substr( $t, 0, strlen( $t ) - 1 );
            if( $ids === "[]" ) {
                $return -> data = [];                
            } else {
                $q = "select distinct book.id, user_id, book_lend.id as book_lend_id, book_lend.status from book, book_lend where book.id = book_lend.book_id and ( book_lend.status < 4 || book_lend.status = 9 ) and book.id in ($t)";
                $s = $pdo -> query( $q );
                $r = $s -> fetchAll( PDO::FETCH_ASSOC );
                //$q = "select distinct book.id, book_lend.id as book_lend_id, book.status, book_lend.status as book_lend_status, user_id from book, book_lend where book.id = book_lend.book_id and ( book_lend.status < 4 || book_lend.status = 9 ) and book.id in ($t)";
                //$s = $pdo -> query( $q );
                //$r = $s -> fetchAll( PDO::FETCH_ASSOC );
                $l = count( $r );
                $i = 0;
                $a = [];
                while( $i < $l ) {
                    $status = $this -> getStatusInfo( $pdo, $r[$i]["status"] );
                    $nU = $this -> getNextRequest( $pdo, $r[$i]["id"] );
                    if( count( $nU ) > 0 ) {
                        $r[$i]["staus"] = 9;    
                    }
                    //$m = $i + 1;
                    //if( $m >= $l ) break;
                    //if( isset( $r[$m]["id"] ) && $r[$i]["id"] === $r[$m]["id"] ) {
                    //    $uid = $r[$m]["user_id"];
                        //$a[] = $r[$i];
                        //array_splice($r, $i + 1, 1 );
                        //$r[$i]["user_id"] = $uid;
                    //} else {
                        
                    //}
                    //$nU = $this -> getNextRequest( $pdo, $r[$i]["book_lend_id"] );
                    $i += 1;
                }
                //$l = count( $r );
                //$i = 0;
                while( $i < $l ) {
                    //$nU = $this -> getNextRequest( $pdo, $r[$i]["id"] );
                    //if( count( $nU ) > 0 ) {
                         //$r[$i]["status"] = 9;
                    //}
                    //$r[$i];
                    $i += 1;
                }
                
                //$nextUser = $this -> getNextRequest( $pdo, $id );
                $return -> data = $r;
            }
            $return -> success = true;    
            $return -> message = "Die Bücher wurde erfolgreich gelesen.";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Bestimmen der Buchstatus ist folgender Fehler aufgetreten: " .  $e -> getMessage();    
        }
        return $return;   
    }
        
    public function  deleteReservation( $pdo, $bookId, $info, $userId ){
        $return = new \stdClass();
        try {
            $book = $this -> getBookInfo( $pdo, $bookId );
            $q = "delete from book_lend where change_status_on = '" . $book["change_status"] . "'";
            $pdo -> query( $q );
            $return -> nextLend = $this -> getNextRequest( $pdo, $bookId );
            if( count($return -> nextLend ) > 0 && $return -> nextLend["user_id"] !== "" ) {
                /* set book status for next user */
                $q = "update book set status = 3, change_status ='" . $return -> nextLend["change_status_on"] . "' where id = $bookId";
                $pdo -> query( $q );    
            } else {
                $q = "update book set status = 4, change_status ='0000-00-00' where id = $bookId";
                $pdo -> query( $q );    
            }
            require_once( "classes/InformUser.php" );
            $iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 0, $userId );
            $iTitleEmail = "Buchreservierung-Löschungs-E-Mail der Bibliothek Suchtselbsthilfe-„Regenbogen”"; 
            $iTitleMessage = "Buchreservierung-löschung Bibliothek Suchtselbsthilfe-„Regenbogen”";
            $iContentEmail = "Das Buch „" . $book["title"] . "” war für dich reserviert. Bedauerlicherweise mussten wir deine Reservierung löschen. $info";
            $iContentMessage = $iContentEmail;
            $iu -> sendUserInfo( $iTitleEmail, $iTitleMessage, $iContentEmail, $iContentMessage );
            $return -> success = true;    
            $return -> message = "Das Löschen der Anfrage war erfolgreich.";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Fehler aufgetreten: " .  $e -> getMessage();            
        }
        return $return;   
        
    }
    public function  deleteRequest( $pdo, $bookId, $info, $userId ){
        $return = new \stdClass();
        try {
            $book = $this -> getBookInfo( $pdo, $bookId );
            $q = "delete from book_lend where change_status_on = '" . $book["change_status"] . "'";
            $pdo -> query( $q );
            $return -> nextLend = $this -> getNextRequest( $pdo, $bookId );
            if( count($return -> nextLend ) > 0 && $return -> nextLend["user_id"] !== "" ) {
                /* set book status for next user */
                $q = "update book set change_status ='" . $return -> nextLend["change_status_on"] . "' where id = $bookId";
                $pdo -> query( $q );    
            } else {
                $q = "update book set status = 4, change_status ='0000-00-00' where id = $bookId";
                $pdo -> query( $q );    
            }
            require_once( "classes/InformUser.php" );
            $iu = new \InformUser( $pdo, $this -> messageBehavior, 9, 0, 0, $userId );
            $iTitleEmail = "Buchanfrage-Löschungs-E-Mail der Bibliothek Suchtselbsthilfe-„Regenbogen”"; 
            $iTitleMessage = "Buchanfragelöschung Bibliothek Suchtselbsthilfe-„Regenbogen”";
            $iContentEmail = "Du hast das Buch „" . $book["title"] . "” angefragt. Bedauerlicherweise mussten wir deine Anfrage löschen. $info";
            $iContentMessage = $iContentEmail;
            $iu -> sendUserInfo( $iTitleEmail, $iTitleMessage, $iContentEmail, $iContentMessage );
            $return -> success = true;    
            $return -> message = "Das Löschen der Anfrage war erfolgreich.";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Fehler aufgetreten: " .  $e -> getMessage();            
        }
        return $return;   
        
    }
    
    
    // end actions
    // private functions
    private function getLastLendDay( $pdo, $id ) {
        $return = new \stdClass();
        try {
            $q = "SELECT `to_date` FROM `book_lend` WHERE status = 1 and `book_id` = $id ORDER BY `to_date` DESC";
            $s = $pdo -> query( $q );
            $r = $s -> fetchAll(PDO::FETCH_ASSOC);
            $return -> to_date = $r[0]["to_date"];
            $return -> success = true;    
            $return -> message = "Das Ende des Ausleihzeitraumes wurde bestimmt.";
        } catch( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Bestimmen des Endes des Ausleihzeitraumes ist folgender Fehler aufgetreten: " .  $e -> getMessage();            
        }
        return $return;   
        
    }
    
    
    
    // end private functions
    public function getCountBooks( $pdo ) {
        $stm = $pdo -> query("SELECT count( book.id ) AS count_id FROM book");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return =  $result[0]["count_id"];
        return $return;
    }
    public function getBookStatus( $pdo ) {
        $return = new \stdClass();
        $stm = $pdo -> query("SELECT * FROM book_status;");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return -> data =  $result;
        return $return;       
    }
    public function getBookCategories( $pdo ) {
        $return = new \stdClass();
        $stm = $pdo -> query("SELECT * FROM book_category;");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return -> data =  $result;
        $return -> success = true;
        $return -> message = "Die Buchkategorien wurden erfolgreich gelesen.";
        return $return;       
    }
    public function saveCategory( $pdo, $id, $category ) {
        $return = new \stdClass();
        $query = "UPDATE `book_category` SET category='$category' WHERE id=$id;";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Die Kategorie wurde erfolgreich gespeichert.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Speichern der Kategorie ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
    public function newCategory( $pdo, $category ) {
        $return = new \stdClass();
        $query = "INSERT INTO `book_category` (category) VALUES ( '$category' );";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Die Kategorie wurde erfolgreich angelegt.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Anlegen der Kategorie ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
    public function deleteCategory( $pdo, $id ) {
        $return = new \stdClass();
        $query = "DELETE FROM `book_category` WHERE id=$id;";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Die Kategorie wurde erfolgreich gelöscht.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen der Kategorie ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
    
    public function getBooks( $pdo, $where = "", $orderBy = " ORDER BY book.id ASC", $limit = "" ) {
        $return = new \stdClass();
        if( $where == "" ) {
            $where = " WHERE book.status = book_status.id ";
        } else {
            $where .= " AND book.status = book_status.id ";
        }
        try{
            $return -> success = true;
            $query = "SELECT book.*, book_status.status AS book_status FROM  `book`, book_status $where $orderBy $limit";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> count_records = count( $result );
            $return -> data = $result;
            $stm = $pdo -> query("SELECT * FROM  `book_status`");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> data_status = $result;
            $stm = $pdo -> query("SELECT * FROM  `book_category`");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> data_category = $result;
            $return -> message = "Die Bücher wurden erfolgreich gelesen.";
             return $return;
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Bücher ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
                return $return;                            
        }        
            
    }
    public function getPrevExemplar( $pdo, $title, $exemplar ) {
        $return = new \stdClass();
        try{
            $return -> success = true;
            $query = "SELECT id FROM book WHERE title = '$title' AND exemplar < $exemplar ORDER BY exemplar DESC LIMIT 0, 1;";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> message = "Das Exemplar wurde erfolgreich gelesen.";                            
            if( count( $result ) == 0 ) {
                $return -> success = false;
                $return -> message = "Dies ist das erste Exemplar.";                            
            
            } else {
                $result = $this -> getBook( $pdo, $result[0]["id"] );
                $return -> data = $result -> data;
            }
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";                            
        }
        return $return;
    }
    public function getNextExemplar( $pdo, $title, $exemplar ) {
        $return = new \stdClass();
        try{
            $return -> success = true;
            $query = "SELECT id FROM book WHERE title = '$title' AND exemplar > $exemplar LIMIT 0, 1;";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> message = "Das Exemplar wurde erfolgreich gelesen.";                            
            if( count( $result ) == 0 ) {
                $return -> success = false;
                $return -> message = "Dies ist das letzte Exemplar.";                            
            
            } else {
                $result = $this -> getBook( $pdo, $result[0]["id"] );
                $return -> data = $result -> data;
            }
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";                            
        }
        return $return;
    }
    public function getBook( $pdo, $id ) {
        $return = new \stdClass();
        try{
            $return -> success = true;
            //$query = "SELECT * FROM  `book` $where $orderBy $limit;";
            $stm = $pdo -> query("SELECT * FROM  `book` WHERE id = $id;");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> data = $result;
            $title = $result[0]["title"];
            $return -> message = "Das Buch wurde erfolgreich gelesen.";
            $query = "SELECT count(exemplar) as countExemplar FROM `book` WHERE title = '" . $title . "'";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> countExemplar = $result[0]["countExemplar"];
            $query = "SELECT min(exemplar) as minExemplar FROM `book` WHERE title = '" . $title . "'";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> minExemplar = $result[0]["minExemplar"];
            $query = "SELECT max(exemplar) as maxExemplar FROM `book` WHERE title = '" . $title . "'";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> maxExemplar = $result[0]["maxExemplar"];
            $query = "SELECT * FROM book_lend";
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> history = $this -> getBookHistory( $pdo, $id );
            $return -> evaluate = $this -> getAllBookEvaluate( $pdo, $id );
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";                            
        }
        return $return;
    }
    public function getBookHistory( $pdo, $id ) { 
        $return = new \stdClass();
        $query = "SELECT book.`id`, book_lend.`status`, book_status.status as bookstatus, change_status_on, from_date, 
                    to_date, concat( firstname, ' ', lastname ) as user_name FROM book, book_lend, book_status, user WHERE book.id = book_lend.book_id and 
                    book_lend.status = book_status.id AND book_lend.user_id = user.id AND book.id = $id";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
    public function getAllBookEvaluate( $pdo, $id ) {
        $return = new \stdClass();
        $query = "SELECT book_evaluate.id, curr_date, text, concat( firstname, ' ', lastname) as name, evaluate FROM user, book_evaluate WHERE user.id = book_evaluate.user_id AND book_id = $id";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        return $result;       
    }
    public function getAverageBookEvaluate( $pdo, $id ) {
        $return = new \stdClass();
        $query = "SELECT COUNT( id ) AS count, AVG( evaluate ) AS average FROM book_evaluate WHERE book_id = $id";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        return $result;       
    }
    public function deleteEval( $pdo, $id ) {
        $return = new \stdClass();
        try {
            $q = "select book_id from book_evaluate where id = $id";
            $s = $pdo -> query( $q );
            $rb = $s -> fetchAll( PDO::FETCH_ASSOC );
            $q = "delete from book_evaluate where id = $id";
            $pdo -> query( $q );
            $return -> success = true;
            $return -> message = "Die Buchbewertung wurde erfolgreich gelöscht.";    
            $r = $this -> getAverageBookEvaluate( $pdo, $rb[0]["book_id"] );
            if( is_null( $r[0]["average"] ) ) {
                $q = "update book set count_eval = " . $r[0]["count"] . ", avg_eval = 0 where id = " . $rb[0]["book_id"];
            } else {
                $q = "update book set count_eval = " . $r[0]["count"] . ", avg_eval = " . $r[0]["average"] . " where id = " . $rb[0]["book_id"];
            }
            $pdo -> query( $q );
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten: " . $e -> getMessage();    
        }
        return $return;
    }
    public function updateLendABook( $pdo, $book, $user, $from, $to, $sure ) {
        // means -> the lend goes to another user as reservated user / $user is the new user_id
        $return = new \stdClass();
        //$return -> sure = $sure;
        $return -> success = true;
        // 1. get reservation user details
        $query = "SELECT book_id, user_id, email, firstname, lastname FROM book_lend, user WHERE user_id = user.id AND book_id = $book AND status = 2";
        try {
            $stm = $pdo -> query( $query );
            $result_user = $stm -> fetchAll(PDO::FETCH_ASSOC);
            // update book_lend
            $query = "UPDATE book_lend SET status = 3, from_date = '0', to_date = '0' WHERE book_id = $book AND user_id = " . $result_user[0]["user_id"];
            $pdo->query( $query );
            // lend book to the new user
            $query = "INSERT INTO book_lend ( book_id, user_id, status, from_date, to_date) VALUES ( $book, $user, 1, '$from', '$to' );";
            $pdo->query( $query );
            $query = "UPDATE book SET status = 1 WHERE id = $book";
            $pdo->query( $query );
            $return -> message .= "Der Buchstatus wurde erfolgreich aktualisiert und das Buch erfolgreich ausgeliehen.";
            // send email
                require_once "PHPMailer/PHPMailer/Exception.php";
                require_once "PHPMailer/PHPMailer/PHPMailer.php";
                $mail = new \PHPMailer\PHPMailer\PHPMailer();
                $exeption = new \PHPMailer\PHPMailer\Exception();
                
                $mail->setFrom( "bibliothek@suchtselbsthilfe-regenbogen.de", "Bibliothek „Regenbogen”");
                $mail -> addAddress( $result_user[0]["email"], $result_user[0]["firstname"] . " " . $result_user[0]["lastname"]);
                $mail_result = sendResetReservationLibraryMail( $mail, '', '' );
                if( !$mail_result ) {
                    $return -> message .= " aber beim Versenden der Rücknahme der Registrierung ist ein Fehler aufgetreten. ";                    
                }
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Bei der Rücknahme der Registrierung ist folgender Fehler aufgetreten: " . $e -> getMessage();    
        }
/*        
        }    
        if( $sure ) {
            $query = "SELECT book_lend.id, email, firstname, lastname FROM book_lend, user WHERE user_id = user.id AND book_id = $book AND user_id = $user AND status = 2";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            // count > 0 -> book is reservated for an other user -> send mail 
            if( count( $result ) == 0 ) {
                //$query = "INSERT INTO book_lend ( book_id, user_id, status, from_date, to_date ) 
                //VALUES ( $book, $user, 1, '$from', '$to')";
                $pdo-> query( "INSERT INTO book_lend ( book_id, user_id, status, from_date, to_date ) 
                VALUES ( $book, $user, 1, '$from', '$to')" );
                //$query = "UPDATE book SET status = 1 WHERE id = $book";
                $pdo-> query( "UPDATE book SET status = 1 WHERE id = $book" );
                $return -> success = true;
                $return -> message = "Das Buch wurde erfolgreich ausgeliehen.";
/*      
                /*      
                require_once "PHPMailer/PHPMailer/Exception.php";
                require_once "PHPMailer/PHPMailer/PHPMailer.php";
                $mail = new \PHPMailer\PHPMailer\PHPMailer();
                $exeption = new \PHPMailer\PHPMailer\Exception();
                
                $mail->setFrom( "bibliothek@suchtselbsthilfe-regenbogen.de", "Bibliothek „Regenbogen”");
                $query = "SELECT user_id, email, firstname, lastname FROM book_lend, user WHERE user_id = user.id AND book_id = $book AND status = 2";
                $stm = $pdo -> query( $query );
                $result_user = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $mail -> addAddress( $result_user[0]["email"], $result_user[0]["firstname"] . " " . $result_user[0]["lastname"]);
                $mail_result = sendResetReservationLibraryMail( $mail, '', '' );
                if( $mail_result ) {
                    $return -> message = "";    
                } else {
                    $return -> message = "Beim Versenden der Rücknahme der Registrierung ist ein Fehler aufgetreten. ";                    
                }
                $query = "UPDATE book_lend SET status = 3, from_date = '', to_date = '' WHERE book_id = $book AND user_id = " . $result_user[0]["user_id"];
                $pdo-> query( $query );      
                */
/*
        }
                
        } else {
            $query = "UPDATE book_lend SET status = 1, from_date = '$from', 
                        to_date = '$to' WHERE book_id = $book AND user_id = $user";            
            $pdo-> query( $query );      
            $return -> message .= "Der Buchstatus wurde erfolgreich aktualisiert.";
            $query = "UPDATE book SET status  = 1 WHERE id = $book";
            $pdo-> query( $query );      
            $return -> message .= " und das Buch wurde erfolgreich ausgeliehen.";
            return $return;    
        }
        $return -> success = true;    
        $return -> message = "Der Buchstatus wurde erfolgreich aktualisiert ";
        if( $sure == "true") {
            $query = "UPDATE book SET status  = 1 WHERE id = $book";
            $pdo-> query( $query );      
        }
        $return -> success = true;    
        $return -> message .= " und das Buch erfolgreich ausgeliehen.";
            $return -> success = false;    
            $return -> message = "Beim Ausleihen des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage();
            $return -> errorNumber = $e -> getCode();
*/            
    return $return;
    }
    public function lendBook( $pdo, $book, $user, $from, $to, $status, $sure ) {
        $return = new \stdClass();
        
        if( $status == 4 ) {
            $return -> sure = !json_decode( $sure ); // bool(false) ! boolval( $sure );
            try {
                $pdo-> query( "UPDATE book SET status = 1 WHERE id = $book" );
                $return -> message = "Das Buch wurde erfolgreich ausgeliehen";      
                $pdo-> query( "INSERT INTO book_lend ( book_id, user_id, status, from_date, to_date ) 
                VALUES ( $book, $user, 1, '$from', '$to')" );
                //$query = "UPDATE book SET status = 1 WHERE id = $book";
                $pdo-> query( "UPDATE book SET status = 1 WHERE id = $book" );
                $return -> sure = true;
                $return -> success = true;
                $return -> message .= " und der Buchstatus wurde aktualisiert.";                      
            } catch ( Exception $e ) {
                $return -> success = false;                
                $return -> message = "Beim Ausleihen des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage();
            }
        } else {            
            /*
            $result = $this -> updateLendABook( $pdo, $book, $user, $from, $to, $sure );
            $return -> success = true;    
            $return -> status = $result -> status;
            $return -> message = $result -> message;
            */
            $query = "SELECT user_id from book_lend WHERE book_id = $book and status = 2 ORDER BY book_lend.id ASC LIMIT 0, 1";             
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            if( count( $result ) == 1 ) {
                if( $user == $result[0]["user_id"] ) {
                    // same User how has resertated book 
                    // update reservated to lend
                    $query = "UPDATE book_lend SET status = 1 , from_date = '$from', to_date = '$to' WHERE user_id = $user AND book_id = $book;";   
                    $pdo-> query( $query );
                    $query = "UPDATE book SET status = 1 WHERE id = $book;";   
                    $pdo-> query( $query );
                    $return -> sure = true;
                    $return -> success = true;
                    $return -> message = "Das Buch wurde erfolgreich ausgeliehen und der Buchstatus erfolgreich gesetzt.";
                } else {
                    // not same User how has resertated book
                    // ask for confirm
                    $return -> success = true;
                    $return -> message = "Du versuchst das Buch an jemanden auszuleihen, für den es nicht reserviert ist. Willst Du das wirklich?";
                    $return -> sure = false;
                }
            }
        }
        return $return;                
    }
    public function relendBook( $pdo, $book, $settings ) {
        $return = new \stdClass();
        require_once "PHPMailer/PHPMailer/Exception.php";
        require_once "PHPMailer/PHPMailer/PHPMailer.php";
        // check for is lend
        $query = "SELECT id FROM book WHERE id = $book AND status = 1";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC); 
        if( count( $result ) == 0 ) {
            $return -> success = false;
            $return -> message = "Dieses Buch kann nicht zurückgenommen werden, da es nicht ausgeliehen ist.";
            return $return;    
        }              
        // get user
        $query = "SELECT user_id FROM book_lend WHERE book_id = $book AND status = 1";
        try {
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);               
            $query = "DELETE FROM book_lend WHERE user_id = " . $result[0]["user_id"] . " AND book_id = $book";
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Das Buch wurde erfolgreich zurückgenommen.";
            $query = "SELECT book.status, title, user_id, firstname, lastname, email FROM book_lend, user, book WHERE book.id=book_id AND user_id = user.id AND book_id = $book ORDER BY change_status_on";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            if( count( $result ) > 0 ) {
                $tmp_user_id = $result[0]["user_id"];
                $tmp_user_email = $result[0]["email"];
                $tmp_title = $result[0]["title"];
                $tmp_name = $result[0]["firstname"] . " " . $result[0]["lastname"];
                $query = "UPDATE book SET status = 2 WHERE id = $book";
                $pdo->query( $query );
                $query = "UPDATE book_lend SET status = 2, from_date = CURDATE(), to_date = CURDATE() + INTERVAL " . $this -> reservationDays . " DAY WHERE book_id = $book AND user_id = $tmp_user_id";
                $pdo->query( $query );
                // set message
                $get_res_date = date( "Y-m-d", time() + $this -> reservationDays * 86400 );
                $stm = $pdo -> query( $get_res_date );
                $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $res_date = getGermanDateFromMysql( $result[0]["res_date"] );
                $query = "INSERT INTO message ( title, content, from_role, to_user ) VALUES ( 'Bibliothek', 'Das Buch „" . $tmp_title . "” wurde erfolgreich für dich reserviert und kann bis zum $res_date abgeholt werden.', 9, $tmp_user_id )";
                $pdo->query( $query );                
                $query = "INSERT INTO `message_user` ( `from_message`, `to_user`) VALUES ( " . $pdo -> lastInsertId() . ", $tmp_user_id )";
                $pdo->query( $query );
                // end set message
                
                // send mail
                $mail = new \PHPMailer\PHPMailer\PHPMailer();
                $mail->CharSet = "UTF-8";
                $mail->Subject = 'Reservierungs-E-Mail von der Suchtselbsthilfe-„Regenbogen”-Bibliothek';

                $mail->isHtml(true);
                $mail->AddEmbeddedImage('../images/logo.png', 'TBP', 'logo.png');
                                
                $mail -> setFrom( "bibliothek@suchtselbsthilfe-regenbogen.de", "Bibliothek Suchtselbsthilfe „Regenbogen”");
                $mail -> addAddress( $tmp_user_email, $result_user[0]["firstname"] . " " . $result_user[0]["lastname"] );
                $content = '
                            <html>
                            <head>
                                <title>Reservierungsstornierung-E-Mail von der Bibliothek der Suchtselbsthilfe-„Regenbogen”-</title>
                            </head>

                            <body>

                            <img src="cid:TBP" alt="Logo" style="width: 100px;">
                            
                            <h3>Reservierungs-E-Mail</h3>

                                <p>Dies ist eine automatisch erzeugte E-Mail. Bitte antworte nicht darauf.</p>

                                <h4>Reservierung</h4>
                                <p>Du hast über die Bibliothek folgendes angefragt:</p>
                                <p>' . $tmp_title . '</p>
                                <p>
                                Du bist auf der Warteliste nach oben gerutscht und das Buch „' . $tmp_title . '” wurde erfolgreich für dich reserviert und kann bis zum ' . $res_date . ' abgeholt werden.
                                </p>
                                    <p>&nbsp;</p>
                                    <p>Ihr "Suchtselbsthilfe-Regenbogen"-Team</p>
                                    <address>
                                        <dl>
                                            <dt>E-Mail: bibliothek@suchtselbsthilfe-regenbogen.de</dt>
                                            <dt>Telefon: +49 341 444 232 2</dt>
                                            <dt>Adresse:</dt><dd>Demmeringstraße 47-49</dd>
                                            <dd>D-04177 Leipzig</dd>
                                            <dd>Germany</dd>
                                        </dl>
                                    </address>
                       </body>
                            </html>                                
                            ';                                        
                            $mail->Body = $content;
                            $result = $mail->Send();
                
                                
                // end send mail
            } else {
                $query = "UPDATE book SET status = 4 WHERE id = $book";
                $pdo->query( $query );                                
            }            
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Zurücknehmen des Buches ist folgender Fehler aufgetreten:" . $e -> getMessage();
                $return -> errorNumber = $e -> getCode();
        }
        return $return;   
    }
    public function getStatusForBook( $pdo, $id, $settings = false ) {
        $r = new \stdClass();
        $q = "SELECT status, change_status FROM book WHERE id = $id";
        try {
            //$status = $this -> getStatusInfo( $pdo, $id );
            $s = $pdo -> query( $q );
            $v = $s -> fetchAll( PDO::FETCH_ASSOC );
            $r -> status = $v[0]["status"];
            $change_status = $v[0]["change_status"]; 
            $r -> success = true;
            $r -> message = "Der Status wurde erfolgreich gelesen.";
            /*
            if( $r -> status === "1") {
                $q = "SELECT user_id FROM book_lend WHERE book_id = $id AND status = 1";
                $s = $pdo -> query( $q );
                $r -> user_id = $s -> fetchAll( PDO::FETCH_ASSOC );
                $r -> user_id = $r -> user_id[0]["user_id"];
                $r -> message .= " Der zugehörige Nutzer wurde erfolgreich gelesen.";
            }
            */
            $q = "select user_id from book_lend, book_status where book_lend.status = book_status.id and book_status.type = 1 and change_status_on = '" . $change_status . "' order by book_lend.id";
            $s = $pdo -> query( $q );
            $r -> user_id = $s -> fetchAll( PDO::FETCH_ASSOC );
            if( count( $r -> user_id ) === 0 ) {
                $r -> user_id = 0;
            } else {
                $r -> user_id = $r -> user_id[0]["user_id"];    
            }
            
            
        } catch ( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Lesen des Buchstatus ist folgender Fehler aufgetreten:" . $e -> getMessage();
        } 
        return $r;
    }
    public function getWaitList( $pdo, $id ) {
        $r = new \stdClass();
        $q = "SELECT concat( firstname, ' ', lastname ), change_status_on FROM book_lend, user WHERE user_id = user.id and status = 3 and book_lend.book_id = $id order by book_lend.id";
        try {
            $s = $pdo -> query( $q );
            $r -> data = $s -> fetchAll( PDO::FETCH_ASSOC );
            $r -> success = true;
            $r -> message = "Die Warteliste wurde erfolgreich gelesen.";
        } catch ( Exception $e ) {
            $r -> success = false;    
            $r -> message = "Beim Lesen der Warteliste ist folgender Fehler aufgetreten:" . $e -> getMessage();
        } 
        return $r;
        
    }
    public function setCurrentUser( $pdo, $id, $settings = false ) {
        $r = new \stdClass();
        $q = "SELECT status FROM book WHERE id = $id";
        try {
            $s = $pdo -> query( $q );
            $r -> status = $s -> fetchAll( PDO::FETCH_ASSOC );
            $r -> status = $r -> status[0]["status"];
            $r -> success = true;
            $r -> message = "Der Status wurde erfolgreich gelesen.";
            
            if( $r -> status === "1") {
                $q = "SELECT user_id FROM book_lend WHERE book_id = $id AND status = 1";
                $s = $pdo -> query( $q );
                $r -> user_id = $s -> fetchAll( PDO::FETCH_ASSOC );
                $r -> user_id = $r -> user_id[0]["user_id"];
                $r -> message .= " Der zugehörige Nutzer wurde erfolgreich gelesen.";
            }
            
        } catch ( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Lesen des Buchstatus ist folgender Fehler aufgetreten:" . $e -> getMessage();
        } 
        return $r;
    }
    
    public function setBookStatus( $pdo, $id, $status, $user, $settings ) {
        $return = new \stdClass();
                
        $query = "SELECT status FROM book WHERE id = $id";
        try {
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $old_status = $result[0]["status"];
            
            $query = "UPDATE book SET status = $status WHERE id = $id";
            $pdo->query( $query );                                
            // book_lend füllen wenn status ist nicht "offen"
            switch ( $status ) {
                case "1":
                    $query = "INSERT INTO book_lend ( book_id, user_id, status, change_status_on ) VALUES( $id, $user, $status, NOW())";                
                    $pdo->query( $query );                                
                break;
                case "2":
                
                break;
                case "3":
                
                break;
                default: //offen                    
                break;
            }
            $return -> success = true;
            $return -> message = "Der Buchstatus wurde erfolgreich gesetzt";    
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Setzen des Buchstatus ist folgender Fehler aufgetreten:" . $e -> getMessage();
                $return -> errorNumber = $e -> getCode();
        }
        return $return;   
    }
    public function requestBook( $pdo, $id, $user, $standard_reservation_time = 7 ) {
        $return = new \stdClass();
        require_once "functions.php";
        require_once "PHPMailer/PHPMailer/Exception.php";
        require_once "PHPMailer/PHPMailer/PHPMailer.php";
        $query = "SELECT title, status FROM book WHERE id = $id";
        //$query = "SELECT status, user_id FROM book_lend WHERE book_id = $id ORDER BY change_status_on";
        try {
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $book_title = $result[0]["title"]; 
            $return -> data = $result;    

            if( $result[0]["status"] == 1 ) {
                // lended
                $query = "SELECT * FROM book_lend WHERE book_id = $id AND user_id = $user";
                $stm = $pdo -> query( $query );
                $result_book_lend = $stm -> fetchAll(PDO::FETCH_ASSOC);
                if( count( $result_book_lend ) > 0 && $result_book_lend[0]["status"] == 1 ) {
                    $return -> success = false;
                    $return -> message = "Das Buch ist bereits für Dich ausgeliehen und kann nicht nochmals ausgeliehen werden!";
                    return $return;    
                } else {
                    $return -> success = false;
                    $return -> message = "Das Buch ist ausgeliehen und kann noch nicht ausgeliehen werden! Wir setzen Dich aber auf die Warteliste.";
                    $query = "INSERT INTO book_lend ( book_id, user_id, status, change_status_on ) VALUES ( $id, $user, 3, NOW() )";
                    $pdo->query( $query );                        
                    $mail = new \PHPMailer\PHPMailer\PHPMailer();
                    $content = "Wir haben Deine Buchanfrage empfangen und gespeichert. Wir setzen Dich in Kenntnis, sobald das Buch für Dich verfügbar ist.";
                    
                    $settings = parse_ini_file('../../ini/settings.ini', TRUE);
                    
                    sendWaitlistLibraryMail( $mail, $settings, $content );
                    
                    return $return;    
                }
            }
            if( $result[0]["status"] == 4 ) {
                // open
                // reserve book
                $query = "UPDATE book SET status = 2 WHERE id = $id";
                $pdo->query( $query );
                $query = "INSERT INTO book_lend ( book_id, user_id, status, change_status_on, from_date, to_date ) VALUES ( $id, $user, 2, NOW(), CURDATE(), CURDATE() + INTERVAL $standard_reservation_time DAY )";
                $pdo->query( $query );
                $return -> success = true;
                $query = "SELECT CURDATE() + INTERVAL $standard_reservation_time DAY AS res_date_to";
                $stm = $pdo -> query( $query );
                $result_date = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $res_date = getGermanDateFromMysql( $result_date[0]["res_date_to"] );
                $return -> message = "Das Buch wurde erfolgreich für dich reserviert und kann bis zum " . $res_date . " abgeholt werden.";
                
                //set message
                
                $message = "Das Buch „" . $result[0]["title"] . "” wurde erfolgreich für dich reserviert und kann bis zum " . $res_date . " abgeholt werden.";
                $query = "INSERT INTO message ( title, content, from_role, to_user ) VALUES ( 'Bibliothek','$message', 9, $user )";
                $pdo->query( $query );
                $query = "INSERT INTO message_user ( from_message, to_user ) VALUES (" . $pdo->lastInsertId() . ", $user)";                 
                $pdo->query( $query );
                //end set message
                
                // send email
                
                $settings = parse_ini_file('../../ini/settings.ini', TRUE);
                $mail = new \PHPMailer\PHPMailer\PHPMailer();
                //$mail_result = sendReservationLibraryMail( $mail, $settings, $message );
                $message = "Das Buch „" . $result[0]["title"] . "” wurde durch " . $_SESSION["firstname"] . " " . $_SESSION["lastname"] . " am " . date( "d.m.Y", time() ) . " reserviert.";
                $mail = new \PHPMailer\PHPMailer\PHPMailer();
                $mail_result = sendReservationLibraryMailToBibliothekar( $mail, $settings, $message );
                
                
                // end send email
                
                return $return;
            }
            if( $result[0]["status"] == 2 ) {
                // rederved
                //
                $book_title = $result[0]["title"]; 
                $query = "SELECT book_id, user_id, status FROM book_lend WHERE book_id = $id AND user_id = $user";
                $stm = $pdo -> query( $query );
                $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                if( count( $result ) > 0 && $result[0]["status"] == 2 ) {
                    $return -> success = false;
                    $return -> message = "Das Buch ist bereits für dich reserviert und kann nicht noch einmal angefordert werden!";
                    return $return;
                }
                // 
                if( count( $result ) > 0 && $result[0]["status"] == 3 ) {
                    // requested --> reserved
                    //$query = "UPDATE book SET status = 2 WHERE id = $id";
                    //$pdo->query( $query );
                    $query = "UPDATE book_lend SET status = 2 WHERE book_id = $id AND user_id = $user";
                    $pdo->query( $query ); 
                    $query = "UPDATE book SET status = 2 WHERE book_id = $id";
                    $pdo->query( $query ); 
                    // send mail
                    // get mail
                    
    $mail = new \PHPMailer\PHPMailer\PHPMailer();
    $mail->CharSet = "UTF-8";
    $mail->Subject = 'Reservierungs-E-Mail von der Suchtselbsthilfe-„Regenbogen”-Bibliothek';

    $mail->isHtml(true);
    $mail->AddEmbeddedImage('../images/logo.png', 'TBP', 'logo.png');
                    
    $mail -> setFrom( "bibliothek@suchtselbsthilfe-regenbogen.de", "Bibliothek Suchtselbsthilfe „Regenbogen”");
    $mail -> addAddress( $_SESSION["email"], $_SESSION["firstname"] . " " . $_SESSION["lastname"] );
    $content = '
                            <html>
                            <head>
                                <title>Reservierungs-E-Mail von der Bibliothek der Suchtselbsthilfe-„Regenbogen”-</title>
                            </head>

                            <body>

                            <img src="cid:TBP" alt="Logo" style="width: 100px;">
                            
                            <h3>Reservierungs-E-Mail</h3>

                                <p>Dies ist eine automatisch erzeugte E-Mail. Bitte antworte nicht darauf.</p>

                                <h4>Reservierung</h4>
                                <p>Du habst über die Bibliothek folgendes angefragt:</p>
                                <p>' . $result[0]["title"] . '</p>
                                <p>
                                
                                </p>
                                    <p>&nbsp;</p>
                                    <p>Ihr "Suchtselbsthilfe-Regenbogen"-Team</p>
                                    <address>
                                        <dl>
                                            <dt>E-Mail: bibliothek@suchtselbsthilfe-regenbogen.de</dt>
                                            <dt>Telefon: +49 341 444 232 2</dt>
                                            <dt>Adresse:</dt><dd>Demmeringstraße 47-49</dd>
                                            <dd>D-04177 Leipzig</dd>
                                            <dd>Germany</dd>
                                        </dl>
                                    </address>
                       </body>
                            </html>                                
                            ';                                        
                            $mail->Body = $content;
                            $mail->Send();
                $return -> success = true;
                $return -> message = "Das Buch ist bereits für dich angefordert. Sobald es verfügbar ist, informieren wir Dich.";    

            } else {
                $query = "INSERT INTO book_lend ( book_id, user_id, status, change_status_on ) VALUES ( $id, $user, 3, NOW() )";
                $pdo->query( $query );
                    
                $return -> success = false;
                $return -> message = "Das Buch „" . $book_title  . "” wurde für dich angefordert. Sobald es wieder verfügbar ist, informieren wir Dich.";
                
                $query = "INSERT INTO message ( title, content, from_role, to_user ) VALUES ( 'Bibliothek', '" . $return -> message . "', 9, $user )";    
                $pdo->query( $query );
                $query = "INSERT INTO message_user ( from_message, to_user ) VALUES (" . $pdo->lastInsertId() . ", $user)";                 
                $pdo->query( $query );
                // send mail
                $settings = parse_ini_file('../../ini/settings.ini', TRUE);
                $mail = new \PHPMailer\PHPMailer\PHPMailer();
                sendWaitlistLibraryMail( $mail, $settings, $return -> message );
                
                // end send mail
            }
            }
        } catch ( PDOException $e ) {
                $return -> success = false;
                if( $e -> getCode() == "23000" ) {
                            $return -> message = "Das Buch ist ausgeliehen und kann noch nicht ausgeliehen werden! Du stehst aber bereits auf die Warteliste.";                    
                } else {
                    $return -> message = "Beim Setzen des Buchstatus ist folgender Fehler aufgetreten:" . $e -> getMessage();
                }   
        }
        return $return;   
    }
    // works
    public function setBookEvaluation( $pdo, $bookId, $userId, $notice, $eval ) {
        $return = new \stdClass();
        $q = "INSERT INTO `book_evaluate` (`curr_date`, `book_id`, `user_id`, `text`, `evaluate`) 
            VALUES (NOW(), $bookId, $userId, '$notice', $eval)";
        try {
            $pdo -> query( $q );
            $return -> success = true;
            $return -> message = "Die Bewertung wurde erfolgreich gespeichert.";
            $q = "SELECT COUNT( id ) AS count_id, ROUND( AVG( evaluate ), 2 ) AS avg_eval FROM `book_evaluate` WHERE book_id = $bookId";        
            $s = $pdo -> query( $q );
            $r = $s -> fetchAll(PDO::FETCH_ASSOC);
            $q = "UPDATE `book` SET `count_eval` = " . $r[0]["count_id"] . ", `avg_eval` = '" . $r[0]["avg_eval"] . "' WHERE `book`.`id` = $bookId";
            $pdo -> query( $q );
        } catch ( PDOException $e ) {
            $return -> success = false;
            $return -> message = "Bei der Speicherung der Bewertung ist folgender Fehler aufgetreten: ." . $e -> getMessage();
        }
        return $return;   
    }
    
}
?>
