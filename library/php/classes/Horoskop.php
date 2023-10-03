<?php
class Horoskop {
    
    public function __construct( $birthDay ) {
        $ch = curl_init();

        // set url
        curl_setopt($ch, CURLOPT_URL, "https://radioherzclub.com/horoskop/horoskop.php?zeichan=1&dekade=1");

        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        // $output contains the output string
        //$output = curl_exec($ch);
        var_dump( curl_exec($ch) );
        // close curl resource to free up system resources
        curl_close($ch);                
    } 
}  
function cURLcheckBasicFunctions()
{
  if( !function_exists("curl_init") &&
      !function_exists("curl_setopt") &&
      !function_exists("curl_exec") &&
      !function_exists("curl_close") ) return false;
  else return true;
}

/*
* Returns string status information.
* Can be changed to int or bool return types.
*/
function cURLdownload($url, $file)
{
  if( !cURLcheckBasicFunctions() ) return "UNAVAILABLE: cURL Basic Functions";
  $ch = curl_init();
  if($ch)
  {
    $fp = fopen($file, "w");
    if($fp)
    {
      if( !curl_setopt($ch, CURLOPT_URL, $url) )
      {
        fclose($fp); // to match fopen()
        curl_close($ch); // to match curl_init()
        return "FAIL: curl_setopt(CURLOPT_URL)";
      }
      if( !curl_setopt($ch, CURLOPT_FILE, $fp) ) return "FAIL: curl_setopt(CURLOPT_FILE)";
      if( !curl_setopt($ch, CURLOPT_HEADER, 0) ) return "FAIL: curl_setopt(CURLOPT_HEADER)";
      if( !curl_exec($ch) ) return "FAIL: curl_exec()";
      curl_close($ch);
      fclose($fp);
      return "SUCCESS: $file [$url]";
    }
    else return "FAIL: fopen()";
  }
  else return "FAIL: curl_init()";
}

// Download from 'example.com' to 'example.txt'
echo cURLdownload("https://www.viversum.de/tageshoroskop#schuetze", "example.txt");

//$i = new Horoskop( "1964-12-06" );
$a=0;
?>
