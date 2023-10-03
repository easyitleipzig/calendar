<div id="message_news" style="display: none;">
    <div id="message_news_id" style="display: none;"></div>
    <div id="message_news_dsPointer" style="display: none;">0</div>
    <div>
    <select id="message_news_type">
        <option value="1">Meldungen</option>
        <option value="2">News</option>
    </select>
    </div>
    <div id="message_news_title" style="font-weight: bold"></div>
    <div id="divIdFromRole"><div class="description">von Gruppe</div><div id="message_news_fromRole"></div></div>
    <div id="divIdFromUser"><div class="description">von Nutzer</div><div id="message_news_fromUser"></div></div>
    <div><div class="description">gelesen</div><input type="checkbox" id="message_news_isRead" checked></div>
    <div><div class="description">Datum/Uhrzeit</div><div id="message_news_currDateTime"></div></div>
    <div><div class="message_news_description">Inhalt</div></div>
    <div id="message_news_content"></div>
</div>
<iframe id="message_news_help" src="help/help_messages_news.php" style="display: none;">
</iframe>
<script>
//dM = new DialogNew( {dVar: "dM", id: "message_news" } );
</script>