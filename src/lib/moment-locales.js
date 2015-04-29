"use strict";

var moment = require("moment");

moment.locale("en-twitter", {
    relativeTime: {
        future : "in %s",
        past   : "%s ago",
        s      : "1m",
        m      : "1m",
        mm     : "%dm",
        h      : "1h",
        hh     : "%dh",
        d      : "1d",
        dd     : "%dd",
        M      : "1m",
        MM     : "%dm",
        y      : "1y",
        yy     : "%dy"
    }
});
