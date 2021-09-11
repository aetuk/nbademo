//var NoTooltipMsg = 'No Description provided.';

$(document).ready(function() {  
		jQuery.support.cors = true; //support cross domain
        
		//set current date time
		var formattedDateTime = jQuery.datepicker.formatDate("DD, dd/mm/yy", new Date());
		$("#CurrentDateTime").html(formattedDateTime);
		
		$("#tabs").tabs();
		
		var urlPrefix = location.protocol + '//' + location.host;
		
		//load customer list
        jQuery.ajax( {
            type: "GET", //HTTP method
            //url: urlPrefix + "/prweb/PRRestService/CustomerNBAAServiceREST/NBAACustomer/GetCustomerListFlat", //page/method name
			url : "GetCustomerListFlat.json",
            dataType: "json",
            success: function(msg) { //handle the callback to handle response                
            	setSelectOptions($('#customersList'), msg, 'Case_ID', 'Full_Name');
          	},
          error: function(XMLHttpRequest, textStatus, errorThrown) {
              alert(textStatus + " " + errorThrown);
          }
       });
        
        $( "#customersList" ).change(function() {
        	if ( $('#customersList').val()==""){
        		return;
        	}
        	//reset tabs
        	$( "#tabs" ).tabs( "option", "active", 0 );
        	$( "#OnlineMsgMessageBody" ).html( "");
        	
        	
        	 jQuery.ajax( {
                 type: "GET", //HTTP method
                 //url: urlPrefix + "/prweb/PRRestService/CustomerNBAAServiceREST/NBAACustomer/GetCustomerProfile/" +$('#customersList').val()+ "/",
				 url : "GetCustomerProfile.json",
                 dataType: "json",
                 username: admUserName,
                 password: admPassword,
                 async: false,
                 success: function(msg) { //handle the callback to handle response
                	 var customerProfile = msg["CustomerProfile"];
                	 
                	 $('#AccNoCurrent').text(customerProfile["AccNoCurrent"]);
                	 $('#AccNoMastercard').text(customerProfile["AccNoMastercard"]);
                	 $('#AccNoSavings').text(customerProfile["AccNoSavings"]);
                	 
                	 $('#CurrentAccountBalance').text(customerProfile["CurrentBalance"]);
                	 $('#CreditCardBalance').text(    customerProfile["ExternalCreditCardBalance"]);
                	 $('#CurrentSavingBalance').text( customerProfile["CurrentSavingsBalance"]);
                	 
                	 $('#CurrentAccountBalanceSuffix').text( msg["CurrentAccountBalanceSuffix"]);
                	 $('#CreditCardBalanceSuffix').text		(msg["ExternalCreditCardAccountBalanceSuffix"]);
                	 $('#CurrentSavingBalanceSuffix').text(  msg["CurrentSavingsAccounBalanceSuffix"]);
                	 
                	 $('#TotalCreditBalance').text(  msg["TotalCreditBalance"]);
                	 $('#TotalDebitBalance').text(   msg["TotalDebitBalance"]);
                	 $('#NetPosition').text(         msg["NetPosition"]);
                	 
                	 $('#TotalCreditBalanceSuffix').text(     msg["TotalCreditBalanceSuffix"]);
                	 $('#TotalDebitBalanceSuffix').text(      "DR");
                	 $('#NetPositionSuffix').text(            msg["NetPositionSuffix"]);
                	 
                	 return;
                	 var output = '';
                		for (property in msg) {
                			output += property + ': ' + msg[property]+'; ';
                		}

                	 alert(output);
               	},
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(textStatus + " " + errorThrown);
               }
            });
        	 
        	 //HTTP method - can be used send complex data - or just more data The POST request method is designed to 
             //request that a web server accept the data enclosed in the request message's body
        	  jQuery.ajax( {
                 type: "POST", 
                 url: urlPrefix + "/prweb/PRRestService/CustomerNBAAServiceREST/NBAACustomer/GetCustomerOffers/",
                 dataType: "json",
                 username: admUserName,
                 password: admPassword,
                 data: JSON.stringify( {CustomerID: $('#customersList').val()}),
                 success: function(msg) { //handle the callback to handle response
                	 var welcomeBanner =     msg["WelcomeBanner"];
                	 var rightHandBanner =   msg["RightHandBanner"];
                	 var onlineMsgInbox =  	 msg["OnlineMsgInbox"];
                	 var promotionProduct =  msg["PopupWindow"];
                	 
                	 //===== Welcome Banner START
                	 var welcomeClickURL = welcomeBanner["ClickThroughUrl"];
                	 var welcomeClickURLexists = true;
                	 	welcomeClickURLexists = !(welcomeClickURL==null || welcomeClickURL===undefined || welcomeClickURL=="");
                	 
                	 var welcomeBannerImg = '<img id="welcomeBannerImage" src=\"' + welcomeBanner["Image"] + '\"/>';
                	 var welcomeBannerTooltip=welcomeBanner["Display_Name"];
                	 welcomeBannerImg = '<a id="welcomeBannerImageLink" href="#" title="'+ welcomeBannerTooltip + '">'+ welcomeBannerImg + '</a>';
                	 $("#WelcomeBannerImg").html(welcomeBannerImg);

                	 $( "#welcomeBannerImageLink" ).click(function() {
                       	 if (welcomeClickURLexists==true){
                       		 window.open(welcomeClickURL, '_blank');
                          }
             			  saveResponse($('#customersList').val(), welcomeBanner["pxIdentifier"], "RESPONSE",  !welcomeClickURLexists);
                	 });
                	 
                	registerTooltip("welcomeBannerImageLink");
                	 
                	 //$("#WelcomeBannerText").html(''+welcomeBanner["ShortDescription"]+'');
                	 //============= Welcome Banner FINISH

                	 //===== Promotion Product START
                	 if (promotionProduct!=null){
                		 $( "#PromotionProductRow").css("display", "");
                		 var promotionProductName = promotionProduct["ShortDescription"];
                		 var promotionProductClickURL = promotionProduct["ClickThroughUrl"];
                		 var promotionProductImage = promotionProduct["Image"];
                		 var PromotionProductTooltip = promotionProduct["Display_Name"];;
                		 
                		 var promotionProductClickURLExists = true;
                		 promotionProductClickURLExists = !(promotionProductClickURL==null || promotionProductClickURL===undefined || promotionProductClickURL=="");
                		 
                		 var promotionProductImg = '<img id="PromotionProductImage" src=\"' + promotionProductImage + '\"/>';
                		 var promotionProductImgHtml = '<a id="PromotionProductImageLink" href="#" title="'+ PromotionProductTooltip +'" >'+ promotionProductImg + '</a>';
                		 $( "#PromotionProductImage").html(promotionProductImgHtml); //product image
                		 
                		 $( "#PromotionProductImageLink" ).click(function() {
	                		 if (promotionProductClickURLExists==true){		
	                			 window.open(promotionProductClickURL, '_blank');
	                		 }
              				saveResponse($('#customersList').val(), promotionProduct["pxIdentifier"], "RESPONSE", !promotionProductClickURLExists );
                 		 });     
                		 
                		 registerTooltip("PromotionProductImageLink");
                		 
                		 var PromotionProductShortDescription="";
                		 PromotionProductShortDescription+='<span id="promotionProductNameDiv" title="'+PromotionProductTooltip +'">'+promotionProductName+'</span>';
                		 PromotionProductShortDescription+='<br>';
                		 PromotionProductShortDescription+='<div  style="white-space: nowrap;float:right;width:20%;" ><a id="PromotionProductDescriptionLink" href="#" style="color:green;" title="'+PromotionProductTooltip +'" >Learn more</a></div>';
                		 
                		 $( "#PromotionProductShortDescription").html(PromotionProductShortDescription); //product name

                		 $( "#PromotionProductDescriptionLink" ).click(function() {
	                		 if (promotionProductClickURLExists==true){		
	                			 window.open(promotionProductClickURL, '_blank');
	                		 }
              				saveResponse($('#customersList').val(), promotionProduct["pxIdentifier"], "RESPONSE", !promotionProductClickURLExists );
                 		 });
                		 registerTooltip("PromotionProductDescriptionLink");
                		 registerTooltip("promotionProductNameDiv");
                	 }else{
                		 $( "#PromotionProductRow").css("display", "none");
                		 $( "#PromotionProductImage").html(""); //product image
                		 $( "#PromotionProductShortDescription").html(""); //product image
                	 }
                	 //===== Promotion Product FINISH
                	 
                	 //==================== Right Hand Banners Start
                	 var numberOfRightHandBanners = 0;
                	 try{
                		 numberOfRightHandBanners = rightHandBanner.length;
                 	}catch (e){}
                 	
                 	if(numberOfRightHandBanners>0){
	                 	$("#RightHandBannerContainer").html("");
	                 	
	                   	 $.each(rightHandBanner, function(index, value) {
	                   		var RHBClickURL = value.ClickThroughUrl;
	                   		var RHBClickURLexists = true;
	                   		
	                   		RHBClickURLexists = !(RHBClickURL==null || RHBClickURL===undefined || RHBClickURL=="");
	                   		
	                   		var RHBLinkId = "RHBannerLink"+index;
	                   		
	                   		var RHBannerHTML = "";
	                   		RHBannerHTML+='<div class="tile-ad">';
	                   		RHBannerHTML+='<h4>' + value.ShortDescription +'</h4>';
	                   		var RHBannerImageId= RHBLinkId+ 'Image';
	                   		RHBannerImage = '<img id="'+ RHBannerImageId+'" style="max-width:100%" src=\"' + value.Image + '\"/>';
	                   		var RHBannerTooltip = value.Display_Name;
                   			RHBannerImage='<a id="'+ RHBLinkId + '" href="#" title="' + RHBannerTooltip + '">'+ RHBannerImage + '</a>';

                   			RHBannerHTML +=RHBannerImage;
                   			RHBannerHTML +='</div>';
	                   		$("#RightHandBannerContainer").append(RHBannerHTML);

                   			$( "#"+RHBLinkId ).click(function() {
                   				if (RHBClickURLexists==true){		
                   					window.open(RHBClickURL, '_blank');
                   				}
                 				saveResponse($('#customersList').val(), value.pxIdentifier, "RESPONSE",  !RHBClickURLexists);
                    		 });
                   			registerRHBannerTooltip(RHBannerImageId);
	                   		
	                   	});
                 	}
                	//====================== Inbox Messages Start
                	var numberOfMessages = 0;
                	try{
                		numberOfMessages = onlineMsgInbox.length;
                	}catch (e){}
                	
                	$("#OnlineMsgInboxNumber").html( numberOfMessages );
                	if (numberOfMessages>0){
                		$("#OnlineMsgInboxBody").html("");
                	 
                		$.each(onlineMsgInbox, function(index, value) {
                			var clickURL = value.ClickThroughUrl;
                			var clickURLexists = true;
                			clickURLexists = !(clickURL==null || clickURL===undefined || clickURL=="");
                			
                			var linkId = 'OnlineMsgInboxBodyLink'+ index;
                			var inboxMsgRowId = 'InboxMsgMessageRow'+index;
                			var inboxMsgRowButtonId = 'inboxMsgRowButton'+index;
                			var pxIdentifier = value.pxIdentifier;
                			var inboxRowTooltip = value.Display_Name;
                			
                			$("#OnlineMsgInboxBody").append('<tr><td><a id="'+ linkId +'" href="#" title="'+ inboxRowTooltip +'" >' +   value.Display_Name+ '</a></td></tr>');
                			
                			var inboxMsgLine = '<tr id=\"' + inboxMsgRowId + '\" style="display:none;">';
                			inboxMsgLine+='<td><img src="'+ value.Image +'\"></td>';
                			inboxMsgLine+='<td>'+value.ShortDescription;
                			if (clickURLexists==true){
                				inboxMsgLine+='<br/><div style="white-space: nowrap;float:right;width:20%;"><a href="#" style="color:green;" id=\"' + inboxMsgRowButtonId+ '\">Learn more</a></div>';	
                			}
                			inboxMsgLine+='</td></tr>';
                			
                			$("#OnlineMsgMessageBody").append(inboxMsgLine);
                			
                			$( "#"+inboxMsgRowButtonId ).click(function() {
                				window.open(clickURL, '_blank');
                				saveResponse($('#customersList').val(), pxIdentifier, "RESPONSE", !clickURLexists );
                			});
                			
                			registerTooltip(linkId);
                			
                					
                			$( "#"+linkId ).click(function() {
                				var allInboxElements = $('tr[id^=InboxMsgMessageRow]');
                        		
                				$.each(allInboxElements, function(index, value) {
                					$( "#"+value.id).css("display", "none");
                        		});
                				
                				$( "#tabs" ).tabs( "option", "active", 1 );
                				$( "#"+inboxMsgRowId).css("display", "block");
                			});
               			});
                 	}
                	 
                	 return;
                	 
                	 var output = '';
                		for (property in msg) {
                			output += property + ': ' + msg[property]+'; ';
                		}

                	 alert(output);
               	},
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                   alert(textStatus + " " + errorThrown);
               }
            }); 
        	 
        });//change event end
});

