
function requestSchema() {
    var httpRequest;
    httpRequest = new XMLHttpRequest();
  
    if (!httpRequest) {
        alert('Cannot create an XMLHTTP instance');
        return false;
    }
    
    function receivedSchema() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                buildForm(httpRequest.responseText);
            } else {
                alert('There was a problem with the request.');
            }
        }
    }

    httpRequest.onreadystatechange = receivedSchema;
    httpRequest.open('GET', '../../Test Snippets/testFormSchema.json');
    httpRequest.send();

}

function buildForm(jsonSchemaText){

    const formSchema = JSON.parse(jsonSchemaText);
    console.log(formSchema);

    let eForm = document.createElement("form");
    document.body.appendChild(eForm);

    let eDiv; 

    function simpleField(fieldType, txtLabel, tDiv){
        let lblTxtInput = document.createElement("label");
        lblTxtInput.innerHTML = txtLabel + ": ";
        lblTxtInput.className = "lblTxtInput";
        let txtInput = document.createElement("input");
        txtInput.type = fieldType;
        txtInput.className = "txtInput";
        tDiv.appendChild(lblTxtInput);
        tDiv.appendChild(txtInput);
    }

    function complexSelectionField(fieldType, strTitle, arrayOptions, strIdentifier, tDiv){
        let lblTitle = document.createElement("label");
        tDiv.appendChild(lblTitle);
        lblTitle.innerHTML = strTitle + ": ";
        lblTitle.className = "lblTitle";
        if(arrayOptions.length > 5){
            //Add the search helpers
            searchHelp(tDiv, strIdentifier, fieldType)
        }

        arrayOptions.forEach(function(opt, idx){
            let rcInput = document.createElement("input");
            rcInput.type = fieldType;
            rcInput.id = "rci_" + strIdentifier + "_" + idx;
            rcInput.name = strIdentifier; 
            rcInput.value = opt;
            rcInput.className = "rciInput";

            let checkMarkSpan = document.createElement("span");
            checkMarkSpan.className = "checkmark";

            let lblRcInput = document.createElement("label");
            //lblRcInput.htmlFor = rcInput.id;
            rcInput.name = "lblrc_" + strIdentifier;
            lblRcInput.className = "lblRcInput";
            lblRcInput.innerHTML = rcInput.outerHTML + checkMarkSpan.outerHTML + rcInput.value;

            tDiv.appendChild(lblRcInput);
            //tDiv.appendChild(rcInput);
        })
    }

    /* CLEAR SEARCH TEXT */
    function clearTextSearch(txtSearchId){
        let searchTxt = document.getElementById(txtSearchId);
        searchTxt.value = "";
    }

    /* SHOW CHECKED CHECKBOXES ONLY */
    function showSelected(txtSearchId, pDiv, rcInputType) {
        //Clear The text in the search text box
        let searchTxt, a, rc_bx;
        searchTxt = document.getElementById(txtSearchId);
        searchTxt.value = "";

        //Get all the label elements in the parent div
        a = pDiv.querySelectorAll('.lblRcInput'); //Selecting by classname
        
        for (i = 0; i < a.length; i++) {
            //chk_bx = a[i].getElementsByTagName("input")
            //was ... chk_bx = a[i].querySelectorAll('input[type="checkbox"]:checked');
            rc_bx = a[i].querySelectorAll('input[type="' + rcInputType + '"]:checked');
            if (rc_bx.length !== 0 ){
                console.log("i: " + i + "; rc_bx.length: " + rc_bx.length);
                console.log("rc_bx.checked: " + rc_bx.checked);
                console.log("a[" + i +"].innerHTML: " + a[i].innerHTML);
                console.log("rc_bx.length: " + rc_bx.length);
                console.log("rc_bx.item: " + rc_bx.item(0));
                //console.log("rc_bx.nameditem: " + rc_bx.namedItem);
                //console.log("rc_bx.tagName: " + rc_bx.tagName);
    
                a[i].style.display = "";
            } 
            else {
                a[i].style.display = "none";
            }
        }
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
        let input, filter, div, a;
        input = document.getElementById(txtSearchId);
        filter = input.value.toUpperCase();
        //div = document.getElementById("Dropdown".concat(i));

        //a = div.getElementsByTagName("a");
        a = pDiv.querySelectorAll(".lblRcInput"); /* Overwirtes the previous a variable, this one gets all checkboxes.*/

        for (i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
            }
        }
    }
    
    /* CREATES THE SEARCH HELPERS: SEARCH TEXT AND ASSOCIATED BUTTONS */
    function searchHelp(parentDiv, strId, rcType){
        //add search box with helper buttons
        let strSearch = document.createElement("input");
        strSearch.placeholder = "Search..."; 
        strSearch.className = "txtSearch";
        let txtSearchId = strId + "Search";
        strSearch.id = txtSearchId;
        strSearch.onkeyup = function (event){
            filterFunction(txtSearchId, parentDiv);
        }
        
        let btnClear = document.createElement("button");
        btnClear.innerHTML = "Clear Text";
        btnClear.id = strId + "_btnClear";
        btnClear.onclick = function (event){
            clearTextSearch(txtSearchId);
        }

        let btnShowSelected = document.createElement("button");
        btnShowSelected.innerHTML = "Show Selected";
        btnShowSelected.id = strId + "_btnShowSelected";
        btnShowSelected.onclick = function (event){
            showSelected(txtSearchId, parentDiv, rcType);
        }

        let btnShowAll = document.createElement("button");
        btnShowAll.innerHTML = "Show All";
        btnShowAll.id = strId + "_btnShowAll";
        btnShowAll.onclick = function (event){
            showAllRcBoxes(txtSearchId, parentDiv)
        };

        let btnReset = document.createElement("button");
        btnReset.innerHTML = "Reset";
        btnReset.id = strId + "_btnReset";
        btnReset.onclick = function (event){
            resetAll(txtSearchId, parentDiv, rcType)
        };

        let qDiv = document.createElement("div");
        qDiv.appendChild(strSearch);
        qDiv.appendChild(btnClear);
        qDiv.appendChild(btnShowSelected);
        qDiv.appendChild(btnShowAll);
        qDiv.appendChild(btnReset);

        //Add the above components to the form
        parentDiv.appendChild(qDiv);
    }

    for(let key in formSchema) {
        console.log(key);
        //if(obj.hasOwnProperty(prop))
         //   ++count;
        eDiv = document.createElement("div");
        eForm.appendChild(eDiv);
        let strType = formSchema[key].type;
        let strTitle = formSchema[key].title;

        switch(strType){
            //SIMPLE TEXT INPUT (EXAMPLE NAMES)
            case "text":
            case "date":
            case "number":
                simpleField(strType, strTitle, eDiv);
                break;
            //COMPLEX SELECTION
            case "radio":
            case "checkbox":
                let arrOpts = formSchema[key].options;
                complexSelectionField(strType, strTitle, arrOpts, key, eDiv);
                break;
        } 
        
    
        
        
        
        
    
        
    }

    /*ADD SUBMIT BUTTON NOW, MUST BE OUTSIDE THE FOR LOOP */
    let btnSubmit = document.createElement("input");
    btnSubmit.type = "submit"
    btnSubmit.value = "Submit";
    btnSubmit.className = "btnSubmit";
    eDiv = document.createElement("div");
    eDiv.appendChild(btnSubmit);
    eForm.appendChild(eDiv);

    eForm.addEventListener("submit", (e) => {
        e.preventDefault(); //prevent default behaviour...
        //TODO: ADD VARIFICATION CHECKS
    })
}