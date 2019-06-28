import * as $ from 'jquery';
let keys: Array<string> = [];
let konami = 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a';
let trigger = $(document).keydown(function (e) {
    keys.push(e.key);
    if (keys.toString().indexOf(konami) >= 0) {
        keys = [];
        if(location.href.replace(/https?:\/\//i, "") === "revision-proposition.cerp-rrm.com/#/eggy"){
            let egg = "<div class='egg egg--rolling-stone'>";
            $('body').prepend(egg);

            window.setTimeout(function () {
                $('.egg').remove();
            }, 3000);
        }
    }
});