function saveResponse(CustomerID, TreatmentID, EventID, IsShowConfirmation){
	
	var urlPrefix = location.protocol + '//' + location.host;
	
	jQuery.ajax( {
        type: "POST", //HTTP method
        url: urlPrefix + "/prweb/PRRestService/CustomerNBAAServiceREST/NBAACustomer/GetCustomerOffers/",
        dataType: "json",
        contentType:"application/json; charset=utf-8",
        username: admUserName,
        password: admPassword,
        data: JSON.stringify({CustomerID: CustomerID, TreatmentID: TreatmentID, EventID:EventID }),
        //async: false,
        success: function(msg) { //handle the callback to handle response
        	if (IsShowConfirmation==true){
        		showConfirmation();
        	}
        	
       	 	return;
       	 var output = '';
       		for (property in msg) {
       			output += property + ': ' + msg[property]+'; ';
       		}

       	 alert(output);
      	},
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          alert(textStatus + " " + errorThrown);
      }
   });
	//======= SaveCustomerResponse FINISH
}

function showConfirmation() {
    $( "#dialog-message" ).dialog({
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
}

function registerTooltip(elementID){ 
	$( "#"+elementID ).tooltip({
	    show: null,
	    position: {
	      my: "left top",
	      at: "left bottom"
	    },
	    open: function( event, ui ) {
	      ui.tooltip.animate({ top: ui.tooltip.position().top +10 }, "fast" );
	    }
	});
}


function registerRHBannerTooltip(elementID){ 
	$( "#"+elementID ).tooltip({
	    position: {
            my: "right bottom"
        },
        //tooltipClass: "entry-tooltip-positioner",
	    open: function( event, ui ) {
	      ui.tooltip.animate({ top: ui.tooltip.position().top }, "fast" );
	    }
	});
	
	/*JQuery tooltips
	.entry {
	    position: relative;
	    right: -200px;
	    width: 500px;
	}
	.entry-tooltip-positioner {
	    position: fixed !important;
	    left: -130px !important;
	}
	*/
}
