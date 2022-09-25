var selectedRow = null;
var editedContact = null;
var isEditingForm = false;
var editedPictur;
const existingsFiles = ["../img/contact1.jpg", "../img/contact2.jpg", "../img/contact3.jpg", "../img/contact4.jpg"]

function onFormeSubmit() {
    if (validate() && !duplicateContact()) {
        var formFata = createNewContact(!(selectedRow == null));
        if (selectedRow == null) {
            insertNewRecord(formFata, true);
        } else {
            updateRecord(formFata);
        }
        resetForm();
    }
}

function getUniqueRandomId() {
    return Math.floor(Math.random() * 100);
}

function readFormData() {
    var formData = {};
    formData["pictur"] = document.getElementById("picturId").value
    formData["fullName"] = document.getElementById("fullNameId").value
    formData["phone"] = document.getElementById("phoneId").value
    formData["location"] = document.getElementById("locationId").value
    formData["dateOfBirthday"] = document.getElementById("dateId").value
    return formData;
}

function insertNewRecord(data, isnewData) {
    var table = document.getElementById("contactList").getElementsByTagName('tbody')[0];
    var row = table.insertRow(table.length);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = data.id;
    cell1.classList.add("hide")
    var cell2 = row.insertCell(1);
    if (isnewData) {
        cell2.innerHTML = `<div style="text-align: center"><img width="50px" src="${sessionStorage.getItem(data.pictur)}" class="avatar"></div>`;
    } else {
        cell2.innerHTML = `<div style="text-align: center"><img width="50px" src="${data.pictur}" class="avatar"></div>`;
    }
    var cell3 = row.insertCell(2);
    cell3.innerHTML = data.fullName;
    var cell4 = row.insertCell(3);
    cell4.innerHTML = data.phone;
    var cell5 = row.insertCell(4);
    cell5.innerHTML = `<div style="text-align: center"><button type="button" class="btn btn-outline-secondary" onclick="onEdit(this)">Edit</button>
                     <button type="button" class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button></div>`;

}

function updateRecord(data) {
    if (existingsFiles.includes(data.pictur)) {
        selectedRow.cells[1].innerHTML = `<div style="text-align: center"><img width="50px" src="${data.pictur}" class="avatar"></div>`;
    } else {
        selectedRow.cells[1].innerHTML = `<div style="text-align: center"><img width="50px" src="${sessionStorage.getItem(data.pictur)}" class="avatar"></div>`;
    }
    selectedRow.cells[2].innerHTML = data.fullName;
    selectedRow.cells[3].innerHTML = data.phone;

}

function resetForm() {
    document.getElementById("picturId").value = "";
    document.getElementById("fullNameId").value = "";
    document.getElementById("phoneId").value = "";
    document.getElementById("locationId").value = "";
    document.getElementById("dateId").value = "";
    selectedRow = null;
    isEditingForm = false;
    if (!document.getElementById("phoneDuplicateValidationErrorId").classList.contains("hide")) {
        document.getElementById("phoneDuplicateValidationErrorId").classList.add("hide");
    }
    if (!document.getElementById("phoneValidationErrorId").classList.contains("hide")) {
        document.getElementById("phoneValidationErrorId").classList.add("hide");
    }
    if (!document.getElementById("fullNameValidationErrorId").classList.contains("hide")) {
        document.getElementById("fullNameValidationErrorId").classList.add("hide");
    }
    if (!document.getElementById("savedIMGId").classList.contains("hide")) {
        document.getElementById("savedIMGId").classList.add("hide");
    }
}


function createNewContact(isFromUpdate) {
    const pictur = document.getElementById("picturId").value == "" ? editedPictur : document.getElementById("picturId").value;
    const fullName = document.getElementById("fullNameId").value;
    const phone = document.getElementById("phoneId").value;
    const location = document.getElementById("locationId").value;
    const birthDate = document.getElementById("dateId").value;
    var contact = new Contact(isFromUpdate ? selectedRow.cells[0].innerHTML : getUniqueRandomId(), pictur, fullName, phone, location, birthDate);
    if (isFromUpdate) {
        allContacts = allContacts.filter(element => element.id != selectedRow.cells[0].innerHTML);
    }
    allContacts.push(contact);

    return contact;
}

