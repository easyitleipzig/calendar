<?php         
class DataForm {
    public $fields = "";
    public $orderfields = [];
    public $data = [];
    public $records;
    private $pdo;
    private $indexField;
    private $pageSource;
    public $countPerPage;
    private $currentPage;
    private $tableDefs;
    private $primaryKeyTable;
    private $isNew;
    private $additionalButtons;
    private $additionalButtonsNewRecord;
    public function standardFunktion(  ) {
        $return = new \stdClass();
        try{
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function __construct( $pdo, $pageSource , $prefetchData = false, $fields = "*", $isNew = "1", $searchStr = "", $orderStr = "", $currentPage = 0, $countPerPage = "10", $additionalButtons = [], $additionalButtonsNewRecord = []) {
        $this -> pdo = $pdo;
        $this -> fields = $fields;
        $tmpTableNames = $this -> getTableNames( $pageSource );
        $this -> records = new \stdClass();
        $l = count( $tmpTableNames );
        $i = 0;
        while ( $i< $l ) {
            $this -> tableDefs[ $tmpTableNames[ $i ] ] = $this -> getTableDef( $tmpTableNames[$i] );
            $i += 1;
        }
        $searchStr = str_replace("\\", '', $searchStr );
        if( $searchStr == "undefined" ) $searchStr = "";
        $this -> pageSource = $this -> getStandardSQL( $pageSource, $this -> fields, $searchStr, $orderStr, $currentPage, $countPerPage );
        $this -> countPerPage = $countPerPage;
        if( $prefetchData ) {
            $this -> records = $this -> getRecords( $this -> pageSource );
        }
        $this -> isNew = $isNew;
        $this -> indexField = $this -> getPrimaryIndex();
        $this -> additionalButtons = $additionalButtons;
        $this -> additionalButtonsNewRecord = $additionalButtonsNewRecord;
    }
    public function setCountPerPage( $countPerPage ) {
            $this -> countPerPage = $countPerPage;
    }
    public function setPageSource( $pageSource ) {
            $this -> pageSource = $pageSource;
    }
    public function getFieldDef( $table, $field ) {
        $return = new \stdClass();
        try{
            $tmp = $this -> tableDefs[ $table ] -> data;
            $l = count( $tmp );
            $i = 0;
            while ( $i< $l ) {
                if( $tmp[$i]["Field"] == $field ) {
                    return $tmp[$i];
                }
                $i += 1;
            }

        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function getFieldTypeAndLength( $table, $field ) {
        $return = new \stdClass();
        try{
            $return -> type = $this -> getFieldDefValue( $table, $field, "Type" );    
            $return -> length = $this -> getFieldDefValue( $table, $field, "length" );    
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }

    public function getFieldDefValue( $table, $field, $value ) {
        $return = new \stdClass();
        if( $table == null ) return "";
        try{
            $l = count( $this -> tableDefs[ $table ] -> data );
            $i = 0;
            while ( $i< $l ) {
                if( $this -> tableDefs[$table] -> data[$i]["Field"] == $field ) {
                    return $this -> tableDefs[$table] -> data[$i][$value];
                }
                $i += 1;
            }
            return "";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    private function getTableDef( $tableName ) {
        $return = new \stdClass();
        try{
            $query = "SHOW FULL COLUMNS FROM $tableName";
            $stm = $this -> pdo -> query( $query );
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $l = count( $return -> data ); 
            $i = 0;
            while( $i < $l ) {
                $tmp = explode("(", $return -> data[$i]["Type"] );
                if( count( $tmp ) == 2 ) {
                    $return -> data[$i]["Type"] = $tmp[0];
                    $tmpC = explode(")", $tmp[1] ); 
                    $return -> data[$i]["length"] = $tmpC[0]; 
                } else {
                    $return -> data[$i]["length"] = null;
                }
                $i += 1;
            }
            $return -> message = "Daten erfolgreich gelesen.";

        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }

    public function getTableNames( $pageSource ) {
        $tmp = explode( "WHERE", $pageSource );
        $tmp = explode( "FROM", $tmp[0] );
        $tables = explode( ",", $tmp[1] );
        $l = count( $tables );
        $i = 0;
        while ( $i < $l ) {
            if( $i == 0 ) $this -> primaryKeyTable = trim( $tables[ $i ] );
            $tables[ $i ] = trim( $tables[ $i ] );
            $i += 1;
        }
        return $tables;                            
    }
    public function getStandardSQL( $pageSource, $fields, $searchStr, $orderStr, $cPage = "", $cPerPage = "" ) {
        $tmpFields = explode( ",", $fields);
        $tmpSql =  explode( "FROM", $pageSource );           
        $query = "SELECT " . $fields . " FROM " . $tmpSql[1];
        $tmpSql = explode( "WHERE", $pageSource );
        if( count( $tmpSql ) == 2 ) {
            if( $searchStr != "" ) {
                $query = $query . " AND " .  $searchStr;
            }
        } else {
            if( $searchStr != "" ) {
                $query = $query . " WHERE " .  $searchStr;
            }        
        }
        if( $orderStr !=  "" ) {
            $query = $query . " ORDER BY " .  $orderStr;
        }
        if( $cPerPage == 0 ) {
            return $query;
        } else {
            return $query . " LIMIT " . ( $cPage  * $cPerPage ) . ", " . $cPerPage;            
        }
    }
    public function addSearchField( $dataField, $type, $selectEntries = "" ) {
        $f = new \stdClass();
        $f -> dataField = $dataField;
        $f -> type =  $type;
        if( $selectEntries !="" ) {
            $f -> selectEntries = $selectEntries;
        }
        $this -> fields[] = $f; 
    }
    public function addOrderField( $dataField, $index, $selectEntries = "" ) {
        $f = new \stdClass();
        $f -> dataField = $dataField;
        $f -> index =  $index;
        if( $selectEntries !="" ) {
            $f -> selectEntries = $selectEntries;
        }
        $this -> orderfields[] = $f; 
    }
    public function getRecords( $query ) {
        $return = new \stdClass();
        $return -> success = true;
        try{
            $stm = $this -> pdo -> query( $query );
            $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> message = "Daten erfolgreich gelesen.";
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function saveRecord( $values ) {
        $return = new \stdClass();
        try{
            $fields = "";
            foreach( $values as $key => $value ) {
                if( $key != "id" && $key != "command" && $key != "pageSource"  ) {
                    if( $value == "on" ) $value = 1;
                    if( $value == "off" ) $value = 0;
                    $a = strpos( $key, "additional_button_", 0 );
                    if( strpos( $key, "additional_button_", 0 ) != 1 ) {
                        $fields .= $key . " = '" . $value . "',";
                    } else {
                        
                    }
                }
            }
            $fields = substr( $fields, 0, strlen( $fields ) - 1 );
            $table = explode( "FROM ", $values["pageSource" ] );
            $table = $table[1];
            $query = "UPDATE $table SET $fields WHERE id = " . $values["id"]; 
            $return -> query = $query;
            $return -> success = true;
            $return -> message = "Der Datensatz wurde erfolgreich gespeichert.";
            return $return;
        } catch( Exception $e ) {
            if( $e -> getCode() == 23000 ) {
                $return -> success = false;
                $return -> message = "Dieser Datensatz besteht bereits!";                
            } else {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";                
            }
        }        
        return $return;                            
    }
    public function newRecord( $values ) {
        $return = new \stdClass();
        try{
            $fields = "";
            $val = "";
            foreach( $values as $key => $value ) {
                if( $key != "id" && $key != "command" && $key != "pageSource"  ) {
                    if( $value == "on" ) $value = 1;
                    if( $value == "off" ) $value = 0;
                    if( strpos( $key, "additional_button_", 0 ) != 1 ) {
                        $fields .= $key . ", ";
                        $val .= "'" . $value . "', ";
                    } else {
                        
                    }
                }
            }
            $fields = substr( $fields, 0, strlen( $fields ) - 2 ) . " ";
            $val = substr( $val, 0, strlen( $val ) - 2 ) . " ";
            $table = explode( "FROM ", $values["pageSource" ] );
            $table = $table[1];
            $query = "insert into $table (" . $fields . ") values( " . $val . ")"; 
            $return -> query = $query;
            $return -> success = true;
            $return -> message = "Der Datensatz wurde erfolgreich gespeichert.";
            return $return;
        } catch( Exception $e ) {
            if( $e -> getCode() == 23000 ) {
                $return -> success = false;
                $return -> message = "Dieser Datensatz besteht bereits!";                
            } else {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";                
            }
        }        
        return $return;                            
    }
    public function deleteRecord( $pdo, $values ) {
        $return = new \stdClass();
        $return -> oldData = null;
        try{
            $table = explode( "FROM ", $values["pageSource" ] );
            $table = $table[1];
            $tmpQuery = "SELECT * FROM $table where id = " . $values["id"];
            $stm = $pdo -> query( $tmpQuery );
            $return -> oldData = $stm -> fetchAll( PDO::FETCH_ASSOC );
            $query = "delete from $table where id = " . $values["id"];
            $pdo -> query( $query );
            $return -> success = true;
            $return -> message = "Der Datensatz wurde erfolgreich gelöscht.";             
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }    
    public function getHtmlForm( $pageSource, $searchField, $lineFields, $fieldDefs, $fieldLabels, $praefixFields = "", $widthDiv = true ) {
        $html = "";
        if( $lineFields == "" ||$lineFields == "*"  ) {
            $tmp = explode( "FROM", $pageSource );
            $tmp = trim( $tmp[1] );
            $lineFields = $this -> getTableDef( $tmp );
            $l = count( $lineFields -> data );
            $i = 0;
            $tmpLineFields = "";
            while ( $i < $l ){
                $tmpLineFields .= $lineFields -> data[$i]["Field"] . ",";
                $i += 1;
            }
            $lineFields = substr( $tmpLineFields, 0, strlen( $tmpLineFields ) - 1 );  
        } 
        if( $fieldLabels == "" ) {
            $fieldLabels = $lineFields;
        }
        if( $fieldDefs == "" ) {
            $tmp = explode( ",", $lineFields );
            $l = count( $tmp );
            $i = 0;
            $tmpLineFields = "";
            while ( $i < $l ){
                $tmpLineFields .= "text,";
                $i += 1;
            }
            $fieldDefs = substr( $tmpLineFields, 0, strlen( $tmpLineFields ) - 1 );  
        }
        $tmpFields = explode( ",", $lineFields );
        $tmpLabels = explode( ",", $fieldLabels );
        $tmpDefs = explode( ";", $fieldDefs );
        $tmp = explode( "FROM", $pageSource );
        $SQL = "SELECT $lineFields FROM" . $tmp[1] . " WHERE " . $searchField;
        $table = trim( $tmp[1] );
        $data = $this -> getRecords( $SQL );
        $l = count( $tmpFields );
        $i = 0;
        while ( $i < $l ){
            if( $widthDiv ) $html .= "<div id='" . $praefixFields . "_div_" . $tmpFields[$i] . "'>";
            if( !isset( $tmpDefs[ $i ] ) ) $tmpDefs[ $i ] = "text";
            if( $tmpDefs[ $i ] == "checkbox" ) {
                $html .= "<label for='" . $praefixFields . "_" . $tmpFields[$i] . "'>" . $tmpLabels[$i] . "</label>";
            } else {
                $html .= "<label>" . $tmpLabels[$i] . "</label>";
            }
            if( substr( $tmpDefs[$i], 0, 6 ) == "select" || substr( $tmpDefs[$i], 0, 7 ) == "<option" ) {
                $html .= $this -> getHTMLSelectField( $praefixFields . "_" . $tmpFields[$i], $data -> data[0][ $tmpFields[$i] ], "recSelect", $tmpDefs[$i] );
            } else {
                switch( $tmpDefs[$i] ) {
                    case "button":
                        $html .= $this -> getHTMLTextField( $praefixFields . $tmpFields[$i], "&nbsp;", "recButton", "button", "" );
                    break;
                    case "text":
                        $html .= $this -> getHTMLTextField( $praefixFields . "_" . $tmpFields[$i], $data -> data[0][ $tmpFields[$i] ], "recText", "text", $this -> getFieldDefValue( $table, $tmpFields[$i], "length" ), $this -> getFieldDefValue( $table, $tmpFields[$i], "Comment" ) );
                    break;
                    case "number":
                        $html .= $this -> getHTMLTextField( $praefixFields . "_" . $tmpFields[$i], $data -> data[0][ $tmpFields[$i] ], "recNumber", "number", $this -> getFieldDefValue( $table, $tmpFields[$i], "length" ), $this -> getFieldDefValue( $table, $tmpFields[$i], "Comment" ) );
                    break;
                    case "date":
                        $html .= $this -> getHTMLTextField( $praefixFields . "_" . $tmpFields[$i], $data -> data[0][ $tmpFields[$i] ], "recDate", "date", $this -> getFieldDefValue( $table, $tmpFields[$i], "length" ), $this -> getFieldDefValue( $table, $tmpFields[$i], "Comment" ) );
                    break;
                    case "datetime":
                        $html .= $this -> getHTMLTextField( $praefixFields . "_" . $tmpFields[$i], $data -> data[0][ $tmpFields[$i] ], "recDate", "datetime-local", $this -> getFieldDefValue( $table, $tmpFields[$i], "length" ), $this -> getFieldDefValue( $table, $tmpFields[$i], "Comment" ) );
                    break;
                        case "time":
                        $html .= $this -> getHTMLTextField( $praefixFields . "_" . $tmpFields[$i], $data -> data[0][ $tmpFields[$i] ], "recTime", "time", $this -> getFieldDefValue( $table, $tmpFields[$i], "length" ), $this -> getFieldDefValue( $table, $tmpFields[$i], "Comment" ) );
                        break;
                    case "checkbox":
                        $html .= $this -> getHTMLCheckboxField( $praefixFields . "_" . $tmpFields[$i], $data -> data[0][ $tmpFields[$i] ], "recCheckbox", $this -> getFieldDefValue( $table, $tmpFields[$i], "Comment" ) );
                    break;
                    case "textarea":
                        $html .= $this -> getHTMLTextareaField( $praefixFields . "_" . $tmpFields[$i], $data -> data[0][ $tmpFields[$i] ], "recTextarea", "",  $this -> getFieldDefValue( $table, $tmpFields[$i], "Comment" ) );
                    break;
                }
            }
            if( $widthDiv ) $html .= "</div>";
            $i += 1;
        }
        return $html;
    }
    public function getDescribeTableHtml( $table ) {
        $l = count( $this -> tableDefs[$table] -> data );
        $i = 0;
        $html = '    <div>
        <input type="text" disabled="" value="Field">
        <input type="text" disabled="" value="Type">
        <input type="text" disabled="" value="Length">
        <input type="text" disabled="" value="Null">
        <input type="text" disabled="" value="Index">
        <input type="text" disabled="" value="Default">
        <input type="text" disabled="" value="Autoincrement">
        <input type="text" disabled="" value="Collation">
        <input type="text" disabled="" value="Privileges">
        <input type="text" disabled="" value="Comment">        
    </div>
';
        while ( $i < $l ){
            /*
            
            Collation: undefined = NULL
  Null: string = "NO"
  Key: string = "PRI"
  Default: undefined = NULL
  Extra: string = "auto_increment"
  Privileges: string = "select,insert,update,references"
  Comment: string = "Id des Users"
  length: string = "11"
*/
            $a = $this -> tableDefs[$table] -> data[$i]["Field"];
            $html .= "<div>";
            $html .= $this -> getHTMLTextField( "dataDef_" . $this -> tableDefs[$table] -> data[$i]["Field"] . "_$i", $this -> tableDefs[$table] -> data[$i]["Field"], "dDef", "text", 50 );
            $html .= $this -> getHTMLTextField( "dataType_" . $this -> tableDefs[$table] -> data[$i]["Field"] . "_$i", $this -> tableDefs[$table] -> data[$i]["Type"], "dType", "text", 50 );
            $html .= $this -> getHTMLTextField( "dataLength_" . $this -> tableDefs[$table] -> data[$i]["Field"] . "_$i", $this -> tableDefs[$table] -> data[$i]["length"], "dLength", "text", 50 );
            $html .= $this -> getHTMLTextField( "dataNull_" . $this -> tableDefs[$table] -> data[$i]["Field"] . "_$i", $this -> tableDefs[$table] -> data[$i]["Null"], "dNull", "text", 50 );
            $html .= $this -> getHTMLTextField( "dataKey_" . $this -> tableDefs[$table] -> data[$i]["Field"] . "_$i", $this -> tableDefs[$table] -> data[$i]["Key"], "dNull", "text", 50 );
            $html .= $this -> getHTMLTextField( "dataDefault_" . $this -> tableDefs[$table] -> data[$i]["Field"] . "_$i", $this -> tableDefs[$table] -> data[$i]["Default"], "dDefault", "text", 512 );
            $html .= $this -> getHTMLTextField( "dataExtra_" . $this -> tableDefs[$table] -> data[$i]["Field"] . "_$i", $this -> tableDefs[$table] -> data[$i]["Extra"], "dExtra", "text", 50 );
            $html .= $this -> getHTMLTextField( "dataCollation_" . $this -> tableDefs[$table] -> data[$i]["Field"] . "_$i", $this -> tableDefs[$table] -> data[$i]["Collation"], "dCollation", "text", 50 );
            $html .= $this -> getHTMLTextField( "dataPrivileges_" . $this -> tableDefs[$table] -> data[$i]["Field"] . "_$i", $this -> tableDefs[$table] -> data[$i]["Privileges"], "dPrivileges", "text", 50 );
            $html .= $this -> getHTMLTextField( "dataComment_" . $this -> tableDefs[$table] -> data[$i]["Field"] . "_$i", $this -> tableDefs[$table] -> data[$i]["Comment"], "dComment", "text", 512 );
            $html .= "</div>\n";
            $i += 1;
        }
        return $html;
    }
    public function getHtmlJSON( $lineFields="", $fieldDefs="", $withSave = true, $widthDel = true, $widthNewDel = false, $praefixFields = "", $additionalButtons = [], $widthDiv = true, $allRecords = true, $labels = "", $widthCopy = false ) {
        $tmpSource = explode( " LIMIT", $this -> pageSource );
        $data = new \stdClass();
        if( $allRecords ) {
            $data = $this -> getRecords( $tmpSource[0] );
        } else {
            $data = $this -> getRecords( $this -> pageSource );
        }
        $this -> records -> data = $data -> data;
        $l = count( $this -> records -> data );
        $i = 0;
        $tmpHTML = "";
        if( $labels != "" ) {
            $tmpLabels = explode( ",", $labels );
            $m = count( $tmpLabels );
            $j = 0;
            $tmpHTML .= "<div class='dLHeadLine'>";
            while ( $j < $m ){
                $tmpLabelsIn = explode( "|", $tmpLabels[ $j ] );
                if( count( $tmpLabelsIn ) == 1 ) {
                    $tmpHTML .= "<div>" . $tmpLabelsIn[0] . "</div>";
                } else {
                    $tmpHTML .= "<div id='" . $tmpLabelsIn[0] . "'>" . $tmpLabelsIn[1] . "</div>";    
                }
                $j += 1;
            }            
            $tmpHTML .= "</div>";    
        }
        if( $lineFields == "" ) {
            $table = trim( explode( "FROM ", $tmpSource[0] )[1] );
            $b = $this -> tableDefs[ $table ];
            for( $k = 0; $k< count( $b -> data ); $k++ ) {
                $lineFields .= $table . "." . $b -> data[$k]["Field"] . ",";
            }
            $lineFields = substr( $lineFields, 0, strlen( $lineFields ) - 1 );
        }
        if( $fieldDefs == "" ) {
            for( $k = 0; $k< count( $b -> data ); $k++ ) {
                $fieldDefs .= "text;";
            }
            $fieldDefs = substr( $fieldDefs, 0, strlen( $fieldDefs ) - 1 );
        }
        while ( $i < $l ) {
            // code...
            $tmpHTML .= $this -> getHtmlLineJSON( $i, $lineFields, $fieldDefs, $withSave, $widthDel, $praefixFields, $additionalButtons, $widthDiv );
            $i += 1;
        }
        if( $this -> isNew ) {
            $tmpHTML .= $this -> getHtmlNewLineJSON( $lineFields, $fieldDefs, $withSave, $widthNewDel, $praefixFields, $additionalButtons, $widthDiv );
        }
        return $tmpHTML;
    }
    public function getHtml( $lineFields, $fieldDefs, $withSave = true, $widthDel = true, $widthNewDel = false, $praefixFields = "", $additionalButtons = [], $widthDiv = true, $widthCopy = false, $additionalButtonsNewRecord = [] ) {
        $l = count( $this -> records -> data );
        $i = 0;
        while ( $i < $l ) {
            // code...
            $this -> getHtmlLine( $i, $lineFields, $fieldDefs, $withSave, $widthDel, $praefixFields, $additionalButtons, $widthDiv );
            $i += 1;
        }
        if( $i < $this -> countPerPage && $this -> isNew ) {
            $this -> getHtmlNewLine( $lineFields, $fieldDefs, $withSave, $widthNewDel, $praefixFields, $additionalButtons, $widthDiv );
        }
    }
    public function getHtmlLineJSON( $index, $lineFields, $fieldDefs, $widthSave = true, $widthDel = true, $praefixFields = "dlField", 
    $additionalButtons = [], $widthDiv = true ) {
        $tmpHTML = "";
        $tmpLineFieldArr = explode( ",", $lineFields );
        $l = count( $tmpLineFieldArr );
        $i = 0;
        $lineFieldArr = [];
        while ( $i < $l ) {
            $tmp = explode( "AS", $tmpLineFieldArr[$i] );
            if( count( $tmp ) == 2 ) {
                $tmpTable = explode( ".", $tmp[0] );
                array_push($lineFieldArr, trim( $tmp[1] ) );                
            } else {
                $tmp = explode( ".", $tmpLineFieldArr[$i] );
                if( count( $tmp ) == 2 ) {
                    array_push($lineFieldArr, $tmp[1] );
                } else {
                    array_push($lineFieldArr, $tmp[0] );
                }
            }
            $i += 1;
        }
        $tmpId = $this -> records -> data[$index]["id"];
        if( $widthDiv ) $tmpHTML .= '<div id="div_rec_' . $praefixFields . "_" . $tmpId . '" class="divRecord">';
        $tmpLineFieldDefArr = explode( ";", $fieldDefs );
        $i = 0;
        foreach ($this -> records -> data[$index] as $key => $value) {
            $a = $key;
            $b = $lineFieldArr[$i];
            if( $i < count($lineFieldArr) && $key == $lineFieldArr[$i] ) {
                if( substr( $tmpLineFieldDefArr[$i], 0, 6 ) == "select" || substr( $tmpLineFieldDefArr[$i], 0, 7 ) == "<option" ) {
                    $tmpHTML .= $this -> getHTMLSelectField( $praefixFields . "_" . $key . "_$tmpId", $value, "recSelect", $tmpLineFieldDefArr[$i] );
                } else {
                    switch( $tmpLineFieldDefArr[$i] ) {
                        case "button":
                            $tmpHTML .= $this -> getHTMLTextField( $praefixFields . "_" . $key . "_$tmpId", "&nbsp;", "recButton", "button", "" );
                        break;
                        case "text":
                        $tmp = explode( ",", $lineFields );
                        $tmp = explode( ".", $tmp[ $i ] );
                        $table = trim( $tmp[0] );
                            $tmpHTML .=  $this -> getHTMLTextField( $praefixFields . "_" . $key. "_$tmpId", $value, "recText", "text", $this -> getFieldDefValue( $table, $key, "length" ), $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "password":
                        $tmp = explode( ",", $lineFields );
                        $tmp = explode( ".", $tmp[ $i ] );
                        $table = trim( $tmp[0] );
                            $tmpHTML .=  $this -> getHTMLTextField( $praefixFields . "_" . $key. "_$tmpId", $value, "recPassword", "password", $this -> getFieldDefValue( $table, $key, "length" ), $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "number":
                        $tmp = explode( ",", $lineFields );
                        $tmp = explode( ".", $tmp[ $i ] );
                        $table = trim( $tmp[0] );
                            $tmpHTML .=  $this -> getHTMLTextField( $praefixFields . "_" . $key. "_$tmpId", $value, "recText", "number", $this -> getFieldDefValue( $table, $key, "length" ), $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "checkbox":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                        $table = trim( $tmp[0] );
                            $tmpHTML .= $this -> getHTMLCheckboxField( $praefixFields . "_" . $key . "_$tmpId", $value, "recCheckbox", $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "date":
                        $tmp = explode( ",", $lineFields );
                        $tmp = explode( ".", $tmp[ $i ] );
                        $table = trim( $tmp[0] );
                        $tmpValue = explode( " ", $value );
                        $value = $tmpValue[0]; 
                            $tmpHTML .= $this -> getHTMLTextField( $praefixFields . "_" . $key. "_$tmpId", $value, "recDate", "date", $this -> getFieldDefValue( $table, $key, "length" ), $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "time":
                        $tmp = explode( ",", $lineFields );
                        $tmp = explode( ".", $tmp[ $i ] );
                        $table = trim( $tmp[0] );
                        $tmpValue = explode( " ", $value );
                        $value = $tmpValue[0]; 
                            $tmpHTML .= $this -> getHTMLTextField( $praefixFields . "_" . $key. "_$tmpId", $value, "recTime c_$key", "time", $this -> getFieldDefValue( $table, $key, "length" ), $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "textarea":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                        $table = trim( $tmp[0] );
                            $tmpHTML .= $this -> getHTMLTextareaField( $praefixFields . "_" . $key. "_$tmpId", $value, "recTextarea", "", $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                    }
                }
            $i += 1;
            }
        }
        $l = count( $this -> additionalButtons );
        $i = 0;
        while ( $i < $l ) {
            // code...
            $tmpHTML .= '<input type="button" id="' . $praefixFields . "_" . $this -> additionalButtons[$i] -> id . "_" . $tmpId . '" class="' . $this -> additionalButtons[$i] -> class . '" value="' . $this -> additionalButtons[$i] -> value . '">';
            
            $i += 1;
        }
        if( $widthSave ) {
            $tmpHTML .= '<input type="button" id="' .$praefixFields . "_" . 'save_' . $tmpId . '" class="cbSave" value="&nbsp;">';
        }    
        if( $widthDel ) {
            $tmpHTML .= '<input type="button" id="' . $praefixFields . "_" . 'delete_' . $tmpId . '" class="cbDelete" value="&nbsp;">';
        } 
        if( $widthDiv ) $tmpHTML .= '</div>';
        return $tmpHTML;
    }
    public function getHtmlNewLineJSON( $lineFields, $fieldDefs, $widthSave, $widthDel, $praefixFields, $additionalButtons, $widthDiv ) {
        $html = "";
        if( $widthDiv ) $html .= '<div id="div_rec_' . $praefixFields . '_new" class="divRecord">';
        $tmpLineFieldArr = explode( ",", $lineFields );
        $l = count( $tmpLineFieldArr );
        $i = 0;
        $lineFieldArr = [];
        while ( $i < $l ) {
            $tmp = explode( "AS", $tmpLineFieldArr[$i] );
            if( count( $tmp ) == 2 ) {
                $tmpTable = explode( ".", $tmp[0] );
                array_push($lineFieldArr, trim( $tmp[1] ) );                
            } else {
                $tmp = explode( ".", $tmpLineFieldArr[$i] );
                if( count( $tmp ) == 2 ) {
                    array_push($lineFieldArr, $tmp[1] );
                } else {
                    array_push($lineFieldArr, $tmp[0] );
                }
            }
            $i += 1;
        }
        $tmpLineFieldDefArr = explode( ";", $fieldDefs );
        $l = count( $tmpLineFieldDefArr );
        $i = 0;
        while ( $i < $l ) {
            // code...
                if( substr( $tmpLineFieldDefArr[$i], 0, 6 ) == "select" || substr( $tmpLineFieldDefArr[$i], 0, 7 ) == "<option" ) {
                    $tmp = explode(",", $lineFields );
                    $tmp = $tmp[$i];
                    $table = trim( explode( ".", $tmp )[0] );
                    $html .=  $this -> getHTMLSelectField( $praefixFields . "_" . $lineFieldArr[$i] . "_new", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Default" ), "recSelect", $tmpLineFieldDefArr[$i] );
                } else {
                    switch( $tmpLineFieldDefArr[$i] ) {
                        case "button":
                            $html .=  $this -> getHTMLTextField( $praefixFields . "_" . $lineFieldArr[$i] . "_new", "❋", "recButton", "button", "" );
                        break;
                        case "text":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = trim( $tmp[0] );
                            $html .=  $this -> getHTMLTextField( $praefixFields . "_" . $lineFieldArr[$i] . "_new", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Default" ), "recText", "text", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "password":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = trim( $tmp[0] );
                            $html .=  $this -> getHTMLTextField( $praefixFields . "_" . $lineFieldArr[$i] . "_new", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Default" ), "recPassword", "password", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "checkbox":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            $html .= $this -> getHTMLCheckboxField( $praefixFields . "_" . $lineFieldArr[$i] . "_new", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Default" ), "recCheckbox", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "date":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            if( $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Default" ) == "current_timestamp()" ) {
                                $default = date("Y-m-d"); 
                            } else {
                                $default = $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Default" ); 
                            }
                            $html .=   $this -> getHTMLTextField( $praefixFields . "_" . $lineFieldArr[$i] . "_new", $default, "recDate", "date", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "time":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = trim( $tmp[0] );
                            if( $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Default" ) == "current_timestamp()" ) {
                                $default = date("h:i"); 
                            } else {
                                $default = $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Default" ); 
                            }
                            $html .=   $this -> getHTMLTextField( $praefixFields . "_" . $lineFieldArr[$i] . "_new", $default, "recTime", "time", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "textarea":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            $html .=  $this -> getHTMLTextareaField( $praefixFields . "_" .  $lineFieldArr[$i] . "_new", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Default" ), "recText", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                    }
                }
            $i += 1;
        }
        $l = count( $additionalButtons );
        $i = 0;
        while ( $i < $l ) {
            // code...
            $html .=  '<input type="button" id="'. $praefixFields . "_" . $additionalButtons[$i] -> id . '_new" class="' . $additionalButtons[$i] -> class . '" value="' . $additionalButtons[$i] -> value . '">';
            
            $i += 1;
        }
        if( $widthSave ) {
            $html .=  '<input type="button" id="' . $praefixFields . "_" . 'save_new" class="cbSave" value="&nbsp;">';
        }    
        if( $widthDel ) {
            $html .=  '<input type="button" id="' .$praefixFields . "_" . 'delete_new"cbDelete" value="&nbsp;">';
        } 
    if( $widthDiv ) $html .=  '</div>';
    return $html;
    }
    public function getHtmlLine( $index, $lineFields, $fieldDefs, $withSave = true, $widthDel = true, $praefixFields = "", $additionalButtons = [], $widthDiv = true ) {
        $tmpLineFieldArr = explode( ",", $lineFields );
        $l = count( $tmpLineFieldArr );
        $i = 0;
        $lineFieldArr = [];
        while ( $i < $l ) {
            $tmp = explode( ".", $tmpLineFieldArr[$i] );
            if( count( $tmp ) == 2 ) {
                array_push($lineFieldArr, $tmp[1] );
            } else {
                array_push($lineFieldArr, $tmp[0] );
            }
            $i += 1;
        }
        $tmpId = $this -> records -> data[$index]["id"];
        if( $widthDiv ) echo '<div id="div_rec_' . $praefixFields . "_" . $tmpId . '" class="divRecord">';
        $tmpLineFieldDefArr = explode( ";", $fieldDefs );
        $i = 0;
        foreach ($this -> records -> data[$index] as $key => $value) {
            if( $i < count($lineFieldArr) && $key == $lineFieldArr[$i] ) {
                if( substr( $tmpLineFieldDefArr[$i], 0, 6 ) == "select" || substr( $tmpLineFieldDefArr[$i], 0, 7 ) == "<option" ) {
                    echo $this -> getHTMLSelectField( $key . "_$tmpId", $value, "recSelect", $tmpLineFieldDefArr[$i] );
                } else {
                    switch( $tmpLineFieldDefArr[$i] ) {
                        case "button":
                            echo $this -> getHTMLTextField( $key . $praefixFields . "_$tmpId", "&nbsp;", "recButton c_$key", "button", "" );
                        break;
                        case "text":
                        $tmp = explode( ",", $lineFields );
                        $tmp = explode( ".", $tmp[ $i ] );
                        $table = $tmp[0];
                            echo $this -> getHTMLTextField( $key . $praefixFields . "_$tmpId", $value, "recText c_$key", "text", $this -> getFieldDefValue( $table, $key, "length" ), $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "number":
                        $tmp = explode( ",", $lineFields );
                        $tmp = explode( ".", $tmp[ $i ] );
                        $table = $tmp[0];
                            echo $this -> getHTMLTextField( $key . $praefixFields . "_$tmpId", $value, "recText c_$key", "number", $this -> getFieldDefValue( $table, $key, "length" ), $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "checkbox":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                        $table = trim( $tmp[0] );
                            echo $this -> getHTMLCheckboxField( $key . $praefixFields . "_$tmpId", $value, "recCheckbox", $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "date":
                        $tmp = explode( ",", $lineFields );
                        $tmp = explode( ".", $tmp[ $i ] );
                        $table = $tmp[0];
                        $tmpValue = explode( " ", $value );
                        $value = $tmpValue[0]; 
                            echo $this -> getHTMLTextField( $key . $praefixFields . "_$tmpId", $value, "recDate c_$key", "date", $this -> getFieldDefValue( $table, $key, "length" ), $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "time":
                        $tmp = explode( ",", $lineFields );
                        $tmp = explode( ".", $tmp[ $i ] );
                        $table = $tmp[0];
                        $tmpValue = explode( " ", $value );
                        $value = $tmpValue[0]; 
                            echo $this -> getHTMLTextField( $key . $praefixFields . "_$tmpId", $value, "recTime c_$key", "time", $this -> getFieldDefValue( $table, $key, "length" ), $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                        case "textarea":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            echo $this -> getHTMLTextareaField( $key . $praefixFields . "_$tmpId", $value, "recTextarea c_$key", "", $this -> getFieldDefValue( $table, $key, "Comment" ) );
                        break;
                    }
                }
            $i += 1;
            }
        }
        $l = count( $this -> additionalButtons );
        $i = 0;
        while ( $i < $l ) {
            // code...
            echo '<input type="button" id="' . $praefixFields . "_" . $this -> additionalButtons[$i] -> id . "_" . $tmpId . '" class="' . $this -> additionalButtons[$i] -> class . '" value="' . $this -> additionalButtons[$i] -> value . '">';
            
            $i += 1;
        }
        if( $withSave ) {
            echo '<input type="button" id="' .$praefixFields . "_" . 'save_' . $tmpId . '" class="cbSave recButton" value="&nbsp;">';
        }    
        if( $widthDel ) {
            echo '<input type="button" id="' . $praefixFields . "_" . 'delete_' . $tmpId . '" class="cbDelete recButton" value="&nbsp;">';
        } 
        if( $widthDiv ) echo '</div>';
    }
    public function getHtmlNewLine( $lineFields, $fieldDefs, $withSave, $widthDel, $praefixFields, $additionalButtons, $widthDiv ) {
        if( $widthDiv ) echo '<div id="div_rec_new" class="divRecord">';
        $tmpLineFieldArr = explode( ",", $lineFields );
        $l = count( $tmpLineFieldArr );
        $i = 0;
        $lineFieldArr = [];
        while ( $i < $l ) {
            $tmp = explode( ".", $tmpLineFieldArr[$i] );
            array_push($lineFieldArr, $tmp[1] );
            $i += 1;
        }
        $tmpLineFieldDefArr = explode( ";", $fieldDefs );
        $l = count( $tmpLineFieldDefArr );
        $i = 0;
        while ( $i < $l ) {
            // code...
                if( substr( $tmpLineFieldDefArr[$i], 0, 6 ) == "select" || substr( $tmpLineFieldDefArr[$i], 0, 7 ) == "<option" ) {
                    echo $this -> getHTMLSelectField( $lineFieldArr[$i] . $praefixFields . "_new", "0", "recSelect", $tmpLineFieldDefArr[$i] );
                } else {
                    switch( $tmpLineFieldDefArr[$i] ) {
                        case "button":
                            echo $this -> getHTMLTextField( $lineFieldArr[$i] . $praefixFields . "_new", "❋", "recButton", "button", "" );
                        break;
                        case "text":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            echo $this -> getHTMLTextField( $lineFieldArr[$i] . $praefixFields . "_new", "", "recText", "text", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "number":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            echo $this -> getHTMLTextField( $lineFieldArr[$i] . $praefixFields . "_new", "", "recText", "number", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "checkbox":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            echo $this -> getHTMLCheckboxField( $praefixFields . "_" . $lineFieldArr[$i] . "_new", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Default" ), "recCheckbox", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "date":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            echo $this -> getHTMLTextField( $lineFieldArr[$i] . $praefixFields . "_new", "", "recDate", "date", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "time":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            echo $this -> getHTMLTextField( $lineFieldArr[$i] . $praefixFields ."_new", "", "recTime", "time", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "textarea":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            echo $this -> getHTMLTextareaField( $lineFieldArr[$i] . $praefixFields . "_new", "", "recText", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "img":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            //echo $this -> getHTMLImgField( $lineFieldArr[$i] . $praefixFields . "_new", "", "recText", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                        case "div":
                            $tmp = explode( ",", $lineFields );
                            $tmp = explode( ".", $tmp[ $i ] );
                            $table = $tmp[0];
                            //echo $this -> getHTMLDivField( $lineFieldArr[$i] . $praefixFields . "_new", "", "recText", $this -> getFieldDefValue( $table, $lineFieldArr[$i], "length" ),  $this -> getFieldDefValue( $table, $lineFieldArr[$i], "Comment" ) );
                        break;
                    }
                }
            $i += 1;
        }
        $l = count( $additionalButtons );
        $i = 0;
        while ( $i < $l ) {
            // code...
            echo '<input type="button" id="' . $additionalButtons[$i] -> id . '_new" class="' . $additionalButtons[$i] -> class . '" value="' . $additionalButtons[$i] -> value . '">';
            
            $i += 1;
        }
        if( $withSave ) {
            echo '<input type="button" id="' . $praefixFields .'_save_new" class="cbSave recButton" value="&nbsp;">';
        }    
        if( $widthDel ) {
            echo '<input type="button" id="' . $praefixFields .'_delete_new" class="cbSave recButton" value="&nbsp;">';
        } 
    if( $widthDiv ) echo '</div>';
    }
    public function getFieldByIndex( $i ) {
        return $this -> fields[$i];
    }
    public function getFieldByFieldName( $name ) {
        $l = count( $this -> fields );
        $i = 0;
        $tmpField = new \stdClass(); 
        while ( $i < $l) {
            if( $this -> fields[$i] -> dataField == $name ) {
                $tmpField = $this -> fields[$i];    
            }
            $i += 1;
        }
        $return = $tmpField; 
    }
    public function getHTMLSelectField( $id, $value, $class, $source, $prevOption = "", $afterOption = "" ) {
        $tmpHtml = $this -> getSelectField( $source, $value );
        return '<select id="' . $id . '" class="' . $class . '">' . "\n" . $prevOption . $tmpHtml . $afterOption . "\n</select>";
    }
    public function getHTMLCheckboxField( $id, $value, $class, $title = "" ) {
        if( $value == 1 ) {
            return '<input id="' . $id . '" class="' . $class . '" type="checkbox" checked title="' . $title . '">';
        } else {
            return '<input id="' . $id . '" class="' . $class . '" type="checkbox" title="' . $title . '">';
        }
    }
    public function getHTMLTextField( $id, $value, $class, $type, $maxlength = 0, $title = "" ) {
        if( is_null( $value ) ) {
            return '<input id="' . $id . '" class="' . $class . '" type="' . $type . '" value="" maxlength="' . $maxlength . '" title="' . $title . '">';
            
        } 
        $value = str_replace('"', "&quot;", $value );
        return '<input id="' . $id . '" class="' . $class . '" type="' . $type . '" value="' . $value . '" maxlength="' . $maxlength . '" title="' . $title . '">';
    }
    public function getHTMLTextareaField( $id, $value, $class, $maxlength = 0, $title = "" ) {
        //$value = str_replace('"', "&quot;", $value );
        return '<textarea id="' . $id . '" class="' . $class . '" maxlength="' . $maxlength . '" title="' . $title . '">' . $value . '</textarea>';
    }
    public function getSelectField( $source, $value ) {
        $return = new \stdClass();
        if( substr( $source, 0, 6) == "select" ) {
            try{
                $source = str_replace('\\', "", $source );
                $stm = $this -> pdo -> query( $source );
                $return -> data = $stm -> fetchAll();
                $l = count( $return -> data );
                $i = 0;
                $fieldStr = "";
                while( $i < $l ) {
                    if( $return -> data[$i][0] == $value ) {
                        $fieldStr .= '<option value="' . $return -> data[$i][0] . '" selected>' . $return -> data[$i][1] . "</option>\n"    ;
                    } else {
                        $fieldStr .= '<option value="' . $return -> data[$i][0] . '">' . $return -> data[$i][1] . "</option>\n"    ;
                    }
                    $i += 1;
                }
                
                $return -> message = "Daten erfolgreich gelesen.";
            } catch( Exception $e ) {
                    $return -> success = false;
                    $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
            }        
                
        } else {
            $tmp = explode( "</option>", $source );

            $l = count( $tmp );
            $i = 0;
            $fieldStr = "";
            while ( $i < $l ) {
                $tmpVal = explode( "'", $tmp[$i] );
                if( isset( $tmpVal[1] ) ) {
                    if( str_replace( '\\', "", $tmpVal[1] ) == $value ) {
                        $fieldStr .= str_replace( '\\', "", $tmpVal[0] )  . ' ' . str_replace( '\\', "", $tmpVal[1] ) . ' selected' . $tmpVal[2] . "</option>\n"    ;
                    } else {
                        $fieldStr .= str_replace( '\\', "", $tmpVal[0] )  . ' ' . str_replace( '\\', "", $tmpVal[1] ) . ' ' . $tmpVal[2] . "</option>\n"    ;                
                    }
                }
                $i += 1;
            }
            try{
            } catch( Exception $e ) {
                    $return -> success = false;
                    $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
            }    
        }
        return $fieldStr;                            
    }
    public function getFirstIdCountRecords( $source ) {
        $tmp = explode( "FROM", $source );
        $tmpFields = explode( "SELECT", $tmp[0] );
        if( trim( $tmpFields[1] ) == "*" ) {
            return "id";
        } else {
            $tmpFirstField = explode( ",", $tmpFields[1] );
            return trim( $tmpFirstField[0] );
        }
    }
    public function getPrimaryIndex() {
        $query = "SHOW INDEX FROM " . $this -> primaryKeyTable . " WHERE Key_name ='PRIMARY'";
        $stm = $this -> pdo -> query( $query );
        $result = $stm -> fetchAll();
        $id = $result[0]["Column_name"];
        return $id;
    }
    public function getCountRecords( $source, $searchString ) {
        $return = new \stdClass();
        $return -> success = true;
        $searchString = str_replace("\\", '', $searchString );
        $tWhere = strpos($source, "WHERE" );
        $tmp = explode( "FROM", $source );
        //$firstId = $this -> getFirstIdCountRecords( $tmp[0] );
        $firstId = $this -> indexField;
        if( !$tWhere ) {
            $query = "SELECT COUNT($firstId) AS count FROM " . $tmp[1] . " WHERE " . $searchString;
        } else {
            $query = "SELECT COUNT($firstId) AS count FROM " . $tmp[1] . " AND " . $searchString;        
        }
        if( $searchString == null  ) {
            $query = "SELECT COUNT($firstId) AS count FROM " . $tmp[1];
        }
        try {
            $stm = $this -> pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> count = $result[0]["count"];
        } catch( Exception $e ) {
            $return -> success = false;
        }
        return $return;
    }

}
?>