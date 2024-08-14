class IframeOptions{constructor(iframe,iframeDoc,options){this.iframe=iframe;this.iframeDoc=document;this.showEventPage=options.showEventPage;this.showOcrMainPage=options.showOcrMainPage;this.eventPageData=options.eventPageData;this.resultTextRef=options.resultTextRef;this.resultImage=options.resultImage;this.languageSelected=options.languageSelected;this.ocrBackIcon=options.ocrBackIcon;this.closeIcon=options.closeIcon}createOcrOptionsPage(){const{iframeDoc,eventPageData,ocrBackIcon,closeIcon}=this;const htmlContent=`
            <div class="quix-ocr-capture-inner ocrParentContainer OcrEventContainer">
                <div class="quix-ocr-capture-top ocrTop">
                    <div class="quix-ocr-capture-top-inner ocrTopInner">
                        <div class="quix-ocr-capture-top-inner-section ocrTopSection">
                            <div class="quix-ocr-back cursorPointer">
                                <img src="${ocrBackIcon}" alt="back" title="Go back" />
                            </div>
                            <div class="quix-ocr-capture-top-inner-section ocrTopSection">
                                <span class="Ocr-name">${eventPageData.main}</span>
                            </div>
                        </div>
                        <div class="quix-ocr-capture-top-inner-section ocrTopSection">
                            <img src="${closeIcon}" alt="" class="closeIcon" title="Close" />
                        </div>
                    </div>
                </div>
                <div class="quix-ocr-capture-mid ocrMid ocrEventMid">
                    ${eventPageData.title==="search"?`<div id="search-event">Search Event Component</div>`:""}
                    ${eventPageData.title==="translate"?`<div id="translate-event">Translate Event Component</div>`:""}
                    ${eventPageData.title==="textToSpeech"?`<div id="text-to-speech-event">Text to Speech Component</div>`:""}
                    ${eventPageData.title==="AskAI"?`<div id="ask-ai-event">Ask AI Component</div>`:""}
                </div>
            </div>
        `;const targetElement=this.iframeDoc.querySelector(".parent.quix-ocr-capture-wrapper");const tempContainer=document.createElement("div");tempContainer.innerHTML=htmlContent;this.iframeDoc.querySelector(".parent.quix-ocr-capture-wrapper").insertAdjacentHTML("beforeend",tempContainer.innerHTML);this.attachEventListeners();this.initializeComponents()}attachEventListeners(){const{iframeDoc,iframe}=this;const backButton=iframeDoc.querySelector(".OcrEventContainer .quix-ocr-back");if(backButton){backButton.addEventListener("click",()=>{iframeDoc.querySelector(".OcrEventContainer").remove();iframeDoc.querySelector(".ocrParentContainer.firstPage").style.display="block"})}const closeButton=iframeDoc.querySelector(".OcrEventContainer .closeIcon");if(closeButton){closeButton.addEventListener("click",()=>{iframeDoc.querySelector(".OcrEventContainer").remove();iframeDoc.querySelector(".ocrParentContainer.firstPage").style.display="block"})}}initializeComponents(){const{eventPageData,iframeDoc,resultTextRef}=this;if(eventPageData.title==="search"){this.createSearchEvent(eventPageData,resultTextRef)}if(eventPageData.title==="translate"){}if(eventPageData.title==="textToSpeech"){}if(eventPageData.title==="AskAI"){}}createSearchEvent=(eventPageData,resultText)=>{const iframeDoc=this.iframeDoc;let inputText="";function highlightMatches(){const elements=iframeDoc.querySelectorAll(".ocr-result-text.searchEvent");let firstMatchFound=false;function highlightText(node,textToHighlight){if(node===null)return;if(node.nodeType===Node.TEXT_NODE){const regex=new RegExp(`(${textToHighlight})`,"gi");const parent=node.parentNode;const newText=node.textContent.replace(regex,'<span class="highlight" style="background-color:yellow">$1</span>');const tempDiv=document.createElement("div");tempDiv.innerHTML=newText;while(tempDiv.firstChild){parent.insertBefore(tempDiv.firstChild,node)}parent.removeChild(node)}else{let child=node.firstChild;while(child!==null){const nextChild=child.nextSibling;highlightText(child,textToHighlight);child=nextChild}}}elements.forEach(element=>{element.innerHTML=resultText;const textContent=element.innerText;if(inputText.trim()!==""&&textContent.toLowerCase().includes(inputText.toLowerCase())){highlightText(element,inputText)}else{element.scrollTo({top:0,behavior:"smooth"})}if(!firstMatchFound){const highlighted=element.querySelector(".highlight");if(highlighted){const highlightedRect=highlighted.getBoundingClientRect();const containerRect=element.getBoundingClientRect();const elementTop=highlightedRect.top-containerRect.top+element.scrollTop;element.scrollTo({top:elementTop,behavior:"smooth"});firstMatchFound=true}}})}function handleInputChange(event){inputText=event.target.value;highlightMatches()}const htmlContent=`
            <div class="ocrEventMid">
                <div class="ocrEventSearchMidInnerSection">
                    <span>${eventPageData.section1Header}</span>
                    <div class="ocrEventInputWrapper">
                        <input class="ocrEventInput" type="text" value=""  />
                    </div>
                </div>
                <hr class="horizontalLine" />
                <div class="ocrEventSearchMidInnerSection2">
                    <span>${eventPageData.section2Header}</span>
                    <div class="ocrResulContainer ocrseachBoxHeight">
                        <div class="ocr-result-text ocr-result-text searchEvent ocrResulText ocrEventResultText ocrResulText ocrEventResultText">No text available</div>
                    </div>
                </div>
            </div>
        `;iframeDoc.querySelector("#search-event").innerHTML=htmlContent;iframeDoc.querySelector("#search-event .ocr-result-text.searchEvent.ocrEventResultText").innerHTML=resultText;iframeDoc.querySelector("#search-event .ocrEventInput").addEventListener("input",handleInputChange);highlightMatches()}}