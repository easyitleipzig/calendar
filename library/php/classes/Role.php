<?php
class Role {
    private $roleId;
    private $roleName;
    private $roleDescription;
    
    public function getRoleById( $pdo, $roleId ) {
    }
    public function getRoles( $pdo, $orderBy = "id") {
        $return = new \stdClass();
        try{
            $stm = $pdo -> query("SELECT * FROM  `role` ORDER BY " . $orderBy );
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> success = true;
            $return -> message = "Die Rollen wurden erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Rollen ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                                    
    }
    public function newRole( $pdo, $name ) {
        $return = new \stdClass();
        $query = "INSERT INTO `role` (`role`) VALUES ('$name');";
        try {
            $result = $pdo -> query( $query );
            $stm = $pdo -> query("SELECT ROW_COUNT() AS 'rows';");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            if( $result[0]["rows"] == "1" ) {
                $stm = $pdo -> query("SELECT MAX(id) AS `maxid` FROM `role`;");
                $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $return -> roleId = $result[0]["maxid"];
                $return -> success = true;
                $return -> message = "Die Rolle wurde erfolgreich angelegt.";
                return $return;
            } else {
                $return -> success = false;
                $return -> message = "Beim Anlegen der Rolle ist ein unbekannter Fehler aufgetreten.";
                return $return;
            }
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> errorNumber = $e -> getCode();
            $return -> message = "Beim Anlegen der Rolle ist folgender Fehler aufgetreten: " . $e -> getMessage();
            return $return;
        }        
    }
    public function updateRole( $pdo, $id, $role) {
        $return = new \stdClass();
        $query = "UPDATE `role` SET role='$role' WHERE id=$id;"; 
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Die Rolle wurde erfolgreich gespeichert.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Speichern der Rolle ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
        
    
    }
    public function deleteRole( $pdo, $id ) {
        $return = new \stdClass();
        $query = "DELETE FROM `role` WHERE id=$id;"; 
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Die Rolle wurde erfolgreich gelöscht.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen der Rolle ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
}
?>
