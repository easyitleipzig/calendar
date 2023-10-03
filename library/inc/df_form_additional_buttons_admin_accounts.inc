<?php
$button = new \stdClass();
$additionalButtons = [];
$button -> id= '_additional_button_password';
$button -> class = 'cbKey recButton';
$button -> value = '&nbsp;';
$button -> title = "";
array_push( $additionalButtons,  $button);
$button = new \stdClass();
$button -> id= '_additional_button_showPassword';
$button -> class = 'cbEye recButton';
$button -> value = ' ';
$button -> title = "";
array_push( $additionalButtons,  $button);
$button = new \stdClass();
$button -> id= '_additional_button_sendActivationEmail';
$button -> class = 'cbEmail recButton';
$button -> value = ' ';
$button -> title = "";
array_push( $additionalButtons,  $button);
?>