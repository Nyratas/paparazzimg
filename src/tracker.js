paparazzimg.tracker = function(el) {

      this.element = null;
      this.id = null;
      this.points = [];
      this.report = null;
      this.breaks = null;
      this.isActive = false;

      this.init = function(el) {
            this.element = el;
            this.setId();
      };

      this.setId = function() {
            if(this.element.getAttribute('id')) this.id = paparazzimg.addId(this.element.getAttribute('id'));
            else {
                  this.id = paparazzimg.addId(this.element.nodeName);
                  this.element.setAttribute('id', this.id);
            }
      };

      this.setActive = function() {
            this.isActive = true;
      };

      this.setInactive = function() {
            this.isActive = false;
      };

      //    API

      this.report = function() {
            this.makeBaseBreaks();
            this.makeReport();
            this.addMinBreak();
            this.reset();
            console.log(this.breaks);
            return this.report;
      };

      this.point = function() {
            this.points.push( this.getPoint() );
      };

      this.reset = function() {
            this.points = [];
      };

      //    FUNCTIONS

      this.getPoint = function() {
            var p = {};
            p.width = this.element.clientWidth;
            p.height = this.element.clientHeight;
            p.ratio = p.width / p.height;
            return p;
      };

      this.makeReport = function() {
            this.report = {};
            this.report.count = this.points.length;
            this.report.extremum = this.getExtremum();
            this.report.optimal = this.getOptimal();
      };

      this.getExtremum = function() {
            var o = {}, i, d, tmp = {};
            for (i = 0; i < this.points.length; i++) {
                  for (d in this.points[i]){
                        if(o[d] === undefined) {
                              o[d] = { min: this.points[i][d], max: this.points[i][d] };
                              tmp[d] = { min: this.points[i], max: this.points[i] };
                        }
                        else if(this.points[i][d] > o[d].max) {
                              o[d].max = this.points[i][d];
                              tmp[d].max = this.points[i];
                        }
                        else if(this.points[i][d] < o[d].min){
                              o[d].min = this.points[i][d];
                              tmp[d].min = this.points[i];
                        }
                  }
            }
            this.addExtremumBreaks(tmp);
            return o;
      };

      this.getOptimal = function() {
            var o = {};
            o.static = this.getStaticSize();
            o.fluidWidth = this.getFluidWidthSize();
            o.fluidHeight = this.getFluidHeightSize();
            return o;
      };

      this.getStaticSize = function() {
            return {
                  width: Math.ceil(this.report.extremum.width.max),
                  height: Math.ceil(this.report.extremum.height.max)
            };
      };

      this.getFluidWidthSize = function() {
            return {
                  width: Math.ceil(this.report.extremum.height.max * this.report.extremum.ratio.max),
                  height: Math.ceil(this.report.extremum.width.max / this.report.extremum.ratio.min)
            };
      };

      this.getFluidHeightSize = function() {
            return {
                  width: Math.ceil(this.report.extremum.height.min * this.report.extremum.ratio.max),
                  height: Math.ceil(this.report.extremum.width.min / this.report.extremum.ratio.min)
            };
      };

      this.makeBaseBreaks = function() {
            this.breaks = [];
            this.addBreak('base', null, null);
      };

      this.addBreak = function(type, x, y) {
            var o = {};
            o.type = type;
            o.width = (x > 0 || x === 0) ? x : null;
            o.height = (y > 0 || y === 0) ? y : null;
            this.breaks.push(o);
      };

      this.addExtremumBreaks = function(o) {
            var d, m;
            for (d in o) {
                  for(m in o[d]){
                        this.addBreak(m + '-' + d, o[d][m].width, o[d][m].height);
                  }
            }
      };

      this.addMinBreak = function() {
            this.addBreak('always', this.report.extremum.width.min, this.report.extremum.height.min);
      };

      this.init(el);
};