"use strict";

window.addEventListener("DOMContentLoaded", start);
const allStudents = [];

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  img: "",
  house: "",
};

function start() {
  loadJSON();
}

//lets fetch json from database

function loadJSON() {
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach((elm) => {
    console.log(elm);

    //create new object
    const student = Object.create(Student);
    // console.log(student);
    // finding the values

    let trimmedStudent = elm.fullname.trim();
    let trimmedHouse = elm.house.trim();

    let firstName = getFirstName(trimmedStudent);

    let lastName = getLastName(trimmedStudent);
    let middleName = getMiddleName(trimmedStudent);
    let nickName = getNickName(trimmedStudent);
    let img = getImg(firstName, lastName);
    let house = getHouse(trimmedHouse);

    // setting properties in the new object to that values
    student.firstName = firstName;
    student.lastName = lastName;
    student.middleName = middleName;
    student.nickName = nickName;
    student.img = img;
    student.house = house;

    // adding new objects to the global array
    allStudents.push(student);
    console.log("this is", student);
    console.table(allStudents);
  });
  displayList();
}

function getFirstName(fullname) {
  let firstname;
  let firstnameCap;
  if (fullname.includes(" ") === false) {
    firstname = fullname.substring(0).toLowerCase();
    firstnameCap = firstname[0].toUpperCase() + firstname.substring(1);
    console.log(firstname);
  } else {
    firstname = fullname.substring(0, fullname.indexOf(" ")).toLowerCase();
    firstnameCap = firstname[0].toUpperCase() + firstname.substring(1);
  }

  return firstnameCap.trim();
}

function getLastName(fullname) {
  let lastname;
  let lastnameCap;

  lastname = fullname
    .substring(fullname.lastIndexOf(" ") + 1, fullname.length)
    .toLowerCase();

  if (fullname.includes(" ") === false) {
    lastnameCap = "";
  } else if (fullname.includes("-") === true) {
    let letter = lastname[0];
    for (let i = 1; i < lastname.length; i++) {
      if (letter[i - 1] === "-") {
        letter += lastname[i].toUpperCase();
      } else {
        letter += lastname[i].toLowerCase();
      }
    }
    lastnameCap = lastname[0].toUpperCase() + letter.substring(1);

    /*  followHyphen =
      lastname.substring(0, lastname.indexOf("-")) +
      lastname.substring(lastname.indexOf("-" + 1, lastname.length)); */
    /*   lastnameCap =
      lastname[0].toUpperCase() +
      lastname.substring(1, lastname.indexOf("-")).toLowerCase() +
      lastname
        .substring(lastname.indexOf("-") + 1, lastname.indexOf("-") + 2)
        .toUpperCase() +
      lastname
        .substring(lastname.indexOf("-" + 2, lastname.length))
        .toLowerCase(); */
  } else {
    lastnameCap = lastname[0].toUpperCase() + lastname.substring(1);
  }

  return lastnameCap.trim();
}
function getMiddleName(fullname) {
  let middlename;
  let middlenameCap;
  middlename = fullname
    .substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "))
    .trim();

  if (middlename === "") {
    middlenameCap = "";
  } else if (middlename.includes('"')) {
    middlenameCap = "";
  } else {
    middlenameCap = middlename[0].toUpperCase() + middlename.substring(1);
  }
  return middlenameCap.trim();
}
function getNickName(fullname) {
  let nickname;
  let nicknameCap;
  nickname = fullname
    .substring(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "))
    .trim();

  if (nickname.includes('"')) {
    nicknameCap = nickname.replaceAll('"', "");
  } else {
    nicknameCap = "";
  }
  return nicknameCap.trim();
}
function getImg(firstName, lastName) {
  let imgname;

  imgname =
    "images/" +
    lastName.toLowerCase() +
    "_" +
    firstName[0].toLowerCase() +
    ".png";
  return imgname;
}

function getHouse(houseName) {
  let housename = houseName.toLowerCase().trim();
  return housename[0].toUpperCase() + housename.substring(1);
}

function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  allStudents.forEach(displayStudent);
}

function displayStudent(student) {
  console.log("this is student in the display function", student);
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = student.firstName;
  clone.querySelector("[data-field=middlename]").textContent =
    student.middleName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=prefect]").textContent = student.prefect;
  clone.querySelector("[data-field=squad]").textContent = student.squad;
  clone.querySelector("[data-field=expel]").textContent = student.expel;
  clone.querySelector("tr td").addEventListener("click", function () {
    showDetails(student);
  });
  /*   clone.querySelector("img").src = "checkImage(student.img)";
  console.log("this is clone img");
  console.log(clone.querySelector("img").src); */

  /* function checkImage(url) {
    let newURL;
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = function () {
      status = request.status;
      if (request.status === 200) {
        console.log("img exists");
        newURL =
          "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png";
        console.log(newURL);
      } else {
        console.log("img doesnt exist");
        newURL =
          "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png";
        console.log(newURL);
      }
    };
    return newURL;
  } */

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
function showDetails(student) {
  console.log("name has been clicked");
  document.querySelector("#student-details-modal").style.display = "block";

  document.querySelector("[data-student-modal=name]").textContent =
    student.firstName;

  if (student.middleName === "") {
    document.querySelector("[data-student-modal=middlename]").style.display =
      "none";
  } else {
    document.querySelector("[data-student-modal=middlename]").textContent =
      student.middleName;
  }
  if (student.nickName === "") {
    document.querySelector("[data-student-modal=nickname]").style.display =
      "none";
  } else {
    document.querySelector("[data-student-modal=nickname]").textContent =
      student.nickName;
  }

  document.querySelector("[data-student-modal=lastname]").textContent =
    student.lastName;
  document.querySelector("[data-student-modal=house]").textContent =
    student.house;
  document.querySelector("[data-student-modal=img] img").src = student.img;

  window.onclick = function (event) {
    if (event.target == document.querySelector("#student-details-modal")) {
      document.querySelector("#student-details-modal").style.display = "none";
      document.querySelector("[data-student-modal=middlename]").style.display =
        "initial";
      document.querySelector("[data-student-modal=nickname]").style.display =
        "initial";
    }
  };
}
function checkImage(url) {
  console.log("this is url in checkImage", url);
  fetch(url)
    .then((response) => {
      //console.log(response);
      if (!response.ok) {
        console.log("The image does not exist");
        let NewUrl =
          "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg";
        console.log("this is newurl", NewUrl);

        return NewUrl;
      }

      return url;
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}
