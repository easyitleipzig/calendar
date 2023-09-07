<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <title>My Event Calendar</title>

    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="manifest" href="library/ressources/site.webmanifest">
    <link rel="stylesheet" href="global.css">
    <link rel="stylesheet" href="library/css/EventCalendar.css">
    <style type="text/css">
        #dDia { background-color:lightblue }
    </style>
</head>
<body>
<div class="row">

    <div id="divCal" class="col"></div>

</div>

<script src="library/javascript/no_jquery.js"></script>
<script src="library/javascript/easyit_helper_neu.js"></script>
<script src="library/javascript/interact.js"></script>
<script src="library/javascript/menu_calendar.js"></script>
<script src="library/javascript/DialogNewInteract.js"></script>
<script src="library/javascript/EventCalendar.js"></script>
<script src="library/javascript/Calendar.js"></script>
<script src="library/javascript/init_calendar.js"></script>
<script>
var cal = new Calendar({pVar: "cal", evCalId: "#divCal" } ), dDia1;
var dDia1 = new DialogNew( { dVar: "dDia1", modal: false, canMove: true, hasInfo: false, hasHelp: false, hasMin: true, hasMax: true, hasClose: true, hasSticky: true, hasHelp: true, innerHTML: TEST_INNER_HTML } );
docReady(function() {
    init();
    dDia1.show();
})
</script>
</body>
</html>
