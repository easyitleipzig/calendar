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
    public $fileName;
    public $formatInfo;
    private $currentDimensions;
    private $previewPath;
    private $preservePreviewFormat;
    private $size;
    private $oldImage;
    private $newImage;
    public function __construct( $picName, $basepath = "", $path = "", $previewPath = "preview/", $preservePreviewFormat = "false", $size = 50 ) {
        $this -> picName = $picName;
        $this -> basePath = ROOT . $basepath;
        $this -> path = $path;
        $this -> previewPath = $previewPath;
        $this -> preservePreviewFormat = $preservePreviewFormat;
        $this -> getFileInfo();
        $this -> getSourceImage( $this -> basePath . $this -> path . $this -> picName );
        $tmp = explode( ".", $this -> picName);
        $l = count( $tmp ) - 1;
        $i = 0;
        $this -> fileName = "";
        while( $i < $l ) {
            $this -> fileName .= $tmp[$i] . ".";
            $i += 1;
        }
        $this -> size = $size;       
    }

    public function getFileInfo() {
        $this -> formatInfo = getimagesize(  $this -> basePath . $this -> path . $this -> picName );        
    }
    protected function getSourceImage( $fileName) {        
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
                $this -> oldImage = imagecreatefromwebp( $fileName );
                break;
            case 'image/gif':
                $this -> oldImage = imagecreatefromgif( $fileName );
                break;
            case 'image/jpeg':
                $this -> oldImage = imagecreatefromjpeg( $fileName );
                break;
            case 'image/png':
                $this -> oldImage = imagecreatefrompng( $fileName );
                break;
        }
    }
    public function transformPic( $type, $previewPath = "", $quality = 100 ){
        $result = new \stdClass();
        switch( $type ) {
            case "image/gif":
                imagegif( $this -> oldImage, $this -> basePath . $this -> path . $previewPath . $this -> fileName . "gif" );
            break;
            case "image/jpeg":
                imagejpeg( $this -> oldImage, $this -> basePath . $this -> path . $previewPath . $this -> fileName . "jpg", 100 );            
            break;
            case "image/png":
                if( $this -> oldImage !== false ) {                    
                    imagepng( $this -> oldImage, $this -> basePath . $this -> path . $previewPath . $this -> fileName . "png", 9 );
                }
            break;
            case "image/webp":
                imagewebp( $this -> oldImage, $this -> basePath . $this -> path . $previewPath . $this -> fileName . "webp" );            
            break;
        }
        $result -> success = true;
        $result -> message = "Das Bild wurde erfolgreich umgewandelt.";
        return $result;
    }
    public function createThumbNail() {
        $targetHeight = intval( $this -> size );
        $targetWidth = $targetHeight;
        $width = imagesx( $this -> oldImage );
        $height = imagesy( $this -> oldImage );
        // Seitenverhältnis beibehalten, wenn keine Höhe eingestellt ist
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
        if( $targetWidth !== 0 && $targetHeight !== 0 ) {
            $this -> oldImage = imagescale(  $this -> oldImage, $targetWidth, $targetHeight );
            if( $this -> preservePreviewFormat === "false" ) {
                $exif = "image/webp";    
            } else {
                $exif = $this -> formatInfo["mime"];
            }
            $this -> transformPic( $exif, $this -> previewPath );            
        }
    }
    public function rotatePic( $type ){
        $result = new \stdClass();
        $this -> oldImage = imagerotate( $this -> oldImage, intval( $type ), 0 );
        switch( $this -> formatInfo["mime"] ) {
            case "image/gif":
                imagegif( $this -> oldImage, $this -> basePath . $this -> path . $this -> picName );
            break;
            case "image/jpeg":
                imagejpeg( $this -> oldImage, $this -> basePath . $this -> path . $this -> picName );            
            break;
            case "image/png":
                imagepng( $this -> oldImage, $this -> basePath . $this -> path . picName, 0 );           
            break;
            case "image/webp":
                imagewebp( $this -> oldImage, $this -> basePath . $this -> path . picName );            
            break;
        }
        $result -> success = true;
        $result -> message = "Das Bild wurde erfolgreich umgewandelt.";
        return $result;
    }
    public function resizePic( $width, $height ) {
        $result = new \stdClass();
        try {
            $this -> oldImage = imagescale(  $this -> oldImage, $width, $height );
            $this -> transformPic( $this -> formatInfo["mime"], "" );            
            $result -> success = true;
            $result -> message = "Das Bild wurde erfolgreich umgewandelt.";
        } catch ( Exception $e ) {
            $result -> success = false;
            $result -> message = "Beim Umwandeln des Bildes ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $result;
    }
}                                   
?>
