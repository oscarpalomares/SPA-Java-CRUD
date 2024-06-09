//XML = 1, JSON = 2
var boolDataMode = 1

var xmlData = `
<Teachers>
    <Teacher>
        <keyidD>01</keyidD>
        <Name>John</Name>
        <Surname1>Doe</Surname1>
        <Surname2>McKinley</Surname2>
        <Birthday>22/11/2000</Birthday>
        <Age>22</Age>
        <Sex>Male</Sex>
        <MaritalStatus>Married</MaritalStatus>
        <Shift>Morning</Shift>
        <Area>Maths</Area>
        <Level>Masters</Level>
    </Teacher>
    <Teacher>
        <keyidD>02</keyidD>
        <Name>Samuel</Name>
        <Surname1>Jackson</Surname1>
        <Surname2>Kennedy</Surname2>
        <Birthday>10/05/1998</Birthday>
        <Age>25</Age>
        <Sex>Male</Sex>
        <MaritalStatus>Widow</MaritalStatus>
        <Shift>Evening</Shift>
        <Area>Literature</Area>
        <Level>HighSchool</Level>
    </Teacher>
    <Teacher>
        <keyidD>03</keyidD>
        <Name>Ana</Name>
        <Surname1>DeArmas</Surname1>
        <Surname2>Gonzalez</Surname2>
        <Birthday>31/01/1980</Birthday>
        <Age>35</Age>
        <Sex>Female</Sex>
        <MaritalStatus>Single</MaritalStatus>
        <Shift>Morning</Shift>
        <Area>Science</Area>
        <Level>Degree</Level>
    </Teacher>
</Teachers>`;

var jsonData = {
    "Teachers": [
        {"keyidD": "01", "Name": "John", "Surname1": "Doe", "Surname2": "McKinley", "Birthday": "22/11/2000", "Age": 22, "Sex": "Male", "MaritalStatus": "Married", "Shift": "Morning", "Area": "Maths", "Level": "Masters"},
        {"keyidD": "02", "Name": "Samuel", "Surname1": "Jackson", "Surname2": "Kennedy", "Birthday": "10/05/1998", "Age": 25, "Sex": "Male", "MaritalStatus": "Widow", "Shift": "Evening", "Area": "Literature", "Level": "HighSchool"},
        {"keyidD": "03", "Name": "Ana", "Surname1": "DeArmas", "Surname2": "Gonzalez", "Birthday": "31/01/1980", "Age": 35, "Sex": "Female", "MaritalStatus": "Single", "Shift": "Morning", "Area": "Science", "Level": "Degree"}
    ]
};


var indexEncontrado = -1;
var parser = new DOMParser();
var xmlDoc = parser.parseFromString(xmlData, "text/xml"); //XML Gets stored here.
var jsonDoc = jsonData; //jsonData gets normalized and stored here.


//This is for the navbar
function ShowTab(tabId) {
    //List with all the tabs
    var tabs = ["RegisterUser", "DeleteUser", "EditUser", "PrintUsers", "SearchUser"];
    //Hides every tab
    tabs.forEach(function(id) {
        document.getElementById(id).style.display = "none";
    });
    //Shows the selected tab
    document.getElementById(tabId).style.display = "block";
}

//DOM
document.addEventListener("DOMContentLoaded", function() {
    //Shows as default "RegisterUser"
    ShowTab("RegisterUser");

    document.getElementById("globalnav").addEventListener("click", function(e) {
        e.preventDefault();

        //Gets the ID of the selected element.
        var targetId = e.target.getAttribute("data-target");
        if (targetId) {
            ShowTab(targetId);
        }
    });
});
function ShowEditForm() {
    document.getElementById("divformedit").style.display = 'block';
}
function HideEditForm() {
    document.getElementById("divformedit").style.display = 'none';
}

function ResetForm() { //Hides the form and focuses on the first field
    document.getElementById("form").reset();
    document.getElementById("formEdit").reset();
    document.getElementById("name").focus();
}

function setCheckedValue(groupName, value) {
    var radios = document.querySelectorAll(`input[name="${groupName}"]`);
    radios.forEach(function(radio) {
        radio.checked = (radio.value === value);
    });
}

