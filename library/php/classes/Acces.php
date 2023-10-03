<?php
class Access {
    public $pdo;
    private $succes;
    private $message;
    public function __construct( $pdo ) {
        $this -> pdo = $pdo;
        $this -> succes = false;
        $this -> message = "";
    }
    public function standard(  ) {
        try {
            return false;     
        } catch( Exception $e ) {
            return false;
        }
    }

    
}
?>
