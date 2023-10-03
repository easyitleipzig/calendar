<?php
class Newsletter{
    private $newsletterId;
    private $newsletterType;
    private $newsletterCycle;
    private $newsletterDate;
    private $newsletterFromRP;
    private $countLinks;
    private $mainHeading;
    public function __construct() {
        
    }
    public function readNewsletter( $pdo, $newsletterId ) {
        $return = new \stdClass();
        $return -> command = "readNewsletter";
        try {
            $stm = $pdo -> query("SELECT * FROM  `newsletter_main` WHERE newsletter_id=" . $newsletterId . ";");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            if( count( (array)$result ) == 1 ) {
                $this -> setNewsletterId( $newsletterId );
                $this -> setNewsletterDate( $result[0]["date"] );
                $this -> setNewsletterType( $result[0]["type"] );
                $this -> setNewsletterCycle( $result[0]["cycle"] );
                $this -> setCountLinks( $result[0]["count_links"] );
                $this -> setNewsletterFromRP( $result[0]["from_rp"] );
                $this -> setNewsletterMainHeading( str_replace('"', '\"', $result[0]["heading"] ) );
                $return -> data = $result;
                $return -> success = true;
                $return -> message = "Die Daten wurden erfolgreich gelesen.";
                return $return;
            } else {
                $return -> success = false;
                $return -> message = "Der Newsletter konnte nicht gelesen werden.";
                return $return;
            }               
        } catch ( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Daten ist folgender Fehler aufgetreten:" . $e->getMessage();
                return $return;   
        }
    }
    public function readNewsletterArray( $pdo, $fromNewsletterId, $toNewsletterId = null, $orderBy = " ORDER BY newsletter_id DESC" ) {
        $return = new \stdClass();
        $return -> command = "readNewsletterArray";
        try {
            if( is_null( $toNewsletterId ) ) {
                    $stm = $pdo -> query("SELECT * FROM  `newsletter_main` WHERE newsletter_id>=" . $fromNewsletterId . " " . $orderBy . ";");
            } else {
                   $stm = $pdo -> query("SELECT * FROM  `newsletter_main` WHERE newsletter_id>=" . $fromNewsletterId . " AND newsletter_id<=" . $toNewsletterId . " " . $orderBy . ";");  
            }            
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> success = true;
            $return -> count = count( $result );
            $return -> message = "Die Daten wurden erfolgreich gelesen.";
            $return -> data = $result;
            return $return;
        } catch(  Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Lesen der Daten ist folgender Fehler aufgetreten:" . $e->getMessage();
            return $return;
        }  
    }