//REGISTER
//Adds a new node if XML is being used (booldatamode)
function createXMLElement(tagName, text) {
    var elem = xmlDoc.createElement(tagName);
    var textNode = xmlDoc.createTextNode(text);
    elem.appendChild(textNode);
    return elem;
}
function SendData() { //Grabs all the information and stores it into variables
    var keyidD = document.getElementById("keyidD").value;
    var name = document.getElementById("name").value;
    var surname1 = document.getElementById("surname1").value;
    var surname2 = document.getElementById("surname2").value;
    var birthday = document.getElementById("birthday").value;
    var age = document.getElementById("age").value;
    var sex = document.querySelector('input[name="gender"]:checked').value; 
    var maritalStatus = document.querySelector('input[name="maritalStatus"]:checked').value;
    var shift = document.querySelector('input[name="morning"]:checked') ? 'Morning' : 'Evening';
    var area = document.querySelector('input[name="area"]:checked').value;
    var level = document.querySelector('input[name="StudyLevel"]:checked').value;

    //Here, it will add into the JSON or XML depending on boolDataMode.
    if (boolDataMode === 2) {
        //JSON
        var newTeacher = {
            "keyidD": keyidD,
            "Name": name,
            "Surname1": surname1,
            "Surname2": surname2,
            "Birthday": birthday,
            "Age": parseInt(age),
            "Sex": sex,
            "MaritalStatus": maritalStatus,
            "Shift": shift,
            "Area": area,
            "Level": level
        };
        jsonData.Teachers.push(newTeacher);
    } else {
        //XML, creates and adds.
        var teacherElem = xmlDoc.createElement("Teacher");
        
        teacherElem.appendChild(createXMLElement("keyidD", keyidD));
        teacherElem.appendChild(createXMLElement("Name", name));
        teacherElem.appendChild(createXMLElement("Surname1", surname1));
        teacherElem.appendChild(createXMLElement("Surname2", surname2));
        teacherElem.appendChild(createXMLElement("Birthday", birthday));
        teacherElem.appendChild(createXMLElement("Age", age));
        teacherElem.appendChild(createXMLElement("Sex", sex));
        teacherElem.appendChild(createXMLElement("MaritalStatus", maritalStatus));
        teacherElem.appendChild(createXMLElement("Shift", shift));
        teacherElem.appendChild(createXMLElement("Area", area));
        teacherElem.appendChild(createXMLElement("Level", level));

        xmlDoc.getElementsByTagName("Teachers")[0].appendChild(teacherElem);
    }
    alert("Teacher registered successfully");
    ResetForm();
}
//REGISTER

