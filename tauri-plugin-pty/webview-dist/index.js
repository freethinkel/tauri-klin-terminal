var t=function(){function t(t,e){this.socket=t,this.options=e||{}}return Object.defineProperty(t.prototype,"bidirectional",{get:function(){var t,e;return void 0===(null===(t=this.options)||void 0===t?void 0:t.bidirectional)||(null===(e=this.options)||void 0===e?void 0:e.bidirectional)},enumerable:!1,configurable:!0}),t.prototype._init=function(){var t=this;this.socket.addEventListener("message",(function(e){return t._getMessage(e)})),this.bidirectional&&this.terminal.onData((function(e){return t._sendData(e)})),this.terminal.onResize((function(e){return t._setSize(e)})),this.socket.addEventListener("close",(function(){return t.deatach()})),this.socket.addEventListener("error",(function(){return t.deatach()}))},t.prototype._setSize=function(t){this.socket.send(JSON.stringify(["set_size",t.rows,t.cols]))},t.prototype._sendData=function(t){this.socket.send(JSON.stringify(["stdin",t]))},t.prototype._flushBuffer=function(){var t;this.terminal.write(null!==(t=this._attachSocketBuffer)&&void 0!==t?t:""),this._attachSocketBuffer=null},t.prototype._pushToBuffer=function(t){var e=this;this._attachSocketBuffer?this._attachSocketBuffer+=t:(this._attachSocketBuffer=t,setTimeout((function(){return e._flushBuffer()}),10))},t.prototype._getMessage=function(t){var e=JSON.parse(t.data);"stdout"===e[0]&&(this.options.buffered?this._pushToBuffer(e[1]):this.terminal.write(e[1]))},t.prototype.deatach=function(){},t.prototype.activate=function(t){this.terminal=t,this._init()},t.prototype.dispose=function(){throw new Error("Method not implemented.")},t}();export{t as TauriPtyAddon};