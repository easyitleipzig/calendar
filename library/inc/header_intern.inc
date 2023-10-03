<div id="navBlender"></div>
<header id="header">
    <div id="header_big">
        <div onClick='location.href = "intern.php"' style="cursor: pointer">
            <img src="library/images/logo_regenbogen.svg" id="picLogoBig" alt="Logo Suchtselbsthilfe Regenbogen Leipzig" title="Homepage Suchtselbsthilfe Regenbogen Leipzig">
                <div id="extern_logo">
                <h1 id="logo_header_big">REGENBOGEN</h1>
                <h2 id="logo_description_big">SUCHTSELBSTHILFE LEIPZIG</h2>
            </div>
    </div>
        <div id="divSearch">
            <input id="searchtext_1" type="text" placeholder="Suchen...">
            <input id="searchbutton_1" type="button" value="&#128269;">
        
        </div>
        <div id="messages_news">
            <div id="count_mess_news"></div>
        </div>
        <div class="con-tooltip left">
            <img 
        <?php /*
        if( $_SESSION["role_id"] == 1 || $_SESSION["role_id"] == 2 ) {
                    echo ' src="library/icons/head_1.svg"'; 
                } elseif( $_SESSION["role_id"] == 13 )  {
                    echo ' src="library/icons/head_2.svg"'; 
                } elseif( $_SESSION["role_id"] == 15 )  {
                    echo ' src="library/icons/head_3.svg"'; 
                } else {
                    echo ' src="library/icons/head.svg" '; 
                }
        */
        switch( $_SESSION["role_id"] ) {
            case 1:
            case 2:
                    echo ' src="library/icons/head_1.svg"'; 
            break;
            case 13:
                    echo ' src="library/icons/head_2.svg"'; 
            break;
            case 15:
                    echo ' src="library/icons/head_3.svg"'; 
            break;
            default:
                    echo ' src="library/icons/head.svg"'; 
            break;
        }
            ?>
             id="disconnect_button" alt="Abmeldung Suchtselbsthilfe Regenbogen Leipzig" title="Abmeldung Suchtselbsthilfe Regenbogen Leipzig">
        <span id="short_name" <?php
                                if( strlen( $_SESSION["letter"] ) == 2 ) {
                                    print_r( 'data-countletters="2" ');
                                    //print_r( 'style="cursor: pointer; position: relative; left: -7px; top: -10px; color: yellow; font-weight: bold;"' );
                                } else {
                                    print_r( 'data-countletters="1" ');
                                    //print_r( 'style="cursor: pointer; position: relative; left: 2px; top: -10px; color: yellow; font-weight: bold;"' );
                                }    
                              ?>
        
        ><?php print_r( $_SESSION["letter"] ); ?></span>
            <div class="tooltip ">
              <p>
              <?php echo( $_SESSION["firstname"] . " " . $_SESSION["lastname"] );  ?>
              </p>
            </div>
        
        </div>
        <!--
        </div>
        -->
    </div>
            <div id="profile" style="display: none;">
                <input type="button" id="profile_show" value="Profil">
                <input type="button" id="abstinencard_show" value="Abstinenzkarte">
            <?php
            // Admin, Webmaster, Moderator and Bibliothekar
                if( $_SESSION["role_id"] == 1 || $_SESSION["role_id"] == 2 || $_SESSION["role_id"] == 8 || $_SESSION["role_id"] == 9 || $_SESSION["role_id"] == 13 ) {
                    echo '<input type="button" id="admin_show" value="Administration">'; 
                }
            ?>
                <input type="button" id="profile_disconnect" value="Abmelden">
                <div id="closeProfile" style="background-color: #0c97e2; cursor: pointer">&nbsp;</div>
            </div>
    <div id="header_small">
        <div><a href="tel: +493414442322"><img src="library/icons/phone_black.svg" id="phone_small"></a></div>
        <div><a href="mailto: info@suchtselbsthilfe-regenbogen.de"><img src="library/icons/email_black.svg" id="mail_small" title="Logo Suchteselbsthilfe „Regenbogen” Leipzig" title="Suchteselbsthilfe „Regenbogen”"></a></div>
        <div id="div_logo_small" onclick='location.href = "intern.php"'>
            <img src="library/images/logo_regenbogen.svg" id="logo_small">
            <div id="logo_small_text_1">REGENBOGEN</div>
            <div id="logo_small_text_2">Suchtselbsthilfe Leipzig</div>
        </div>
        <div><img src="library/icons/search_black.svg" id="search_small"></div>
        <div id="messages_news_small">
            <div id="count_mess_news_small"></div>
        </div>
        <div id="">
                    <img 
        <?php if( $_SESSION["role_id"] == 1 || $_SESSION["role_id"] == 2 ) {
                echo ' src="library/icons/head_small_red.svg"'; 
            } else {
                if( $_SESSION["role_id"] == 13 ) {
                    echo ' src="library/icons/head_small_green.svg"'; 
                } else {
                    echo ' src="library/icons/head_small_blue.svg" '; 
                }                
            }
            ?>
             id="disconnect_button_phone" alt="Abmeldung Suchtselbsthilfe Regenbogen Leipzig" title="Abmeldung Suchtselbsthilfe Regenbogen Leipzig">
             <!--
            <div id="count_messages_phone" title="Meldungen und News">&#9711;</div>
            -->
        <div id="profile_phone" style="display: none;">
            <input type="button" id="profile_show_phone" value="Profil">
            <input type="button" id="abstinencecard_show_phone" value="Abstinenzkarte">
        <?php
        // Admin, Webmaster, Moderator, Bibliothekar and Wandelhalle
            if( $_SESSION["role_id"] == 1 || $_SESSION["role_id"] == 2 || $_SESSION["role_id"] == 8 || $_SESSION["role_id"] == 9 || $_SESSION["role_id"] == 13 ) {
                echo '<input type="button" id="admin_show_phone" value="Administration">'; 
            }
        ?>
            <input type="button" id="profile_disconnect_phone" value="Abmelden">
            <div id="closeProfile_phone" style="background-color: #0c97e2; cursor: pointer">&nbsp;</div>
        </div>
        </div>
    </div>    
</header>
<div id="navSpacer"></div>
