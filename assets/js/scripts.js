$(function(){
  $(".J_openForCommitte").click(function(evt) {
    evt.preventDefault()
    openForCommitte()
  })
	// $("#aFloatTools_Show").click(function(){
	// 	$('#divFloatToolsView').animate({ width:'show',opacity:'show'},100,function(){$('#divFloatToolsView').show();});
	// 	$('#aFloatTools_Show').hide();
	// 	$('#aFloatTools_Hide').show();
	// });
	// $("#aFloatTools_Hide").click(function(){
	// 	$('#divFloatToolsView').animate({width:'hide', opacity:'hide'},100,function(){$('#divFloatToolsView').hide();});

	// 	$('#aFloatTools_Show').show();
	// 	$('#aFloatTools_Hide').hide();
	// });
});
$(document).ready(function() {
        var timeout = null;
        $('.top-pd-center').mouseenter(function() {
          $(this).addClass('open');
          clearTimeout(timeout);
        });
        $('.top-pd-center').mouseleave(function() {
          var self = $(this)
          timeout = setTimeout(function(){
            self.removeClass('open');
          },300);
        });
      });