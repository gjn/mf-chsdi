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
    
    divEvents: null,
    
    _slider: null,

    initComponent: function() {

        this.div = OpenLayers.Util.createAlphaImageDiv('timeslider', null, null, null, 'relative');
        this.div.style.display = 'none';
        this.div.style.width = '650px';
        this.div.style.height = '80px';
        this.div.style.left = '100px';
        this.div.style.backgroundColor = '#ffffff';
        this.div.style.opacity = 1.0;
        this.div.style.zIndex = 2000;
        
        this.divEvents = new OpenLayers.Events(this, this.div, null, true, {includeXY: true});
  
        this.divEvents.on({
                "mousedown": this.divDown,
                "mouseup": this.divUp,
                "mousemove": this.divDrag,
                scope: this
            });
        

        this._timecontrol = this.timecontrol;
        delete this.timecontrol;

        this._timecontrol.map.viewPortDiv.appendChild(this.div);

        this._slider = this.createSlider();

        this._slider.map = this._timecontrol.map;
        this._timecontrol.events.on({
            changeavailabletimestamps: this.onChangeTimestampYear,
            scope: this
        });
        
        this._slider.setValue(this._timecontrol.map.year);

        this._slider.on({
            "changecomplete": function(slider, newValue, thumb) {
                var timeslider = this.findParentByType('ga_timeslider');
                timeslider._timecontrol.setMapYear(newValue); 
                
            }
        });
        
        var image = new Ext.BoxComponent({autoEl: {tag: 'div', class: 'time-off', width: 30, height: 30}});
      
        this.items = [
                         //this.createLabel(this._slider.minValue), 
                         this._slider, 
                         //this.createLabel(this._slider.maxValue), 
                         new Ext.Button({
                              id: 'timeslider-displayall-toggle',
                              cls: 'x-btn-no-over',
                              width:30,
                              height: 30,
                              iconCls: 'time-off',
                              enableToggle: true,
                              toggleHandler: function(btn, state) {
                                  this.toggleDisplayAll(state);
                              }, 
                              
                              scope: this 
                         })  
        ];
        GeoAdmin.TimeSlider.superclass.initComponent.apply(this, arguments);
    },
    
    createSlider: function(options) {
        options = Ext.apply({}, options);

        var currentYear = new Date().getFullYear();

        return new Ext.TimeSlider({
            id: 'geoadmin-timeslider',
            width: 530,
            increment: 1,
            increments: [2013],
            minValue: 1838,
            maxValue: currentYear,
            value: currentYear,
            plugins: new Ext.slider.Tip(),
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
            var px = Math.round((incr - min) / (max - min) * 518 - 5); //width of x-slider-inner
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
    
    toggleDisplayAll: function(state) {
 
            var but = this.items.get(1);
            if (state) {
                but.setIconClass('time-on');
                this._timecontrol.setDisplayAll(true);
                this._slider.disable();
            } else {
                but.setIconClass('time-off');
                this._timecontrol.setDisplayAll(false);
                this._slider.enable();
            };
    },
    
  
    divDown: function(evt) {
       if (!OpenLayers.Event.isLeftClick(evt) && !OpenLayers.Event.isSingleTouch(evt)) {
            return;
        }
        this.mouseDragStart = evt.xy.clone();  
        this._slider.map.events.on({
            "mousemove": this.passEventToDiv,
            "mouseup": this.passEventToDiv,
            scope: this
        });
        OpenLayers.Event.stop(evt);
    },
    
    divUp: function(evt) {
       if (!OpenLayers.Event.isLeftClick(evt) && !OpenLayers.Event.isSingleTouch(evt)) {
            return;
        }
        if (this.mouseDragStart) {  
            this._slider.map.events.un({
                "mousemove": this.passEventToDiv,
                "mouseup": this.passEventToDiv,
                scope: this
            });
            this.mouseDragStart = null;
        }
        OpenLayers.Event.stop(evt);
    },
    divDrag: function(evt) {
         if (this.mouseDragStart != null) {
             OpenLayers.Event.stop(evt);   
         }
    },
   
    passEventToDiv:function(evt) {
        this.divEvents.handleBrowserEvent(evt);
    },

    onChangeTimestampYear: function(evt) {
        this._slider.increments = evt.timestamps; 
        this._slider.syncThumb();
        this.removeTicks();
        this.createTicks();
      

        if (this._slider.increments.length > 0) {
            this.div.style.display = 'block';
            this._slider.setValue(this._slider.doSnap(evt.year));
        } else {
            this.div.style.display = 'none';
        }

    }
});
/** api: xtype = ga_timeslider */
Ext.reg("ga_timeslider", GeoAdmin.TimeSlider);
