YUI.add("moodle-mod_bigbluebuttonbn-rooms",function(e,t){M.mod_bigbluebuttonbn=M.mod_bigbluebuttonbn||{},M.mod_bigbluebuttonbn.rooms={datasource:null,bigbluebuttonbn:{},panel:null,pinginterval:null,init:function(t){this.datasource=new e.DataSource.Get({source:M.cfg.wwwroot+"/mod/bigbluebuttonbn/bbb_broker.php?"}),this.bigbluebuttonbn=t,this.pinginterval=t.ping_interval,this.pinginterval===0&&(this.pinginterval=1e4),(this.bigbluebuttonbn.profile_features.includes("all")||this.bigbluebuttonbn.profile_features.includes("showroom"))&&this.init_room()},init_room:function(){if(this.bigbluebuttonbn.activity!=="open"){var t=[M.util.get_string("view_message_conference_has_ended","bigbluebuttonbn")];this.bigbluebuttonbn.activity!=="ended"&&(t.push(this.bigbluebuttonbn.opening),t.push(this.bigbluebuttonbn.closing)),e.DOM.addHTML(e.one("#status_bar"),this.init_status_bar(t));return}this.update_room()},update_room:function(){var t=e.one("#status_bar"),n=e.one("#control_panel"),r=e.one("#join_button"),i=e.one("#end_button"),s=this.bigbluebuttonbn.meetingid,o=this.bigbluebuttonbn.bigbluebuttonbnid;this.datasource.sendRequest({request:"action=meeting_info&id="+s+"&bigbluebuttonbn="+o,callback:{success:function(u){e.DOM.addHTML(t,M.mod_bigbluebuttonbn.rooms.init_status_bar(u.data.status.message)),e.DOM.addHTML(n,M.mod_bigbluebuttonbn.rooms.init_control_panel(u.data)),typeof u.data.status.can_join!="undefined"&&e.DOM.addHTML(r,M.mod_bigbluebuttonbn.rooms.init_join_button(u.data.status)),typeof u.data.status.can_end!="undefined"&&u.data.status.can_end&&e.DOM.addHTML(i,M.mod_bigbluebuttonbn.rooms.init_end_button(u.data.status)),u.data.status.can_join||M.mod_bigbluebuttonbn.rooms.wait_moderator({id:s,bnid:o})}}})},init_status_bar:function(t){var n=e.DOM.create("<span>");e.DOM.setAttribute(n,"id","status_bar_span");if(t.constructor===Array)for(var r in t){if(!t.hasOwnProperty(r))continue;var i=e.DOM.create("<span>");e.DOM.setAttribute(i,"id","status_bar_span_span"),e.DOM.setText(i,t[r]),e.DOM.addHTML(n,i),e.DOM.addHTML(n,e.DOM.create("<br>"))}else e.DOM.setText(n,t);return n},init_control_panel:function(t){var n=e.DOM.create("<div>");e.DOM.setAttribute(n,"id","control_panel_div");var r="";return t.running&&(r+=this.msg_started_at(t.info.startTime)+" ",r+=this.msg_attendees_in(t.info.moderatorCount,t.info.participantCount)),e.DOM.addHTML(n,r),n},msg_started_at:function(e){var t=parseInt(e,10)-parseInt(e,10)%1e3,n=new Date(t),r=n.getHours(),i=n.getMinutes(),s=M.util.get_string("view_message_session_started_at","bigbluebuttonbn");return s+" <b>"+r+":"+(i<10?"0":"")+i+"</b>."},msg_attendees_in:function(e,t){if(typeof t=="undefined"||t===0)return M.util.get_string("view_message_session_no_users","bigbluebuttonbn")+".";var n=M.util.get_string("view_message_session_has_users","bigbluebuttonbn"),r=M.util.get_string("view_message_moderators","bigbluebuttonbn"),i=M.util.get_string("view_message_viewers","bigbluebuttonbn");if(t==1)return e>0?n+" <b>1</b> "+r+".":n+" <b>1</b> "+i+".";var s=t-e;return e==1&&(r=M.util.get_string("view_message_moderator","bigbluebuttonbn")),s==1&&(i=M.util.get_string("view_message_viewer","bigbluebuttonbn")),n+" <b>"+e+"</b> "+r+" and <b>"+s+"</b> "+i+"."},init_join_button:function(t){var n=e.DOM.create("<input>");e.DOM.setAttribute(n,"id","join_button_input"),e.DOM.setAttribute(n,"type","button"),e.DOM.setAttribute(n,"value",t.join_button_text),e.DOM.setAttribute(n,"class","btn btn-primary");var r="M.mod_bigbluebuttonbn.broker.join('"+t.join_url+"');";e.DOM.setAttribute(n,"onclick",r);if(!t.can_join){e.DOM.setAttribute(n,"disabled",!0);var i=e.one("#status_bar_span"),s=e.DOM.create("<img>");e.DOM.setAttribute(s,"id","spinning_wheel"),e.DOM.setAttribute(s,"src","pix/processing16.gif"),e.DOM.addHTML(i,"&nbsp;"),e.DOM.addHTML(i,s)}return n},init_end_button:function(t){var n=e.DOM.create("<input>");return e.DOM.setAttribute(n,"id","end_button_input"),e.DOM.setAttribute(n,"type","button"),e.DOM.setAttribute(n,"value",t.end_button_text),e.DOM.setAttribute(n,"class","btn btn-secondary"),t.can_end&&e.DOM.setAttribute(n,"onclick","M.mod_bigbluebuttonbn.broker.end_meeting();"),n},remote_update:function(e){setTimeout(function(){M.mod_bigbluebuttonbn.rooms.clean_room(),M.mod_bigbluebuttonbn.rooms.update_room()},e)},clean_room:function(){this.clean_status_bar(),this.clean_control_panel(),this.clean_join_button(),this.clean_end_button()},clean_status_bar:function(){e.one("#status_bar_span").remove()},clean_control_panel:function(){e.one("#control_panel_div").remove()},clean_join_button:function(){e.one("#join_button").setContent("")},hide_join_button:function(){e.DOM.setStyle(e.one("#join_button"),"visibility","hidden")},show_join_button:function(){e.DOM.setStyle(e.one("#join_button"),"visibility","shown")},clean_end_button:function(){e.one("#end_button").setContent("")},hide_end_button:function(){e.DOM.setStyle(e.one("#end_button"),"visibility","hidden")},show_end_button:function(){e.DOM.setStyle(e.one("#end_button"),"visibility","shown")},window_close:function(){window.onunload=function(){opener.M.mod_bigbluebuttonbn.rooms.remote_update(5e3)},window.close()},wait_moderator:function(e){this.datasource.sendRequest({request:"action=meeting_info&id="+e.id+"&bigbluebuttonbn="+e.bnid,callback:{success:function(t){return t.data.running&&(M.mod_bigbluebuttonbn.rooms.clean_room(),M.mod_bigbluebuttonbn.rooms.update_room()),setTimeout(function(){return function(){M.mod_bigbluebuttonbn.rooms.wait_moderator(e)}}(this),M.mod_bigbluebuttonbn.rooms.pinginterval)},failure:function(t){e.message=t.error.message}}})}}},"@VERSION@",{requires:["base","node","datasource-get","datasource-jsonschema","datasource-polling","moodle-core-notification"]});