class Contact {
    constructor(id, pictur, fullName, phone, location, birthDate) {
        this.id = id;
        this.pictur = pictur;
        this.fullName = fullName;
        this.phone = phone;
        this.location = location;
        this.birthDate = birthDate;
    }
}

var allContacts = [];

async function initTable() {
    await fetch('data/data.json')
        .then((response) => response.json())
        .then((json) => allContacts = json);
    allContacts.forEach((item) => {
        insertNewRecord(item, false);
    })
}

initTable();

function getContactFromList(id) {
    allContacts.forEach((item) => {
        if (item.id == id) {
            editedContact = item;
            return;
        }
    })
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement.parentElement;
    getContactFromList(selectedRow.cells[0].innerHTML);
    document.getElementById("savedIMGId").classList.remove("hide");
    if (existingsFiles.includes(editedContact.pictur)) {
        document.getElementById("savedIMGId").src = editedPictur = editedContact.pictur;
    } else {
        document.getElementById("savedIMGId").src = sessionStorage.getItem(editedContact.pictur);
        editedPictur = editedContact.pictur
    }
    document.getElementById("fullNameId").value = editedContact.fullName;
    document.getElementById("phoneId").value = editedContact.phone;
    document.getElementById("locationId").value = editedContact.location;
    document.getElementById("dateId").value = editedContact.birthDate;
    isEditingForm = true;
}

function onDelete(td) {
    if (confirm("Are you sure to deete this contact")) {
        row = td.parentElement.parentElement.parentElement;
        document.getElementById("contactList").deleteRow(row.rowIndex);
        resetForm();
        allContacts = allContacts.filter(element => element.id != row.cells[0].innerHTML);
    }
}

function validate() {
    isvalide = true;
    if (document.getElementById("fullNameId").value.replace(/^\s+|\s+$/gm, '') == "") {
        isvalide = false;
        document.getElementById("fullNameValidationErrorId").classList.remove("hide");
    } else {
        if (!document.getElementById("fullNameValidationErrorId").classList.contains("hide")) {
            document.getElementById("fullNameValidationErrorId").classList.add("hide");
        }
    }
    if (document.getElementById("phoneId").value.replace(/^\s+|\s+$/gm, '') == "") {
        isvalide = false;
        document.getElementById("phoneValidationErrorId").classList.remove("hide");
    } else {
        if (!document.getElementById("phoneValidationErrorId").classList.contains("hide")) {
            document.getElementById("phoneValidationErrorId").classList.add("hide");
        }
    }
    return isvalide;
}

function duplicateContact() {
    duplicate = false;
    allContacts.forEach(item => {
        if (item.phone == document.getElementById("phoneId").value.replace(/^\s+|\s+$/gm, '')) {
            selectedRow != null && item.id == selectedRow.cells[0].innerHTML? duplicate = false : duplicate = true; 
        }
    })
    if (duplicate) {
        document.getElementById("phoneDuplicateValidationErrorId").classList.remove("hide");
    } else {
        if (!document.getElementById("phoneDuplicateValidationErrorId").classList.contains("hide")) {
            document.getElementById("phoneDuplicateValidationErrorId").classList.add("hide");
        }
    }
    return duplicate;
}

document.querySelector("#picturId").addEventListener("change", function () {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        sessionStorage.setItem(document.getElementById("picturId").value, reader.result);
        document.getElementById("savedIMGId").classList.remove("hide");
        document.getElementById("savedIMGId").src = sessionStorage.getItem(document.getElementById("picturId").value);
    })
    reader.readAsDataURL(this.files[0]);
})





