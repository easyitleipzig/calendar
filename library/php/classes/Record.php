<?php
class Record {
    public $fields;
    public $values;
    
    private $pdo;
    private $primaryKey;
    public function standardFunktion(  ) {
        $return = new \stdClass();
        try{
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function __construct( $pdo, $primaryKey ) { 
        $this -> pdo = $pdo;
        $this -> primaryKey = $primaryKey;
    }
    public function saveRecord( $primaryKey, $recordId, $values ) {
        $return = new \stdClass();
        $dObj = 
        try{
            if( $recordId == "new" ) {
                $this -> pdo -> query( $query );
            } else {
                
            }
            $this -> pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Der Datensatz wurde erfolgreich gespeichert.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function deleteRecord( $table, $recordId ) {    
        $return = new \stdClass();
            $query = "DELETE FROM $table WHERE " . $this -> primaryKey . " = $recordId";
            $this -> pdo -> query( $query )
            $return -> success = true;
            $return -> message = "Der Datensatz wurde erfolgreich gelöscht.";
        try{
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
}  
?>
