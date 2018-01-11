!function(e,t){var i=0;e.widget("ui.autocomplete",{options:{appendTo:"body",autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function(){var t,i=this,n=this.element[0].ownerDocument;this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(n){if(!i.options.disabled&&!i.element.propAttr("readOnly")){t=!1;var s=e.ui.keyCode;switch(n.keyCode){case s.PAGE_UP:i._move("previousPage",n);break;case s.PAGE_DOWN:i._move("nextPage",n);break;case s.UP:i._move("previous",n),n.preventDefault();break;case s.DOWN:i._move("next",n),n.preventDefault();break;case s.ENTER:case s.NUMPAD_ENTER:i.menu.active&&(t=!0,n.preventDefault());case s.TAB:if(!i.menu.active)return;i.menu.select(n);break;case s.ESCAPE:i.element.val(i.term),i.close(n);break;default:clearTimeout(i.searching),i.searching=setTimeout(function(){i.term!=i.element.val()&&(i.selectedItem=null,i.search(null,n))},i.options.delay)}}}).bind("keypress.autocomplete",function(e){t&&(t=!1,e.preventDefault())}).bind("focus.autocomplete",function(){i.options.disabled||(i.selectedItem=null,i.previous=i.element.val())}).bind("blur.autocomplete",function(e){i.options.disabled||(clearTimeout(i.searching),i.closing=setTimeout(function(){i.close(e),i._change(e)},150))}),this._initSource(),this.response=function(){return i._response.apply(i,arguments)},this.menu=e("<ul></ul>").addClass("ui-autocomplete").appendTo(e(this.options.appendTo||"body",n)[0]).mousedown(function(t){var n=i.menu.element[0];e(t.target).closest(".ui-menu-item").length||setTimeout(function(){e(document).one("mousedown",function(t){t.target===i.element[0]||t.target===n||e.ui.contains(n,t.target)||i.close()})},1),setTimeout(function(){clearTimeout(i.closing)},13)}).menu({focus:function(e,t){var n=t.item.data("item.autocomplete");!1!==i._trigger("focus",e,{item:n})&&/^key/.test(e.originalEvent.type)&&i.element.val(n.value)},selected:function(e,t){var s=t.item.data("item.autocomplete"),o=i.previous;i.element[0]!==n.activeElement&&(i.element.focus(),i.previous=o,setTimeout(function(){i.previous=o,i.selectedItem=s},1)),!1!==i._trigger("select",e,{item:s})&&i.element.val(s.value),i.term=i.element.val(),i.close(e),i.selectedItem=s},blur:function(e,t){i.menu.element.is(":visible")&&i.element.val()!==i.term&&i.element.val(i.term)}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu"),e.fn.bgiframe&&this.menu.element.bgiframe(),i.beforeunloadHandler=function(){i.element.removeAttr("autocomplete")},e(window).bind("beforeunload",i.beforeunloadHandler)},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup"),this.menu.element.remove(),e(window).unbind("beforeunload",this.beforeunloadHandler),e.Widget.prototype.destroy.call(this)},_setOption:function(t,i){e.Widget.prototype._setOption.apply(this,arguments),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(e(i||"body",this.element[0].ownerDocument)[0]),"disabled"===t&&i&&this.xhr&&this.xhr.abort()},_initSource:function(){var t,n,s=this;e.isArray(this.options.source)?(t=this.options.source,this.source=function(i,n){n(e.ui.autocomplete.filter(t,i.term))}):"string"==typeof this.options.source?(n=this.options.source,this.source=function(t,o){s.xhr&&s.xhr.abort(),s.xhr=e.ajax({url:n,data:t,dataType:"json",context:{autocompleteRequest:++i},success:function(e,t){this.autocompleteRequest===i&&o(e)},error:function(){this.autocompleteRequest===i&&o([])}})}):this.source=this.options.source},search:function(e,t){return e=null!=e?e:this.element.val(),this.term=this.element.val(),e.length<this.options.minLength?this.close(t):(clearTimeout(this.closing),this._trigger("search",t)!==!1?this._search(e):void 0)},_search:function(e){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.source({term:e},this.response)},_response:function(e){!this.options.disabled&&e&&e.length?(e=this._normalize(e),this._suggest(e),this._trigger("open")):this.close(),this.pending--,this.pending||this.element.removeClass("ui-autocomplete-loading")},close:function(e){clearTimeout(this.closing),this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.deactivate(),this._trigger("close",e))},_change:function(e){this.previous!==this.element.val()&&this._trigger("change",e,{item:this.selectedItem})},_normalize:function(t){return t.length&&t[0].label&&t[0].value?t:e.map(t,function(t){return"string"==typeof t?{label:t,value:t}:e.extend({label:t.label||t.value,value:t.value||t.label},t)})},_suggest:function(t){var i=this.menu.element.empty().zIndex(this.element.zIndex()+1);this._renderMenu(i,t),this.menu.deactivate(),this.menu.refresh(),i.show(),this._resizeMenu(),i.position(e.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next(new e.Event("mouseover"))},_resizeMenu:function(){var e=this.menu.element;e.outerWidth(Math.max(e.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(t,i){var n=this;e.each(i,function(e,i){n._renderItem(t,i)})},_renderItem:function(t,i){return e("<li></li>").data("item.autocomplete",i).append(e("<a></a>").text(i.label)).appendTo(t)},_move:function(e,t){return this.menu.element.is(":visible")?this.menu.first()&&/^previous/.test(e)||this.menu.last()&&/^next/.test(e)?(this.element.val(this.term),void this.menu.deactivate()):void this.menu[e](t):void this.search(null,t)},widget:function(){return this.menu.element}}),e.extend(e.ui.autocomplete,{escapeRegex:function(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},filter:function(t,i){var n=new RegExp(e.ui.autocomplete.escapeRegex(i),"i");return e.grep(t,function(e){return n.test(e.label||e.value||e)})}})}(jQuery),function(e){e.widget("ui.menu",{_create:function(){var t=this;this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(i){e(i.target).closest(".ui-menu-item a").length&&(i.preventDefault(),t.select(i))}),this.refresh()},refresh:function(){var t=this,i=this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem");i.children("a").addClass("ui-corner-all").attr("tabindex",-1).mouseenter(function(i){t.activate(i,e(this).parent())}).mouseleave(function(){t.deactivate()})},activate:function(e,t){if(this.deactivate(),this.hasScroll()){var i=t.offset().top-this.element.offset().top,n=this.element.scrollTop(),s=this.element.height();0>i?this.element.scrollTop(n+i):i>=s&&this.element.scrollTop(n+i-s+t.height())}this.active=t.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end(),this._trigger("focus",e,{item:t})},deactivate:function(){this.active&&(this.active.children("a").removeClass("ui-state-hover").removeAttr("id"),this._trigger("blur"),this.active=null)},next:function(e){this.move("next",".ui-menu-item:first",e)},previous:function(e){this.move("prev",".ui-menu-item:last",e)},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},move:function(e,t,i){if(!this.active)return void this.activate(i,this.element.children(t));var n=this.active[e+"All"](".ui-menu-item").eq(0);n.length?this.activate(i,n):this.activate(i,this.element.children(t))},nextPage:function(t){if(this.hasScroll()){if(!this.active||this.last())return void this.activate(t,this.element.children(".ui-menu-item:first"));var i=this.active.offset().top,n=this.element.height(),s=this.element.children(".ui-menu-item").filter(function(){var t=e(this).offset().top-i-n+e(this).height();return 10>t&&t>-10});s.length||(s=this.element.children(".ui-menu-item:last")),this.activate(t,s)}else this.activate(t,this.element.children(".ui-menu-item").filter(!this.active||this.last()?":first":":last"))},previousPage:function(t){if(this.hasScroll()){if(!this.active||this.first())return void this.activate(t,this.element.children(".ui-menu-item:last"));var i=this.active.offset().top,n=this.element.height();result=this.element.children(".ui-menu-item").filter(function(){var t=e(this).offset().top-i+n-e(this).height();return 10>t&&t>-10}),result.length||(result=this.element.children(".ui-menu-item:first")),this.activate(t,result)}else this.activate(t,this.element.children(".ui-menu-item").filter(!this.active||this.first()?":last":":first"))},hasScroll:function(){return this.element.height()<this.element[e.fn.prop?"prop":"attr"]("scrollHeight")},select:function(e){this._trigger("selected",e,{item:this.active})}})}(jQuery);
