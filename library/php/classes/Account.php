<?php
class Account {
    private $accountId;
    private $userId;
    private $roleId;
    private $accountEmail;
    private $accountPassword;
    
    public function getAccountByEmailAndPassword( $pdo, $email, $password ) {
        $return = new \stdClass();
        try{
            $return -> count_result = false;
            $query = "SELECT `account`.*, `user`.`email` FROM  `account`, `user` WHERE email='" . $email . "' AND password ='" . $password . "' AND `user`.`id` = `account`.`user_id`;";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> count_result = count( (array)$result );
            if( count( (array)$result ) == 1 ) {
                $this -> setAccountId( $result[0]["id"] );
                $this -> setUserId( $result[0]["user_id"] );
                $this -> setRoleId( $result[0]["role_id"] );


                $return -> success = true;
                $return -> data = $result[0];
                $return -> message = "Der User wurde erfolgreich gelesen.";
                return $return;
            } else {
                if( count( (array)$result ) == 0 ) {
                    $return -> success = false;
                    $return -> message = "Es wurde kein entsprechender Datensatz gefunden.";
                    return $return;                
                    
                } else {
                    $return -> success = false;
                    $return -> message = "Beim Lesen des Users ist ein unerwarteter Fehler aufgetreten.";
                    return $return;                                    
                }
            }
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen des Users ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
                return $return;                            
        }        
    }
    public function getRolesByEmail( $pdo, $email ) {
        $return = new \stdClass();
        $query = "select role.role, account.id FROM role, account, user WHERE role.id = account.role_id AND account.activated = 1 AND user.id = account.user_id AND email = '$email'";
        try{
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> data = $result;
            $return -> success = true;
            $return -> message = "Die Rollen wurden erfolgreich gelesen.";                           
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Rollen ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";                           
        }        
        return $return;
    
    }
    public function getUserByEmail( $pdo, $email ) {
        $return = new \stdClass();
        $query = "select role.role, account.id FROM role, account, user WHERE role.id = account.role_id AND account.activated = 1 AND user.id = account.user_id AND account.role_id = 4 AND email = '$email'";
        try{
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> data = $result;
            $return -> success = true;
            $return -> message = "Die Rollen wurden erfolgreich gelesen.";                           
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Rollen ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";                           
        }        
        return $return;
    
    }
    public function getAccountByEmailAndRoleId( $pdo, $email, $role_id = 4 ) {
        $return = new \stdClass();
        try{
            $stm = $pdo -> query("SELECT * FROM  `account`, `user` WHERE `user`.`email`='$email' AND role_id=$role_id;");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> count_records = count( (array)$result );
            $this -> setAccountId( $result[0]["id"] );
            $return -> data = $result[0];
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen des Users ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";                           
        }        
        return $return;
    }
    public function newAccount( $pdo, $user_id, $password, $role_id = 4 ) {
        $return = new \stdClass();
        $return -> eCode = 0;
        $query = "INSERT INTO `account` (`user_id`, `password`, `role_id`, `created_on` ) VALUES ($user_id, '$password', $role_id, '" . date("Y-m-d") . "');";
        try {
            $result = $pdo -> query( $query );
            $newAccountId = $pdo -> lastInsertId();
            $this -> setAccountId( $newAccountId );
            $stm = $pdo -> query("SELECT role_id FROM `account` WHERE id=" . $this -> getAccountId() . ";");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $this -> setRoleId( $result[0]["role_id"] );
            $return -> success = true;
            $return -> newAccountId = $newAccountId;
            $return -> message = "Das Konto wurde erfolgreich angelegt.";
            return $return;
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> eCode = $e -> getCode();
            $return -> message = "Beim Anlegen des Kontos ist folgender Fehler aufgetreten: " . $e -> getMessage();
            return $return;
        }        
    }
    public function newFullAccount( $pdo, $user_id, $role_id, $password, $activated, $activated_on, $created_on ) {
        $return = new \stdClass();
        $return -> success = true;
        $query = "SELECT COUNT(id) AS count_id FROM  `account` WHERE user_id = $user_id AND role_id = $role_id;";
        $stm = $pdo -> query("SELECT COUNT(id) AS count_id FROM  `account` WHERE user_id = $user_id AND role_id = $role_id;");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        if( $result[0]["count_id"] > 0 ) {
            $return -> success = false;
            $return -> message = "Diese Rolle kann nicht verwendet werden, da sie bereits von einem anderen Konto benutzt wird.";
            return $return;                            
        }
        $query = "SELECT COUNT(id) AS count_id FROM  `account` WHERE user_id = $user_id AND password = '$password';";
        $stm = $pdo -> query("SELECT COUNT(id) AS count_id FROM  `account` WHERE user_id = $user_id AND password = '$password';");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        if( $result[0]["count_id"] > 0 ) {
            $return -> success = false;
            $return -> message = "Dieses Passwort kann nicht verwendet werden, da es bereits von einem anderen Konto benutzt wird.";
            return $return;                            
        }
        $query = "INSERT INTO `account` (`user_id`, `role_id`, `password`, `activated`, `activated_on`, `created_on` ) VALUES ($user_id, $role_id, '$password', $activated, '$activated_on', '$created_on');";
        try {
            $result = $pdo -> query( $query );
            $stm = $pdo -> query("SELECT ROW_COUNT() AS 'rows';");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            if( $result[0]["rows"] == "1" ) {
                $stm = $pdo -> query("SELECT MAX(id) AS `maxid` FROM `account`;");
                $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $this -> setAccountId( $result[0]["maxid"] );
                $stm = $pdo -> query("SELECT role_id FROM `account` WHERE id=" . $this -> getAccountId() . ";");
                $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $this -> setRoleId( $result[0]["role_id"] );
                $return -> newAccountId = $newAccountId;
                $return -> success = true;
                $return -> message = "Das Konto wurde erfolgreich angelegt.";
                return $return;
            } else {
                $return -> success = false;
                $return -> message = "Beim Anlegen des Kontos ist ein unbekannter Fehler aufgetreten.";
                return $return;
            }
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Anlegen des Kontos ist folgender Fehler aufgetreten: " . $e -> getMessage();
            return $return;
        }        
    }
    public function activateAccount( $pdo, $accountId ) {
        $return = new \stdClass();
        $query = "UPDATE `account` SET activated=true, activated_on='" . date("Y-m-d") . "' WHERE id=$accountId;"; 
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Der Account wurde erfolgreich aktiviert.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Aktualisieren des Accounts ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
        
    }
    public function updatePassword( $pdo, $accountId, $newPassword ){
        $return = new \stdClass();
        $query = "UPDATE `account` SET `password` = '" . $newPassword . "' WHERE `account`.`id` = $accountId";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Das Passwort wurde erfolgreich aktualsiert.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Setzen des neuen Passworts ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
    public function updateAccount( $pdo, $account_id, $user_id, $role_id, $password, $activated, $activated_on, $created_on ) {
        $return = new \stdClass();
        $return -> success = true;
        $query = "SELECT COUNT(id) AS count_id FROM  `account` WHERE user_id = $user_id AND role_id = $role_id AND id != $account_id;";
        $stm = $pdo -> query("SELECT COUNT(id) AS count_id FROM  `account` WHERE user_id = $user_id AND role_id = $role_id AND id != $account_id;");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        if( $result[0]["count_id"] > 0 ) {
            $return -> success = false;
            $return -> message = "Diese Rolle kann nicht verwendet werden, da sie bereits von einem anderen Konto benutzt wird";
            return $return;                            
        }
        $stm = $pdo -> query("SELECT COUNT(id) AS count_id FROM  `account` WHERE user_id = $user_id AND password = 'password' AND id != $account_id;");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        if( $result[0]["count_id"] > 0 ) {
            $return -> success = false;
            $return -> message = "Dieses Passwort kann nicht verwendet werden, da es bereits von einem anderen Konto benutzt wird";
            return $return;                            
        }
        try{
            $query = "UPDATE `account` SET `role_id` = $role_id, `password` = '$password', `activated` = $activated, `activated_on` = '$activated_on', `created_on` = '$created_on'  WHERE `account`.`id` = $account_id";
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Das Konto wurde erfolgreich aktualsiert.";
            return $return;
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Aktualisieren des Kontos ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
                return $return;                            
        }        
            
    }
    public function getAccountsByUserId( $pdo, $userId, $orderBy = "id", $sortOrder = "ASC", $limit = "" ) {
        $return = new \stdClass();
        try{
            $return -> success = true;
            $query = "SELECT `account`.* FROM  `account`, `user` WHERE user_id = '$userId'  AND `account`.`user_id` = `user`.`id` ORDER BY $orderBy $sortOrder $limit;";
            $stm = $pdo -> query("SELECT `account`.* FROM  `account`, `user` WHERE user_id = '$userId'  AND `account`.`user_id` = `user`.`id` ORDER BY $orderBy $sortOrder $limit;");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> count_records = count( (array)$result );
            $return -> data = $result;
            $stm = $pdo -> query("SELECT `role`.* FROM `role` ORDER BY role");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> role = $result;
            $return -> message = "Die Konten wurden erfolgreich gelesen.";
            return $return;
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Konten ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
                return $return;                            
        }        
            
    }
    public function deleteAccount( $pdo, $accountId ) {
        $return = new \stdClass();       
        $query = "DELETE FROM `account` WHERE id = $accountId;"; 
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Der Account wurde erfolgreich gelöscht.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen des Accounts ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
        
    }
    public function deleteAccountsByUserId( $pdo, $userId ) {
        $return = new \stdClass();
        $return = new \stdClass();       
        $query = "DELETE FROM `account` WHERE user_id = $userId;"; 
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Die Konten wurde erfolgreich gelöscht.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen der Konten ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
        
    }
    public function checkForExistingPassword( $pdo, $user_id, $password ) {
        $return = new \stdClass();
        try{
            $return -> success = true;
            $stm = $pdo -> query("SELECT count(id) as count_id FROM  `account` WHERE password='$password' AND user_id=$user_id;");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> count_records = $result[0]["count_id"];
            //$return -> count_records = count( (array)$result );
            if( $return -> count_records > 0 ) {
                $return -> message = "Dieses Passwort kann nicht benutzt werden, da es bereits mit einem anderen Konto verknüpft ist.";    
            } else {
                $return -> message = "Dieses Passwort kann verwendet werden.";    
            }
            return $return;
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen des Users ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
                return $return;                            
        }        
    }
    public function getAccount( $pdo, $id, $userId ) {
        $return = new \stdClass();
        try{
            $return -> success = true;
            $q = "SELECT account.*, role, concat( lastname, ', ', firstname ) as fullname, email FROM  `account`, role, user WHERE account.role_id = role.id and user_id = account.user_id and account.id=$id and user.id = $userId;";
            $stm = $pdo -> query( $q );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> data = $result;
            //$return -> count_records = count( (array)$result );
            $return -> success = true;
            $return -> message = "Das Konto wurde erfolgreich gelesen.";
        } catch( Exception $e ) {
            $return -> data = [];
            $return -> success = false;
            $return -> message = "Beim Lesen des Users ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;
    }
    public function getAccountId() {
        return $this->accountId;
    }
    public function setAccountId( $accountId ) {
        $this->accountId = $accountId;
    }
    public function getUserId() {
        return $this->userId;
    }
    public function setUserId( $userId ) {
        $this->accountId = $userId;
    }
    public function getRoleId() {
        return $this->roleId;
    }
    public function setRoleId( $roleId ) {
        $this->roleId = $roleId;
    }
   
}
?>
