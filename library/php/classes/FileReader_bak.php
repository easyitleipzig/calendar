<?php
define( "PIC_EXIF", "image/gif; charset=binary|image/jpeg; charset=binary|image/png; charset=binary|image/webp; charset=binary"); 
class FileReader {
    private $path;
    private $basisPath;
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
    public function standardFunktion(  ) {
        $return = new \stdClass();
        try{
        } catch( Exception $e ) {
                $return -> success = false;
                $return -> message = "Fehler aufgetreten:" . $e -> getMessage() . ".";
        }        
        return $return;                            
    }

    public function __construct( $pdo, $path = "", $basisPath = "../../", $type = "List", $size = "Small", $onlyDirs = false, $onlyFiles = false, $filterExt = "", $filterExif = "", $createPreview = false, $previewFolder = "preview", $preservePreviewFormat = false ) {
        $this -> pdo = $pdo;
        $this -> path = $path;
        $this -> basisPath = $basisPath;
        $this -> type = $type;
        $this -> size = $size;
        $this -> onlyDirs = $onlyDirs;
        $this -> onlyFiles = $onlyFiles;
        $this -> filterExt = $filterExt;
        $this -> filterExif = $filterExif;
        $this -> createPreview = $createPreview;
        $this -> previewFolder = $previewFolder;
        $this -> preservePreviewFormat = $preservePreviewFormat;
        $this -> tableName = $this -> getTableName( $pdo ) -> tableName;
    }
    private function getTableName( $pdo ) {
        $return = new \stdClass();
        try{
            $query = "SHOW TABLES LIKE 'tmp_files_%';";
            $stm = $pdo -> query( $query );
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
            $query = "CREATE TABLE `" . $return -> tableName . "` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `extension` varchar(50) NOT NULL,
  `filetype` varchar(50) NOT NULL,
  `createDate` datetime NOT NULL,
  `lastChange` datetime NOT NULL,
  `size` bigint(20) NOT NULL,
  `formatedSize` varchar(10) NOT NULL,
  `exif` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
            $this -> pdo -> query( $query );
            $query = "ALTER TABLE `" . $return -> tableName . "`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_name` (`name`),
  ADD KEY `type` (`exif`),
  ADD KEY `filetype` (`filetype`);
ALTER TABLE `" . $return -> tableName . "`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT";
            $this -> pdo -> query( $query );

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
    public function getContent( $pdo, $path ) {
        $return = new \stdClass();
        $content = [];
        $i = 0;
        if ( is_dir ( $this -> basisPath . $path ) ) {
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
        }
        $query = "SELECT * FROM " . $this -> tableName . " ORDER BY filetype";
        $stm = $this -> pdo -> query( $query );
        $return -> content = $stm -> fetchAll(PDO::FETCH_ASSOC);
        //$return -> content = $content;            
        return $return;
    }
}  
?>
