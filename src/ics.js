/* global saveAs, Blob, BlobBuilder, console */
/* exported ics */

var ics = function() {
    'use strict';

    if (navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('MSIE 10') == -1) {
        console.log('Unsupported Browser');
        return;
    }

    var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
    var calendarEvents = [];
    var calendarStart = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0'
    ].join(SEPARATOR);
    var calendarEnd = SEPARATOR + 'END:VCALENDAR';

    return {
        /**
         * Returns events array
         * @return {array} Events
         */
        events: function() {
            return calendarEvents;
        },

        /**
         * Returns calendar
         * @return {string} Calendar in iCalendar format
         */
        calendar: function() {
            return calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
        },

        /**
         * Add event to the calendar
         * @param  {string} subject     Subject/Title of event
         * @param  {string} description Description of event
         * @param  {string} location    Location of event
         * @param  {string} begin       Beginning date of event
         * @param  {string} stop        Ending date of event
         */
        addEvent: function(subject, description, location, begin, stop, organizer, attendees) {
            // I'm not in the mood to make these optional... So they are all required
            if (typeof subject === 'undefined' ||
                typeof description === 'undefined' ||
                typeof location === 'undefined' ||
                typeof begin === 'undefined' ||
                typeof stop === 'undefined'
            ) {
                return null;
            };

            var icsDateString = "";
            if (begin && begin._isAMomentObject && begin.isValid()) {
                icsDateString = begin.format("YYYYMMDDTHHmmssZZ");
            } else {
                var momentStartDate = moment(begin, true);
                if (momentStartDate.isValid()) {
                    icsDateString = momentStartDate.format("YYYYMMDDTHHmmssZZ");
                }
            }
            var icsEndDateString = "";
            if (stop && stop._isAMomentObject && stop.isValid()) {
                icsEndDateString = stop.format("YYYYMMDDTHHmmssZZ");
            } else {
                var momentEndDate = moment(stop, true);
                if (momentEndDate.isValid()) {
                    icsEndDateString = momentEndDate.format("YYYYMMDDTHHmmssZZ");
                }
            }

            var calendarEvent = [
                'BEGIN:VEVENT',
                'CLASS:PUBLIC'
            ];
            var organizerString = "ORGANIZER;CN=" + organizer.Name + " ;RSVP=TRUE:" + organizer.Email;
            calendarEvent.push(organizerString);

            if (attendees.length > 0) {
                attendees.forEach(function(attendee) {
                    if (attendee.Email != organizer.Email && attendee.Email != undefined && attendee.Email != 'null') {
                        calendarEvent.push("ATTENDEE;CN=" + attendee.Name + " ;RSVP=TRUE:" + attendee.Email);
                    }
                }, this);
            }

            calendarEvent.push('DESCRIPTION:' + description || "");
            calendarEvent.push('DTSTART;VALUE=DATE:' + icsDateString);
            calendarEvent.push('DTEND;VALUE=DATE:' + icsEndDateString);
            calendarEvent.push('LOCATION:' + location || "");
            calendarEvent.push('SUMMARY;LANGUAGE=nb-no:' + subject || "Møte");
            calendarEvent.push('TRANSP:TRANSPARENT');
            calendarEvent.push('END:VEVENT');

            var calendarEventString = "";
            for (var i = 0; i < calendarEvent.length; i++) {
                if (calendarEvent[i] != "") calendarEventString += calendarEvent[i] + SEPARATOR;
            }
            calendarEvents.push(calendarEventString);
            return calendarEvent;
        },
        download: function(filename, ext) {
            if (calendarEvents.length < 1) {
                return null;
            }

            ext = (typeof ext !== 'undefined') ? ext : '.ics';
            filename = (typeof filename !== 'undefined') ? filename : 'calendar';
            var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;

            var blob;
            try {
                //Supported by Chrome, FF and IE>10
                blob = new Blob([calendar]);
            } catch (e) {
                // The BlobBuilder API has been deprecated in favour of Blob, but older
                // browsers don't know about the Blob constructor
                // IE10 also supports BlobBuilder, but since the `Blob` constructor
                //  also works, there's no need to add `MSBlobBuilder`.
                var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
                var bb = new BlobBuilder();
                bb.append(calendar);
                blob = bb.getBlob('text/x-vCalendar;charset=' + document.characterSet);
            }

            saveAs(blob, filename + ext);
            return calendar;
        }
    };
};
