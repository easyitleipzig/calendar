<div id="connect_window">
	<form action="" method="post" name="connect_form" id="connect_form" target="_self">
	  <label>E-Mail</label>
	    <input type="text" name="u" id="u" value="" autocomplete="username" tabindex="1">
	  <label>Passwort</label>
	    <input type="password" name="p" id="p" value="" autocomplete="current-password" tabindex="2">
      <input type="text" name="r" id="r" value="<?php echo $role_id; ?>" style="display: none;">
	  <a id="link_register" href="register.php">Registrieren</a>
	  <a id="link_get_new_pw" href="#">Passwort vergessen</a>
      <input type="text" name="t" id="t" value="" style="display: none;">    
	</form>
</div>