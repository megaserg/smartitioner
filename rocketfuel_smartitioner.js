// Rocket Fuel Smartitioner
// Deterministic Pixel Rotation Script
//
// (C) 2011-2013 BY ROCKET FUEL, INC. ALL RIGHTS RESERVED
// THIS PROGRAM IS PROVIDED UNDER THE TERMS OF THE ATTACHED
// ECLIPSE PUBLIC LICENSE ("AGREEMENT"). ANY USE, REPRODUCTION
// OR DISTRIBUTION OF THE PROGRAM CONSTITUTES RECIPIENT'S
// ACCEPTANCE OF THIS AGREEMENT.
//
// http://www.rocketfuel.com/

if (!window.ROT) {
    window.ROT = {};
    window.PID_COOKIE_NAME = "rotp";
}

(function() {
    var protocol = "https:" == document.location.protocol ? 'https:' : 'http:';
    var cbuster = new Date().getTime() + Math.random().toString().substr(2);

    // ==========================
    // = Start customizing here =
    // ==========================
    ROT.pixels = [
        protocol + '[INSERT_FIRST_COMPETITOR_URL_HERE]',
        // protocol + '//www.example.com/pixel3', // add additional partners as you please
        protocol + '[INSERT_ROCKETFUEL_URL_HERE]' + cbuster // IMPORTANT: no final comma on this list!
    ];
    ROT.weights = [1, 1]; // IMPORTANT: match the number of weights to the number of pixels
    // =========================
    // = Stop customizing here =
    // =========================

    ROT.hc = function(s) {
        var h = 0;
        for (var i = 0; i < s.length; i++) {
            h = h * 31 + s.charCodeAt(i);
        }
        return (h * 71) % 131;
    };

    ROT.save = function(name, value, days) {
        var cv = escape(value);
        if (days !== null) {
            var d = new Date();
            d.setDate(d.getDate() + days);
            cv += "; expires=" + d.toUTCString();
        }
        document.cookie = name + "=" + cv;
    };

    ROT.load = function(name) {
        var x, y, ac = document.cookie.split(";");
        for (var i = 0; i < ac.length; i++) {
            var eq = ac[i].indexOf("=");
            var x = ac[i].substr(0, eq).replace(/^\s+|\s+$/g, ""); // trimmed name
            var y = ac[i].substr(eq + 1); // value
            if (x == name) {
                return unescape(y);
            }
        }
    };

    var pid = parseInt(ROT.load(PID_COOKIE_NAME), 10);

    if (isNaN(pid) || pid < 0 || pid > Object.keys(ROT.pixels).length - 1) {
        // Hash user agent and plugins count to choose a deterministic pid
        var total = 0;
        for (var i = 0; i < ROT.weights.length; i++) {
            total = total + ROT.weights[i];
        }
        var id = navigator.userAgent + navigator.plugins.length;
        var hash = ROT.hc(id) % total;
        total = 0;
        for (var i = 0; i < ROT.weights.length; i++) {
            total = total + ROT.weights[i];
            if (total > hash) {
                pid = i;
                break;
            }
        }
        ROT.save(PID_COOKIE_NAME, pid, 365);
    }

    if (ROT.pixels[pid]) {
        var pxImg = document.createElement('img');
        pxImg.setAttribute('src', ROT.pixels[pid]);
        document.body.insertBefore(pxImg, document.body.childNodes[0]);
    }
})();
