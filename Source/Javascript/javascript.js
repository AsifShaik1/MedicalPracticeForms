/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function ShowDropdownContent(i) {
  document.getElementById("Dropdown".concat(i)).classList.toggle("show");
}

function filterFunction(i) {
  var input, filter, div, a;
  input = document.getElementById("txtInput".concat(i));
  filter = input.value.toUpperCase();
  div = document.getElementById("Dropdown".concat(i));
  
  //a = div.getElementsByTagName("a");
  a = div.getElementsByTagName("label"); /* Overwirtes the previous a variable, this one gets all checkboxes.*/

  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

/*  SHOW CHECKED CHECKBOXES ONLY */
function btnShowSelected(strInputType, i) {
  //Clear The text in the search text box
  var searchTxt, filter, div, a, chk_bx;
  searchTxt = document.getElementById("txtInput".concat(i));
  searchTxt.value = "";

  //div = document.getElementById("Dropdown".concat(i));
  //a = div.getElementsByTagName("label");
  
  div = document.querySelector("#Dropdown".concat(i));
  a = div.querySelectorAll('label');
  //var checkboxesAll = div.querySelectorAll('input[type="checkbox"]');
  //var checkBoxesSelected = div.querySelectorAll('input[type="checkbox"]:checked');

  //console.log("checkboxesAll.length: " + checkboxesAll.length, "; checkBoxesSelected.length: " + checkBoxesSelected.length);
  //console.log("a.length: " + a.length);


  for (i = 0; i < a.length; i++) {
    //chk_bx = a[i].getElementsByTagName("input")
    //was ... chk_bx = a[i].querySelectorAll('input[type="checkbox"]:checked');
    chk_bx = a[i].querySelectorAll('input[type="' + strInputType + '"]:checked');
    if (chk_bx.length !== 0 ){
      console.log("i: " + i + "; chk_bx.length: " + chk_bx.length);
      console.log("chk_bx.checked: " + chk_bx.checked);
      console.log("a[" + i +"].innerHTML: " + a[i].innerHTML);
      console.log("chk_bx.length: " + chk_bx.length);
      console.log("chk_bx.item: " + chk_bx.item(0));
      //console.log("chk_bx.nameditem: " + chk_bx.namedItem);
      console.log("chk_bx.tagName: " + chk_bx.tagName);
      
      a[i].style.display = "";
    } 
    else {
      a[i].style.display = "none";
    }
  }

}


/*  SHOW ALL CHECKBOXES ONLY */
function btnShowAllCheckboxes(i) {
  //Clear The text in the search text box
  var searchTxt, filter, div, a, chk_bx;
  searchTxt = document.getElementById("txtInput".concat(i));
  searchTxt.value = "";
  div = document.getElementById("Dropdown".concat(i));
  
  a = div.getElementsByTagName("label");
  
  for (i = 0; i < a.length; i++) {
    a[i].style.display = "";
  }
}


/*  CLOSE ALL CHECKBOXES/RADIO BUTTONS IN DIV  */
function btnReset(strInputType, i) {
  //Clear The text in the search text box
  var searchTxt, filter, div, a, chk_bx;
  searchTxt = document.getElementById("txtInput".concat(i));
  searchTxt.value = "";

  //div = document.getElementById("Dropdown".concat(i));
  //a = div.getElementsByTagName("label");
  
  div = document.querySelector("#Dropdown".concat(i));
  a = div.querySelectorAll('label');
  //var checkboxesAll = div.querySelectorAll('input[type="checkbox"]');
  //var checkBoxesSelected = div.querySelectorAll('input[type="checkbox"]:checked');

  //console.log("checkboxesAll.length: " + checkboxesAll.length, "; checkBoxesSelected.length: " + checkBoxesSelected.length);
  //console.log("a.length: " + a.length);


  for (i = 0; i < a.length; i++) {
    //chk_bx = a[i].getElementsByTagName("input")
    //was ... chk_bx = a[i].querySelectorAll('input[type="checkbox"]:checked');
    chk_bx = a[i].querySelectorAll('input[type="' + strInputType + '"]');
    if (chk_bx.length !== 0 ){
      //console.log("i: " + i + "; chk_bx.length: " + chk_bx.length);
      //console.log("Before Reset chk_bx.checked: " + chk_bx.checked);
      //console.log("a[" + i +"].innerHTML: " + a[i].innerHTML);
      //console.log("chk_bx.length: " + chk_bx.length);
      //console.log("chk_bx.item: " + chk_bx.item(0));
      //console.log("chk_bx.nameditem: " + chk_bx.namedItem);
      //console.log("chk_bx.tagName: " + chk_bx.tagName);

      //console.log(chk_bx)
      chk_bx[0].checked = false; //Such an irritating error, console.log(chk_bx) helped to find it!!! Must use the [0] index.
      //console.log("After Reset chk_bx.checked: " + chk_bx.checked);
    } 
    //Show the element
    a[i].style.display = "";
  }
}


