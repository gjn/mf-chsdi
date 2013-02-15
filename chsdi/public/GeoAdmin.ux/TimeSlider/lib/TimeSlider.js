/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 */

Ext.TimeSlider = Ext.extend(Ext.Slider, {

    doSnap: function(value) {
        if (this.increments) {
            return this.getClosestIncrement(value);
        }
    },
    getClosestIncrement: function(value) {
        var lo,
        hi;
        if (value == 0) {
            return this.increments[0];
        }
        if (value < this.increments[0]) {
            return this.increments[0];
        }
        if (value > this.increments[this.increments.length]) {
            return this.increments[this.increments.length]
            }
        for (var i = this.increments.length; i--;) {
            if (this.increments[i] <= value && (lo === undefined || lo < this.increments[i]))
                lo = this.increments[i];
            if (this.increments[i] >= value && (hi === undefined || hi > this.increments[i]))
                hi = this.increments[i];
        };
        if ((value - lo) > (hi - value)) {
            return hi;
        } else {
            return lo;
        }
    }
});

/** api: constructor
 *  .. class:: TimeSlider(options)
 *
 *  :param options: ``Object`` options
 *
 *  :return:  ``GeoAdmin.TimeSlider
 *
 *  Add a time slider to the map, will be displayed if time enabled layers are present
 */

GeoAdmin.TimeSlider = Ext.extend(Ext.Container, {

    timecontrol: null,

    layout: 'column',

    div: null,

    initComponent: function() {

        this.div = OpenLayers.Util.createAlphaImageDiv('timeslider', null, null, null, 'relative');
        this.div.style.display = 'none';
        this.div.style.width = '400px';
        this.div.style.height = '80px';
        this.div.style.left = '100px';
        this.div.style.backgroundColor = '#ffffff';
        this.div.style.opacity = 1.0;
        this.div.style.zIndex = 2000;
        

        this._timecontrol = this.timecontrol;
        delete this.timecontrol;

        this._timecontrol.map.viewPortDiv.appendChild(this.div);

        this._slider = this.createSlider();

        this._slider.map = this._timecontrol.map;
        this._timecontrol.events.on({
            changeavailabletimestamps: this.onChangeTimestampYear,
            scope: this
        });

        this._slider.on({
            "change": function(slider, newValue, thumb) {
                var slider = this.findParentByType('ga_timeslider');
                slider._timecontrol.setMapYear(newValue);
                
            }
        });
        this.items = [
                         this.createLabel(this._slider.minValue), 
                         this._slider, this.createLabel(this._slider.maxValue), 
                         new Ext.Button({
                             icon: '../images/time.png'
                         })
        ];
        GeoAdmin.TimeSlider.superclass.initComponent.apply(this, arguments);
    },
    createSlider: function(options) {
        options = Ext.apply({}, options);

        var currentYear = new Date().getFullYear();

        return new Ext.TimeSlider({
            id: 'geoadmin-timeslider',
            width: 300,
            increment: 1,
            //increments: [1938,1947,1960,1974,1990,2006,2012],
            minValue: 1938,
            maxValue: currentYear,
            value: currentYear,
            plugins: new Ext.slider.Tip()
            })
        },

    createLabel: function(label) {
        return new Ext.BoxComponent({
            html: '<span class="geoadmin-timeslider-label x-unselectable">' + label + '</span>'
        });
    },

    createTicks: function() {
        var el = this._slider.getEl().select('.x-slider-inner');
        var min = this._slider.minValue;
        var max = this._slider.maxValue
        var increments = this._timecontrol.getTimestamps();
        for (var i = 0; i < increments.length; i++) {
            var incr = increments[i];
            var px = Math.round((incr - min) / (max - min) * 286 - 5);
            var e = el.createChild({
                id: incr,
                cls: 'timeslider-tick',
                style: "left: " + px + 'px' + "; right: auto;"
            });
        }

    },
    removeTicks: function() {
        var el = this._slider.getEl().select('.timeslider-tick');
        for (var i = 0; i < el.elements.length; i++) {
            var parentNode = el.elements[i].parentNode;
            parentNode.removeChild(el.elements[i]);
        }
    },

    onChangeTimestampYear: function(evt) {
        this._slider.increments = evt.timestamps;
        this._slider.syncThumb();
        this.removeTicks();
        this.createTicks();

        if (this._slider.increments.length > 0) {
            this.div.style.display = 'block';
        } else {
            this.div.style.display = 'none';
        }

    }
});
/** api: xtype = ga_timeslider */
Ext.reg("ga_timeslider", GeoAdmin.TimeSlider);
