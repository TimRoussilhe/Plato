(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{0:function(t,e){},SexK:function(t,e,n){var i=(0,n("uorI").twig)({id:"a1b76cb585753503ff0dae9856c2bbcc25815b7df904ddcea7088a9288b3d10663740d3a73e212ba5063a6d1e9ee2440c62a930ed689bf50c6e601e2deaf7729",data:[{type:"raw",value:'<section class="page-wrapper" id="homepage">\n\n\t<div class="introduction">\n\t\t<h1 class="f-title">Dynamic content: '},{type:"output",stack:[{type:"Twig.expression.type.variable",value:"data",match:["data"]},{type:"Twig.expression.type.key.period",key:"content"},{type:"Twig.expression.type.key.period",key:"title"}]},{type:"raw",value:'</h1>\n\t\t<h2 class="f-body">ABOUT PAGE Static content</h2>\n\t</div>\n\n</section>\n'}],allowInlineIncludes:!0,rethrow:!0});t.exports=function(t){return i.render(t)}},Xe5c:function(t,e,n){"use strict";var i=n("lwsE"),a=n.n(i),o=n("W8MJ"),s=n.n(o),u=n("a1gu"),c=n.n(u),r=n("Nsbk"),l=n.n(r),h=n("iWIM"),p=n.n(h),d=n("7W2i"),f=n.n(d),y=n("bPao"),v=function(t){function e(t){return a()(this,e),c()(this,l()(e).call(this,t))}return f()(e,t),s()(e,[{key:"fetchData",value:function(){var e=this;if(this.props.endPoint){var t="/data/"+this.props.endPoint;fetch(t).then(function(t){return t.json()}).then(function(t){e.data=t,e.promises.data.resolve()}).catch(function(t){e.promises.data.reject()})}else this.promises.data.resolve()}},{key:"loadAssets",value:function(){this.promises.data.resolve()}},{key:"initData",value:function(){}},{key:"onInit",value:function(){p()(l()(e.prototype),"onInit",this).call(this)}}]),e}(y.a);e.a=v},kdZZ:function(t,e,n){"use strict";var i=n("lwsE"),a=n.n(i),o=n("W8MJ"),s=n.n(o),u=n("a1gu"),c=n.n(u),r=n("Nsbk"),l=n.n(r),h=n("iWIM"),p=n.n(h),d=n("7W2i"),f=n.n(d),y=n("2+8n"),v=n("EJyy"),w=(v.a,function(t){function e(){return a()(this,e),c()(this,l()(e).apply(this,arguments))}return f()(e,t),s()(e,[{key:"setupDOM",value:function(){v.c.set(this.el,{autoAlpha:0})}},{key:"initTL",value:function(){var t=this;this.TL.show=new v.b({paused:!0,onComplete:function(){return t.onShown()}}),this.TL.show.to(this.el,.3,{autoAlpha:1,ease:Cubic.easeOut}),this.TL.hide=new v.b({paused:!0,onComplete:function(){return t.onHidden()}}),this.TL.hide.to(this.el,.3,{autoAlpha:0,ease:Cubic.easeOut})}},{key:"onDOMInit",value:function(){document.getElementById("content").appendChild(this.el),p()(l()(e.prototype),"onDOMInit",this).call(this)}},{key:"showComponent",value:function(){var t=this;setTimeout(function(){t.TL.show.play(0)},0)}},{key:"hideComponent",value:function(){var t=this;setTimeout(function(){t.TL.hide.play(0)},0)}}]),e}(y.a));e.a=w},vdNk:function(t,e,n){"use strict";n.r(e);var i=n("lwsE"),a=n.n(i),o=n("W8MJ"),s=n.n(o),u=n("a1gu"),c=n.n(u),r=n("Nsbk"),l=n.n(r),h=n("iWIM"),p=n.n(h),d=n("7W2i"),f=n.n(d),y=n("Xe5c"),v=n("kdZZ"),w=n("SexK"),k=n.n(w),b=function(t){function n(t){var e;return a()(this,n),(e=c()(this,l()(n).call(this,t))).template=k.a,e}return f()(n,t),s()(n,[{key:"dispose",value:function(){p()(l()(n.prototype),"dispose",this).call(this)}}]),n}(v.a),m=function(t){function n(t){var e;return a()(this,n),(e=c()(this,l()(n).call(this,t))).ComponentClass=b,e}return f()(n,t),s()(n,[{key:"initData",value:function(){p()(l()(n.prototype),"initData",this).call(this)}}]),n}(y.a);e.default=m}}]);