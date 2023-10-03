<?php
class AdminSearch {
    private $pdo;
    public function standardFunktion(  ) {
        $return = new \stdClass();
        try{
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function __construct( $pdo ) {
        $this -> pdo = $pdo;
    }
    public function getAccount( $id ) {
        $return = new \stdClass();
        try{
                $query = "SELECT role FROM search_role WHERE to_page = $id";
                $stm = $this -> pdo -> query( $query );
                $return -> role = $stm -> fetchAll( PDO::FETCH_ASSOC );
                $l = count( $return -> role );
                $i = 0;
                $role = [];
                while ( $i < $l ){
                    $role[] = $return -> role[ $i ]["role"];
                    $i += 1;
                }
                $return -> role = $role;
                $return -> success = true;
                $return -> message = "Gruppen erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }

    public function newAccount( $id, $accounts, $save = false ) {
        $return = new \stdClass();
        try {
            if( $save ) {
                $query = "DELETE FROM search_role WHERE to_page = $id";
                $this -> pdo -> query( $query );                
            }
            $tmp = explode( ",", $accounts );
            $l = count( $tmp );
            $i = 0;
            while ( $i < $l ){
                $query = "INSERT INTO search_role ( to_page, role ) VALUES ($id, " . $tmp[$i] . ")";
                $this -> pdo -> query( $query );
                $i += 1;
            }
            $return -> success = true;
            $return -> message = "Die Gruppen wurden erfolgreich gespeichert.";
        } catch( Exception $e ) {
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function newShort( $type, $page, $title, $description, $search_words, $fullText ) {
        $return = new \stdClass();
        try{
            $query = "INSERT INTO search ( type, page, title, description, keywords, full_text) VALUES (" . $type . ", '" . $page . "', '" . $title . "', '" . $description . "' , '" . $search_words . "', '" . $fullText . "' )";
            $this -> pdo -> query( $query );
            $return -> newSearchId = $this -> pdo -> lastInsertId();
            $query = "INSERT INTO `search_role` (`to_page` ) VALUES (" . $return -> newSearchId . ")";
            $this -> pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Die Seite wurde erfolgreich angelegt."; 
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
    return $return;                            
    }
    public function saveDetail( $id, $type, $url, $title, $description, $keywords, $full_text, $accounts ) {
        $return = new \stdClass();
        try {
            require_once( "functions.php" );
            if( !chkLinkExists( $url ) ) {
                $return -> success = false;
                $return -> message = "Der angegebene Link ist fehlerhaft!";
                return $return;
            }
            if( $id == "new" ) {
                $query = "INSERT INTO `search` (`type`, `page`, `title`, `description`, `keywords`, `full_text`) VALUES ( $type, '" . $url . "', '" . $title . "', '" . $description . "', '" . $keywords . "', '" . $full_text . "')";
                $this -> pdo -> query( $query );
                $return -> Id = $this -> pdo -> lastInsertId();
                $this -> newAccount( $return -> Id, $accounts );
                $return -> success = true;
                $return -> message = "Die Daten wurden erfolgreich gespeichert.";
            } else {
                $query = "UPDATE `search` SET `type` = $type, `page` = '" . $url . "', `title` = '" . $title . "', `description` = '" . $description . "', `keywords` = '" . $keywords . "', full_text = '" . $full_text . "' WHERE `search`.`id` = " . $id;
                $this -> pdo -> query( $query );
                $query = "DELETE FROM search_role WHERE to_page = " . $id;
                $this -> pdo -> query( $query );
                $this -> newAccount( $id, $accounts, true );
                $return -> success = true;
                $return -> message = "Die Daten wurden erfolgreich gespeichert.";
            }

        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function saveShort( $id, $type, $page, $title, $description, $search_words, $fullText ) {
        $return = new \stdClass();
        try{
            require_once( "functions.php" );
            if( !chkLinkExists( $page ) ) {
                $return -> success = false;
                $return -> message = "Der angegebene Link ist fehlerhaft!";
            } else {
                    $query = "UPDATE search SET type = " . $type . ", page = '" . $page . "', title = '" . $title . "', description = '" . $description . "', keywords = '" . $search_words . "', full_text='" . $fullText . "'  WHERE id = ". $id;
                    $this -> pdo -> query( $query );
                    $return -> success = true;
                    $return -> message = "Die Seite wurde erfolgreich gespeichert."; 
            }
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
    return $return;                            
    }
    public function deleteRecord( $id ) {
        $return = new \stdClass();
        try{
            $query = "DELETE FROM search WHERE id =" . $id; 
            $this -> pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Die Seite wurde erfolgreich gelöscht.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function getPageById( $id ) {
        $return = new \stdClass();
        try{
            $query = "SELECT * FROM search WHERE id =" . $id; 
            $stm = $this -> pdo -> query( $query );
            $return -> data = $stm -> fetchAll( PDO::FETCH_ASSOC );
            if( count( $return -> data) == 0 ) {
                $return -> success = false;
                $return -> message = "Es wurde keine entsprechende Seite gefunden.";
            } else {
                $return -> role = $this -> getAccount( $id ); 
            }
            $return -> success = true;
            $return -> message = "Die Seite wurde erfolgreich geladen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
}
?>