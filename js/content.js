if(!screenShotType){var screenShotType="Visible Part";let captureScreenshot;let recordScreen;let helpers;let recordAnnotation;let quixyuserData;let preScreenshotLength=0;let isCameraRecord;let isMicrophoneRecord;let isPanelRecord;let isPlayRecord;let extPrefix="OCR_";window.onbeforeunload=function(event){if(!recordScreen.userConfirmedClose&&recordScreen.recordingStarted&&recordScreen.recordingType!=1){const confirmationMessage="Screen Recording will be cancelled if you chose to reload the page?";(event||window.event).returnValue=confirmationMessage;return confirmationMessage}};window.onload=function(){helpers=new helperSG;captureScreenshot=new captureScreenshotSG;recordAnnotation=new recordAnnotationSG;recordScreen=new recordScreenSG;chrome.storage.local.get(`${extPrefix}isRecorderStarted`,async function(obj){if(obj[`${extPrefix}isRecorderStarted`]){chrome.storage.local.get(`${extPrefix}setRecorderToolData`,async function(obj){let data=obj[`${extPrefix}setRecorderToolData`];let dataArr=data.split("-");recordScreen.recordingType=dataArr[5];if(recordScreen.recordingType==1){recordScreen.displayControls(undefined,true,undefined,dataArr[6],function(){recordScreen.updateControlBarTime(dataArr[0])})}else{recordScreen.isCancelledRecord=true;recordScreen.stopScreenRecording()}})}});const tokenAuth=localStorage.getItem(`${extPrefix}screenGeniusAuthToken`);let authTime=localStorage.getItem(`${extPrefix}screenGeniusAuthTime`);if(authTime&&authTime!==null){authTime=parseInt(authTime)}const realTime=new Date(authTime);chrome.storage.local.get(`${extPrefix}quixyLoginUserData`,result=>{if((tokenAuth==null||tokenAuth==undefined||tokenAuth=="")&&document.location.origin===helpers.dashboard){if(result[`${extPrefix}quixyLoginUserData`]!==undefined&&result[`${extPrefix}quixyLoginUserData`]!==""&&result[`${extPrefix}quixyLoginUserData`]!==null){if(result[`${extPrefix}quixyLoginUserData`]?.screenGeniusAuthTime>authTime){localStorage.setItem(`${extPrefix}screenGeniusAuthToken`,result[`${extPrefix}quixyLoginUserData`].access_token);localStorage.setItem(`${extPrefix}screenGeniusUserID`,result[`${extPrefix}quixyLoginUserData`].id);localStorage.setItem(`${extPrefix}screenGeniusAuthTime`,Date.now());document.location.reload()}}else{localStorage.removeItem(`${extPrefix}screenGeniusAuthToken`);chrome.runtime.sendMessage({type:"quixyUserLogoutCall"})}}else{setTimeout(function(){let tokenAuth=localStorage.getItem(`${extPrefix}screenGeniusAuthToken`);let authTime=localStorage.getItem(`${extPrefix}screenGeniusAuthTime`);if(tokenAuth!==""){chrome.storage.local.get(`${extPrefix}quixyLoginUserData`,result=>{if(result[`${extPrefix}quixyLoginUserData`]!==undefined&&result[`${extPrefix}quixyLoginUserData`]!==""&&result[`${extPrefix}quixyLoginUserData`]!==null&&result[`${extPrefix}quixyLoginUserData`].screenGeniusAuthTime>authTime){localStorage.setItem(`${extPrefix}screenGeniusAuthToken`,result[`${extPrefix}quixyLoginUserData`].access_token);localStorage.setItem(`${extPrefix}screenGeniusUserID`,result[`${extPrefix}quixyLoginUserData`].id);localStorage.setItem(`${extPrefix}screenGeniusAuthTime`,Date.now());if(document.location.origin===helpers.dashboard){document.location.reload()}}else{chrome.runtime.sendMessage({type:"getActiveSessionCall",token:tokenAuth})}})}},500)}})};chrome.runtime.onMessage.addListener(async(request,sender,sendResponse)=>{if(request.type==="removeAuthToken"){localStorage.removeItem(`${extPrefix}screenGeniusAuthToken`)}else if(request.type=="captureFirstTime"){if(document.readyState!=="complete"){alert("This page is not fully loaded yet so please wait for this page to load first.");return}if(request.uploadType!="Local"){chrome.storage.local.get(`${extPrefix}quixyLoginUserData`,function(res){quixyuserData=res[`${extPrefix}quixyLoginUserData`];if(quixyuserData&&quixyuserData.screenshots&&quixyuserData.screenshots==recordScreen.imagesLimit){let text="You have reached max upload limit so you cannot upload screenshots to cloud. Do you want to continue with local download?";if(confirm(text)){request.uploadType="Local";captureScreenshot.captureFullScreenshotsRequest(request)}}else{captureScreenshot.captureFullScreenshotsRequest(request)}})}else{captureScreenshot.captureFullScreenshotsRequest(request)}}else if(request.type=="captureVisibleAreaNoScrollPresentRes"){if(request.dataUri!==undefined&&request.dataUri!="data:,"){captureScreenshot.baseImgArr.push(request.dataUri);captureScreenshot.fullScreenCaptured(request.mode)}}else if(request.type=="sendScroll"){if(request.dataUri!==undefined&&request.dataUri!="data:,"&&captureScreenshot.requestSentToCaptureScreen>0&&(preScreenshotLength==0||preScreenshotLength!==request.dataUri.length)){preScreenshotLength=request.dataUri.length;captureScreenshot.requestReceivedOnceScreenCaptured=captureScreenshot.requestReceivedOnceScreenCaptured+1;captureScreenshot.baseImgArr.push(request.dataUri);captureScreenshot.scrollWindowManual(request.mode)}}else if(request.type=="getGoogleAuth"){jQuery.ajax({url:"https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="+request.authToken,success:function(result){helpers.googleLoginPopup(result)}})}else if(request.type=="closePreviousWindow"){captureScreenshot.canvas_background=null;captureScreenshot.isCanvasBackground=0;if(document.getElementById("canvas_background")){document.getElementById("canvas_background").remove();jQuery("#close-captureScreen").unbind("click");jQuery("#close-captureScreen").remove()}}else if(request.type=="videocapture"){if(document.readyState!=="complete"){alert("This page is not fully loaded yet so please wait for this page to load first.");return}if(request.uploadType!="Local"){chrome.storage.local.get(`${extPrefix}quixyLoginUserData`,function(res){quixyuserData=res[`${extPrefix}quixyLoginUserData`];if(quixyuserData.videos==recordScreen.videosLimit){let text="You have reached max upload limit so you cannot upload videos to cloud. Do you want to continue with local download?";if(confirm(text)){request.uploadType="Local";chrome.storage.local.get(`${extPrefix}isDevicesPermitted`,function(resultR){let isDevicesPermitted=resultR[`${extPrefix}isDevicesPermitted`];if(!isDevicesPermitted){let text="You have blocked access to Camera and Microphone which cannot be allowed while recording. Permissions can be allowed under tab settings. Do you want to continue without Camera and Microphone permissions?";if(confirm(text)){chrome.runtime.sendMessage({type:"videocaptureScreen",event:request})}}else{chrome.runtime.sendMessage({type:"videocaptureScreen",event:request})}})}}else{chrome.storage.local.get(`${extPrefix}isDevicesPermitted`,function(resultR){let isDevicesPermitted=resultR[`${extPrefix}isDevicesPermitted`];if(!isDevicesPermitted){let text="You have blocked access to Camera and Microphone which cannot be allowed while recording. Permissions can be allowed under tab settings. Do you want to continue without Camera and Microphone permissions?";if(confirm(text)){chrome.runtime.sendMessage({type:"videocaptureScreen",event:request})}}else{chrome.runtime.sendMessage({type:"videocaptureScreen",event:request})}})}})}else{chrome.storage.local.get(`${extPrefix}isDevicesPermitted`,function(resultR){let isDevicesPermitted=resultR[`${extPrefix}isDevicesPermitted`];if(!isDevicesPermitted){let text="You have blocked access to Camera and Microphone which cannot be allowed while recording. Permissions can be allowed under tab settings. Do you want to continue without Camera and Microphone permissions?";if(confirm(text)){chrome.runtime.sendMessage({type:"videocaptureScreen",event:request})}}else{chrome.runtime.sendMessage({type:"videocaptureScreen",event:request})}})}}else if(request.type=="videocaptureScreenResponseEntire"){chrome.storage.local.get(`${extPrefix}isDevicesAvailable`,function(resultR){recordScreen.isDevicesAvailable=resultR[`${extPrefix}isDevicesAvailable`];try{recordScreen.quix_startCapture(request.event,request.currentTab)}catch(error){window.top.close()}})}else if(request.type=="videocaptureScreenResponse"){chrome.storage.local.get(`${extPrefix}isDevicesAvailable`,function(resultR){recordScreen.isDevicesAvailable=resultR[`${extPrefix}isDevicesAvailable`];let data7={[`${extPrefix}isPictureInPicture`]:false};chrome.storage.local.set(data7,function(){});recordScreen.exitPictureInPicture();setTimeout(function(){recordScreen.quix_startCapture(request.event,"")},200)})}else if(request.type=="toolbarEvents"){switch(request.eventType){case"cam":recordScreen.toolbarToggleCam(request.eventVal);break;case"mic":recordScreen.toolbarToggleMic(request.eventVal);break;case"timer":break;case"panel":recordScreen.hidePanelRecording(request.eventVal);break;case"delete":recordScreen.isCancelledRecord=true;recordScreen.cancelScreenRecording();break;case"pause":recordScreen.toolbarPlayPause(request.eventVal);break;case"stop":recordScreen.isCancelledRecord=false;if(recordScreen.recordingType==1){chrome.runtime.sendMessage({type:"executeScriptInallTabs",reqType:"hideToolbar"})}recordScreen.stopScreenRecording();break;default:}}else if(request.type=="quixyShareFeedback"){helpers.shareFeedbackPopup()}else if(request.type=="quixyUserLogin"){chrome.runtime.sendMessage({type:"quixyUserLoginCallback",event:request})}else if(request.type=="getActiveSession"){chrome.runtime.sendMessage({type:"getActiveSessionCall"})}else if(request.type=="quixyUserLoginResponse"){jQuery.ajax({url:"https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="+request.token,success:function(result){chrome.runtime.sendMessage({type:"quixyUserLoginXMLCall",res:result})}})}else if(request.type=="quixyUserLogout"){helpers.handleQuixyLogOut()}else if(request.type=="handleQuixyDashboardLogout"){localStorage.removeItem(`${extPrefix}screenGeniusAuthToken`);localStorage.removeItem(`${extPrefix}screenGeniusUserID`);localStorage.removeItem(`${extPrefix}screenGeniusAuthTime`)}else if(request.type=="getAttachedDevices"){recordScreen.handleGetDevices(request.isMic,request.isCam)}else if(request.type=="enableCamOnScreen"){if(request.isCam){let data7={[`${extPrefix}isPictureInPicture`]:false};chrome.storage.local.set(data7,function(){});recordScreen.recordingType=1;recordScreen.isCameraRecord=true;recordScreen.recordCameraScreen()}else{recordScreen.recordingType=1;recordScreen.isCameraRecord=false;recordScreen.stopCameraScreen()}}else if(request.type=="quixyGotoDashboard"){chrome.runtime.sendMessage({type:"quixyGotoDashboardCallback",event:request})}else if(request.type=="quixyGotoUpgradePlan"){chrome.runtime.sendMessage({type:"quixyGotoUpgradePlanCallback",event:request})}else if(request.type=="quixyGotoUgradeAccount"){var quixuserData="one";chrome.storage.local.get(`${extPrefix}quixyLoginUserData`,async result=>{quixuserData=await result[`${extPrefix}quixyLoginUserData`];if(quixuserData.email){helpers.upgradeAccountpopup(quixuserData.id,quixuserData.name,quixuserData.email,quixuserData.picture)}})}else if(request.type=="quixyGoToForgotPassword"){chrome.runtime.sendMessage({type:"quixyGoToForgotPasswordCallback",event:request})}else if(request.type=="quixyGoToTraditionalSignUp"){chrome.runtime.sendMessage({type:"quixyGoToTraditionalSignUpCallback",event:request})}else if(request.type=="quixyTraditionalSignIn"){helpers.handleQuixyLogIn(request.data,result=>{console.log(result,"fsdlk");if(result&&result.status==true){chrome.runtime.sendMessage({type:"quixyuserData",user:result.data})}else{if(result.responseJSON&&!result.responseJSON.status){helpers.failureMessagePopup(result.responseJSON.message,"Please try again")}else{helpers.failureMessagePopup("Something went wrong","Please try again")}chrome.runtime.sendMessage({type:"quixyLoginFailed"})}})}else if(request.type=="quixyGotoQuixy"){chrome.runtime.sendMessage({type:"quixyGotoQuixyCallback",event:request})}else if(request.type=="quixyGotoQuixyLogin"){}else if(request.type=="quixyGotoQuixyLoginGoogle"){chrome.runtime.sendMessage({type:"quixyUserLoginCallback",event:request})}else if(request.type=="quixyGotoQuixyLoginFacebook"){chrome.runtime.sendMessage({type:"quixyGotoQuixyLoginFacebook",event:request})}else if(request.type=="quixyGotoQuixyLoginFacebookResponse"){if(request.token){helpers.shareToFacebook("oauthPopup",request.token)}else{helpers.failureMessagePopup("Something went wrong","Please try again");chrome.runtime.sendMessage({type:"quixyLoginFailed"})}}else if(request.type=="quixyGotoQuixyLoginFacebookCallback"){chrome.runtime.sendMessage({type:"quixyUserLoginXMLCall",res:request.data})}else if(request.type=="quixyGotoQuixyLoginTwitter"){helpers.create_oauth_twitter("oauthPopup",request.tabId)}else if(request.type=="quixyGotoQuixyLoginTwitterResponsecallback"){try{let urlReq="";const requestData={caption:"post data",oauthToken:request.data[0],oauthVerifier:request.data[1]};urlReq=helpers.api+"/share/video/accessTokenTwitter";helpers.makeServerRequest("POST","json",urlReq,requestData,function(res){try{const requestData={caption:"post data",access_token:res.data.access_token,access_token_secret:res.data.access_token_secret};let urlReq="";urlReq=helpers.api+"/share/video/TwitterAuth";helpers.makeServerRequest("POST","json",urlReq,requestData,function(res){if(res.status){chrome.runtime.sendMessage({type:"quixyUserLoginXMLCall",res:res.data})}else{helpers.failureMessagePopup("Something went wrong","Please try again");chrome.runtime.sendMessage({type:"quixyLoginFailed"})}})}catch(error){helpers.failureMessagePopup("Something went wrong","Please try again");chrome.runtime.sendMessage({type:"quixyLoginFailed"})}})}catch(error){helpers.failureMessagePopup("Something went wrong","Please try again");chrome.runtime.sendMessage({type:"quixyLoginFailed"})}}else if(request.type=="quixyGotoQuixyLoginLinkedin"){chrome.runtime.sendMessage({type:"quixyGotoQuixyLoginLinkedin",event:request})}else if(request.type=="quixyGotoQuixyLoginLinkedinResponse"){try{const token=request.data[0];const authData=request.data[1];const tabId=request.data[2];helpers.oauth_LinkedIn_Access_Token(token,authData,"popup",tabId)}catch(error){helpers.failureMessagePopup("Something went wrong","Please try again");chrome.runtime.sendMessage({type:"quixyLoginFailed"})}}else if(request.type=="quixyGotoQuixyLoginLinkedinResponseFinal"){const profileData=request.data[0];if(profileData){chrome.runtime.sendMessage({type:"quixyUserLoginXMLCall",res:profileData})}else{helpers.failureMessagePopup("Something went wrong","Please try again");chrome.runtime.sendMessage({type:"quixyLoginFailed"})}}else if(request.type=="quixyLoginFailed"){chrome.runtime.sendMessage({type:"quixyLoginFailed"});helpers.failureMessagePopup("Something went wrong","Please try again")}else if(request.type=="quixyOpenEditor"){chrome.runtime.sendMessage({type:"quixyOpenEditorCallback",event:request})}else if(request.type=="extensionPopupClosed"){if(!request.isRecording&&recordScreen&&recordScreen.inPIPMode){recordScreen.toolbarToggleCam("disabled")}}else if(request.type=="OCR_textExtracted"){helpers.handleExtractedText(request.data,request.ocrImageData)}else if(request.type=="remove-ocr-elems-present-in-screen"){helpers.removeOcrElements()}else if(request.type=="executeScriptInallTabsCallback"){if(request.event.reqType=="hideToolbar"){recordScreen.isCancelledRecord=false;recordScreen.stopScreenRecording("other")}else if(request.event.reqType=="cancelToolbar"){recordScreen.isCancelledRecord=true;recordScreen.stopScreenRecording("other")}else if(request.event.reqType=="toolbarEventsAllTabsTimer"){recordScreen.updateControlBarTime(request.event.badgeText)}else if(request.event.reqType=="toolbarEventsAllTabs"){recordScreen.updateControlBarStates(request.event.reqSubType,request.event.reqVal)}else{let autostopVal=request.event.autostopVal;let recordDelay=request.event.recordDelay;let delayD=request.event.delayD;let recType=request.event.recordingType;isCameraRecord=request.event.isCamera;isMicrophoneRecord=request.event.isMicrophone;isPanelRecord=request.event.isPanel;isPlayRecord=request.event.isPlay;recordScreen.recordingType=recType;chrome.storage.local.get(`${extPrefix}isDevicesAvailable`,function(resultR){recordScreen.isDevicesAvailable=resultR[`${extPrefix}isDevicesAvailable`];recordScreen.displayControls(autostopVal,delayD,recordDelay,recordScreen.isDevicesAvailable,function(){})})}}else{if(document.readyState!=="complete"){alert("This page is not fully loaded yet so please wait for this page to load first.");return}if(request.uploadType!="Local"){chrome.storage.local.get(`${extPrefix}quixyLoginUserData`,function(res){quixyuserData=res[`${extPrefix}quixyLoginUserData`];if(quixyuserData&&quixyuserData.screenshots&&quixyuserData.screenshots==recordScreen.imagesLimit){let text="You have reached max upload limit so you cannot upload screenshots to cloud. Do you want to continue with local download?";if(confirm(text)){request.uploadType="Local";captureScreenshot.captureScreenshotsRequest(request)}}else{captureScreenshot.captureScreenshotsRequest(request)}})}else{captureScreenshot.captureScreenshotsRequest(request)}}let data={[`${extPrefix}quixyScreenShotType`]:screenShotType};chrome.storage.local.set(data,function(){});if(captureScreenshot){captureScreenshot.clearFinalScreenshot()}sendResponse()})}