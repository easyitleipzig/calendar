<?php
define( "THUMB_WIDTH_SMALL", 50 );
define( "THUMB_WIDTH_NORMAL", 70 );
define( "THUMB_WIDTH_BIG", 120 );
const IMAGE_HANDLERS = [
    IMAGETYPE_JPEG => [
        'load' => 'imagecreatefromjpeg',
        'save' => 'imagejpeg',
        'quality' => 100
    ],
    IMAGETYPE_PNG => [
        'load' => 'imagecreatefrompng',
        'save' => 'imagepng',
        'quality' => 0
    ],
    IMAGETYPE_GIF => [
        'load' => 'imagecreatefromgif',
        'save' => 'imagegif'
    ],
    IMAGETYPE_WEBP => [
        'load' => 'imagecreatefromwebp',
        'save' => 'imagewebp'
    ]
];

class ThumbNail {
    public $basePath;
    public $path;
    public $picName;
    protected $fullName;
    protected $currentDimensions;
    public $formatInfo;
    private $previewPath;
    private $oldImage;
    private $newImage;
    private $thumbPraefix;
    private $preservePreviewFormat;
    public function __construct( $picName, $basepath = "../../", $path = "", $previewPath = "preview", $thumbPraefix = "NORMAL_", $preservePreviewFormat = false, $createPreviewPath = true ) {
        $this -> basePath = $basepath;
        $this -> path = $path;
        $this -> picName = $picName;
        $this -> fullName = $this -> basePath . $this -> path . $this -> picName;
        $this -> previewPath = $previewPath;
        $this -> thumbPraefix = $thumbPraefix;
        $this -> preservePreviewFormat = $preservePreviewFormat;
        if( !file_exists( $this -> basePath . $this -> path . $this -> previewPath ) && $createPreviewPath ) mkdir( $this -> basePath . $this -> path . $this -> previewPath );
        $this -> getFileInfo();
        $this -> getSourceImage();
        if( boolval($createPreviewPath ) ) $this -> writeThumb();
    }
    protected function getPath() {
        return $this -> basePath . $this -> path;
    }
    public function writeThumb() {
        switch( $this -> thumbPraefix ) {
            case "SMALL_":
                if( $this -> formatInfo["aspectRatio"]  > 1 ) {
                    $this -> newImage = imagescale( $this -> oldImage, THUMB_WIDTH_SMALL );
                } else {
                    $this -> newImage = imagescale( $this -> oldImage, intval( THUMB_WIDTH_SMALL * $this -> formatInfo["aspectRatio"] ) );
                }            
            break;
            case "NORMAL_":
                if( $this -> formatInfo["aspectRatio"]  > 1 ) {
                    $this -> newImage = imagescale( $this -> oldImage, THUMB_WIDTH_NORMAL );
                } else {
                    $this -> newImage = imagescale( $this -> oldImage, intval( THUMB_WIDTH_NORMAL * $this -> formatInfo["aspectRatio"] ) );
                }            
            break;
            case "BIG_":
                if( $this -> formatInfo["aspectRatio"]  > 1 ) {
                    $this -> newImage = imagescale( $this -> oldImage, THUMB_WIDTH_BIG );
                } else {
                    $this -> newImage = imagescale( $this -> oldImage, intval( THUMB_WIDTH_BIG * $this -> formatInfo["aspectRatio"] ) );
                }            
            break;
        }
        if( !$this -> newImage ) $this -> newImage = $this -> oldImage;
        if( boolval( $this -> preservePreviewFormat ) ) {
            switch ($this -> formatInfo["mime"]) {
                case 'image/webp':
                    imagewebp($this -> newImage, $this -> basePath . $this -> path . $this -> previewPath . "/" . $this -> thumbPraefix . $this -> picName );
                    break;
                case 'image/gif':
                    imagegif($this -> newImage, $this -> basePath . $this -> path . $this -> previewPath . "/" . $this -> thumbPraefix . $this -> picName );
                    break;
                case 'image/jpeg':
                    if( $this -> formatInfo["aspectRatio"] >= 1 ) {
                        $this -> newImage = imagerotate( $this -> newImage, 90, 0);    
                    } else {
                        //$this -> newImage = imagerotate( $this -> newImage, 180, 0);    
                    }                       
                    imagejpeg($this -> newImage, $this -> basePath . $this -> path . $this -> previewPath . "/" . $this -> thumbPraefix . $this -> picName );

                    break;
                case 'image/png':
                    imagepng($this -> newImage, $this -> basePath . $this -> path . $this -> previewPath . "/" . $this -> thumbPraefix . $this -> picName );
                    break;
            }
        } else {
            if( $this -> formatInfo["aspectRatio"] > 1 && $this -> formatInfo["mime"] == "image/jpeg"  ) $this -> newImage = imagerotate( $this -> newImage, 270, 0);
            $this -> picName .= ".webp";
            imagewebp($this -> newImage, $this -> basePath . $this -> path . $this -> previewPath . "/" . $this -> thumbPraefix . $this -> picName );
            
        }        
        // Free up memory
        imagedestroy($this -> newImage);        
        return;
    }
    protected function fileExistsAndReadable () {
    
    }
    public function getFileInfo( $targetHeight = null) {
        $this -> formatInfo = getimagesize( $this -> fullName );
        $this -> getSourceImage();
        $width = imagesx($this -> oldImage);
        $height = imagesy($this -> oldImage);
        $targetHeight = 50;
        $targetWidth = 50;
        // Seitenverhältnis beibehalten, wenn keine Höhe eingestellt ist
        if ($targetHeight == null) {
            // Verhältnis von Breite zu Höhe ermitteln
            $this -> formatInfo["aspectRatio"] = $width / $height;
            // wenn ist Hochformat
            // Verhältnis zur Skalierungshöhe verwenden, um in das Quadrat zu passen
            if ($width > $height) {
                $targetHeight = floor($targetWidth / $this -> formatInfo["aspectRatio"]);
            }
            // wenn ist Querformat
            // Verhältnis zur Skalierungsbreite verwenden, um in das Quadrat zu passen
            else {
                $targetHeight = $targetWidth;
                $targetWidth = floor($targetWidth * $this -> formatInfo["aspectRatio"]);
            }
        }
        if( !$this -> formatInfo ) {
            $this -> formatInfo["mime"] = "STRING";
        } else {
            $this -> formatInfo["aspectRatio"] = floatval( $this -> formatInfo[0] / $this -> formatInfo[1] );
            $this -> formatInfo["aspectRatio"] = $targetWidth;
        }
    }
    protected function getSourceImage() {        
/*
imagecreatefromavif
imagecreatefrombmp
imagecreatefromgd2
imagecreatefromgd2part
imagecreatefromgd
imagecreatefromgif
imagecreatefromjpeg
imagecreatefrompng
imagecreatefromstring
imagecreatefromtga
imagecreatefromwbmp
imagecreatefromwebp
imagecreatefromxbm
imagecreatefromxpm
*/

        switch ($this -> formatInfo["mime"])
        {
            case 'image/webp':
                $this -> oldImage = imagecreatefromwebp( $this -> fullName );
                break;
            case 'image/gif':
                $this -> oldImage = imagecreatefromgif( $this -> fullName );
                break;
            case 'image/jpeg':
                $this -> oldImage = imagecreatefromjpeg( $this -> fullName );
                break;
            case 'image/png':
                $this -> oldImage = imagecreatefrompng( $this -> fullName );
                break;
        }
    }
    public function scaleImage( $x, $y ){
        $this -> newImage = imagescale( $this -> oldImage, $x, $y );    
        switch ($this -> formatInfo["mime"]) {
            case 'image/webp':
                imagewebp($this -> newImage, $this -> basePath . $this -> path . $this -> picName );
                break;
            case 'image/gif':
                imagegif($this -> newImage, $this -> basePath . $this -> path . $this -> picName );
                break;
            case 'image/jpeg':
                if( $this -> formatInfo["aspectRatio"] < 1 ) {
                    $this -> newImage = imagerotate( $this -> newImage, 270, 0);    
                } else {
                    imagejpeg($this -> newImage, $this -> basePath . $this -> path . $this -> picName );                    
                }
                break;
            case 'image/png':
                imagepng($this -> newImage, $this -> basePath . $this -> path  . $this -> picName );
                break;
        }
            
    }
    public function changeFileFormat( $format ) {
        $r = new \stdClass();
        $this -> getSourceImage();
        $this -> getFileInfo();
        $r -> fileName = "";
        try {            
            switch ( $format ) {
                case 'image/webp':
                    imagewebp($this -> oldImage, getFileWithoutExt( $this -> fullName ) . ".webp" );
                    $r -> fileName = getFileWithoutExt( $this -> fullName ) . ".webp";
                    unlink( $this -> fullName );
                    break;
                case 'image/gif':
                    imagegif( $this -> oldImage, getFileWithoutExt( $this -> fullName ) . ".gif" );
                    $r -> fileName = getFileWithoutExt( $this -> fullName ) . ".gif";
                    unlink( $this -> fullName );
                    break;
                case 'image/jpeg':
                    if( $this -> formatInfo["aspectRatio"] > 1 ) $this -> oldImage = imagerotate( $this -> oldImage, 270, 0 );
                    //imagerotate( $this -> oldImage, 270, 0 );
                    imagejpeg( $this -> oldImage, getFileWithoutExt( $this -> fullName ) . ".jpg" );
                    $r -> fileName = getFileWithoutExt( $this -> fullName ) . ".jpg";
                    unlink( $this -> fullName );
                    break;
                case 'image/png':
                    imagepng( $this -> oldImage, getFileWithoutExt( $this -> fullName ) . ".png" );
                    $r -> fileName = getFileWithoutExt( $this -> fullName ) . ".png";
                    unlink( $this -> fullName );
                    break;
            }
            $r -> fileName = str_replace("../../", "", $r -> fileName );
            $r -> success = true;
            $r -> message = "Das Bild wurde erfolgreich umgewandelt.";
        } catch ( Exception $e ) {
            $r -> success = false;
            $r -> message = "Beim Umwandeln des Bildes ist folgender Fehler aufgetreten: " . $e -> getMessage();           
        }
    return $r;       
    }        
    public function compressImage( $compress = 100 ){
        $r = new \stdClass();
        $this -> getSourceImage();
        $this -> getFileInfo();
        $r-> fileName = $this -> basePath . $this -> path . $this -> picName;
        $this -> newImage = $this -> oldImage;
        try {    
        switch ($this -> formatInfo["mime"]) {
            case 'image/webp':
                imagewebp($this -> newImage, $this -> basePath . $this -> path . $this -> picName, $compress );
                break;
            case 'image/gif':
                imagegif($this -> newImage, $this -> basePath . $this -> path . $this -> picName );
                break;
            case 'image/jpeg':
                if( $this -> formatInfo["aspectRatio"] < 1 ) {
                    $this -> newImage = imagerotate( $this -> newImage, 270, 0);
                }

                imagejpeg($this -> newImage, $this -> basePath . $this -> path . $this -> picName, $compress / 100 );
                break;
            case 'image/png':
                imagepng($this -> newImage, $this -> basePath . $this -> path  . $this -> picName, intval( $compress / 10 ) );
                break;
        }
            $r -> success = true;
            $r -> message = "Das Bild wurde erfolgreich komprimiert.";
        } catch (Exception $e) {
            $r -> success = false;
            $r -> message = "Beim Komprimieren des Bildes ist folgender Fehler aufgetreten: " . $e -> getMessage();               
        }
        return $r;   
    }
    /**
    * @param $ src - ein gültiger Dateispeicherort
    * @param $ dest - ein gültiges Dateiziel
    * @param $ targetWidth - gewünschte Ausgabebreite
    * @param $ targetHeight - gewünschte Ausgabehöhe oder null
    */
    public function createThumbnail($src, $dest, $targetWidth, $targetHeight = null) {
        // 1. Lade das Bild aus dem angegebenen $ src
        // - Überprüfe, ob die Datei tatsächlich vorhanden ist
        // - Überprüfe, ob es sich um einen gültigen Bildtyp handelt
        // - Lade die Bildressource
        // erhalte den Typ des Bildes
        // Wir brauchen den Typ, um den richtigen Loader zu bestimmen
        $src = ROOT . $src;
        $type = exif_imagetype($src);
        // wenn kein gültiger Typ oder kein Handler gefunden wurde -> exit
        if (!$type || !IMAGE_HANDLERS[$type]) {
            return null;
        }
        // lade das Bild mit dem richtigen Loader
        $image = call_user_func(IMAGE_HANDLERS[$type]['load'], $src);
        // kein Bild am angegebenen Ort gefunden -> beenden
        if (!$image) {
            return null;
        }
        // 2. Erstelle eine Miniaturansicht und ändern Sie die Größe des geladenen $ image
        // - Bildabmessungen abrufen
        // - Definiere die Ausgabegröße entsprechend
        // - Erstelle ein Miniaturbild basierend auf dieser Größe
        // - Alpha-Transparenz für GIFs und PNGs festlegen
        // - zeichne das letzte Miniaturbild
        // Originalbildbreite und -höhe abrufen
        $width = imagesx($image);
        $height = imagesy($image);
        // Seitenverhältnis beibehalten, wenn keine Höhe eingestellt ist
        if ($targetHeight == null) {
            // Verhältnis von Breite zu Höhe ermitteln
            $ratio = $width / $height;
            // wenn ist Hochformat
            // Verhältnis zur Skalierungshöhe verwenden, um in das Quadrat zu passen
            if ($width > $height) {
                $targetHeight = floor($targetWidth / $ratio);
            }
            // wenn ist Querformat
            // Verhältnis zur Skalierungsbreite verwenden, um in das Quadrat zu passen
            else {
                $targetHeight = $targetWidth;
                $targetWidth = floor($targetWidth * $ratio);
            }
        }
        // Erstelle eine Kopie basierend auf der berechneten Zielgröße
        $thumbnail = imagecreatetruecolor($targetWidth, $targetHeight);
        // Transparenzoptionen für GIFs und PNGs festlegen
        if ($type == IMAGETYPE_GIF || $type == IMAGETYPE_PNG) {
            // Bild transparent machen
            imagecolortransparent(
                $thumbnail,
                imagecolorallocate($thumbnail, 0, 0, 0)
            );
            // zusätzliche Einstellungen für PNGs
            if ($type == IMAGETYPE_PNG) {
                imagealphablending($thumbnail, false);
                imagesavealpha($thumbnail, true);
            }
        }
        // Kopiere das gesamte Quellbild, um das Bild zu duplizieren und die Größe zu ändern
        imagecopyresampled(
            $thumbnail,
            $image,
            0, 0, 0, 0,
            $targetWidth, $targetHeight,
            $width, $height
        );
        // 3. Speiche das $ thumbnail auf der Festplatte
        // - rufe die richtige Speichermethode auf
        // - Stelle die richtige Qualitätsstufe ein
        // speichere die doppelte Version des Bildes auf der Festplatte
        /*
        return call_user_func(
            IMAGE_HANDLERS[$type]['save'],
            $thumbnail,
            $dest,
            IMAGE_HANDLERS[$type]['quality']
        );
        */
    }

}
?>
