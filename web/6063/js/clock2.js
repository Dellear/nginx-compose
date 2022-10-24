
function init(option) { // eslint-disable-line
    'use strict';
    var container = document.getElementById('container'),
        clockbg = document.createElement('canvas'),
        clock = document.createElement('canvas');
    clockbg.id = 'clockbg';
    clock.id = 'clock';
    container.style.position = 'relative';
    clockbg.style.position = clock.style.position = 'absolute';
    container.style.width = container.style.height = option.width + 'px';
    clockbg.style.left = clockbg.style.top = clock.style.left = clock.style.top = 0;
    clockbg.style.width = clockbg.style.height = clock.style.width = clock.style.height = option.width + 'px';
    container.appendChild(clockbg);
    container.appendChild(clock);

    var ctxbg = clockbg.getContext('2d'),
        ctx = clock.getContext('2d'),
        r = option.width / 2; //r=100
    clockbg.width = clockbg.height = clock.width = clock.height = 2 * r;

    function drawBackground() {
        ctxbg.translate(r, r);
        ctxbg.lineWidth = r / 15;
        ctxbg.beginPath();
        ctxbg.arc(0, 0, r / 20 * 19, 0, 2 * Math.PI, false);
        ctxbg.stroke();

        var hourNumbers = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
        hourNumbers.forEach(function (number, i) {
            ctxbg.font = r / 7 + 'px Arial';
            ctxbg.textAlign = 'center';
            ctxbg.textBaseline = 'middle';
            var rad = 2 * Math.PI / 12 * i,
                x = Math.cos(rad) * (r / 4 * 3),
                y = Math.sin(rad) * (r / 4 * 3);
            ctxbg.fillText(number, x, y);
        });

        for (var i = 0; i < 60; i++) {
            var rad = 2 * Math.PI / 60 * i,
                x = Math.cos(rad) * (r / 7 * 6),
                y = Math.sin(rad) * (r / 7 * 6),
                dotr = r / 50;
            ctxbg.beginPath();
            if (i % 5 === 0) {
                ctxbg.fillStyle = '#000';
            } else {
                ctxbg.fillStyle = '#ccc';
            }
            ctxbg.arc(x, y, dotr, 0, 2 * Math.PI, false);
            ctxbg.fill();
        }
    }

    function drawFont(date) {
        var monthArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            year = date.getFullYear(),
            month = monthArr[date.getMonth()],
            day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
            week = weekArr[date.getDay()];
        ctx.save();
        ctx.font = 'bold ' + r / 10 + 'px Arial Black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(year + '-' + month + '-' + day, 0, r / 3);
        ctx.fillText(week, 0, r / 2);
        ctx.restore();
    }

    function drawHour(date) {
        var hour = date.getHours(),
            minute = date.getMinutes();
        ctx.save();
        ctx.beginPath();
        var rad = 2 * Math.PI / 12 * hour,
            mrad = 2 * Math.PI / 12 / 60 * minute;
        ctx.rotate(rad + mrad);
        ctx.lineWidth = r / 20;
        ctx.lineCap = 'round';
        ctx.moveTo(0, r / 10);
        ctx.lineTo(0, -r / 2);
        ctx.stroke();
        ctx.restore();
    }

    function drawMinute(date) {
        var minute = date.getMinutes(),
            second = date.getSeconds();
        ctx.save();
        ctx.beginPath();
        var rad = 2 * Math.PI / 60 * minute,
            srad = 2 * Math.PI / 60 / 60 * second;
        ctx.rotate(rad + srad);
        ctx.lineWidth = r / 33;
        ctx.lineCap = 'round';
        ctx.moveTo(0, r / 10);
        ctx.lineTo(0, -r / 3 * 2);
        ctx.stroke();
        ctx.restore();
    }

    function drawSecond(date) {
        var second = date.getSeconds();
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = '#f00';
        var rad = 2 * Math.PI / 60 * second;
        ctx.rotate(rad);
        ctx.moveTo(-r / 50, r / 5);
        ctx.lineTo(r / 50, r / 5);
        ctx.lineTo(r / 100, -r / 5 * 4);
        ctx.lineTo(-r / 100, -r / 5 * 4);
        ctx.fill();
        ctx.restore();
    }

    function drawDot() {
        ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.arc(0, 0, r / 33, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
    }

    function draw() {
        var now = new Date();
        ctx.clearRect(0, 0, 2 * r, 2 * r);
        ctx.save();
        ctx.translate(r, r);
        drawFont(now);
        drawHour(now);
        drawMinute(now);
        drawSecond(now);
        drawDot();
    }

    drawBackground();
    draw();
    setInterval(function () {
        draw();
    }, 1000);
}
