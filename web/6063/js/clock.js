(function (window, document) {
    'use strict';

    function Clock(option) {
        this.id = option.id;
        this.option = option;
        this.clock = null;
        this.ctx = null;
        this.clockbg = null;
        this.ctxbg = null;
        this.interval = null;
        this.destroy();
        this.init();
    }

    if(!window.Clock) {
        window.Clock = Clock;
    }

    /**
     * 初始化
     */
    Clock.prototype.init = function () {
        var T = this;
        this.createContainer();
        this.drawBackground();
        this.draw();
        this.interval = setInterval(function () {
            T.draw();
        }, 100);
    }

    /**
     * 销毁时钟
     */
    Clock.prototype.destroy = function () {
        if(this.clock) {
            this.clock.parentNode.removeChild(this.clock);
            this.clock = null;
        }
        if(this.clockbg) {
            this.clockbg.parentNode.removeChild(this.clockbg);
            this.clockbg = null;
        }

        window.clearInterval(this.interval);
    }

    /**
     * 创建容器
     */
    Clock.prototype.createContainer = function () {
        this.createDoms();
        this.initSize();
    }

    /**
     * 绘制背景
     */
    Clock.prototype.drawBackground = function () {
        var r = this.r,
            ctxbg = this.ctxbg;
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

    /**
     * 绘制完整的时钟（包括表针、日期、星期等）
     */
    Clock.prototype.draw = function () {
        var now = new Date();

        this.preDraw();
        this.drawFont(now);
        this.drawHour(now);
        this.drawMinute(now);
        this.drawSecond(now);
        this.drawDot();
    }

    /**
     * 创建相关的DOM元素
     */
    Clock.prototype.createDoms = function () {
        var container = document.getElementById(this.id),
            clockbg = document.createElement('canvas'),
            clock = document.createElement('canvas');
        
        this.width = container.offsetWidth;
        this.r = this.width / 2;
        clockbg.id = 'clockbg';
        clock.id = 'clock';
        container.style.position = 'relative';
        clockbg.style.position = clock.style.position = 'absolute';
        container.style.height = this.width + 'px';   // 处理成方形
        clockbg.style.left = clockbg.style.top = clock.style.left = clock.style.top = 0;
        clockbg.style.width = clockbg.style.height = clock.style.width = clock.style.height = this.width + 'px';
        container.appendChild(clockbg);
        container.appendChild(clock);

        this.clock = clock;
        this.clockbg = clockbg;
    }

    /**
     * 初始化大小
     */
    Clock.prototype.initSize = function () {
        var r = this.r;

        this.ctxbg = this.clockbg.getContext('2d'),
            this.ctx = this.clock.getContext('2d'),
            this.clockbg.width = 2 * r;
        this.clockbg.height = 2 * r;
        this.clock.width = 2 * r;
        this.clock.height = 2 * r;
    }

    /**
     * 绘制日期和星期几
     */
    Clock.prototype.drawFont = function (date) {
        var ctx = this.ctx,
            r = this.r,
            monthArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
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

    /**
     * 绘制时针
     */
    Clock.prototype.drawHour = function (date) {
        var ctx = this.ctx,
            r = this.r,
            hour = date.getHours(),
            minute = date.getMinutes(),
            rad = 2 * Math.PI / 12 * hour,
            mrad = 2 * Math.PI / 12 / 60 * minute;
        ctx.save();
        ctx.beginPath();

        ctx.rotate(rad + mrad);
        ctx.lineWidth = r / 20;
        ctx.lineCap = 'round';
        ctx.moveTo(0, r / 10);
        ctx.lineTo(0, -r / 2);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * 绘制分针
     */
    Clock.prototype.drawMinute = function (date) {
        var ctx = this.ctx,
            r = this.r,
            minute = date.getMinutes(),
            second = date.getSeconds(),
            rad = 2 * Math.PI / 60 * minute,
            srad = 2 * Math.PI / 60 / 60 * second;
        ctx.save();
        ctx.beginPath();

        ctx.rotate(rad + srad);
        ctx.lineWidth = r / 33;
        ctx.lineCap = 'round';
        ctx.moveTo(0, r / 10);
        ctx.lineTo(0, -r / 3 * 2);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * 绘制秒针
     */
    Clock.prototype.drawSecond = function (date) {
        var ctx = this.ctx,
            r = this.r,
            second = date.getSeconds(),
            millisecond = date.getMilliseconds(),
            rad = 2 * Math.PI / 60 * ( second + millisecond /1000);

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = '#f00';

        ctx.rotate(rad);
        ctx.moveTo(-r / 50, r / 5);
        ctx.lineTo(r / 50, r / 5);
        ctx.lineTo(r / 100, -r / 5 * 4);
        ctx.lineTo(-r / 100, -r / 5 * 4);
        ctx.fill();
        ctx.restore();
    }

    /**
     * 绘制表针的交汇固定点
     */
    Clock.prototype.drawDot = function drawDot() {
        this.ctx.beginPath();
        this.ctx.fillStyle = '#fff';
        this.ctx.arc(0, 0, this.r / 33, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.restore();
    }

    Clock.prototype.preDraw = function () {
        this.ctx.clearRect(0, 0, this.width, this.width);
        this.ctx.save();
        this.ctx.translate(this.r, this.r);
    }

})(window, document);