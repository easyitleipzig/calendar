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
    <link rel="stylesheet" href="library/css/global.css">
    <link rel="stylesheet" href="library/css/EventCalendar.css">
    <style type="text/css">
        #dDia { background-color:lightblue }
        .fc-1 {
            background-color: orange;
            color: white;
        }
    </style>
</head>
<body>
<div class="row">

    <div id="divCal" class="col"></div>

</div>

<script src="library/javascript/no_jquery.js"></script>
<script src="library/javascript/easyit_helper_neu.js"></script>
<script src="library/javascript/menu_calendar.js"></script>
<script src="library/javascript/DropResize.js"></script>
<script src="library/javascript/DialogDR.js"></script>
<script src="library/javascript/EventCalendar.js"></script>
<script src="library/javascript/Calendar.js"></script>
<script src="library/javascript/init_calendar.js"></script>
<script>
var cal = new Calendar({pVar: "cal", evCalId: "#divCal" } );
docReady(function() {
    init();
});
</script>
</body>
</html>
