function enableButtons_AddDelete(strId){
    console.log("enableButtons_AddDelete: " + strId);
    let checkedCount = 1 ;//document.querySelectorAll(`input[name="${strId}"]:checked`).length
}

function addOption(pDiv, optionType, optionLabel, strID, i, zIdx, boolAddClickEvent){
    optionLabel = optionLabel.toProperCase();
    let rcInput = document.createElement("input");
    rcInput.type = optionType;
    rcInput.id = "rci_" + strID + "_" + i;
    rcInput.name = strID; 
    rcInput.value = optionLabel;
    rcInput.className = "rciInput";
    //rcInput.style.zIndex = zIdx;
    if(boolAddClickEvent){
        //rcInput.addEventListener("click", enableButtons_AddDelete(strID));
        rcInput.onclick = function(event){
            enableButtons_AddDelete(strID);
        };
        console.log(rcInput);
    }else{
        console.log(strID + " Click event listener not added...");
    }

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