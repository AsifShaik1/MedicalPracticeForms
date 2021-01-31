

String.prototype.toProperCase = function () {
    let tmpString;
    //remove double or move consecutive whitespace with just a single 1
    tmpString = this.replace(/  +/g, ' ');

    return tmpString.replace(/\w\S*/g, function(txt){
        txt = txt.replace(/  +/g, ' ');
        //txt = txt.replace(/\s\s+/g, ' ');
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

function toTitleCase(str) {
    str = str.replace(/  +/g, ' ');
    return str.replace(
        /\w\S*/g,
        function(txt) {
            
            //txt = txt.replace(/\s\s+/g, ' ');
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function testProperCase(sentence){
    console.log(toTitleCase("hELLO   THIS    is the Wrong   cASE."))
    console.log("hELLO   THIS is     the Wrong   cASE.".toProperCase())
}

function onSubmit(){
    //when sending data, send 2 parts
    //part 1 is the form edits...
    //form edits must contain 
    //part 2 is the form data
}


function requestSchema() {
    //testProperCase();
    
    //var httpRequest;
    //httpRequest = new XMLHttpRequest();
  
    //if (!httpRequest) {
    //    alert('Cannot create an XMLHTTP instance');
    //    return false;
    //}
    
    //Replace the file location below with a request to a database.
    let filesNames = ["updateOptions"];
    let groupTitles = ["Update Options"];

    //let filesNames = ["pDetails", "pHistory", "pRecord"];    
    //let groupTitles = ["Patient Details", "Patient History", "Patient Record"];

    let numFiles = filesNames.length;
    let filesTitlesArray = [];
    filesNames.forEach(function(element, j){
        filesTitlesArray.push({
            "FileName" : element,
            "Title" : groupTitles[j].toProperCase()
        });
    })

    //Need to put the HTTPRequestTexts into an array
    let responseTexts = [];
    function receivedSchema(httpRequestObj, i, sKey) {
        if (httpRequestObj.readyState === XMLHttpRequest.DONE) {
            if (httpRequestObj.status === 200) {
                groupObj[i].value.contents = JSON.parse(httpRequestObj.responseText);  
                //console.log(groupObj.length);
                if(groupObj.length === numFiles){

                    let htmlBuildStack = generateHtmlFormBuildStack (groupObj);
                    //console.log(htmlBuildStack);
                    buildForm(htmlBuildStack);
                    
                    //console.log(sKey);
                    //groupObj[1].value.contents = JSON.parse(httpRequestObj.responseText);
                    //console.log(groupObj[1]);
                }

            } else {
                alert('There was a problem with the request.');
            }
        }
    }

    //Need to send Get request Multiple times, so building a structure for this
    //Note browser may have a limit for the number of simultaneous requests to the 
    //same origin.
    var httpRequests = [];
    var groupObj = [];
    
    //filesTitlesArray
    filesTitlesArray.forEach(function(obj, idx){
    //filesNames
    //filesNames.forEach(function(fName, idx){
        
        let completeFilePath = `../../Test Snippets/${obj.FileName}.json`;
        //console.log(completeFilePath);
        let strKey = obj.Title.replace(" ", "");
        let groupContents = {
            "title": obj.Title.toProperCase(),
            "type": "group",
            "contents" : {}
          };
        groupObj.push({
            key: strKey,
            value: groupContents
        });

        httpRequests.push(new XMLHttpRequest());
        httpRequests[idx].onreadystatechange = function(){
            receivedSchema(this, idx, strKey); //pass in the httpRequest object
        };
        if (!httpRequests[idx]) {
            alert('Cannot create an XMLHTTP instance');
            return false;
        }
        httpRequests[idx].open('GET', completeFilePath, false); //true makes it asynchronous
        httpRequests[idx].send();

    });
}

//This will generate an object, from which to build the form, as the form
//components in the schema are nested. This will create a straightforwad 
//linear object (un nested or unwrapped), that you can then run a for loop on
//instead of a recursive function.
function generateHtmlFormBuildStack (fSchema){
    let htmlFormBuildStack = [];
    fSchema.forEach(function(obj){
        //console.log(obj);
        //console.log(obj.key);
        //console.log(obj.value.type);
        let gID = obj.key;
        htmlFormBuildStack.push({
            "parentID" : "formContainer",
            "ID" : gID,
            "type" : obj.value.type,
            "title" : obj.value.title.toProperCase()
        });

        let contentsObj = obj.value.contents;
        //console.log(Object.entries(contentsObj));
        let arrayObjs = Object.entries(contentsObj)
        arrayObjs.forEach(function(iArr){
            //console.log(iArr);
            //let cID = cObj.key;
            let cID = iArr[0].replace(" ", "");
            let fType = iArr[1].type;
            let cObj = {
                "parentID" : "tab_grp_" + gID,
                "ID" : cID,
                "type" : fType,
                "title" : iArr[1].title.toProperCase(),
                "required" : iArr[1].required
            };
            // Need to add the options field if "type" is checkbox or radio
            if("checkbox" === fType || "radio" === fType){
                cObj["options"] = iArr[1].options;
            }
            //console.log(cObj);
            htmlFormBuildStack.push(cObj);
        });
        //console.log(htmlFormBuildStack);
    })

    //Add the close all tab, only once
    htmlFormBuildStack.push({
        "parentID" : "formContainer",
        "ID" : "ddc_rc_closeTab",
        "type" : "groupClose",
        "title" : "Close All"
    });
    //console.log(htmlFormBuildStack)
    return htmlFormBuildStack;
}


// Builds the form. Possible to move this to serverside then serve the form.
function buildForm(toBuildArray){ //jsonSchemaText){

    //const formSchema = JSON.parse(jsonSchemaText);
    //console.log(toBuildArray);

    let gbl_Z_Index = 1;
    let gbl_AllowEdits = true;

    //CHECK IF THERE IS A FORM
    let eForm = document.querySelector("form");

    //Function Close All Groups
    function CloseAllMainGroups(){
        //console.log("btnCollapse onClick")
        let gblCloseAll = document.querySelectorAll('input[name="ddc_rc"]');
        //console.log(gblCloseAll)
        gblCloseAll.forEach(function(obj_i){
            //console.log(obj_i)
            obj_i.checked = false;
            window.scroll(0,0); //scroll to top
        });
        //let fGroups = document.getElementsByName("ddc_rc");
        //console.log(fGroups);
        //console.log(event)
    };

    function CloseAllInnerGroups(){
        //console.log("btnCollapseInner onClick")
        let innCloseAll = document.querySelectorAll('input[name="ddc_rc_inner"]');
        //console.log(innCloseAll)
        innCloseAll.forEach(function(obj_i){
            //console.log(obj_i)
            obj_i.checked = false;
        });
        //let fGroups = document.getElementsByName("ddc_rc");
        //console.log(fGroups);
        //console.log(event)
    };

    function openAllInnerGroups(){
        //console.log("btnCollapseInner onClick")
        let innCloseAll = document.querySelectorAll('input[name="ddc_rc_inner"]');
        //console.log(innCloseAll)
        innCloseAll.forEach(function(obj_i){
            //console.log(obj_i)
            obj_i.checked = true;
        });
    };

    if(eForm === null){
        //CREATE ALL THE FOLLOWING ELEMENTS ONCE ONLY
        //Add Meta data links
        //Add CSS link

        //ADD PAGE HEADER AND BUTTONS AT THE TOP TO COLLAPSE FORM GROUPS
        //AS WELL AS INNER FORM GROUPS. BUTTONS DIV MUST STICK TO THE TOP 
        //OF THE FORM ONCE YOU SCROLL UP. 
        //let divHeader = document.createElement("div"); the sticky buttons div wont work 
        //if it is in nested divs, so had to move the heading and buttons div outside
        let hHeading = document.createElement("h1");
        hHeading.innerHTML = "New Patient Record";
        document.body.appendChild(hHeading);
        //divHeader.appendChild(hHeading);

        let divBtnCollapse = document.createElement("div");
        divBtnCollapse.id = "divBtnCollapse";
        divBtnCollapse.className = "divBtnCollapse_sticky"; //So these buttons stick to the top
        divBtnCollapse.style.zIndex = gbl_Z_Index + 2;

        //Close all main outer Groups
        let btnCollapse = document.createElement("button");
        btnCollapse.id = "btnCollapseGroups";
        btnCollapse.innerHTML = "Close Groups";
        btnCollapse.className = "button";
        btnCollapse.style.zIndex = gbl_Z_Index + 3;
        btnCollapse.onclick = function(event){CloseAllMainGroups()}

        //Close all inner groups
        let btnCollapseInner = document.createElement("button");
        btnCollapseInner.id = "btnCollapseInnerGroups";
        btnCollapseInner.innerHTML = "Close Inner Groups";
        btnCollapseInner.className = "button";
        btnCollapseInner.style.zIndex = gbl_Z_Index + 3;
        btnCollapseInner.onclick = function(event){CloseAllInnerGroups()};

        divBtnCollapse.appendChild(btnCollapse);
        divBtnCollapse.appendChild(btnCollapseInner);
        //divHeader.appendChild(divBtnCollapse);
        document.body.appendChild(divBtnCollapse)
        //document.body.appendChild(divHeader);

        //Create form element, as this is the first time this code is running.
        eForm = document.createElement("form");
        document.body.appendChild(eForm);

    } 
    //console.log(eForm);
    
    //This section of code must be exeuted once, 1 div row, 1 div column, 1 div tabs
    let eDiv; 
    let divHierarchy = ["row", "col", "tabs"]; //classes in the hierarchy
    //can have multiple rows, columns, and tabs
    divHierarchy.forEach(function(divClass, idx){
        eDiv = document.createElement("div");
        eDiv.className = divClass;
        //Nesting the divs in the divHierarchy array
        if (0 === idx){
            eForm.appendChild(eDiv);
        } else {
            //Nesting the divs in the divHierarchy array
            let pDiv = document.querySelector("." + divHierarchy[idx-1]);
            pDiv.appendChild(eDiv);
        }
    })
    
    ////This is the first and only tab
    let parentTab = document.querySelector(".tabs");
    parentTab.id = "formContainer";

    //MOVE CODE BELOW INTO A GROUP BUILDER
    function groupDropDown(parentDiv, idx, strTitle){
        //Insert radio button, that will allow the dropdowns to function.
        let zIndex = gbl_Z_Index;
        let tabDiv = document.createElement("div")
        tabDiv.className = "tab";
        tabDiv.style.zIndex = zIndex;
        let dropDownRC_lblTitle = strTitle; //parameter

        let dropDownRC = document.createElement("input");
        dropDownRC.type = "checkbox"; //was radio
        dropDownRC.id = "ddc_rc_" + idx; //parameter
        dropDownRC.name = "ddc_rc";
        dropDownRC.style.zIndex = -1; //dont want these visible
        let dropDownRC_lbl = document.createElement("label");
        dropDownRC_lbl.className = "tab-label";
        dropDownRC_lbl.htmlFor = dropDownRC.id;
        dropDownRC_lbl.innerHTML = dropDownRC_lblTitle; 
        dropDownRC_lbl.style.zIndex = zIndex;
        tabDiv.appendChild(dropDownRC);
        tabDiv.appendChild(dropDownRC_lbl);

        let eDiv_dropDownRC_TabContent = document.createElement("div");
        eDiv_dropDownRC_TabContent.className = "tab-content";
        eDiv_dropDownRC_TabContent.id = "tab_grp_" + idx;
        eDiv_dropDownRC_TabContent.style.zIndex = zIndex;
        tabDiv.appendChild(eDiv_dropDownRC_TabContent);
        
        parentDiv.appendChild(tabDiv);
    }

    function groupDropDown_CloseAll(parentDiv, strTitle){
        //Insert radio button, that will allow the dropdowns to function.
        let tabDiv = document.createElement("div")
        tabDiv.className = "tab";
        let dropDownRC_lblTitle = strTitle; //parameter

        let dropDownRC = document.createElement("input");
        dropDownRC.type = "radio";
        dropDownRC.id = "ddc_rc_close"; 
        dropDownRC.name = "ddc_rc";
        dropDownRC.onclick = function(event){CloseAllMainGroups()};

        let dropDownRC_lbl = document.createElement("label");
        dropDownRC_lbl.className = "tab-close";
        dropDownRC_lbl.htmlFor = dropDownRC.id;
        dropDownRC_lbl.innerHTML = dropDownRC_lblTitle; 
        tabDiv.appendChild(dropDownRC);
        tabDiv.appendChild(dropDownRC_lbl);

        parentDiv.appendChild(tabDiv);
    }

    //For simple fields like name, id number, DOB, etc
    function simpleField(parentDiv, fieldType, strIdentifier, txtLabel){
        let zIndex = gbl_Z_Index;
        let tDiv = document.createElement("div");
        tDiv.className = "divField";
        tDiv.style.zIndex = zIndex;
        parentDiv.appendChild(tDiv);
        let lblTxtInput = document.createElement("label");
        lblTxtInput.innerHTML = txtLabel + ": ";
        lblTxtInput.className = "lblTitle";
        lblTxtInput.id = "lblTxtInput_" + strIdentifier;
        lblTxtInput.style.zIndex = zIndex;
        let txtInput = document.createElement("input");
        txtInput.type = fieldType;
        txtInput.className = "txtInput";
        txtInput.id = "txtInput_" + strIdentifier;
        txtInput.style.zIndex = zIndex;
        tDiv.appendChild(lblTxtInput);
        tDiv.appendChild(txtInput);
    }

    //For fields that have a large number of radio buttons or checkboxes
    //has helper search box and buttons to filter out options, making search easier.
    function complexSelectionField(parentDiv, fieldType, strIdentifier, strTitle, arrayOptions){
        let tDiv = document.createElement("div");
        let zIndex = gbl_Z_Index;
        tDiv.className = "divField";
        tDiv.style.zIndex = zIndex;
        parentDiv.appendChild(tDiv);
        //strIdentifier will be the key to this object and should be unique.
        let lblTitle = document.createElement("label");
        tDiv.appendChild(lblTitle);
        lblTitle.innerHTML = strTitle + ": ";
        lblTitle.className = "lblTitle";
        lblTitle.style.zIndex = zIndex;
        if(arrayOptions.length > 5){
            //Change the div class to be tab-inner
            tDiv.className = "tab-inner";
            //Add the checkbox
            let cbxInner = document.createElement("input"); //not a radio for sure
            cbxInner.type = "checkbox";
            cbxInner.name = "ddc_rc_inner";
            cbxInner.id = cbxInner.name + "_" + strIdentifier
            cbxInner.style.zIndex = -1; //dont want these visible
            tDiv.prepend(cbxInner); //so it appears before the label
            //Assign the label to the checkbox
            lblTitle.htmlFor = cbxInner.id;
            //Also change the class of the label
            lblTitle.className = "tab-inner-label"

            //TODO: ADD A click method to show button to close all inner drop downs
            // ***

            //Need to create a new element for tab inner content, then reassign tDiv to that 
            //div for all the options in arrayOptions
            let tabInnerContenDiv = document.createElement("div");
            tabInnerContenDiv.className = "tab-inner-content";
            tabInnerContenDiv.style.zIndex = zIndex;
            tDiv.appendChild(tabInnerContenDiv);
            tDiv = tabInnerContenDiv;
            //Add the search helpers (search text box, with buttons to show
            //selected only, show all, reset)
            searchHelp(tDiv, strIdentifier, fieldType)
        }

        //let containsOtherOption = false;

        arrayOptions.forEach(function(opt, idx){
            let rcInputField = addOption(tDiv, fieldType, opt, strIdentifier, idx, zIndex);

            //opt = opt.toProperCase();
            //let rcInput = document.createElement("input");
            //rcInput.type = fieldType;
            //rcInput.id = "rci_" + strIdentifier + "_" + idx;
            //rcInput.name = strIdentifier; 
            //rcInput.value = opt;
            //rcInput.className = "rciInput";
            //rcInput.style.zIndex = zIndex;

            // //ADD ONCLICK FUNCTION TO SHOW EDIT CONTROLS, IF GLOBALEDIT IS SET TO TRUE
            // //check if other is an option, if so will add a text input to enter value
            // //if (txtValue_upper.indexOf("OTHER") > -1) {
            // //    containsOtherOption = true;
            // //};

            //let checkMarkSpan = document.createElement("span");
            //checkMarkSpan.className = "checkmark";
            //checkMarkSpan.style.zIndex = zIndex;

            //let lblRcInput = document.createElement("label");
            // //lblRcInput.htmlFor = rcInput.id;
            //lblRcInput.name = "lblrc_" + strIdentifier;
            //lblRcInput.className = "lblRcInput";
            //lblRcInput.style.zIndex = zIndex;
            //lblRcInput.innerHTML = rcInput.outerHTML + checkMarkSpan.outerHTML + rcInput.value;

            //tDiv.appendChild(lblRcInput);
            // //tDiv.appendChild(rcInput);
        })
    }

    /* CLEAR SEARCH TEXT */
    function clearTextSearch(txtSearchId, pDiv){
        let searchTxt = document.getElementById(txtSearchId);
        searchTxt.value = "";

        //Show all options
        //showAllRcBoxes(txtSearchId, pDiv);
    }

    /* SHOW CHECKED CHECKBOXES ONLY */
    function showSelected(txtSearchId, pDiv, rcInputType, boolResetSearchText = true) {
        //Clear The text in the search text box
        let a, rc_bx;
        if(boolResetSearchText){
            let searchTxt;
            searchTxt = document.getElementById(txtSearchId);
            searchTxt.value = "";
        } 
        
        //Get all the label elements in the parent div
        a = pDiv.querySelectorAll('.lblRcInput'); //Selecting by classname
        let selectedRC = [];
        for (i = 0; i < a.length; i++) {
            //chk_bx = a[i].getElementsByTagName("input")
            //was ... chk_bx = a[i].querySelectorAll('input[type="checkbox"]:checked');
            rc_bx = a[i].querySelectorAll('input[type="' + rcInputType + '"]:checked');
            if (rc_bx.length !== 0 ){
                //console.log("i: " + i + "; rc_bx.length: " + rc_bx.length);
                //console.log("rc_bx.checked: " + rc_bx.checked);
                //console.log("a[" + i +"].innerHTML: " + a[i].innerHTML);
                //console.log("rc_bx.length: " + rc_bx.length);
                //console.log("rc_bx.item: " + rc_bx.item(0));
                //console.log("rc_bx.nameditem: " + rc_bx.namedItem);
                //console.log("rc_bx.tagName: " + rc_bx.tagName);
    
                a[i].style.display = "";
                selectedRC.push(a[i]);
            } 
            else {
                a[i].style.display = "none";
            }
        }
        return selectedRC;
    }

    /* SHOW ALL CHECKBOXES ONLY */
    function showAllRcBoxes(txtSearchId, pDiv) {
        //Clear The text in the search text box
        let searchTxt, a;
        searchTxt = document.getElementById(txtSearchId);
        searchTxt.value = "";
        
        a = pDiv.getElementsByTagName("label");

        for (i = 0; i < a.length; i++) {
            a[i].style.display = "";
        }
    }
    
    /* CLOSE ALL CHECKBOXES/RADIO BUTTONS IN DIV  */
    function resetAll(txtSearchId, pDiv, rcInputType) {
        //Clear The text in the search text box
        let searchTxt = document.getElementById(txtSearchId);
        searchTxt.value = "";
        
        let a = pDiv.querySelectorAll('label');
        
        for (i = 0; i < a.length; i++) {
            //rc_bx = a[i].getElementsByTagName("input")
            //was ... rc_bx = a[i].querySelectorAll('input[type="checkbox"]:checked');
            let rc_bx = a[i].querySelectorAll('input[type="' + rcInputType + '"]');
            if (rc_bx.length !== 0 ){
                rc_bx[0].checked = false; //Such an irritating error, 
                //console.log(chk_bx) helped to find it!!! Must use the [0] index.
                //console.log("After Reset chk_bx.checked: " + chk_bx.checked);
            } 
            //Show the element
            a[i].style.display = "";
        }
    }

    /* FILTERS THE OPTIONS AVAILABLE BASED ON USER TYPED TEXT */
    function filterFunction(txtSearchId, pDiv) {
        
        let input, filter, a;
        input = document.getElementById(txtSearchId);

        //Change case and remove multiple spaces
        filter = input.value.toUpperCase();
        filter = filter.replace(/  +/g, ' ');
        filter_segments = filter.split(" ");
        //div = document.getElementById("Dropdown".concat(i));

        //a = div.getElementsByTagName("a");
        //Get all the options
        a = pDiv.querySelectorAll(".lblRcInput"); /* Overwirtes the previous a variable, this one gets all checkboxes.*/
        let ai_display = [];
        let enableEdit = false;

        for (i = 0; i < a.length; i++) {
            ai_display.push(true);
            txtValue = a[i].textContent || a[i].innerText;
            txtValue_upper = txtValue.toUpperCase();

            filter_segments.forEach(function(txtSeg){
                if (txtValue_upper.indexOf(txtSeg) > -1) {
                    //a[i].style.display = "";
                    ai_display[i] = ai_display[i] && true; //Now will only be true if all
                    //filtersegments are found
                } else {
                    ai_display[i] = ai_display[i] && false;
                    //a[i].style.display = "none";
                };
                
                //If the user typed in edit, enable edit functionality
                if (txtSeg === "EDIT"){
                    enableEdit = true;
                };
            });
            ai_display.forEach(function(wasFound){
                if (wasFound) {
                    a[i].style.display = "";
                } else {
                    a[i].style.display = "none";
                }
            });
        };

        //Shows the edit mode div with edit controls
        enterEditMode(pDiv, txtSearchId, enableEdit, gbl_AllowEdits);
    }    


    function returnSearchEditDivs(pDiv){
        let innerDivs = pDiv.getElementsByTagName("div");
        let editOptionsDiv;
        let optSearchTextDiv;
        let searchButtonsDiv;
        for (j = 0; j < innerDivs.length; j++) {
            //console.log(innerDivs[j]);
            if (innerDivs[j].name === "editOptionsDiv"){
                editOptionsDiv = innerDivs[j];
            }
            //optSearchTextDiv searchButtonsDiv
            if (innerDivs[j].name === "optSearchTextDiv"){
                optSearchTextDiv = innerDivs[j];
            }
            if (innerDivs[j].name === "searchButtonsDiv"){
                searchButtonsDiv = innerDivs[j];
            }
        };
        return {searchButtonsDiv, optSearchTextDiv, editOptionsDiv}
    };


    function enterEditMode(parDiv, searchTxtInputID, localEnableEdit, globalAllowEdits){
        let searchEditDivs = returnSearchEditDivs(parDiv);
        //If user enabled edit functionality, and global edit flag enabled
        //then show the edit tool bar.
        if (localEnableEdit && globalAllowEdits){
            //searchTxtInput.value = ""; //reset the search text
            searchEditDivs.editOptionsDiv.style.display = "";
            searchEditDivs.optSearchTextDiv.style.display = "";

            //show all options, clear search text box
            showAllRcBoxes(searchTxtInputID, parDiv);
        };
    }


    function exitEditMode(pDiv, searchTxtInputID) {
        let seDivs = returnSearchEditDivs(pDiv);
        //Dont know the order of the innerdivs, and number (2 or 3), so set the 
        //the display or visible css properties individucally
        if(seDivs.editOptionsDiv !== null){
            seDivs.editOptionsDiv.style.display = "none";
            if(seDivs.searchButtonsDiv === null){
                //if we dont have search buttons, set the search text div
                //to not visible.
                seDivs.optSearchTextDiv.style.display = "none";
            }
        };
        //show all options, clear search text box
        showAllRcBoxes(searchTxtInputID, pDiv);
    }

    function deleteOptions(pDiv, tSearchId, rc_Type){
        let selectedItems;
        selectedItems = showSelected(tSearchId, pDiv, rc_Type);
        let selectedCount = selectedItems.length;
        if(selectedCount > 0){
            let str_this_these = "";
            str_this_these = selectedCount === 1 ? "this" : "these";
            let str_option_s = ""
            str_option_s = selectedCount === 1 ? "" : "s";
            if (window.confirm(`Are you sure you want to delete ${str_this_these} ${selectedCount} option${str_option_s}!`)) {
                //TODO: delete options, must record which options have been deleted and send 
                //with form data.
                selectedItems.forEach(function(item){
                    //console.log(item);
                    item.remove();
                });
            } else {
                //show all options, clear search text box
                //Do nothing.
            }
            showAllRcBoxes(tSearchId, pDiv);
        }
    };

    function addOption(pDiv, optionType, optionLabel, strID, i, zIdx){
        optionLabel = optionLabel.toProperCase();
        let rcInput = document.createElement("input");
        rcInput.type = optionType;
        rcInput.id = "rci_" + strID + "_" + i;
        rcInput.name = strID; 
        rcInput.value = optionLabel;
        rcInput.className = "rciInput";
        rcInput.style.zIndex = zIdx;

        //ADD ONCLICK FUNCTION TO SHOW EDIT CONTROLS, IF GLOBALEDIT IS SET TO TRUE
        //check if other is an option, if so will add a text input to enter value
        //if (txtValue_upper.indexOf("OTHER") > -1) {
        //    containsOtherOption = true;
        //};

        let checkMarkSpan = document.createElement("span");
        checkMarkSpan.className = "checkmark";
        checkMarkSpan.style.zIndex = zIdx;

        let lblRcInput = document.createElement("label");
        //lblRcInput.htmlFor = rcInput.id;
        lblRcInput.name = "lblrc_" + strID;
        lblRcInput.className = "lblRcInput";
        lblRcInput.style.zIndex = zIdx;
        lblRcInput.innerHTML = rcInput.outerHTML + checkMarkSpan.outerHTML + rcInput.value;

        pDiv.appendChild(lblRcInput);
        //pDiv.appendChild(rcInput);
        return rcInput.id;
    }

    function lastIdIndex(elemList){
        let lastIdx = 0;
        elemList.forEach(function(elem, j){
            //ids are of the form str1_str2_number
            let idBreakdown = elem.id.split("_");
            lastIdx = idBreakdown[2] > lastIdx ? idBreakdown[2] : lastIdx;
        });
        return parseInt(lastIdx);
    }

    function updateOption(pDiv, tSearchId, rc_Type){
        let selectedItems;
        selectedItems = showSelected(tSearchId, pDiv, rc_Type, false); //do not reset the search text
        let tSearchText = document.getElementById(tSearchId);
        //console.log(tSearchId);
        //console.log(tSearchText.value);

        let selectedCount = selectedItems.length;
        if(selectedCount === 0){
            window.alert("Please select an option to edit.")
        } else if(selectedCount > 1){
            window.alert("You can only edit 1 option at a time, please deselect all and pick an option.")
        } else if(selectedCount === 1){
            let newValue = tSearchText.value.toProperCase();
            //console.log("newValue : " & newValue)
            if ("" === newValue){
                window.alert("Please enter text to update the selected option with.")
            } else {
                //console.log(selectedItems);
                //console.log(selectedItems[0]);
                //console.log(selectedItems[0].children[0].innerHTML);
                let oldValue = selectedItems[0].children[0].value;
            
                if (window.confirm(`Are you sure you want to update option:\n${oldValue} \nwith :\n${newValue}`)) {
                    let eId = selectedItems[0].children[0].id;
                    //console.log("eId = ", eId);
                   
                    let iHTML = String(selectedItems[0].innerHTML);
                    let elementsHTML = iHTML.split(oldValue);
                    //iHTML = iHTML.replace(oldValue, "*$*"); //Must have this intermediate step
                    //iHTML = iHTML.replace("*$*", newValue);
                    //console.log("Replace : ", iHTML)
                    iHTML = elementsHTML[0] + newValue + elementsHTML[1] + newValue;
                    selectedItems[0].innerHTML = iHTML; //elementsHTML[0] + newValue;
                    selectedItems[0].children[0].checked = true;
                    //console.log(selectedItems[0].children[0]);
                    //console.log(elementsHTML);
                    selectedItems = showSelected(tSearchId, pDiv, rc_Type, true);

                    //TODO: log the change.
                } else {
                    //show all options, clear search text box
                    //Do nothing.
                };
            }
        
        };
    }

    /* CREATES THE SEARCH HELPERS: SEARCH TEXT AND ASSOCIATED BUTTONS */
    function searchHelp(parentDiv, strId, rcType){
        //add search box with helper buttons
        let zIndex = gbl_Z_Index;
        let strSearch = document.createElement("input");
        strSearch.placeholder = "Search..."; 
        strSearch.classList.add("txtInput", "txtSearch");
        let txtSearchId = strId + "Search";
        strSearch.id = txtSearchId;
        strSearch.onkeyup = function (event){
            filterFunction(txtSearchId, parentDiv);
        }
        strSearch.style.zIndex = zIndex;
        
        let btnClear = document.createElement("button");
        btnClear.innerHTML = "Clear Text";
        btnClear.className = "button";
        btnClear.id = strId + "_btnClear";
        btnClear.onclick = function (event){
            clearTextSearch(txtSearchId, parentDiv);
        }
        btnClear.style.zIndex = zIndex;

        let btnShowSelected = document.createElement("button");
        btnShowSelected.innerHTML = "Show Selected";
        btnShowSelected.className = "button";
        btnShowSelected.id = strId + "_btnShowSelected";
        btnShowSelected.onclick = function (event){
            let seletedItems;
            seletedItems = showSelected(txtSearchId, parentDiv, rcType);
        }
        btnShowSelected.style.zIndex = zIndex;

        let btnShowAll = document.createElement("button");
        btnShowAll.innerHTML = "Show All";
        btnShowAll.className = "button";
        btnShowAll.id = strId + "_btnShowAll";
        btnShowAll.onclick = function (event){
            showAllRcBoxes(txtSearchId, parentDiv)
        };
        btnShowAll.style.zIndex = zIndex;

        let btnReset = document.createElement("button");
        btnReset.innerHTML = "Reset";
        btnReset.className = "button";
        btnReset.id = strId + "_btnReset";
        btnReset.onclick = function (event){
            resetAll(txtSearchId, parentDiv, rcType)
        };
        btnReset.style.zIndex = zIndex;

        //ADD EDIT BUTTONS AND EDIT DIV ---------------
        //Add new option
        let btnAdd = document.createElement("button");
        btnAdd.innerHTML = "Add";
        btnAdd.className = "button";
        btnAdd.id = strId + "_btnAdd";
        btnAdd.onclick = function (event){
            //resetAll(txtSearchId, parentDiv, rcType)
            //Get count of fieldsOptions and add 1 then set as idx
            let optsList = parentDiv.querySelectorAll('input[type="' + rcType + '"]');
            let lastOptsIdx = lastIdIndex(optsList) + 1;
            if (window.confirm(`Are you sure you want to add this option!`)) {
                let rcInput_Id;
                rcInput_Id = addOption(parentDiv, rcType, strSearch.value, strId, lastOptsIdx, zIndex);
                document.getElementById(rcInput_Id).checked = true;
                strSearch.value = "";
                //console.log(rcInput_F);
            } else {
                //show all options, clear search text box
                //Do nothing.
            }
            //showAllRcBoxes(txtSearchId, parentDiv);
        };
        btnAdd.style.zIndex = zIndex;

        //Delete option
        let btnDelete = document.createElement("button");
        btnDelete.innerHTML = "Delete";
        btnDelete.className = "button";
        btnDelete.id = strId + "_btnDelete";
        btnDelete.onclick = function (event){
            deleteOptions(parentDiv, txtSearchId, rcType)
        };
        btnDelete.style.zIndex = zIndex;

        //Update Option
        let btnUpdate = document.createElement("button");
        btnUpdate.innerHTML = "Update";
        btnUpdate.className = "button";
        btnUpdate.id = strId + "_btnUpdate";
        btnUpdate.onclick = function (event){
            updateOption(parentDiv, txtSearchId, rcType);
        };
        btnUpdate.style.zIndex = zIndex;

        //Exit Edit Mode for Option
        let btnExitedit = document.createElement("button");
        btnExitedit.innerHTML = "Exit";
        btnExitedit.className = "button";
        btnExitedit.id = strId + "_btnExitedit";
        btnExitedit.onclick = function (event){
            exitEditMode(parentDiv, txtSearchId);
        };
        btnExitedit.style.zIndex = zIndex;

        //SEARCH DIV
        let qDiv = document.createElement("div");
        qDiv.appendChild(btnClear);
        qDiv.appendChild(btnShowSelected);
        qDiv.appendChild(btnShowAll);
        qDiv.appendChild(btnReset);
        qDiv.name = "searchButtonsDiv";
        qDiv.id = strId + "_" + qDiv.name;
        qDiv.style.zIndex = zIndex;
        //Add the above components to the form
        parentDiv.appendChild(qDiv);

        qDiv = document.createElement("div");
        qDiv.appendChild(strSearch);
        qDiv.name = "optSearchTextDiv"; 
        qDiv.id = strId + "_" + qDiv.name;
        qDiv.style.zIndex = zIndex;
        parentDiv.appendChild(qDiv);

        //EDIT DIV
        qDiv = document.createElement("div");
        //Add the above components to the form
        qDiv.appendChild(btnAdd);
        qDiv.appendChild(btnUpdate);
        qDiv.appendChild(btnDelete);
        qDiv.appendChild(btnExitedit);
        qDiv.name = "editOptionsDiv"; //.style.display = "none";
        qDiv.id = strId + "_" + qDiv.name;
        qDiv.className = "divEdit";
        qDiv.style.zIndex = zIndex;
        qDiv.style.display = "none"; //make sure edit div is hidden
        //Add the above components to the form
        parentDiv.appendChild(qDiv);
        
    }

    //Calls functions that build each element, in the HTML_Form_Build_Stack
    toBuildArray.forEach(function(obj){
    //for(let obj in toBuildArray) {
        
        let strType = obj.type;
        let strTitle = obj.title;
        let objID = obj.ID;
        let parID = "#"+obj.parentID;
        let parDiv = document.querySelector(parID); //Searching for html with IDs
        
        //console.log(obj);
        //console.log(objID);
        //console.log(strType);
        //console.log(parID);
        //console.log(parDiv);

        switch(strType){
            //GROUP
            case "group":
                //groupDropDown(parentDiv, idx, strTitle)
                groupDropDown(parDiv, objID, strTitle);
                break;
            case "groupClose":
                //groupDropDown_CloseAll(parentDiv, strTitle)
                groupDropDown_CloseAll(parDiv, strTitle)
                break;
            
            //SIMPLE TEXT INPUT (EXAMPLE NAMES)
            case "text":
            case "date":
            case "number":
                //simpleField(parentDiv, fieldType, strIdentifier, txtLabel)
                simpleField(parDiv, strType, objID, strTitle);
                break;
            
            //COMPLEX SELECTION
            case "radio":
            case "checkbox":
                let arrOpts = obj.options;
                //complexSelectionField(parentDiv, fieldType, strIdentifier, strTitle, arrayOptions)
                complexSelectionField(parDiv, strType, objID, strTitle, arrOpts);
                break;
            
        } 
    });

    //IF THERE IS ONLY 1 GROUP, OPEN IT
    let allMainGroups = document.querySelectorAll('input[name="ddc_rc"]');
    //console.log(allMainGroups);
    //console.log(allMainGroups.length);
    if (allMainGroups.length === 2){
        allMainGroups[0].checked = true;
        //Comment bottom line out this is for debugging n testing
        openAllInnerGroups();
    }

    /*ADD SUBMIT BUTTON NOW, MUST BE OUTSIDE THE FOR LOOP */
    let btnSubmit = document.createElement("input");
    btnSubmit.type = "submit"
    btnSubmit.value = "Submit";
    btnSubmit.className = "btnSubmit";
    eDiv = document.createElement("div");
    eDiv.appendChild(btnSubmit);
    eDiv.className = "divField";
    eForm.appendChild(eDiv);

    eForm.addEventListener("submit", (event) => {
        event.preventDefault(); //prevent default behaviour...
        //TODO: ADD VARIFICATION CHECKS
    })
}