"use strict";

window.addEventListener("DOMContentLoaded", start);
const allStudents = [];
const searchBar = document.querySelector("#search");

const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  img: "",
  house: "",
  prefect: false,
  squad: false,
  expelled: false,
};

function start() {
  registerButtons();

  loadJSON();
}

function registerButtons() {
  document
    .querySelectorAll(`[data-action="filter"]`)
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll(`[data-action="sort"]`)
    .forEach((button) => button.addEventListener("click", selectSort));
  searchBar.addEventListener("keyup", search);
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
  /*   displayList(allStudents); */
  buildList();
}

function search(e) {
  const searchVal = e.target.value.toLowerCase();
  const searchResult = allStudents.filter((student) => {
    return (
      student.firstName.toLowerCase().includes(searchVal) ||
      student.middleName.toLowerCase().includes(searchVal) ||
      student.nickName.toLowerCase().includes(searchVal) ||
      student.lastName.toLowerCase().includes(searchVal) ||
      student.house.toLowerCase().includes(searchVal)
    );
  });
  console.log(searchResult);
  displayList(searchResult);
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log("user selected", filter);
  setFilter(filter);
}
function setFilter(filter) {
  settings.filter = filter;
  buildList();
}
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find old sortby element and remove .sortBy
  const oldElement = document.querySelector(`[data-sort="${settings.sortBy}"]`);
  oldElement.classList.remove("sortby");

  // indicate active sort
  event.target.classList.add("sortby");
  // toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log("user selecter", sortBy);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}
function filterList(filteredList) {
  // create filtered list of only cats

  if (settings.filter === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filter === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filter === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filter === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else {
    filteredList = allStudents.filter(all);
  }

  return filteredList;
}

function isGryffindor(student) {
  console.log("is grffinfor", student);
  if (student.house === "Gryffindor") {
    return true;
  }
  return false;
}
function isHufflepuff(student) {
  if (student.house === "Hufflepuff") {
    return true;
  }
  return false;
}
function isRavenclaw(student) {
  if (student.house === "Ravenclaw") {
    return true;
  }
  return false;
}
function isSlytherin(student) {
  if (student.house === "Slytherin") {
    return true;
  }
  return false;
}
function all(student) {
  return true;
}
/* function filterList(house) {
  const filteredList = allStudents.filter(isHouse);

  function isHouse(student) {
    console.log("this is student in the house", student);
    console.log("this is house", house);
    if (student.house.toLowerCase() === house) {
      return true;
    } else {
      return false;
    }
  }

  return filteredList;
} */
/* function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  console.log("user selecter", sortBy);
  sortList(sortBy);
} */
/* 
function sortList(sortedList) {
  let sortedList = allStudents;

  sortedList = sortedList.sort(sortByAll);

  function sortByAll(studentA, studentB) {
    if (studentA[sortBy] < studentB[sortBy]) {
      return -1;
    }
    return 1;
  }

  displayList(sortedList);
} */
function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortBy);

  function sortBy(studentA, studentB) {
    console.log("this is studentA", studentA);
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    }
    return 1 * direction;
  }

  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents); // FUTURE: Filter and sort currentList before displaying
  const sortedList = sortList(currentList);
  displayList(sortedList);
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
  if (lastName === "Patil") {
    imgname =
      "images/" +
      lastName.toLowerCase() +
      "_" +
      firstName.toLowerCase() +
      ".png";
  } else if (lastName.includes("-") || lastName === "") {
    imgname = "images/person-icon.png";
  } else {
    imgname =
      "images/" +
      lastName.toLowerCase() +
      "_" +
      firstName[0].toLowerCase() +
      ".png";
  }
  return imgname;
}

function getHouse(houseName) {
  let housename = houseName.toLowerCase().trim();
  return housename[0].toUpperCase() + housename.substring(1);
}

function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
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
  /*  clone.querySelector("[data-field=prefect]").textContent = student.prefect;
  clone.querySelector("[data-field=squad]").textContent = student.squad;
  clone.querySelector("[data-field=expel]").textContent = student.expel; */
  clone
    .querySelector("[data-field=name]")
    .addEventListener("click", function () {
      showDetails(student);
    });
  clone
    .querySelector("[data-field=middlename]")
    .addEventListener("click", function () {
      showDetails(student);
    });
  clone
    .querySelector("[data-field=nickname]")
    .addEventListener("click", function () {
      showDetails(student);
    });
  clone
    .querySelector("[data-field=lastname]")
    .addEventListener("click", function () {
      showDetails(student);
    });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
function showDetails(student) {
  console.log("name has been clicked");
  document.querySelector("#student-details-modal").style.display = "block";

  document.querySelector("[data-student-modal=name]").textContent =
    student.firstName;

  if (student.house === "Gryffindor") {
    document.querySelector(
      ".student-details-model-content"
    ).style.backgroundImage = "url(images/gryffindor-bg.svg)";
  } else if (student.house === "Hufflepuff") {
    document.querySelector(
      ".student-details-model-content"
    ).style.backgroundImage = "url(images/hufflepuff-bg.svg)";
  } else if (student.house === "Ravenclaw") {
    document.querySelector(
      ".student-details-model-content"
    ).style.backgroundImage = "url(images/ravenclaw-bg.svg)";
  } else {
    document.querySelector(
      ".student-details-model-content"
    ).style.backgroundImage = "url(images/slytherin-bg.svg)";
  }

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
