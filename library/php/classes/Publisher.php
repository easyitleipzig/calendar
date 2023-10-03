<?php
define( "PUBLISHER_PATH", "../publisher/" );
define( "ROOT", "../../" );
require_once( "functions.php" );
class Publisher {

    private $pdo;
    private $orderBy;
    public function standardFunktion(  ) {
        $return = new \stdClass();
        try{
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function __construct( $pdo, $orderBy = "ORDER BY id DESC" ) {
        $this -> pdo = $pdo;
        $this -> orderBy = $orderBy;
    }
    public function initPub( $id  ) {
        $return = new \stdClass();
        try{
            $query = "SELECT * FROM pub WHERE id = $id";
            $stm = $this -> pdo -> query( $query );
            $return -> data =  $stm -> fetchAll( PDO::FETCH_ASSOC );
            if( count( $return -> data ) == 1 ) {
                $return -> success = true;
                $return -> message = "Der Eintrag wurde erfolgreich gelesen.";
                $query = "SELECT id FROM pub_entry WHERE pub_id = $id";
                $stm = $this -> pdo -> query( $query );
                $return -> entries =  $stm -> fetchAll( PDO::FETCH_ASSOC );
            } else {
                $return -> success = false;
                $return -> message = "Beim Lesen des Eintrags ist ein unerwarteter Fehler aufgetreten.";            
            }
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function newPub( $type, $url, $title  ) {
        $return = new \stdClass();
        $query = "INSERT INTO `pub` ( `type`,`url`, `title`) VALUES ( $type, '$url', '$title')";
        try {
            $this -> pdo -> query( $query );
            $return -> newId = $this -> pdo -> lastInsertId();
            if( file_exists( PUBLISHER_PATH . $return -> newId ) ) {
                
            } else {
                mkdir( PUBLISHER_PATH . $return -> newId );
            }
            $return -> publisherPath = str_replace( "..", "library", PUBLISHER_PATH . $return -> newId . "/" );
            $return -> success = true;
            $return -> message = "Der Eintrag wurde erfolgreich angelegt.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;                            
    }
    public function deletePatternChildren( $id ) {
        $return = new \stdClass();
        try {
            $q = "select id from pub_entry where pub_id = " . $id;
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $l = count( $r );
            $i = 0;
            while( $i < $l ) {
                $q = "delete from pub_element where pub_entry_id = " . $r[$i]["id"];
                //$r[$i];
                $i += 1;
             $this -> pdo -> query( $q );
            }
            $q = "delete from pub_entry where pub_id = " . $id;        
            $this -> pdo -> query( $q );
            if( !deleteDirectory( "../publisher/" . $id ) ) {
                $return -> success = false;
                $return -> message = "Beim Löschen des Verzeichnisses ist ein Fehler aufgetreten:" . $e -> getMessage() . ".";            
                return $return;
            }
            $return -> success = true;
            $return -> message = "Die Kindeinträge wurden erfolgreich gelösch.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;                            
   }
    public function getEntry( $id ) {
        $return = new \stdClass();
        $query = "SELECT * FROM pub_entry WHERE id = $id";
        try {
            $stm = $this -> pdo -> query( $query );
            $return -> data =  $stm -> fetchAll( PDO::FETCH_ASSOC );
            if( count( $return -> data ) == 1 ) {
/*                $query = "SELECT * FROM pub_elements WHERE id = $id";
                $stm = $this -> pdo -> query( $query );
                $return -> dataElements =  $stm -> fetchAll( PDO::FETCH_ASSOC );
*/                $return -> success = true;
                $return -> message = "Der Eintrag wurde erfolgreich gelesen.";
            } else {
                $return -> success = false;
                $return -> message = "Beim Lesen des Eintrags ist ein unerwarteter Fehler aufgetreten.";            
            }
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function getEntries( $id ) {
        $return = new \stdClass();
        $query = "SELECT * FROM pub_entry WHERE pub_id = $id " . $this -> orderBy;
        try {
            $stm = $this -> pdo -> query( $query );
            $return -> data =  $stm -> fetchAll( PDO::FETCH_ASSOC );
            $return -> success = true;
            $return -> message = "Die Einträge wurde erfolgreich gelesen.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function newPatternEntry( $pubId, $template ) {
        $return = new \stdClass();
        $query = "INSERT INTO `pub_entry` (`pub_id`, `title`, `created_on`, `published_on`, `status`, `type`, `class_list`, `template`) VALUES ( $pubId, 'Neu', '0', '0', 0, 1, 'index_intern.css publisher.css', '$template' )";        
        try {
            $this -> pdo -> query( $query );
            $return -> newId = $this -> pdo -> lastInsertId();
            $q = "select id, url from pub where url = 'pattern.php?p=new'";
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $l = count( $r );
            $i = 0;
            while( $i < $l ) {
                $q = "update pub set url = 'publisher.php?p=" . $r[$i]["id"] . "' where id = " . $r[$i]["id"];
                $this -> pdo -> query( $q );               
                $r[$i];
                $i += 1;
            }
                 
            mkdir("../publisher/" . $pubId, 0777, true );
            $query = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( " . $return -> newId . ", '1', 'library/css/icons/image.png')";
            $this -> pdo -> query( $query );
            $query = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( " . $return -> newId . ", '2', '')";
            $this -> pdo -> query( $query );
            $query = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( " . $return -> newId . ", '3', '#|_blank|weiterlesen')";
            $this -> pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Der Eintrag wurde erfolgreich angelegt.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function newArchiveEntry( $pubId, $template ) {
        $return = new \stdClass();
        $query = "INSERT INTO `pub_entry` (`pub_id`, `title`, `created_on`, `published_on`, `status`, `type`, `class_list`, `template`) VALUES ( $pubId, 'Neu', '0', '0', 0, 1, 'index_intern.css publisher.css', '$template' )";        
        try {
            $this -> pdo -> query( $query );
            $return -> newId = $this -> pdo -> lastInsertId();
            $q = "select id, url from pub where url = 'archive.php?p=new'";
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $l = count( $r );
            $i = 0;
            while( $i < $l ) {
                $q = "update pub set url = 'archive.php?p=" . $r[$i]["id"] . "' where id = " . $r[$i]["id"];
                $this -> pdo -> query( $q );               
                $r[$i];
                $i += 1;
            }
                 
            mkdir("../publisher/" . $pubId, 0777, true );
            $query = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( " . $return -> newId . ", '1', 'library/css/icons/image.png')";
            $this -> pdo -> query( $query );
            $query = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( " . $return -> newId . ", '2', '')";
            $this -> pdo -> query( $query );
            $query = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( " . $return -> newId . ", '3', '#|_blank|weiterlesen')";
            $this -> pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Der Eintrag wurde erfolgreich angelegt.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function newEntry( $title, $status, $createdOn, $publishedOn, $pubId = 0, $type = 0, $classList = "", $template = "", $orderType = "0" ) {
        $return = new \stdClass();
        // get last order number
        $q = "select max(order_nr) + 1 as maxOrd from pub_entry where pub_id = $pubId";
        $s = $this -> pdo -> query( $q );
        $r_mOrd = $s -> fetchAll( PDO::FETCH_ASSOC ); 
        $query = "INSERT INTO `pub_entry` (`pub_id`, `title`, `created_on`, `published_on`, `status`, `type`, `class_list`, `template`,  `order_nr`) VALUES ( $pubId, '$title', '$createdOn', '$publishedOn', $status, $type, '$classList', '$template', " . $r_mOrd[0]["maxOrd"] . " )";        
        try {
            $this -> pdo -> query( $query );
            $return -> newId = $this -> pdo -> lastInsertId();
            $query = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( " . $return -> newId . ", '1', 'library/css/icons/image.png')";
            $this -> pdo -> query( $query );
            $query = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( " . $return -> newId . ", '2', '')";
            $this -> pdo -> query( $query );
            $query = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( " . $return -> newId . ", '3', '#|_blank|weiterlesen')";
            $this -> pdo -> query( $query );

            $return -> success = true;
            $return -> message = "Der Eintrag wurde erfolgreich angelegt.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function newListEntry( $entryId, $type ) {
        $return = new \stdClass();
        try {
            $q = "INSERT INTO `pub_element` ( pub_entry_id, `type`, `content`) VALUES ( $entryId, $type, '')";
            $this -> pdo -> query( $q );
            $return -> newEntryId = $this -> pdo -> lastInsertId();
            if( $type === "4" ) {
                $type = 6; 
            } else {
                $type = 7;
            }
            $q = "INSERT INTO `pub_element` ( pub_entry_id, `type`, `content`) VALUES ( $entryId, $type, '" . $return -> newEntryId . "|')";
            $this -> pdo -> query( $q );
            $return -> newElementId = $this -> pdo -> lastInsertId();
            $return -> success = true;
            $return -> message = "Die Liste wurde erfolgreich gespeichert.";            
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function newList( $elId, $entryId, $type, $content ) {
        $return = new \stdClass();
        try {
            if( $type === "ol") {
                $q = "update `pub_element` set type = 4, content = '' where id = $elId";
            } else {
                $q = "update `pub_element` set type = 5, content = '' where id = $elId";
            }
            $this -> pdo -> query( $q );
            $q = "INSERT INTO `pub_element` ( pub_entry_id, `type`, content ) VALUES ( $entryId, 6, '$elId|$content')";
            $this -> pdo -> query( $q );
            $return -> newElementId = $this -> pdo -> lastInsertId();
            $return -> success = true;
            $return -> message = "Die Liste wurde erfolgreich gespeichert.";            
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }

    public function swapEntryTemplate( $Id, $template ) {
        $return = new \stdClass();
        try {
            $q = "UPDATE `pub_entry` SET `template` = '$template' WHERE id = $Id";
            $this -> pdo -> query( $q );
            $return -> success = true;
            $return -> message = "Das Template wurde erfolgreich gespeichert.";            
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function swapEntry( $fromId, $toId ) {
        $return = new \stdClass();
        try {
            $query = "SELECT * FROM pub_entry WHERE id = $fromId";
            $stm = $this -> pdo -> query( $query );
            $return -> dataFrom =  $stm -> fetchAll( PDO::FETCH_ASSOC );
            $query = "SELECT * FROM pub_entry WHERE id = $toId";
            $stm = $this -> pdo -> query( $query );
            $return -> dataTo =  $stm -> fetchAll( PDO::FETCH_ASSOC );
            $query = "UPDATE `pub_entry` SET `pub_id` = " . $return -> dataFrom[0]["pub_id"] . ", `type` = " . $return -> dataFrom[0]["type"] . ", `template` = '" . $return -> dataFrom[0]["template"] . "', `class_list` = '" . $return -> dataFrom[0]["class_list"] . "', `title` = '" . $return -> dataFrom[0]["title"] . "', `created_on` = '" . $return -> dataFrom[0]["created_on"] . "', `published_on` = '" . $return -> dataFrom[0]["published_on"] . "', `status` = " . $return -> dataFrom[0]["status"] . " WHERE `pub_entry`.`id` = $toId";
            $this -> pdo -> query( $query );
            $query = "UPDATE `pub_entry` SET `pub_id` = " . $return -> dataTo[0]["pub_id"] . ", `type` = " . $return -> dataTo[0]["type"] . ", `template` = '" . $return -> dataTo[0]["template"] . "', `class_list` = '" . $return -> dataTo[0]["class_list"] . "', `title` = '" . $return -> dataTo[0]["title"] . "', `created_on` = '" . $return -> dataTo[0]["created_on"] . "', `published_on` = '" . $return -> dataTo[0]["published_on"] . "', `status` = " . $return -> dataTo[0]["status"] . " WHERE `pub_entry`.`id` = $fromId";
            $this -> pdo -> query( $query );           
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function saveEntry( $id, $title, $status, $img, $para, $link ) {
        $return = new \stdClass();
        $query = "UPDATE `pub_entry` SET `title` = '$title', `status` = $status WHERE `pub_entry`.`id` = $id";
        try {
            $this -> pdo -> query( $query );
            $id = explode( "_", $img -> id )[1];
            $query = "UPDATE `pub_element` SET `content` = '" .  $img -> content . "' WHERE `pub_element`.`id` = $id";
            $this -> pdo -> query( $query );
            $id = explode( "_", $link -> id )[1];
            $query = "UPDATE `pub_element` SET `content` = '" .  $link -> content . "' WHERE `pub_element`.`id` = $id";
            $this -> pdo -> query( $query );
            $l = count( $para );
            $i = 0;
            while ( $i < $l ){
                $id = explode( "_",  $para[$i] -> id )[1];
                $query = "UPDATE `pub_element` SET `content` = '" .   $para[$i] -> content . "' WHERE `pub_element`.`id` = $id";
                $this -> pdo -> query( $query );
                $i += 1;
            }

            $return -> success = true;
            $return -> message = "Der Eintrag wurde erfolgreich gespeichert.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;        
    }
    public function deleteEntry( $id, $deteteContent = "true" ) {
        $return = new \stdClass();
        $query = "SELECT pub_id FROM pub_entry WHERE id = $id";
        $stm = $this -> pdo -> query( $query );
        $r = $stm -> fetchAll( PDO::FETCH_ASSOC );
        $query = "SELECT * FROM pub_element WHERE pub_entry_id = $id AND ( type = 1 OR type = 3 )";
        $stm = $this -> pdo -> query( $query );
        $r = $stm -> fetchAll( PDO::FETCH_ASSOC );
        $l = count( $r );
        $i = 0;
        while ( $i < $l ){
            $tmp = str_replace( "library/", "../", $r[$i]["content"] );
            switch( $r[$i]["type"] ) {
                case "1":
                    if( file_exists( $tmp ) &&  $r[$i]["content"] !== "library/css/icons/image.png" ) {
                        unlink( $tmp );
                    }                
                break;
                case "3":
                    $query = "SELECT pub_id FROM pub_entry WHERE id = $id";
                    $stm = $this -> pdo -> query( $query );
                    $r_pub = $stm -> fetchAll( PDO::FETCH_ASSOC );
                    $tmpExt = substr( getFileExt( $tmp ), 0, 3  );
                    if( $tmpExt != "php" && $tmpExt != "htm" ) {
                        $file = "../publisher/" . $r_pub[0]["pub_id"] . "/" . explode( "|", $tmp )[0];
                        if( file_exists( $file ) ) {
                            unlink( $file );
                        }                
                    }
                break;
            }
            $i += 1;
        }
        $query = "DELETE FROM pub_element WHERE pub_entry_id = $id";
        try {
            $this -> pdo -> query( $query );
            $query = "DELETE FROM pub_entry WHERE id = $id";
            $this -> pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Der Eintrag wurde erfolgreich gelöscht.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;        
    }
    public function saveHeadline( $id, $content ) {
        $return = new \stdClass();        
        $query = "UPDATE `pub_entry` SET `title` = '$content' WHERE `pub_entry`.`id` = $id";
        try {
            $this -> pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Die Überschrift wurde erfolgreich gespeichert.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;        
            
    }
    public function getElements( $id ) {
        $return = new \stdClass();
        $query = "SELECT * FROM pub_element WHERE pub_entry_id = $id";
        try {
            $stm = $this -> pdo -> query( $query );
            $return -> data =  $stm -> fetchAll( PDO::FETCH_ASSOC );
            $return -> success = true;
            $return -> message = "Die Elemente wurden erfolgreich gelesen.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function getElement( $id ) {
        $return = new \stdClass();
        $query = "SELECT * FROM pub_element WHERE id = $id";
        try {
            $stm = $this -> pdo -> query( $query );
            $return -> data =  $stm -> fetchAll( PDO::FETCH_ASSOC );
            $return -> success = true;
            $return -> message = "Das Element wurde erfolgreich gelesen.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function newElement( $entryId, $type, $oldIds ) {
        $return = new \stdClass();
        try {
            $tmp = explode( ",", $oldIds );
            $l = count( $tmp );
            $i = 0;
            $newIds = [];
            while( $i < $l ) {
                
                $id = explode( "_", $tmp[$i] );
                
                if( $id[ 1 ] == "new" ) {
                    $q = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( $entryId, $type, '')";    
                    $this -> pdo -> query( $q );
                    $return -> actualId = "#pElement_" . $this -> pdo -> lastInsertId();
                    array_push( $newIds, "pElement_" . $this -> pdo -> lastInsertId() );
                } else {
                    $q = "select * from pub_element where id = " . $id[ 1 ];
                    $s = $this -> pdo -> query( $q );
                    $r_el = $s -> fetchAll( PDO::FETCH_ASSOC );
                    $q = "delete from pub_element where id = " . $id[ 1 ];
                    $this -> pdo -> query( $q );
                    $q = "INSERT INTO `pub_element` ( `pub_entry_id`, `type`, `content`) VALUES ( " . $r_el[0]["pub_entry_id"] . ", " . $r_el[0]["type"] . ", '" . $r_el[0]["content"] . "')";    
                    $this -> pdo -> query( $q );
                    $newElId = $this -> pdo -> lastInsertId();
                    array_push( $newIds, $id[ 0 ] . "_" . $this -> pdo -> lastInsertId() );
                    if( $id[0] === "pList" ) {
                        // rewrite list elements
                        $q = "select * from pub_element where content like '" . $id[ 1 ] . "|%'";
                        $s = $this -> pdo -> query( $q );
                        $r_liEl = $s -> fetchAll( PDO::FETCH_ASSOC );
                        $m = count( $r_liEl );
                        $j = 0;
                        while( $j < $m ) {
                            $tmpContent = explode( "|", $r_liEl[$j]["content"] )[1];
                            $qCont = "update pub_element set content = '" . $newElId . "|" . $tmpContent . "' where id = " . $r_liEl[$j]["id"];
                            $this -> pdo -> query( $qCont );
                            $j += 1;
                        }               
                    }
                }
                
                $i += 1;
            }
            $return -> newIds = $newIds;
            $return -> success = true;
            $return -> message = "Das Element wurde erfolgreich angelegt.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function saveElement( $Id, $content ) {
        $return = new \stdClass();
        if( is_null( $Id ) || $Id == "undefined" ) {
            $return -> success = true;
            $return -> message = "Das Element war leer.";            
        }
        $query = "UPDATE `pub_element` SET `content` =  '" . $content . "' WHERE `pub_element`.`id` = $Id";
        try {
            $this -> pdo -> query( $query );
/*
            $q = "select content, pub_entry_id from pub_element WHERE `pub_element`.`id` = $Id";
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $return -> content = $r[0]["content"];
            $return -> entry_id = $r[0]["pub_entry_id"];
*/
            //$q = "INSERT INTO `pub_element` ( pub_entry_id, `type`, `content`) VALUES ( $entryId, 6, '$listId|')";
            //$this -> pdo -> query( $q );
            //$return -> newId = $this -> pdo -> lastInsertId();
            $return -> success = true;
            $return -> message = "Das Element wurde erfolgreich gespeichert.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;        
    }
    public function setFormatParagraphElement( $Id, $content ) {
        $return = new \stdClass();
        try {
            $return -> success = true;
            $return -> message = "Das Element wurde erfolgreich gespeichert.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;        
    }
    public function deleteElement( $Id ) {
        $return = new \stdClass();
        $query = "DELETE FROM `pub_element` WHERE id = $Id";
        try {
            $this -> pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Das Element wurde erfolgreich gelöscht.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;
    }
    public function saveListElement( $Id, $entryId, $listId, $content ) {
        $return = new \stdClass();
        $query = "UPDATE `pub_element` SET `content` =  '$listId|" . $content . "' WHERE `pub_element`.`id` = $Id";
        try {
            $this -> pdo -> query( $query );
            //$q = "INSERT INTO `pub_element` ( pub_entry_id, `type`, `content`) VALUES ( $entryId, 6, '$listId|')";
            //$this -> pdo -> query( $q );
            //$return -> newId = $this -> pdo -> lastInsertId();
            $return -> success = true;
            $return -> message = "Das Element wurde erfolgreich gespeichert.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;        
    }
    public function newListElement( $entryId, $listId, $Ids, $oldId , $oldValue ) {
        $return = new \stdClass();
        $result = new \stdClass();
        $result = $this -> saveListElement( $oldId, $entryId, $listId, $oldValue );
        $q = "insert into pub_element (pub_entry_id, type, content ) values ( $entryId, 6, '" . $listId . "|')";
        $this -> pdo -> query( $q );
        $oldIds = [];
        $oldIds[] = $this -> pdo -> lastInsertId();
        $q = "select * from pub_element where content like '" . $listId . "|%'";
        $s = $this -> pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        $tmpIds = explode( ",", $Ids );
        $l = count( $tmpIds );
        $i = 0;
        $j = 0;
        while( $i < $l ) {
            if( $tmpIds[$i] === "pElement_new" ) {
                $q = "insert into pub_element (pub_entry_id, type, content ) values ( $entryId, 6, '" . $listId . "|')";
                $this -> pdo -> query( $q );
                $newIds[] = $this -> pdo -> lastInsertId();
                $return -> activeId = $this -> pdo -> lastInsertId();               
            } else {
                $oldIds[] = $r[$j]["id"];
                $q = "insert into pub_element (pub_entry_id, type, content, styles ) values (" . $r[$j]["pub_entry_id"] . ", 6, '" . $r[$j]["content"] . "', '" . $r[$j]["styles"] . "' )";
                $this -> pdo -> query( $q );
                $nId = $this -> pdo -> lastInsertId();
                $newIds[] = $nId;
                if( $r[$j]["id"] == $oldId ) $return -> oldId = $nId;
                $j++;                               
            }
            $i += 1;
        }
        $return -> newIds = $newIds;
        if( count( $oldIds ) > 0 ) {
            $q = "delete from pub_element where id in( " . implode( ",", $oldIds ) . ")";
            $this -> pdo -> query( $q );            
        }
        return $return;
    }
    public function deleteListElement( $Id ) {
        $return = new \stdClass();
        // get list id
        $q = "select content from pub_element where id = $Id";
        $s = $this -> pdo -> query( $q );
        $r_list = $s -> fetchAll( PDO::FETCH_ASSOC );
        $lId = explode( "|", $r_list[0]["content"] )[0];
        // check if id the first list element
        $q = "select id from pub_element where content like '$lId|%' order by id"; 
        $s = $this -> pdo -> query( $q );
        $r_checkListElement = $s -> fetchAll( PDO::FETCH_ASSOC );
        if( $r_checkListElement[0]["id"] == $Id ) {
            // is first element -> get next list element
            $q = "select id from pub_element where content like '$lId|%' order by id"; 
            $s = $this -> pdo -> query( $q );
            $r_checkListElement = $s -> fetchAll( PDO::FETCH_ASSOC );
            $return -> activeId = $r_checkListElement[1]["id"];
        } else {
            // get previos id if exsist
            $q = "select id from pub_element where content like '$lId|%' and id < $Id order by id desc"; 
            $s = $this -> pdo -> query( $q );
            $r_checkListElement = $s -> fetchAll( PDO::FETCH_ASSOC );
            $return -> activeId = $r_checkListElement[0]["id"];            
        }
        $query = "DELETE FROM `pub_element` WHERE `id` = $Id";
        try {
            $this -> pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Das Element wurde erfolgreich gelöscht.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;        
    }
    public function deleteList( $Id ) {
        $return = new \stdClass();
        try {
            $q = "delete from pub_element where content like '$Id|%'";            
            $this -> pdo -> query( $q );
            $q = "update pub_element set type = 2, content = '' where id = $Id";
            $this -> pdo -> query( $q );
            $return -> success = true;
            $return -> message = "Die Liste wurde erfolgreich gelöscht.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;        
    }
    public function switchStatus( $id, $status ) {
        $return = new \stdClass();
        try {            
            switch( $status ) {
                case "0":
                    $query = "UPDATE `pub_entry` SET `status` = 1 WHERE `pub_entry`.`id` = $id";
                    $this -> pdo -> query( $query );
                    $query = "SELECT DATE( created_on ) as created_on FROM `pub_entry` WHERE id = $id";
                    $stm = $this -> pdo -> query( $query );
                    $data =  $stm -> fetchAll( PDO::FETCH_ASSOC );
                    $date = $data[0]["created_on"];
                    $return -> status = 1;
                break;
                case "1":
                    $date = date( "Y-m-d", time() );
                    $query = "UPDATE `pub_entry` SET `published_on` = '$date', `status` = 0 WHERE `pub_entry`.`id` = $id";
                    $this -> pdo -> query( $query );
                    $return -> status = 0;
                break;
            }
            
            $return -> date = $date;
            $return -> success = true;
            $return -> message = "Der Status wurde erfolgreich gespeichert.";
        } catch ( Exception $e) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";            
        }
        return $return;        
                
    }
    public function saveTemplate( $id, $template  ) {
        $return = new \stdClass();
        try{
            $query = "UPDATE `pub_entry` SET `template` = '$template' WHERE `pub_entry`.`id` = $id";
            $this -> pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Das Template wurde erfolgreich gespeichert.";
            
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function getContent( $pub_id = "1" ) {
        $return = new \stdClass();
        try{
            $q = "select order_type from pub where id = $pub_id";
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            switch( $r[0]["order_type"] ) {
                case 0:
                    $q = "select * from pub_entry where pub_id = $pub_id order by created_on desc";
                
                break;
                case 1:
                    $q = "select * from pub_entry where pub_id = $pub_id order by published_on desc";
                
                break;
                case 2:
                    $q = "select * from pub_entry where pub_id = $pub_id order by published_on asc";
                break;
                case 3:
                    $q = "select * from pub_entry where pub_id = $pub_id order by id desc";
                break;
                case 4:
                    $q = "select * from pub_entry where pub_id = $pub_id order by id asc";
                break;
                case 5:
                    $q = "select * from pub_entry where pub_id = $pub_id order by order_nr";
                break;
            }
            //$q = "select * from pub_entry where pub_id = $pub_id order by id asc";
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $return -> entries = $r;
            $l = count( $return -> entries );
            $i = 0;
            while( $i < $l ) {
                $q = "select * from pub_element where pub_entry_id = " . $return -> entries[$i]["id"];
                $s = $this -> pdo -> query( $q );
                $r = $s -> fetchAll( PDO::FETCH_ASSOC );
                $return -> entries[$i]["elements"] = $r;
                $i += 1;
            }
            
            $return -> success = true;
            $return -> message = "Der Inhalt wurde erfolgreich gelesen.";
            
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    } 
    public function getEntryInfo( $entryId ) {
        $return = new \stdClass();
        $return -> data = new \stdClass();
        try{
            $q = "SELECT pub.* FROM pub, `pub_entry` WHERE pub_id = pub.id and pub_entry.id = $entryId";
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $return -> data -> pubInfo = $r; 
            $q = "select * from pub_entry where id = $entryId";
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $return -> data -> entryInfo = $r; 
            $return -> success = true;
            $return -> message = "Die Daten wurden erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function getLinkUrlsFiles( $path, $extensions ) {
        $return = new \stdClass();
        $return -> data = new \stdClass();
        try{
            $files = [];
            //chdir( ROOT . $path );
            $ext = explode( ";", $extensions );
            $l = count( $ext );
            $i = 0;
            while( $i < $l ) {
                foreach( glob( ROOT . $path . $ext[$i] ) as $filename ) {
                     $files[] = $filename;   
                }
                $i += 1;
            }
            $return -> files = $files;            
            $return -> success = true;
            $return -> message = "Die Daten wurden erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function getLinkArchives( $id ) {
        $return = new \stdClass();
        $return -> data = new \stdClass();
        try{
            $r = $this -> getElement( $id );
            $q = "select archive_id from pub_entry where id = " . $r -> data[0]["pub_entry_id"];
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $r = $r[0]["archive_id"];
            $return -> data = $r;            
            $return -> success = true;
            $return -> message = "Die Daten wurden erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function getLinkTarget( $id ) {
        $return = new \stdClass();
        $return -> data = new \stdClass();
        try{
            $r = $this -> getElement( $id );
            $q = "select content from pub_element where id = $id";
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $r = $r[0]["content"];
            $r = explode( "|", $r );
            $return -> target = $r[1];            
            $return -> success = true;
            $return -> message = "Die Daten wurden erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function createNews( $id ) {
        $return = new \stdClass();
        $return -> data = new \stdClass();
        try{
            $q = "select title from pub_entry where id = $id";
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $r = $r[0]["title"];
            require_once( "classes/News.php" );
            $n = new \News();
            $res = $n -> newNews( $this -> pdo, "Neuer Homepage-Eintrag", "Es wurde ein neuer Eintrag “" . $r . "“ auf der internen Homepage erstellt. Schau doch einfach mal wieder vorbei.", 29, 0, 1, 0, date( "Y-m-d", time() + 30 * 86400 ) );

            $return -> success = true;
            $return -> message = "Die Daten wurden erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function setSpanStyle( $Id, $spanHtml, $style, $value ) {
        $return = new \stdClass();
        $sty = ["font-size", "font-weight", "font-style", "text-decoration" ];    
    }
    public function setElStyle( $Id, $style, $value ) {
        $q = "select styles from pub_element where id = $Id";
        $s = $this -> pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        if( count( $r ) == 0 ) return; 
        $tmp = explode( ";", $r[0]["styles"] );
        $l = count( $tmp );
        $i = 0;
        while( $i < $l ) {
            $tmpStyle = explode( ":", $tmp[$i] );
            if( $tmpStyle[0] === $style ) {
                unset( $tmp[$i] );
            }
            $i += 1;
        }
        $l = count( $tmp );
        $i = 0;
        $sty = "";
        while( $i < $l ) {
            if( isset( $tmp[$i] ) && $tmp[$i] != "" ) $sty .= $tmp[$i] . ";";

            $i += 1;
        }
        $sty .= $style . ":" . $value . ";";
        $q = "update pub_element set styles ='$sty' where id = $Id";
        $this -> pdo -> query( $q );
    }
    public function setFullStyle( $Id, $style ) {
        $q = "update pub_element set styles ='$style' where id = $Id";
        $this -> pdo -> query( $q );
    }
    public function deleteElStyle( $Id ) {
        $q = "update pub_element set styles ='' where id = $Id";
        $this -> pdo -> query( $q );
    }
    public function addFontStyle( $Id, $fontStyle ) {
        $q = "select styles from pub_element where id = $Id";
        $s = $this -> pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        $q = "update pub_element set styles ='$fontStyle" . $r[0]["styles"] . "' where id = $Id";
        $this -> pdo -> query( $q );
    }
    public function deleteFontStyle( $Id ) {
        $q = "select styles from pub_element where id = $Id";
        $s = $this -> pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        $tmp = explode( ";", $r[0]["styles"] );
        $l = count( $tmp );
        $i = 0;
        $newStyle = "";
        while( $i < $l ) {
            $tmpSty = explode( ":", $tmp[ $i ] );
            switch( $tmpSty[0] ) {
                case "font-size":
                case "font-weight":
                case "font-style":
                case "text-decoration":
                case "color":
                
                break;
                default:
                    $newStyle .= $tmpSty[0] . ":" . $tmpSty[1] .";";
                break;
            }
            $args[$i];
            $i += 1;
        }
    }
    public function moveEntryDown( $Id ) {
        // get pub Id
        $return = new \stdClass();
        $q = "select pub_id, order_nr from pub_entry where id = $Id";
        $s = $this -> pdo -> query( $q );
        $r_pubId = $s -> fetchAll( PDO::FETCH_ASSOC );
        $pubId = $r_pubId[0]["pub_id"];
        // get count entries
        $q = "select count( id ) as cEntries, max( order_nr ) as mOrd from pub_entry where pub_id = $pubId";
        $s = $this -> pdo -> query( $q );
        $r_cEnt = $s -> fetchAll( PDO::FETCH_ASSOC );
        if( $r_cEnt[0]["cEntries"] === 1 )  {
            $return -> status = 0;
            $return -> success = true;
            $return -> message = "Es ist nur dieser Eintrag vorhanden.";
            return $return;
        }
        // check if last entry
        if( $r_cEnt[0]["mOrd"] === $r_pubId[0]["order_nr"] ) {
            $return -> status = 1;
            $return -> success = true;
            $return -> message = "Der letzte Eintrag kann nicht nach hinten verschoben werden.";
            return $return;
        }
        // get next record order nr
        $q = "select id, order_nr from pub_entry where pub_id = $pubId and order_nr > " . $r_pubId[0]["order_nr"] . " order by order_nr";
        $s = $this -> pdo -> query( $q );
        $r_nOrd = $s -> fetchAll( PDO::FETCH_ASSOC );
        $nOrd = $r_nOrd[0]["order_nr"];
        $q = "update pub_entry set order_nr = " . $r_pubId[0]["order_nr"] . " where id = " . $r_nOrd[0]["id"];
        $this -> pdo -> query( $q );
        $q = "update pub_entry set order_nr = $nOrd where id = $Id";
        $this -> pdo -> query( $q );
        $return -> status = 2;
        $return -> success = true;
        $return -> message = "Die Einträge wurden erfolgreich vertauscht.";
        return $return;
    }
    public function moveEntryUp( $Id ) {
        // get pub Id
        $return = new \stdClass();
        $q = "select pub_id, order_nr from pub_entry where id = $Id";
        $s = $this -> pdo -> query( $q );
        $r_pubId = $s -> fetchAll( PDO::FETCH_ASSOC );
        $pubId = $r_pubId[0]["pub_id"];
        // get count entries
        $q = "select count( id ) as cEntries, min( order_nr ) as mOrd from pub_entry where pub_id = $pubId";
        $s = $this -> pdo -> query( $q );
        $r_cEnt = $s -> fetchAll( PDO::FETCH_ASSOC );
        if( $r_cEnt[0]["cEntries"] === 1 )  {
            $return -> status = 0;
            $return -> success = true;
            $return -> message = "Es ist nur dieser Eintrag vorhanden.";
            return $return;
        }
        // check if first entry
        if( $r_cEnt[0]["mOrd"] === $r_pubId[0]["order_nr"] ) {
            $return -> status = 1;
            $return -> success = true;
            $return -> message = "Der erste Eintrag kann nicht nach hinten verschoben werden.";
            return $return;
        }
        // get next record order nr
        $q = "select id, order_nr from pub_entry where pub_id = $pubId and order_nr < " . $r_pubId[0]["order_nr"] . " order by order_nr desc";
        $s = $this -> pdo -> query( $q );
        $r_nOrd = $s -> fetchAll( PDO::FETCH_ASSOC );
        $nOrd = $r_nOrd[0]["order_nr"];
        $q = "update pub_entry set order_nr = " . $r_pubId[0]["order_nr"] . " where id = " . $r_nOrd[0]["id"];
        $this -> pdo -> query( $q );
        $q = "update pub_entry set order_nr = $nOrd where id = $Id";
        $this -> pdo -> query( $q );
        $return -> status = 2;
        $return -> success = true;
        $return -> message = "Die Einträge wurden erfolgreich vertauscht.";
        return $return;
    }
}  
?>
