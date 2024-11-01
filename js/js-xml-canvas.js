jQuery(document).ready(function($) {

        $(".chbtn_top").click(function() {
            $(this).closest('ul').find('.chbtn_active').removeClass('chbtn_active');
            $(this).addClass('chbtn_active');
            var idActive = $(this).attr('data-menu');
            $('.userInfo_xmlc_top').each(function(i, obj) {
                if($(obj).hasClass('userInfo_active')){
                    $(obj).removeClass('userInfo_active');
                }
            });
            $('#'+idActive).addClass('userInfo_active');
            
        });
        
        $( ".userInfo_xmlc_systemUser .chbtn" ).click(function() {
            $(this).closest('ul').find('.chbtn_active').removeClass('chbtn_active');
            $(this).addClass('chbtn_active');            
            var idActive = $(this).attr('data-menu');
            $(this).closest('.userInfo_xmlc_systemUser').find('.userInfo_xmlc').each(function(i, obj) {
                if($(obj).hasClass('userInfo_active')){
                    $(obj).removeClass('userInfo_active');
                }
            });
            $('#'+idActive).addClass('userInfo_active');
            
        }); 
        
        $( ".imgSystemUser" ).click(function() {
            $('.imgSystemUser').each(function(i, obj) {
                $(obj).css('border', '2px solid #d7d7d7');
                if($(obj).hasClass('imgSystemUser_active')){
                    $(obj).removeClass('imgSystemUser_active');
                }                
            });
            $(this).css('border', '2px solid orange');
            $(this).addClass('imgSystemUser_active');
        })

        
        $( ".chbtn_StepOneNewFeed" ).click(function() {
            var apiKey = $('#userApiKeyInput').val().replace(/[^a-z0-9\_]/gi, '');            
            var inFeed = $('#stepOneNewFeed').val();
            var pattern = new RegExp(/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i);
            if(!pattern.test(inFeed)) {      
                 $(".ajaxInfoNewOrder").css('color','#CD0000');
                 $(".ajaxInfoNewOrder").html('<span class="fa fa-exclamation-circle"></span>&nbsp;&nbsp;You must insert a functional URL of your feed.');   
             }else{
                 $(".ajaxInfoNewOrder").html('<img src="https://xmlcanvas.com/css/logo/ajax-load2.gif">');
                 $.ajax({
                        type: "POST",
                        dataType: 'json', 
                        url: 'https://api.xmlcanvas.com/2.0/'+apiKey+'/get_number_of_items/',
                        data: 'feed_in='+inFeed,                
                        success: function(jsonResponse){
                            $(".ajaxInfoNewOrder").html('');
                            if(jsonResponse.detail){
                                $(".ajaxInfoNewOrder").append('Ou, something is wrong<br>');
                                $(".ajaxInfoNewOrder").append('Error detail: '+jsonResponse.detail.replace(/[^a-z0-9\,\:\-\.\s]/gi, '')); 
                            }else{
                                if(parseInt(jsonResponse.feedPrice)==0){
                                    $(".ajaxInfoNewOrder").append('XML feed in free mode.<br>');     
                                }else if(parseInt(jsonResponse.credit) >= parseInt(jsonResponse.preview[0].feedPrice)){
                                    $(".ajaxInfoNewOrder").append('A new order can be created<br>');   
                                }else if(parseInt(jsonResponse.credit) < parseInt(jsonResponse.preview[0].feedPrice)){
                                    $(".ajaxInfoNewOrder").append("A new order can't be created<br>");
                                }else{
                                    $(".ajaxInfoNewOrder").append('Ou, something is wrong<br>');                               
                                }
                                $(".ajaxInfoNewOrder").append('Count of items: '+jsonResponse.preview[0].feedCount.replace(/[^a-z0-9\s\.]/gi, '')+'<br>');
                                $(".ajaxInfoNewOrder").append('Price for new order: $ '+jsonResponse.preview[0].feedPrice.replace(/[^0-9]/gi, '')+'<br>'); 
                                $(".ajaxInfoNewOrder").append('Cash balance on XmlCanvas: $ '+jsonResponse.credit.replace(/[^0-9]/gi, ''));
                                  
                            }
                        }
                 });                 
             }
        });
        
        
        $( ".createNewFeed" ).click(function() {
            var apiKey = $('#userApiKeyInput').val().replace(/[^a-z0-9\_]/gi, '');            
            var templateId = 'unset';
            if($('.imgSystemUser_active').attr('title')){
                var templateId = $('.imgSystemUser_active').attr('title');
            } 
            var inFeed = $('#stepOneNewFeed').val();            
            var pattern = new RegExp(/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i);
            if(!pattern.test(inFeed)) {      
                 $(".ajaxInfoNewOrderStep3").css('color','#CD0000');
                 $(".ajaxInfoNewOrderStep3").html('<span class="fa fa-exclamation-circle"></span>&nbsp;&nbsp;You must insert a functional URL of your feed.');   
             }else if(templateId == 'unset'){
                 $(".ajaxInfoNewOrderStep3").css('color','#CD0000');
                 $(".ajaxInfoNewOrderStep3").html('<span class="fa fa-exclamation-circle"></span>&nbsp;&nbsp;You must chosse one of templates.'); 
             }else{
                 $(".ajaxInfoNewOrder").html('');
                 $(".ajaxInfoNewOrderStep3").html('<img src="https://xmlcanvas.com/css/logo/ajax-load2.gif">');                 
                 $.ajax({
                        type: "POST",
                        dataType: 'json', 
                        url: 'https://api.xmlcanvas.com/2.0/'+apiKey+'/create_new_feed/',
                        data: 'feed_in='+inFeed+'&templates_id='+templateId,                
                        success: function(jsonResponse){
                            $(".ajaxInfoNewOrderStep3").html('');
                            if(jsonResponse.detail){
                                $(".ajaxInfoNewOrderStep3").append('Ou, something is wrong<br>');
                                $(".ajaxInfoNewOrderStep3").append('Error detail: '+jsonResponse.detail.replace(/[^a-z0-9\,\:\-\.\s]/gi, '')); 
                            }else{
                                $('.hideInfoZeroOrder').hide();
                                $('#stepOneNewFeed').val('');                              
                                $(".ajaxInfoNewOrderStep3").html('OK - new order vas created.');
                                
                                $("#myFeedsXmlCanvas").prepend('<br clear="all"><br clear="all">');

                                var box = '<table class="tableStartStopFeed"><tr><td>';
                                if(parseInt(jsonResponse.preview[0].userStop)==1){
                                    box = box + '<span onclick="startStopFeed(this)" data-action="start" data-feedId="'+jsonResponse.preview[0].feed_id.replace(/[^a-z0-9]/gi, '')+'" class="button btn startStopFeed">Start</span>';
                                }else{
                                    box = box + '<span onclick="startStopFeed(this)" data-action="stop" data-feedId="'+jsonResponse.preview[0].feed_id.replace(/[^a-z0-9]/gi, '')+'" class="button btn startStopFeed">Stop</span>';
                                }
                                box = box + '</td><td class="wtbtdStartStopFeed"><img class="imgStartStopFeed" title="'+jsonResponse.preview[0].feed_id.replace(/[^a-z0-9]/gi, '')+'" src="'+jsonResponse.preview[0].img.replace(/[^a-z0-9]\/\:\./gi, '')+'"></td></tr>';
                                box = box + '<tr><td>Input feed: </td><td>' + jsonResponse.preview[0].feed_in + '</td></tr>';  //control in pattern
                                box = box + '<tr><td>Output feed: </td><td>' + jsonResponse.preview[0].feed_out.replace(/[^a-z0-9]\/\:\./gi, '') + '</td></tr>';
                                box = box + '<tr><td>Date of last generated: </td><td class="lastGenerated">' + jsonResponse.preview[0].lastGenerated.replace(/[^0-9\:\-\s]/gi, '') + '</td></tr>';
                                if((jsonResponse.preview[0].userStop==0)&&(jsonResponse.preview[0].paymentMode=='Free_10_Item')){
                                    var prolong = '<span id="prolong'+jsonResponse.preview[0].feed_id+'">' + jsonResponse.preview[0].paidUpToDay.split(" ")[0].replace(/[^0-9\:\-\s]/gi, '') + '</span>  <span id="button'+jsonResponse.preview[0].feed_id.replace(/[^a-z0-9]/gi, '')+'" onclick="prolongFreeFeed(this)" data-action="prolong" data-feedId="'+jsonResponse.preview[0].feed_id.replace(/[^a-z0-9]/gi, '')+'" class="button btn" title="Maximum of days to prolong is 30 days from today!">Prolong</span>';
                                }else{
                                    var prolong = '<span id="prolong'+jsonResponse.preview[0].feed_id.replace(/[^a-z0-9]/gi, '')+'">' + jsonResponse.preview[0].paidUpToDay.replace(/[^0-9\:\-\s]/gi, '') + '</span>';
                                }
                                box = box + '<tr><td>Active until: </td><td class="paidUntill">' + prolong;
                                box = box + '</td></tr></table>';
                                var trailer = '';
                                if(jsonResponse.preview[0].lastGenerated=='Awaiting processing'){
                                    trailer = trailer + '<div class="trailerMiniBox trailerMiniBoxOrange"><span class="trailerMini trailerMiniOrange">NEW</span></div>';
                                }else{
                                    trailer = trailer + '<div class="trailerMiniBox"><span class="trailerMini">Ready</span></div>';   
                                }
                                if(jsonResponse.preview[0].paymentMode=='FreeRezim'){
                                    trailer = trailer + '<span class="trailer">14 days FREE</span>';
                                }
                                if(jsonResponse.preview[0].paymentMode=='KodZdarmaRezim'){
                                    trailer = trailer + '<span class="trailer">Promotions</span>';
                                }
                                if(jsonResponse.preview[0].paymentMode=='Free_10_Item'){
                                    trailer = trailer + '<span class="trailer">FREE</span>';
                                }                                 
                                var ajaxInfoCoverEditMyFeed = '<div class="ajaxInfoCoverEditMyFeed '+jsonResponse.preview[0].feed_id.replace(/[^a-z0-9]/gi, '')+'"></div>';
                                box = '<div id="box'+jsonResponse.preview[0].feed_id.replace(/[^a-z0-9]/gi, '')+'" class="editMyFeedClosest" style="">' +ajaxInfoCoverEditMyFeed + trailer + box + '</div>';
                                
                                $("#myFeedsXmlCanvas").prepend(box);

                                $('#creditBalance').html('$ '+jsonResponse.credit.replace(/[^0-9]/gi, ''));

                                $('#trgNewOrder').trigger('click');

                            }
                        }
                 });                 
             }
        });
         
});
  
  
function closeInfo(closeThis){
    $('.'+closeThis).hide();
}