//SEARCH
function SearchUser() {
    var searchKey = document.getElementById("searchallinput").value;
    var found = false; //Just to know if the teachas has been succesfully found
    var resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = ""; //Clean

    if (boolDataMode === 2) {
        //JSON
        jsonData.Teachers.forEach(teacher => {
            if (teacher.keyidD === searchKey) {
                found = true;
                displayResults(teacher, resultsContainer);
            }
        });
    } else {
        //XML
        var teachers = xmlDoc.getElementsByTagName("Teacher");
for (var i = 0; i < teachers.length; i++) {
    var currentKey = teachers[i].getElementsByTagName("keyidD")[0].childNodes[0].nodeValue.trim();
    if (currentKey === searchKey.trim()) {
        found = true;
        var teacher = {
            keyidD: currentKey,
            Name: teachers[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue,
            Surname1: teachers[i].getElementsByTagName("Surname1")[0].childNodes[0].nodeValue,
            Surname2: teachers[i].getElementsByTagName("Surname2")[0].childNodes[0].nodeValue,
            Birthday: teachers[i].getElementsByTagName("Birthday")[0].childNodes[0].nodeValue,
            Age: teachers[i].getElementsByTagName("Age")[0].childNodes[0].nodeValue,
            Sex: teachers[i].getElementsByTagName("Sex")[0].childNodes[0].nodeValue,
            MaritalStatus: teachers[i].getElementsByTagName("MaritalStatus")[0].childNodes[0].nodeValue,
            Shift: teachers[i].getElementsByTagName("Shift")[0].childNodes[0].nodeValue,
            Area: teachers[i].getElementsByTagName("Area")[0].childNodes[0].nodeValue,
            Level: teachers[i].getElementsByTagName("Level")[0].childNodes[0].nodeValue
        };
        displayResults(teacher, resultsContainer);
        break;
    }
}
    }

    if (!found) {
        resultsContainer.innerHTML = "No teacher found with KeyID: " + searchKey;
    }
}

function displayResults(teacher, container) {
    //Displays the teacher info
    var table = `<table class="table table-striped table-bordered table-hover">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">Campo</th>
                            <th scope="col">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>KeyID</td><td>${teacher.keyidD}</td></tr>
                        <tr><td>Name</td><td>${teacher.Name}</td></tr>
                        <tr><td>First Surname</td><td>${teacher.Surname1}</td></tr>
                        <tr><td>Second Surname</td><td>${teacher.Surname2}</td></tr>
                        <tr><td>Birthday</td><td>${teacher.Birthday}</td></tr>
                        <tr><td>Age</td><td>${teacher.Age}</td></tr>
                        <tr><td>Sex</td><td>${teacher.Sex}</td></tr>
                        <tr><td>Marital Status</td><td>${teacher.MaritalStatus}</td></tr>
                        <tr><td>Shift</td><td>${teacher.Shift}</td></tr>
                        <tr><td>Area</td><td>${teacher.Area}</td></tr>
                        <tr><td>Level</td><td>${teacher.Level}</td></tr>
                    </tbody>
                </table>`;

    //Cleans
    container.innerHTML = table;
}
//SEARCH



//PRINTALL
function PrintUsers() {
    var table = document.getElementById("TableAllUsers");
    table.className = "table table-striped table-hover table-bordered"; //Bootstrap...

    var thead = document.createElement('thead');
    thead.className = "thead-dark"; //MOAR Bootstrap...

    var tbody = document.createElement('tbody');

    thead.innerHTML = `<tr>
                        <th>KeyID</th>
                        <th>Name</th>
                        <th>Surname1</th>
                        <th>Surname2</th>
                        <th>Birthday</th>
                        <th>Age</th>
                        <th>Sex</th>
                        <th>Marital Status</th>
                        <th>Shift</th>
                        <th>Area</th>
                        <th>Level</th>
                       </tr>`;

    //XML
    if (boolDataMode === 1) {
        var teachers = xmlDoc.getElementsByTagName("Teacher");
        for (var i = 0; i < teachers.length; i++) {
            var row = "<tr>";
            row += "<td>" + teachers[i].getElementsByTagName("keyidD")[0].childNodes[0].nodeValue + "</td>";
            row += "<td>" + teachers[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue + "</td>";
            row += "<td>" + teachers[i].getElementsByTagName("Surname1")[0].childNodes[0].nodeValue + "</td>";
            row += "<td>" + teachers[i].getElementsByTagName("Surname2")[0].childNodes[0].nodeValue + "</td>";
            row += "<td>" + teachers[i].getElementsByTagName("Birthday")[0].childNodes[0].nodeValue + "</td>";
            row += "<td>" + teachers[i].getElementsByTagName("Age")[0].childNodes[0].nodeValue + "</td>";
            row += "<td>" + teachers[i].getElementsByTagName("Sex")[0].childNodes[0].nodeValue + "</td>";
            row += "<td>" + teachers[i].getElementsByTagName("MaritalStatus")[0].childNodes[0].nodeValue + "</td>";
            row += "<td>" + teachers[i].getElementsByTagName("Shift")[0].childNodes[0].nodeValue + "</td>";
            row += "<td>" + teachers[i].getElementsByTagName("Area")[0].childNodes[0].nodeValue + "</td>";
            row += "<td>" + teachers[i].getElementsByTagName("Level")[0].childNodes[0].nodeValue + "</td>";
            row += "</tr>";
            tbody.innerHTML += row;
        }
    } else if (boolDataMode === 2) { //JSON!
        jsonDoc.Teachers.forEach(function(teacher) {
            var row = "<tr>";
            row += "<td>" + teacher.keyidD + "</td>";
            row += "<td>" + teacher.Name + "</td>";
            row += "<td>" + teacher.Surname1 + "</td>";
            row += "<td>" + teacher.Surname2 + "</td>";
            row += "<td>" + teacher.Birthday + "</td>";
            row += "<td>" + teacher.Age + "</td>";
            row += "<td>" + teacher.Sex + "</td>";
            row += "<td>" + teacher.MaritalStatus + "</td>";
            row += "<td>" + teacher.Shift + "</td>";
            row += "<td>" + teacher.Area + "</td>";
            row += "<td>" + teacher.Level + "</td>";
            row += "</tr>";
            tbody.innerHTML += row;
        });
    }

    //CLEAN
    table.innerHTML = '';

    table.appendChild(thead);
    table.appendChild(tbody);
}
//PRINTALL

//DELETE
function DeleteUser() {
    var searchKey = document.getElementById("fieldforsearchinput").value; //Gets the id to delete.
    var found = false;
    var clearer = '';

    if (boolDataMode === 2) {
        //JSON
        for (var i = 0; i < jsonData.Teachers.length; i++) {
            if (jsonData.Teachers[i].keyidD === searchKey) {
                found = true;
                //Deletes the teacher from the array.
                jsonData.Teachers.splice(i, 1);
                break;
            }
        }
    } else {
        //XML
        var teachers = xmlDoc.getElementsByTagName("Teacher");
        for (var i = 0; i < teachers.length; i++) {
            if (teachers[i].getElementsByTagName("keyidD")[0].childNodes[0].nodeValue === searchKey) {
                found = true;
                //Deletes DOM element from the XML "File"
                teachers[i].parentNode.removeChild(teachers[i]);
                break;
            }
        }
    }

    //Debugging?
    if (found) {
        alert("Teacher with KeyID " + searchKey + " has been successfully deleted.");
        PrintUsers();
        document.getElementById("fieldforsearchinput").value = clearer;
    } else {
        alert("No teacher found with KeyID: " + searchKey);
    }
}
//DELETE

//EDIT
//This one was tough... its cheesy but works perfectly


//First, we search for the teacher, depending if we are on XML or JSON.
//Then, we fill in the form with the teacher's info.
//FIRST STEP FOR EDITION!
function SearchEdit() {
    document.getElementById('keyidEdit').style.display = 'none';
    var varkeyidDSearch = document.getElementById('keyidDSearch').value.trim();
    var found = false;

    //JSON
    if (boolDataMode === 2) {
        jsonData.Teachers.forEach(function(teacher) {
            if (teacher.keyidD === varkeyidDSearch) {
                found = true;
                document.getElementById('nameEdit').value = teacher.Name;
                document.getElementById('surname1Edit').value = teacher.Surname1;
                document.getElementById('surname2Edit').value = teacher.Surname2;
                document.getElementById('birthdayEdit').value = teacher.Birthday;
                document.getElementById('ageEdit').value = teacher.Age;
                document.getElementById('keyidDEdit').value = teacher.keyidD;
                setCheckedValue('maritalStatusEdit', teacher.MaritalStatus);
                setCheckedValue('genderEdit', teacher.Sex);
                setCheckedValue('shiftEdit', teacher.Shift);
                setCheckedValue('areaEdit', teacher.Area);
                setCheckedValue('StudyLevelEdit', teacher.Level);
                ShowEditForm();
            }
        });
    //XML
    } else {
        var teachers = xmlDoc.getElementsByTagName("Teacher");
        for (var i = 0; i < teachers.length; i++) {
            var currentKey = teachers[i].getElementsByTagName("keyidD")[0].textContent;
            if (currentKey === varkeyidDSearch) {
                found = true;
                var teacher = teachers[i];
                document.getElementById('nameEdit').value = teacher.getElementsByTagName("Name")[0].textContent;
                document.getElementById('surname1Edit').value = teacher.getElementsByTagName("Surname1")[0].textContent;
                document.getElementById('surname2Edit').value = teacher.getElementsByTagName("Surname2")[0].textContent;
                document.getElementById('birthdayEdit').value = teacher.getElementsByTagName("Birthday")[0].textContent;
                document.getElementById('ageEdit').value = teacher.getElementsByTagName("Age")[0].textContent;
                setCheckedValue('genderEdit', teacher.getElementsByTagName("Sex")[0].textContent);
                setCheckedValue('maritalStatusEdit', teacher.getElementsByTagName("MaritalStatus")[0].textContent);
                setCheckedValue('shiftEdit', teacher.getElementsByTagName("Shift")[0].textContent);
                setCheckedValue('areaofspecialityEdit', teacher.getElementsByTagName("Area")[0].textContent);
                setCheckedValue('StudyLevelEdit', teacher.getElementsByTagName("Level")[0].textContent);
                ShowEditForm();
                break;
            }
        }
    }

    if (!found) {
        alert('Key not found.');
        HideEditForm();
        document.getElementById("divformeditsearch").style.display = 'none';
    }
    else {
        //Since it was found and the teacher's data has been copied INTO the form, we proceed to delete the teacher.
        //This causes data to be "out of place" but it's fine.
        DeleteUserEdit();
    }
    
}

//THIRD STEP FOR EDITION!
//Once found, we update it with the form data and the new data inputed by the user
function UpdateData() {
    var keyidD = document.getElementById("keyidDEdit").value;
    var name = document.getElementById("nameEdit").value;
    var surname1 = document.getElementById("surname1Edit").value;
    var surname2 = document.getElementById("surname2Edit").value;
    var birthday = document.getElementById("birthdayEdit").value;
    var age = document.getElementById("ageEdit").value;
    var sex = document.querySelector('input[name="genderEdit"]:checked').value;
    var maritalStatus = document.querySelector('input[name="maritalStatusEdit"]:checked').value;
    var shift = document.querySelector('input[name="shiftEdit"]:checked').value;
    var area = document.querySelector('input[name="area1Edit"]:checked') ? 'Maths' : (document.querySelector('input[name="area2Edit"]:checked') ? 'Literature' : 'Science');
    var level = document.querySelector('input[name="StudyLevelEdit"]:checked').value;

    //JSON
    if (boolDataMode === 2) {
        var newTeacher = {
            "keyidD": keyidD,
            "Name": name,
            "Surname1": surname1,
            "Surname2": surname2,
            "Birthday": birthday,
            "Age": parseInt(age),
            "Sex": sex,
            "MaritalStatus": maritalStatus,
            "Shift": shift,
            "Area": area,
            "Level": level
        };
        jsonData.Teachers.push(newTeacher);
    } else {
        //XML
        var teacherElem = xmlDoc.createElement("Teacher");
        
        teacherElem.appendChild(createXMLElement("keyidD", keyidD));
        teacherElem.appendChild(createXMLElement("Name", name));
        teacherElem.appendChild(createXMLElement("Surname1", surname1));
        teacherElem.appendChild(createXMLElement("Surname2", surname2));
        teacherElem.appendChild(createXMLElement("Birthday", birthday));
        teacherElem.appendChild(createXMLElement("Age", age));
        teacherElem.appendChild(createXMLElement("Sex", sex));
        teacherElem.appendChild(createXMLElement("MaritalStatus", maritalStatus));
        teacherElem.appendChild(createXMLElement("Shift", shift));
        teacherElem.appendChild(createXMLElement("Area", area));
        teacherElem.appendChild(createXMLElement("Level", level));

        xmlDoc.getElementsByTagName("Teachers")[0].appendChild(teacherElem);
    }
    alert("Teacher updated successfully");
    ResetForm();
    HideEditForm();
    document.getElementById("divformeditsearch").style.display = 'block';

}

function DeleteUserEdit() {
    //SECOND STEP FOR EDITION!
    var searchKeyEdit = document.getElementById("keyidDSearch").value;
    //var found = false;

    if (boolDataMode === 2) {
        //JSON
        for (var i = 0; i < jsonData.Teachers.length; i++) {
            if (jsonData.Teachers[i].keyidD === searchKeyEdit) {
                //found = true;
                //Deletes the teacher from the array
                jsonData.Teachers.splice(i, 1);
                break;
            }
        }
    } else {
        //XML
        var teachers = xmlDoc.getElementsByTagName("Teacher");
        for (var i = 0; i < teachers.length; i++) {
            if (teachers[i].getElementsByTagName("keyidD")[0].childNodes[0].nodeValue === searchKeyEdit) {
                //found = true;
                //Deletes teacher from DOM!
                teachers[i].parentNode.removeChild(teachers[i]);
                break;
            }
        }
    }
}