    public function newNewsletter( $pdo, $date, $type, $cycle, $count_links, $from_rp, $heading ) {
        $return = new \stdClass();
        $query = 'INSERT INTO `newsletter_main` (`date`, `type`, `cycle`, `count_links`, `from_rp`, `heading`) 
            VALUES ("' . $date . '", ' . $type . ', ' . $cycle . ', ' . $count_links . ',"' . $from_rp . '", "' . $heading . '");';
        try {
            $result = $pdo -> query( $query );
            $stm = $pdo -> query("SELECT ROW_COUNT() AS 'rows';");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            if( $result[0]["rows"] == "1" ) {
                $stm = $pdo -> query("SELECT MAX(newsletter_id) AS `maxid` FROM  `newsletter_main`;");
                $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                $this -> setNewsletterId( $result[0]["maxid"] );
                $this -> setNewsletterDate( $date );
                $return -> newId = $this -> getNewsletterId();
                $return -> date = $this -> getNewsletterDate();
                $return -> success = true;
                $return -> message = "Der Newsletter wurde erfolgreich angelegt.";
                return $return;
            } else {
                $return -> success = false;
                $return -> message = "Beim Anlegen des Newsletters ist ein unbekannter Fehler aufgetreten.";
                return $return;
            }
        } catch ( Exception $e ) {
            $return -> success = false;
            $return -> message = "Beim Anlegen des Newsletters ist folgender Fehler aufgetreten: " . $e -> getMessage();
            return $return;
        }        
    }
    public function updateNewsletter( $pdo, $date, $type, $cycle , $count_links, $from_rp, $heading, $newsletterId ) {
        $return = new \stdClass();
        $query = "UPDATE `newsletter_main` SET date='" . $date . "', type=" . $type . ", cycle=" . $cycle . ", count_links = " . $count_links . ", from_rp ='" . $from_rp . "', heading='" . $heading . "' WHERE newsletter_id=" . $newsletterId . ";"; 
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Der Newsletter wurde erfolgreich gespeichert.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim speichern des Newsletters ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
    public function deleteNewsletter( $pdo, $newsletterId ) {
        $return = new \stdClass();
        $this -> setNewsletterId( $newsletterId );
        $query = "DELETE FROM `newsletter_main` WHERE newsletter_id=" . $newsletterId . ";"; 
        try {
            $pdo->query( $query );
            $stm = $pdo -> query("SELECT ROW_COUNT() AS 'rows';");
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            if( $result[0]["rows"] == "1" ) {
                $return -> success = true;    
                $return -> message = "Der Newsletter wurde erfolgreich gelöscht.";
            } else {
                $return -> success = false;    
                $return -> message = "Beim Löschen des Newsletters ist ein unbekannter Fehler aufgetreten.";
            }
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen des Newsletters ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
        
    }
    
    public function getClicksPerNewsletter( $pdo ) {
        $stm = $pdo -> query("SELECT *, count( from_ip ) as count_clicks FROM `newsletter_response`, `newsletter_main` WHERE to_newsletter = newsletter_main.newsletter_id GROUP BY to_newsletter;");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return = new \stdClass();
        $return -> data = $result;
        return $return;
    }

    public function getClicksPerLink( $pdo, $nlId ) {
        $stm = $pdo -> query("SELECT *, count( newsletter_response.index ) as count_clicks FROM `newsletter_response`, `newsletter_main` WHERE to_newsletter = newsletter_main.newsletter_id and to_newsletter = " . $nlId . " GROUP BY to_newsletter");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return = new \stdClass();
        $return -> data = $result;
        return $return;
    }
    public function getClicksPerIP( $pdo ) {
        $stm = $pdo -> query("SELECT *, count( from_ip ) as count_clicks FROM `newsletter_response`, `newsletter_main` WHERE to_newsletter = newsletter_main.newsletter_id GROUP BY from_ip;");
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return = new \stdClass();
        $return -> data = $result;
        return $return;
    }
    public function setSentNewsletter( $pdo, $nlId, $userId ) {
        /*
        
        UPDATE `newsletter_user` SET `newsletter_lastdate` = CURRENT_DATE(), `newsletter_lastid` = '1' WHERE `newsletter_user`.`id` = 3;
        
        */
        $return = new \stdClass();
        $return -> success = array();
        $return -> message = array();
        $query = "UPDATE `newsletter_user` SET `newsletter_lastdate` = CURRENT_DATE(), `newsletter_lastid` = " . $nlId . " WHERE `newsletter_user`.`id` = " . $userId . ";"; 
        try {
            $pdo->query( $query );      
            $return -> success[0] = true;    
            $return -> message[0] = "Der User wurde erfolgreich aktualisiiert.";
        } catch ( PDOException $e ) {
                $return -> success[0] = false;    
                $return -> message[0] = "Beim speichern des Users ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        $query = "INSERT INTO `newsletter_sent` ( `to_newsletter`, `newsletter_date`, `to_user`) VALUES (" . $nlId . ", CURRENT_DATE(), " . $userId . ");"; 
        try {
            $pdo->query( $query );      
            $return -> success[1] = true;    
            $return -> message[1] = "Der gesendte Newsletter wurde erfolgreich archiviert.";
        } catch ( PDOException $e ) {
                $return -> success = false;    
                $return -> message = "Beim der Archivierung des Newsletters ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;        
    }    
    public function getNewsletterId() {
        return $this->newsletterId;
    }
    public function setNewsletterId( $newsletterId ) {
        $this->newsletterId = $newsletterId;
    }
    public function getNewsletterType() {
        return $this->newsletterType;
    }
    public function setNewsletterType( $newsletterType ) {
        $this->newsletterType = $newsletterType;
    }
    public function getNewsletterDate() {
        return $this->newsletterDate;
    }
    public function setNewsletterDate( $newsletterDate ) {
        $this->newsletterDate = $newsletterDate;
    }
    public function getNewsletterFromRP() {
        return $this->newsletterFromRP;
    }
    public function setNewsletterFromRP( $newsletterFromRP ) {
        $this->newsletterFromRP = $newsletterFromRP;
    }
    public function getNewsletterMainHeading() {
        return $this->mainHeading;
    }
    public function setNewsletterMainHeading( $newsletterMainHeading ) {
        $this->mainHeading = $newsletterMainHeading;
    }
    public function getNewsletterCycle() {
        return $this->newsletterCycle;
    }
    public function setNewsletterCycle( $newsletterCycle ) {
        $this->newsletterCycle = $newsletterCycle;
    }
    public function getCountLinks() {
        return $this-> countLinks;
    }
    public function setCountLinks( $countLinks ) {
        $this-> countLinks = $countLinks;
    }
}
?>
