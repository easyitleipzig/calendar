<?php
class Ads {
    public function getCountAds( $pdo ) {
        $stm = $pdo -> query("SELECT count( id ) AS count_id FROM advertisement");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return =  $result[0]["count_id"];
        return $return;
    }
    public function getCountAdAnswers( $pdo, $ad_id ) {
        $stm = $pdo -> query("SELECT count( id ) AS count_id FROM advertisement_answer WHERE ad_id = " . $ad_id );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return =  $result[0]["count_id"];
        return $return;
    }
    public function getAds( $pdo, $where = "", $orderBy = " ORDER BY advertisement.id DESC", $limit = "" ) {
        $return = new \stdClass();
        if( $where == "" ) {
            $where = " WHERE `advertisement`.`from_user` =  `user`.`id` ";
        } else {
            $where .= " AND `advertisement`.`from_user` =  `user`.`id` ";
        }
        try{
            $return -> success = true;
            $query = "SELECT `advertisement`.`id`, `advertisement`.`title`, `advertisement`.`content`, `advertisement`.`from_user`, `advertisement`.`from_date`, `advertisement`.`from_date`, `advertisement`.`active`, CONCAT( `user`.`firstname`, ' ', `user`.`lastname` ) AS user_name FROM `advertisement`, `user` $where $orderBy $limit";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            // to_date > CURDATE() -> delete from $result
            
            //
            $return -> count_records = count( $result );
            $return -> data = $result;
            for( $i = 0; $i < count( $result ); $i++ ) {
                $return -> data[$i]["count_answers"] = $this -> getCountAdAnswers( $pdo, $return -> data[$i]["id"] );
            }
            return $return;
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Anzeigen ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
                return $return;                            
        }        
            
    }
    public function getAdAnswers( $pdo, $where = "", $orderBy = " ORDER BY advertisement_answer.id DESC", $limit = "" ) {
        $return = new \stdClass();
        if( $where == "" ) {
            $where = " WHERE `advertisement_answer`.`user_id` =  `user`.`id` ";
        } else {
            $where .= " AND `advertisement_answer`.`user_id` =  `user`.`id` ";
        }
        try{
            $return -> success = true;
            $query = "SELECT `advertisement_answer`.`id`, `advertisement_answer`.`ad_id`, `advertisement_answer`.`user_id`,`advertisement_answer`.`from_date`, `advertisement_answer`.`content`, CONCAT( `user`.`firstname`, ' ', `user`.`lastname` ) AS user_name FROM `advertisement_answer`, `user` $where $orderBy $limit";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> count_records = count( $result );
            $return -> data = $result;
            return $return;
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Antworten ist folgender Fehler aufgetreten:" . $e -> getMessage() . ".";
                return $return;                            
        }        
            
    }
    public function getAdBackAnswers( $pdo, $answerId ) {
        $query = "SELECT advertisement_backanswer.* FROM advertisement_backanswer WHERE to_answer = $answerId";
    }
}  
?>
