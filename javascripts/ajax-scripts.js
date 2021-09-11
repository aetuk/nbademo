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
            //username: admUserName,
            //password: admPassword,
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
				 url : "GetCustomerProfile" + $('#customersList').val() + ".json",
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
                	 
					 // Call to nbc
					 console.log("customersList :" + $('#customersList').val());
					 console.log("CustomerAge :" + customerProfile["CustomerAge"]);
					 console.log("EventId :" + msg["EventId"]);
					 console.log("ExternalCreditCardAccountBalanceSuffix :" + msg["ExternalCreditCardAccountBalanceSuffix"]);
					 console.log("DetectChannel :" + DetectChannel());
					 
					 controller_nbc.nbc({userid: $('#customersList').val(), age: customerProfile["CustomerAge"], EventId : msg["EventId"], channel : DetectChannel() , breuserid : "aetuk", brecontext : "all"});
					 
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
        	 
        });//change event end
});


	//====================== Inbox Messages Start
function OnlineMsg(index, value) {
		
			var clickURL = value.clickurl;
        	var clickURLexists = true;
			clickURLexists = !(clickURL==null || clickURL===undefined || clickURL=="");
                			
            var linkId = 'OnlineMsgInboxBodyLink'+ index;
            var inboxMsgRowId = 'InboxMsgMessageRow'+index;
            var inboxMsgRowButtonId = 'inboxMsgRowButton'+index;
            var pxIdentifier = value.propid;
            var inboxRowTooltip = value.propname;
                			
			$("#OnlineMsgInboxBody").append('<tr><td><a id="'+ linkId +'" href="#" title="'+ inboxRowTooltip +'" >' +   value.description + '</a></td></tr>');
                			
            var inboxMsgLine = '<tr id=\"' + inboxMsgRowId + '\" style="display:none;">';
            inboxMsgLine+='<td><img src="'+ value.imageref +'\"></td>';
            inboxMsgLine+='<td>'+value.message;
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
   
	}
	
	
	function InboxPromotionMsg(index, value) {
	
			var promotionProduct = value;
	    	 //===== Promotion Product START
                	 if (promotionProduct!=null){
                		 $( "#PromotionProductRow").css("display", "");
                		 var promotionProductName = promotionProduct["description"];
                		 var promotionProductClickURL = promotionProduct["clickurl"];
                		 var promotionProductImage = promotionProduct["imageref"];
                		 var PromotionProductTooltip = promotionProduct["propname"];;
                		 
                		 var promotionProductClickURLExists = true;
                		 promotionProductClickURLExists = !(promotionProductClickURL==null || promotionProductClickURL===undefined || promotionProductClickURL=="");
                		 
                		 var promotionProductImg = '<img id="PromotionProductImage" src=\"' + promotionProductImage + '\"/>';
                		 var promotionProductImgHtml = '<a id="PromotionProductImageLink" href="#" title="'+ PromotionProductTooltip +'" >'+ promotionProductImg + '</a>';
                		 $( "#PromotionProductImage").html(promotionProductImgHtml); //product image
                		 
                		 $( "#PromotionProductImageLink" ).click(function() {
	                		 if (promotionProductClickURLExists==true){		
	                			 window.open(promotionProductClickURL, '_blank');
	                		 }
              				saveResponse($('#customersList').val(), promotionProduct["propid"], "RESPONSE", !promotionProductClickURLExists );
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
              				saveResponse($('#customersList').val(), promotionProduct["propid"], "RESPONSE", !promotionProductClickURLExists );
                 		 });
                		 registerTooltip("PromotionProductDescriptionLink");
                		 registerTooltip("promotionProductNameDiv");
                	 }else{
                		 $( "#PromotionProductRow").css("display", "none");
                		 $( "#PromotionProductImage").html(""); //product image
                		 $( "#PromotionProductShortDescription").html(""); //product image
                	 }
                	 //===== Promotion Product FINISH
}

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
