// javascript
/* calendar definition 

    let ec = new EventCalendar(document.getElementById('ec'), {         // ec is the id of div, where the calendar will be placed
        view: 'dayGridMonth',   // dayGridMonth,timeGridWeek,timeGridDay,listWeek, resourceTimeGridWeek
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek, resourceTimeGridWeek, resourceTimeGridDay'
        },
        buttonText: function (texts) {
            texts.resourceTimeGridWeek = 'Res. Woche';
            texts.resourceTimeGridDay = 'Res. Tag';
// dayGridMonth: 'month', listDay: 'list', listMonth: 'list', listWeek: 'list', listYear: 'list', resourceTimeGridDay: 'day', resourceTimeGridWeek: 'week', timeGridDay: 'day'
            texts.dayGridMonth = "Monat";
            texts.timeGridWeek = 'Woche';
            texts.timeGridDay = "Tag";
            texts.listWeek = "Liste";
            texts.today = "heute";
            return texts;
        },
        resources: [
            {id: 1, title: 'Resource A'},
            {id: 2, title: 'Resource B'}
        ],
        scrollTime: '09:00:00',
        events: createEvents(),
        views: {
            timeGridWeek: {pointer: true},
            resourceTimeGridWeek: {pointer: true}
        },
        // options
        displayEventEnd: true,
        dayMaxEvents: true,
        nowIndicator: true,
        selectable: true,
        firstDay: 1,                                // 0 -> sunday, 1-> monday, etc.
        date: new Date(),                           // selected start date
        editable: true,
        // events
        eventClick: onEventClick,
        eventDrop: dropEvent,
        dateClick: onDateClick,
        eventResizeStop: onEventResizeStop,
        eventMouseEnter: onEventMouseEnter,
        /*### eventDidMount
        - Type `function`
        - Default `undefined`

        Callback function that is triggered right after the element has been added to the DOM. If the event data changes, this is not called again.


        eventDidMount: onEventDidMount,    
    });

	end calendar definition

*/
/* functions for calendar events

    function onEventDidMount( info ){
        console.log( info.event );
    }
    aggregateEvents();
    function aggregateEvents( data ) {
        ec.getEventById('{generated-5}').extendedProps.test = 1;
        console.log( ec.getEventById( '{generated-5}' ) );
    }
    function dropEvent( ev ) {
        console.log( ev.event );
    }
    function onEventClick( ev ) {
        console.log( ev );
    }
    function onDateClick( ev ) {
        console.log( ev );
    }
    function onEventResizeStop( ev ) {
        console.log( ev );
    }
    function onEventMouseEnter( ev ) {
        console.log( ev );
        ev.jsEvent.preventDefault();
    }
    function initClasses( args ) {
        console.log( args );    
    }
    function createEvents() {

        let days = [];
        for (let i = -4; i < 30; ++i) {
            let day = new Date();
            let diff = i - day.getDay();
            day.setDate(day.getDate() + diff);
            days[i] = day.getFullYear() + "-" + _pad(day.getMonth()+1) + "-" + _pad(day.getDate());
        }
        return [
            // day 0 is today
            // time is greenwich time
            {start: days[-2] + " 00:00", end: days[-2] + " 09:00", resourceId: 1, display: "auto"},
            {start: days[1] + " 12:00", end: days[1] + " 14:00", resourceId: 2, display: "background"},
            {start: days[2] + " 17:00", end: days[2] + " 24:00", resourceId: 1, display: "background"},
            {start: days[0] + " 10:00", end: days[0] + " 14:00", resourceId: 1, title: "The calendar can display background and regular events", color: "#FE6B64"},
            {start: days[1] + " 16:00", end: days[2] + " 08:00", resourceId: 2, title: "An event may span to another day", color: "#B29DD9"},
            {start: days[2] + " 09:00", end: days[2] + " 13:00", resourceId: 2, title: "Events can be assigned to resources and the calendar has the resources view built-in", color: "#779ECB"},
            //{start: days[3] + " 14:00", end: days[3] + " 20:00", resourceId: 1, title: {html: "You have complete control over the <i><b>1234</b></i> of events…"}, color: "#FE6B64"},
            {start: days[1] + " 14:00", end: days[1] + " 20:00", resourceId: 2, title: {html: "<span class='ev' id='1234'>1234</span>Dies ist ein Testevent"}, color: "#779ECB" },
            {start: days[3] + " 15:00", end: days[3] + " 18:00", resourceId: 1, title: "Overlapping events are positioned properly", color: "#779ECB"},
            {start: days[5] + " 10:00", end: days[5] + " 16:00", resourceId: 2, title: {html: "You have complete control over the <i><b>display</b></i> of events…"}, color: "#779ECB"},
            {start: days[5] + " 14:00", end: days[5] + " 19:00", resourceId: 2, title: "…and you can drag and drop the events!", color: "#FE6B64"},
            {start: days[5] + " 18:00", end: days[5] + " 21:00", resourceId: 2, title: "", color: "#B29DD9"},
            {start: days[1], end: days[3], resourceId: 1, title: "All-day events can be displayed at the top", color: "#B29DD9", allDay: true}
        ];
        aggregateEvents();
    }

    function _pad(num) {
        let norm = Math.floor(Math.abs(num));
        return (norm < 10 ? '0' : '') + norm;
    }

	end functions

*/
/* add an event
    ec.addEvent( {
    "allDay": false,
    "start": "2023-09-04T14:00:00.000Z",
    "end": "2023-09-05T06:00:00.000Z",
    "title":{html: "<span id='ev_1234'><b>test</b></span>" },
    "display": "auto",
    "extendedProps": {
                "test": 1,
                "id": 1234,
                "participate": true,
                ...
    },
    "backgroundColor": "#B29DD9",
    } )
*/ 
const init = function() {
    cal.evCal.setOption( "datesSet", function ( info ) {
        window[ nj("*[data-dvar][data-ei_calendar]").atr("data-dvar") ].getDaysForView( info )
    });
}