function startStopFeed(obj) {
    var startStopAction = $(obj).attr('data-action').replace(/[^a-z]/gi, '');
    var feedId = $(obj).attr('data-feedId').replace(/[^a-z0-9]/gi, '');
    var apiKey = $('#userApiKeyInput').val().replace(/[^a-z0-9\_]/gi, '');
    $.ajax({
            type: "POST",
            dataType: 'json', 
            url: 'https://api.xmlcanvas.com/2.0/'+apiKey+'/edit_my_feed/',
            data: 'feed_id='+feedId+'&action='+startStopAction,                
            success: function(jsonResponse){
//                console.log(jsonResponse);
                if(jsonResponse.detail){
                    $('.'+feedId).html('<span class="closeInfo" onclick="closeInfo(\''+feedId+'\')">�</span>Ou, something is wrong<br><br>');
                    $('.'+feedId).append('<h2>This xml feed can not be activated.</h2>');                            
                    $('.'+feedId).append('Error detail: <p>'+jsonResponse.detail.replace(/[^a-z0-9\,\:\-\.\s]/gi, '')+'</p>');
                    $('.'+feedId).show();
                }else{
                    $('#creditBalance').html('$ '+jsonResponse.credit.replace(/[^0-9]/gi, ''));
                    $('#box'+feedId+' .lastGenerated').text(jsonResponse.preview[0].lastGenerated.replace(/[^0-9\:\-\s]/gi, ''));
                    $('#prolong'+feedId).text(jsonResponse.preview[0].paidUpToDay.replace(/[^0-9\:\-\s]/gi, ''));
                    if(parseInt(jsonResponse.preview[0].userStop)==1){
                        $(obj).attr('data-action', 'start');
                        $(obj).text('Start');
                        if(jsonResponse.preview[0].paymentMode=='Free_10_Item'){
                            var prolong = '<span id="prolong'+feedId+'">' + jsonResponse.preview[0].paidUpToDay.replace(/[^0-9\:\-\s]/gi, '') + '</span>';
                            $('#box'+feedId+' .paidUntill').html(prolong);
                        }
                    }
                    if(parseInt(jsonResponse.preview[0].userStop)==0){                    
                        $(obj).attr('data-action', 'stop');
                        $(obj).text('Stop');
                        if(jsonResponse.preview[0].paymentMode=='Free_10_Item'){
                            var prolong = '<span id="prolong'+feedId+'">' + jsonResponse.preview[0].paidUpToDay.split(" ")[0].replace(/[^0-9\:\-\s]/gi, '') + '</span>  <span onclick="prolongFreeFeed(this)" data-action="prolong" data-feedId="'+feedId+'" class="button btn" title="Maximum of days to prolong is 30 days from today!">Prolong</span>';                            
                            $('#box'+feedId+' .paidUntill').html(prolong);
                        }                        
                    }
                    $('#box'+feedId+' .trailer').remove();
                    $('#box'+feedId+' .trailerMiniBox').remove();
                    var trailer = '';
                    if(jsonResponse.preview[0].lastGenerated=='Awaiting processing'){
                        trailer = trailer + '<div class="trailerMiniBox trailerMiniBoxOrange"><span class="trailerMini trailerMiniOrange">NEW</span></div>';
                    }else{
                        trailer = trailer + '<div class="trailerMiniBox"><span class="trailerMini">Ready</span></div>';   
                    }
                    if(parseInt(jsonResponse.preview[0].userStop)==1){
                        trailer = trailer + '<span class="trailer" style="color:red">PAUSE</span>';
                    }else{
                        if(jsonResponse.preview[0].paymentMode=='FreeRezim'){
                            trailer = trailer + '<span class="trailer">14 days FREE</span>';
                        }
                        if(jsonResponse.preview[0].paymentMode=='KodZdarmaRezim'){
                            trailer = trailer + '<span class="trailer">Promotions</span>';
                        }
                        if(jsonResponse.preview[0].paymentMode=='Free_10_Item'){
                            trailer = trailer + '<span class="trailer">FREE</span>';
                        } 
                    }
                    
                    $('#box'+feedId+'').prepend(trailer);

                }                        

            }
    });        
};

