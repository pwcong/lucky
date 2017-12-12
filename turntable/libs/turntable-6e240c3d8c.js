;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Turntable = factory();
  }
}(this, function() {
"use strict";var TurnTable=function(t,i,s){this.$el=t,this.data=i||[],this.defaultOptions={rootClass:"turntable",wrapClass:"turntable-wrap",maskClass:"turntable-mask",mainClass:"turntable-main",itemClass:"turntable-item",actionClass:"turntable-action",actionLabel:"抽奖",radius:100,lineWidth:1,lineColor:"#E44025",outerLineWidth:5,fillColors:["#FFB820","#FFCB3F"],defaultSelected:0,duration:5e3,delay:100,speed:3600,timingFunction:"ease-in-out",renderItem:function(t,i){var s=document.createElement("span");return s.innerHTML=i,s},lottery:function(t){return(t=t||[]).length<=0?-1:Math.round(Math.random()*t.length-1)},handleLotteryResult:function(t,i){alert("data["+t+"] = "+i)}},this.options={};for(var a in this.defaultOptions)this.options[a]=s[a]||this.defaultOptions[a]};TurnTable.prototype={__initialize:function(){this.$el.className.indexOf(this.options.rootClass)<0&&(this.$el.className=this.$el.className+" "+this.options.rootClass),this.$wrap=document.createElement("div"),this.$wrap.className=this.options.wrapClass,this.$el.appendChild(this.$wrap),this.$canvas=document.createElement("canvas"),this.$canvas.className=this.options.maskClass,this.$wrap.appendChild(this.$canvas),this.$main=document.createElement("ul"),this.$main.className=this.options.mainClass,this.$wrap.appendChild(this.$main),this.$action=document.createElement("span"),this.$action.className=this.options.actionClass,this.$action.innerHTML=this.options.actionLabel,this.$el.appendChild(this.$action),this.$el.style.width=this.$el.style.height=this.$wrap.style.width=this.$wrap.style.height=this.$main.style.width=this.$main.style.height=2*this.options.radius+"px",this.$canvas.width=this.$canvas.height=2*this.options.radius,this.render(),this.afterRender()},clear:function(){},drawMask:function(){var t=this.$canvas.getContext("2d"),i=this.data.length;if(!(i<=0)){var s=360/i,a=Math.PI/180;t.translate(this.options.radius,this.options.radius);for(var e=0;e<i;e++)t.save(),t.beginPath(),t.moveTo(0,0),t.arc(0,0,this.options.radius-this.options.lineWidth/2,(e*s-s/2-90)*a,((e+1)*s-s/2-90)*a),t.lineTo(0,0),t.closePath(),t.lineWidth=this.options.lineWidth,t.strokeStyle=this.options.lineColor,t.fillStyle=this.options.fillColors[e%this.options.fillColors.length],t.fill(),t.stroke(),t.restore();t.beginPath(),t.arc(0,0,this.options.radius-this.options.outerLineWidth/2,0,360*a),t.strokeStyle=this.options.lineColor,t.lineWidth=this.options.outerLineWidth,t.stroke()}},drawMain:function(){var t=this.data.length;if(!(t<=0)){for(var i=360/t,s=document.createDocumentFragment(),a=0;a<t;a++){var e=document.createElement("li");e.className=this.options.itemClass,e.appendChild(this.options.renderItem(a,this.data[a])),e.style.transform="rotate("+-i*a+"deg)",s.appendChild(e)}this.$main.appendChild(s)}},startLottery:function(t){var i=this;if(!((t=t||i.options.lottery(i.data))<0)){i.$action.setAttribute("data-disabled",!0),i.$action.className=i.options.actionClass+" disabled";var s=parseInt(i.$wrap.getAttribute("data-counts")),a=360/i.data.length,e=(s+1)*i.options.speed+t*a;i.$wrap.style.transform="rotate("+e+"deg)",i.$wrap.setAttribute("data-counts",s+1),setTimeout(function(){i.$action.removeAttribute("data-disabled",!0),i.$action.className=i.options.actionClass,i.options.handleLotteryResult(t,i.data[t])},i.options.duration)}},render:function(){var t=this;t.clear(),t.drawMask(),t.drawMain(),t.$action.onclick=function(){t.$action.getAttribute("data-disabled")||t.startLottery()}},afterRender:function(){var t=this.data.length;if(!(t<=0)){var i=360/t;this.currentSelected=this.options.defaultSelected>=t?t:this.options.defaultSelected,this.$wrap.style.transform="rotate("+this.currentSelected*i+"deg)",this.$wrap.setAttribute("data-counts",0),this.$wrap.style.transitionDelay=this.options.delay/1e3+"s",this.$wrap.style.transitionDuration=this.options.duration/1e3+"s",this.$wrap.style.transitionTimingFunction=this.options.timingFunction}}},TurnTable.init=function(t,i,s){var a=new TurnTable(t,i,s);return a.__initialize(),a};
return Turntable;
}));

//# sourceMappingURL=turntable-6e240c3d8c.js.map