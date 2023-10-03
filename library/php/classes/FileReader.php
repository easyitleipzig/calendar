<?php
define( "PIC_EXIF", "image/gif; charset=binary|image/jpeg; charset=binary|image/png; charset=binary|image/webp; charset=binary"); 
class FileReader extends \stdClass {
    private $path;
    private $basisPath;
    private $dVar;
    private $type;
    private $size;
    private $zoom;
    private $onlyDirs;
    private $onlyFiles;
    private $filterExt;
    private $filterExif;
    private $createPreview;
    private $previewFolder;
    public $tableName;
    private $reReadData;
    public function standardFunktion(  ) {
        $return = new \stdClass();
        try{
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }

    public function __construct( $pdo, $path = "", $basisPath = "../../", $type = "List", $size = "Small", $onlyDirs = false, $onlyFiles = false, $filterExt = "", $filterExif = "", $createPreview = false, $preservePreviewFormat = false, $previewFolder = "preview", $tableName = "", $reReadData = true, $dVar = "fr" ) {
        $this -> pdo = $pdo;
        $this -> path = $path;
        $this -> basisPath = $basisPath;
        $this -> dVar = $dVar;
        $this -> type = $type;
        $this -> size = $size;
        $this -> onlyDirs = $onlyDirs;
        $this -> onlyFiles = $onlyFiles;
        $this -> filterExt = $filterExt;
        $this -> filterExif = $filterExif;
        $this -> createPreview = $createPreview;
        $this -> previewFolder = $previewFolder;
        $this -> preservePreviewFormat = $preservePreviewFormat;
        $this -> reReadData = $reReadData;
        if( $tableName == "" ) {
            $this -> tableName = $this -> getTableName( $tableName ) -> tableName;
        } else {
            $this -> tableName = $tableName;
        }
    }
    private function getTableName( $tableName ) {
        $return = new \stdClass();
        try{
            $query = "SHOW TABLES LIKE '$tableName';";
            $stm = $this -> pdo -> query( $query );
            $result = $stm -> fetchAll();
            $l = count( $result );
            if( $l == 1) {
                $this -> tableName = $tableName;
                if( $this -> reReadData ) {
                    $query = "TRUNCATE " . $this -> tableName;
                    $this -> pdo -> query( $query );
                }    
            } else {
                $query = "SHOW TABLES LIKE 'tmp_files_%';";
                $stm = $this -> pdo -> query( $query );
                $result = $stm -> fetchAll();
                $l = count( $result );
                $i = 0;
                $counter = 0;
                while ( $i < $l ){
                    $tmp = explode( "_", $result[$i][0] );
                    $tmpCount = intval( $tmp[2] );
                    if( $tmpCount > $counter ) $counter = $tmpCount;
                    $i += 1;
                }
                $counter += 1;            
                $return -> success = true;
                $return -> tableName = "tmp_files_" . $counter; 
                $return -> message = "Tabellenname erfolgreich gelesen.";
                $query = "CREATE TABLE `" . $return -> tableName . "` (`id` int(11) NOT NULL, `name` varchar(255) NOT NULL, `extension` varchar(50) NOT NULL, `filetype` varchar(50) NOT NULL, `createDate` datetime NOT NULL, `lastChange` datetime NOT NULL, `size` bigint(20) NOT NULL, `formatedSize` varchar(10) NOT NULL, `exif` varchar(150) NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
                $this -> pdo -> query( $query );
                $query = "ALTER TABLE `" . $return -> tableName . "` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `idx_name` (`name`), ADD KEY `type` (`exif`), ADD KEY `filetype` (`filetype`); ALTER TABLE `" . $return -> tableName . "` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT";
                $this -> pdo -> query( $query );
            }           
        } catch( Exception $e ) {
            $return -> tableName = null; 
            $return -> success = false;
            $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }
    public function getPath(  ) {
        return $this -> path;                            
    }
    public function getBasisPath(  ) {
        return $this -> basisPath;                            
    }
    private function writeContent() {
        $content = [];
        $i = 0;
        if ( is_dir ( $this -> basisPath . $this -> path ) ) {
            // öffnen des Verzeichnisses
            if ( $handle = opendir( $this -> basisPath . $this -> path ) ) {
                // einlesen der Verzeichnisses
                while (($file = readdir( $handle ) ) !== false)
                {
                    if( $file == "." ) continue;
                    if( $this -> path == "" && $file == ".." ) {
                        $return -> path = "/";
                        continue;    
                    }
                    $entry = new \stdClass();
                    $entry -> id = $i;
                    $entry -> name = $file;
                    $entry -> filetype = filetype(  $this -> basisPath . $this -> path . $file );
                    $entry -> size = filesize(  $this -> basisPath . $this -> path . $file );
                    $entry -> formatedSize = formatFilesizeUnits( $entry -> size );
                    $finfo = new finfo(FILEINFO_MIME);
                    if( $entry -> filetype == "file" ) {
                        $tmp = explode( ".",  $file);
                        $entry -> extension = $tmp[ count( $tmp ) - 1 ];
                    } else {
                        $entry -> extension = "";
                    }
                    $entry -> exif = $finfo->file( $this -> basisPath . $this -> path . $file );
                    $entry -> createDate = date( "Y.m.d h:i",  filectime(  $this -> basisPath . $this -> path . $file ) );
                    $entry -> lastChange = date( "Y.m.d h:i",  filemtime(  $this -> basisPath . $this -> path . $file ) );
                    $content[ $i ] = $entry;
                    $i += 1;
                }
                closedir($handle);
            }
            $query = "TRUNCATE TABLE " . $this -> tableName . "";
            $this -> pdo -> query( $query );
            if( $this -> createPreview ) {
                $query = "INSERT INTO `" . $this -> tableName . "` (`name`, `extension`, `filetype`, `size`, `formatedSize`, `exif`) VALUES ('" . $this -> previewFolder . "', '', 'dir', '0', '0 bytes', 'directory notempty')";
                $this -> pdo -> query( $query );
            }
            $l = count( $content );
            $i = 0;
            $query = "INSERT INTO `" . $this -> tableName . "` (`name`, `extension`, `filetype`, `createDate`, `lastChange`, `size`, `formatedSize`, `exif`) VALUES ";
            while ( $i < $l ){
                $query .= "('" . $content[ $i ] -> name . "', '" . $content[ $i ] -> extension . "', '" . $content[ $i ] -> filetype . "', '" . $content[ $i ] -> createDate . "', '" . $content[ $i ] -> lastChange . "', '" . $content[ $i ] -> size . "', '" . $content[ $i ] -> formatedSize . "', '" . $content[ $i ] -> exif . "'), ";
                $i += 1;
            }
            $query = substr( $query, 0, -2 );
            $pdo -> query( $query );      
        }
        return $content;
    }
    public function getContent( $pdo, $path ) {
        $return = new \stdClass();
        $content = [];
        $i = 0;
        if ( is_dir ( $this -> basisPath . $this -> path ) ) {
            // öffnen des Verzeichnisses
            if ( $handle = opendir( $this -> basisPath . $path ) ) {
                // einlesen der Verzeichnisses
                while (($file = readdir( $handle ) ) !== false)
                {
                    if( $file == "." ) continue;
                    if( $path == "" && $file == ".." ) {
                        $return -> path = "/";
                        continue;    
                    }
                    $entry = new \stdClass();
                    $entry -> id = $i;
                    $entry -> name = $file;
                    $entry -> filetype = filetype(  $this -> basisPath . $path . $file );
                    $entry -> size = filesize(  $this -> basisPath . $path . $file );
                    $entry -> formatedSize = formatFilesizeUnits( $entry -> size );
                    $finfo = new finfo(FILEINFO_MIME);
                    if( $entry -> filetype == "file" ) {
                        $tmp = explode( ".",  $file);
                        $entry -> extension = $tmp[ count( $tmp ) - 1 ];
                    } else {
                        $entry -> extension = "";
                    }
                    $entry -> exif = $finfo->file( $this -> basisPath . $path . $file );
                    if( $entry -> filetype == "dir" && checkDirIsEmpty( $this -> basisPath . $path, $file) ) {
                        $entry -> exif = "directory notempty";
                    }
                    $entry -> createDate = date( "Y.m.d h:i",  filectime(  $this -> basisPath . $path . $file ) );
                    $entry -> lastChange = date( "Y.m.d h:i",  filemtime(  $this -> basisPath . $path . $file ) );
                    $content[ $i ] = $entry;
                    $i += 1;
                }
                closedir($handle);
            }
            $query = "TRUNCATE TABLE " . $this -> tableName . "";
            $pdo -> query( $query );
            $l = count( $content );
            $i = 0;
            $query = "INSERT INTO `" . $this -> tableName . "` (`name`, `extension`, `filetype`, `createDate`, `lastChange`, `size`, `formatedSize`, `exif`) VALUES ";
            while ( $i < $l ){
                $query .= "('" . $content[ $i ] -> name . "', '" . $content[ $i ] -> extension . "', '" . $content[ $i ] -> filetype . "', '" . $content[ $i ] -> createDate . "', '" . $content[ $i ] -> lastChange . "', '" . $content[ $i ] -> size . "', '" . $content[ $i ] -> formatedSize . "', '" . $content[ $i ] -> exif . "'), ";
                $i += 1;
            }
            $query = substr( $query, 0, -2 );
            $pdo -> query( $query );

            //$content = $this -> writeContent();
            
            if( $this -> createPreview ) {
                deleteDirectory( $this -> basisPath . $this -> path . $this -> previewFolder );
                require_once( "classes/ThumbNail.php");
                //$res = $img -> 
                $tmpExifs = explode( "|", PIC_EXIF );
                $l = count( $tmpExifs );
                $i = 0;
                while ( $i < $l ){
                    $query = "SELECT name FROM " . $this -> tableName . " WHERE exif = '" . $tmpExifs[$i] . "'";
                    $stm = $pdo -> query( $query );
                    $result = $stm -> fetchAll();
                    $m = count( $result );
                    $j = 0;
                    while ( $j < $m ){
                        $img = new \ThumbNail( $result[$j]["name"], $this -> basisPath, $this -> path, $this -> previewFolder, $this -> size . "_", $this -> preservePreviewFormat );
                        $j += 1;
                    }                
                    $i += 1;
                }
            }
        $query = "SELECT * FROM " . $this -> tableName . " ORDER BY filetype";
        $stm = $this -> pdo -> query( $query );
        $return -> content = $content;            
        $return -> content = $stm -> fetchAll( PDO::FETCH_ASSOC );
        return $return;
        }
    }
    public function refreshPreview() {
        deleteDirectory( $this -> basisPath . $this -> path . $this -> previewFolder );
        require_once( "classes/ThumbNail.php");
        //$res = $img -> 
        $tmpExifs = explode( "|", PIC_EXIF );
        $l = count( $tmpExifs );
        $i = 0;
        while ( $i < $l ){
            $query = "SELECT name FROM " . $this -> tableName . " WHERE exif = '" . $tmpExifs[$i] . "'";
            $stm = $this -> pdo -> query( $query );
            $result = $stm -> fetchAll();
            $m = count( $result );
            $j = 0;
            while ( $j < $m ){
                $img = new \ThumbNail( $result[$j]["name"], $this -> basisPath, $this -> path, $this -> previewFolder, $this -> size . "_", $this -> preservePreviewFormat );
                $j += 1;
            }                
            $i += 1;
        }
        
    }
    public function refreshData( $cratePreview, $size, $order = "", $search = "") {
        $return = new \stdClass();
        try {
            if( $search != "" ) {
                $search = " WHERE " . $search;
            }
            if( $order != "" ) {
                $order = " ORDER BY " . $order;
            }
            $query = "SELECT * FROM " . $this -> tableName . $search . $order;
            $stm = $this -> pdo -> query( $query );
            $return -> content = $stm -> fetchAll();
            if( $cratePreview ) {
                $this -> refreshPreview();
            }
            $return -> success = true;
            $return -> message = "Die Daten wurden erfolgreich geladen.";
        } catch ( Exception $e ) {
            $return -> content = false;
            $return -> success = false;
            $return -> message = "Beim Lesen der Daten ist folgender Fehler aufgetreten: " . $e -> getMessage();
            
        }
        return $return;  
    }
    public function getInfo( $id ) {
        $return = new \stdClass();
        $tmp = explode( "_", $id );
        $entr = $tmp[ count( $tmp ) - 1];
        $query = "SELECT * FROM " . $this -> tableName . " WHERE id = " . $entr;
        try {
            $stm = $this -> pdo -> query( $query );
            $return -> data = $stm -> fetchAll( PDO::FETCH_ASSOC );
            $return -> success = true;
            $return -> message = "Die Daten wurden erfolgreich geladen.";
        $html = "";        
        $html .= "<fieldset><legend>Allgemeine Informationen</legend>";
        $html .= "<div><div>Name: </div><input id='" . $this -> dVar . "_infoFileName' value='" . $return -> data[0]["name"] . "'></div>";
        if( $return -> data[0]["filetype"] == "file"  ) {
            $html .= "<div><div>Dateityp: </div><div>" . $return -> data[0]["extension"] . " - Datei</div></div>";
        } else {
            $html .= "<div><div>Dateityp: </div><div>Verzeichnis</div></div>";
        }
        $exif = chunk_split( $return -> data[0]["exif"], 30 ) . "\r\n";
        $html .= "<div><div>Metadaten:</div><textarea>" . $exif . "</textarea></div>";
        $html .= "<div><div>Größe: </div><div>" . $return -> data[0]["formatedSize"] . "</div></div>";
        $html .= "</fieldset>";
        $html .= "<fieldset><legend>Zusatzinformationen</legend>";
        if( strpos( PIC_EXIF, $return -> data[0]["exif"] )> -1 ) {
            require_once( "classes/ThumbNail.php");
            $tr = new \ThumbNail( $return -> data[0]["name"], $this -> basisPath, $this -> path );
            $tr -> getFileInfo();
            $picInfo = $tr -> formatInfo;
            $html .= "<div><div>Dimensionen:</div><div>" . $picInfo[0] . " * " . $picInfo[1] . "px</div></div>";
            $html .= "<div><div>Seitenverhältnis:</div><div> 1 zu " . $picInfo["0"] / $picInfo["1"] . "</div></div>";
            if( isset( $picInfo["channels"] ) ) {
                $html .= "<div><div>Bits / Kanäle:</div><div>" . $picInfo["bits"] . " / " . $picInfo["channels"] . "</div></div>";
                
            } else {
                $html .= "<div><div>Bits:</div><div>" . $picInfo["bits"] . "</div></div>";
            }
        }            
        $html .= "</fieldset>";
        $html .= "<fieldset><legend>Tools</legend>";
        if( strpos( PIC_EXIF, $return -> data[0]["exif"] )> -1 ) {
            require_once( "classes/ThumbNail.php");
            $tr = new \ThumbNail( $return -> data[0]["name"], $this -> basisPath, $this -> path );
            $html .= "<div><div>Umwandeln in:</div>";
            $html .= "<select id='" . $this -> dVar . "_transformPic'>";
            $html .= "<option value='0' selected></option>";
            $html .= "<option value='image/gif'>GIF-Datei</option>";
            $html .= "<option value='image/jpeg'>JPG-Datei</option>";
            $html .= "<option value='image/png'>PNG-Datei</option>";
            $html .= "<option value='image/webp'>WEBP-Datei</option>";
            $html .= "</select></div>";
            $html .= "<div><div>Komprimieren:</div>";
            $html .= "<select id='" . $this -> dVar . "_compressPic'>";
            $html .= "<option value='0' selected></option>";
            $html .= "<option value='25'>25%</option>";
            $html .= "<option value='50'>50%</option>";
            $html .= "<option value='70'>70%</option>";
            $html .= "<option value='80'>80%</option>";
            $html .= "<option value='90'>90%</option>";
            $html .= "</select></div>";
            $html .= "<div><div>Größe ändern:</div><div>erhalte Seitenverhältnis&nbsp;<input type='checkbox' id='" . $this -> dVar . "_preserveAspectRatio' checked></div></div>";
            $html .= "<div><input id='" . $this -> dVar . "_aspectRatio' value='" . $picInfo[0] / $picInfo[1] . "'></div>";
            $html .= "<div><div><input value='" . $picInfo[0] .  "' id='" . $this -> dVar . "_resizeWidth' type=number><input value='" . $picInfo[1] .  "' id='" . $this -> dVar . "_resizeHeight' type=number><input type=button id='" . $this -> dVar . "_changeSize' value='Ändern'></div></div>";           
        }
        $html .= "</fieldset>";
       $return -> html = $html;
        } catch ( Exception $e ) {
            $return -> content = false;
            $return -> success = false;
            $return -> message = "Beim Lesen der Daten ist folgender Fehler aufgetreten: " . $e -> getMessage();
        }
        return $return;  
    }        
}  
?>