function prolongFreeFeed(obj) {
    var prolongDays = 30;
    var feedId = $(obj).attr('data-feedId').replace(/[^a-z0-9]/gi, '');
    var apiKey = $('#userApiKeyInput').val().replace(/[^a-z0-9\_]/gi, '');
    $.ajax({
            type: "POST",
            dataType: 'json', 
            url: 'https://api.xmlcanvas.com/2.0/'+apiKey+'/prolong_free_mode/',
            data: 'feed_id='+feedId+'&prolong_days='+prolongDays,                
            success: function(jsonResponse){
//                console.log(jsonResponse);
                if(jsonResponse.detail){
                    $('.'+feedId).html('<span class="closeInfo" onclick="closeInfo(\''+feedId.replace(/[^a-z0-9\s]/gi, '')+'\')">�</span>Ou, something is wrong<br><br>');
                    $('.'+feedId).append('<h2>This xml feed can not be prolong.</h2>');                            
                    $('.'+feedId).append('Error detail: <p>'+jsonResponse.detail.replace(/[^a-z0-9\,\:\-\.\s]/gi, '')+'</p>');
                    $('.'+feedId).show();
                }else{
                    $('#prolong'+feedId).text(jsonResponse.preview[0].paidUpToDay.replace(/[^0-9\:\-\s]/gi, ''));
                }                
            }    
    });            
}


