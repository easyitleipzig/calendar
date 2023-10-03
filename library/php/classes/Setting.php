<?php
class Setting {
    private $settings;
    private  $path;
    private $fileName;
    private $fileContent;
    public function standardFunktion(  ) {
        $return = new \stdClass();
        try{
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }

    public function __construct( $path, $fileName ) {
        $this -> fileName = $fileName;
        $this -> settings = $settings = parse_ini_file( $path . $this -> fileName, TRUE);
        $fh = fopen( $path . $this -> fileName, "r" );
        while (!feof($fh)) {
            $this -> fileContent[] = preg_replace('#\r|\n#', '', fgets( $fh ) );
        }
        fclose( $fh );
    }
    public function getSections() {
        $i = 0;
        foreach($this -> settings as $key=>$value) {
          $tmp[$i] = $key;
          $i ++;
        }
        return $tmp;
    }
    public function getSectionValues( $section ) {
        $i = 0;
        foreach($this -> settings[ $section ] as $key=>$value) {
            $v = new \stdClass();
            $v -> key = $key;
            $v -> value = $value;
            if( substr( $v -> key, 0, 4 ) != "desc" ) { 
                if( !isset( $this -> settings[$section][ "description_" . $v -> key ] ) ) {
                    $v -> description = "";
                } else {
                    $v -> description = $this -> settings[$section][ "description_" . $v -> key ];                           
                }
                $tmp[$i] =  $v;
                $i ++;
            }
        }
        return $tmp;
    }
    public function getSection( $section ) {
        return $this -> settings[ $section ];
    }
    public function setSection( $section, $values ) {
        
    }
    public function getSectionDescription( $section ) {
        if( !isset( $this -> settings[ $section ][ "description_" . $section ] ) ) {
            return "";
        } else {
            return $this -> settings[ $section ][ "description_" . $section ];            
        }
    } 
    public function getSectionValue( $section, $value ) {
        return $this -> settings[ $section ][ "description_" . $section ][$value];
    }
    public function getRealValue( $sName, $vName ) {
        $sName = "[" . $sName . "]";
        $l = count( $this -> fileContent );
        $i = 0;
        while ( $i < $l ){
                if( $this -> fileContent[ $i ] == $sName ) {
                $m = 10000;
                $j = $i + 1;
                while ( $j < $m ){
                    $tmp = explode( "=", $this -> fileContent[ $j ] );
                    if( $tmp[0] == $vName ) return $tmp[1];
                    $j += 1;
                }
            }
            $i += 1;
        }
        
    } 
    public function getHTMLSection( $section ) {
        $html = "<div class='section'><div class='section_name'><h3 contenteditable>" . $section . "</h3><div class='section_controlls'><input type='button' id='copy_" . $section . "' data-section='" . $section . "' class='cbCopy iconButtMiddle iconCircleMiddle'><input type='button' id='add_" . $section . "' data-section='" . $section . "' class='cbAdd iconButtMiddle iconCircleMiddle'><input type='button' id='delete_" . $section . "' data-section='" . $section . "' class='cbDelete iconButtMiddle iconCircleMiddle'></div></div>";
        $html .= "<p contenteditable id=\"description_section_" . $section . "\" class='description_section'>" . $this -> getSectionDescription( $section ) . "</p>";
        return $html;
    }
    public function getHTMLValue($section, $v ) {
        $html = "<section data-section='" . $section . "' data-value='" . $v -> key . "'><div><h4 contenteditable id='" . $section . "_name_key_" . $v -> key . "'>" . $v -> key . "</h4></div><div contenteditable id=\"description_value_" . $section . "_" . $v -> key . "\" class='description_value'>" . $v -> description . "</div>";
        /*
        $test_singleQuota = strpos( $v -> value, "'" );
        $test_doubleQuota = strpos( $v -> value, '"' );
        if( $test_singleQuota > 0 ) {
            $v -> value = '"' . $v -> value . '"';   
        }
        if( $test_doubleQuota > 0 ) {
            $v -> value = "'" . $v -> value . "'";   
        }
        */
        $html .= "<div><textarea id='" . $section . "_" . $v -> key . "'>" . $this -> getRealValue( $section, $v -> key ) . "</textarea><input type='button' value='&nbsp' id='delete_" . $section . "_" . $v -> key . "' class='cbDelete iconButtSmall iconCircleSmall' data-section='" . $section . "' data-value='" . $v -> key . "'></div></section>";
        $html .= "<div><textarea disabled style='background-color: white; color: red; resize: none; height: 22px; width: 95%'>" . $v -> value . "</textarea></div>";
        return $html;
    } 
}  
?>
