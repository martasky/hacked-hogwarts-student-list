"use strict";

window.addEventListener("DOMContentLoaded", start);
let allStudents = [];
let expelledStudents = [];
let bloodInfo = [];
let isHacked = false;

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
  gender: "boy",
  prefect: false,
  squad: false,
  expelled: false,
  bloodType: "",
  fade: false,
};

function start() {
  registerButtons();

  getJSONfiles();
}
// Set up event listeners
function registerButtons() {
  document
    .querySelectorAll(`[data-action="filter"]`)
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll(`[data-action="sort"]`)
    .forEach((button) => button.addEventListener("click", selectSort));
  document.querySelector("#search").addEventListener("keyup", search);
  document.querySelector("header").addEventListener("click", hackTheSystem);
}

//fetch json from database
function getJSONfiles() {
  let urlStudents = "https://petlatkea.dk/2021/hogwarts/students.json";
  let urlFamilies = "https://petlatkea.dk/2021/hogwarts/families.json";

  function loadJSON() {
    fetch(urlStudents)
      .then((response) => response.json())
      .then((jsonData) => {
        prepareObjects(jsonData);
      });
  }
  fetch(urlFamilies)
    .then((response) => response.json())
    .then((jsonData) => {
      bloodInfo = jsonData;
      loadJSON();
    });
}
function prepareObjects(jsonData) {
  jsonData.forEach((elm) => {
    console.log(elm);

    //create new object
    const student = Object.create(Student);
    console.log("do we have two lists now?=", student);
    console.log(bloodInfo);

    // finding the values
    let trimmedStudent = elm.fullname.trim();
    let trimmedHouse = elm.house.trim();

    let firstName = getFirstName(trimmedStudent);

    let lastName = getLastName(trimmedStudent);
    let middleName = getMiddleName(trimmedStudent);
    let nickName = getNickName(trimmedStudent);
    let img = getImg(firstName, lastName);
    let house = getHouse(trimmedHouse);
    let bloodType = calculateBloodType(bloodInfo, lastName);

    // setting properties in the new object to that values
    student.firstName = firstName;
    student.lastName = lastName;
    student.middleName = middleName;
    student.nickName = nickName;
    student.img = img;
    student.house = house;
    student.gender = elm.gender;
    student.expelled = false;
    student.prefect = false;
    student.squad = false;
    student.bloodType = bloodType;
    student.fade = false;

    // adding new objects to the global array
    allStudents.push(student);
    console.log("this is", student);
    console.table(allStudents);
  });

  buildList();
}

//Calculates correct number of student displayed in the list
function displayNumbers(currentList, searchResult) {
  let expelledNum = expelledStudents.length;
  document.querySelector(".flex-right li:nth-child(2) span").textContent =
    expelledNum;
  let totalNum = allStudents.length;
  document.querySelector(".flex-right li:nth-child(1) span").textContent =
    totalNum;
  let currentNum = currentList.length;
  document.querySelector(".flex-right li:nth-child(3) span").textContent =
    currentNum;
  let gryffindorNum = allStudents.filter(isGryffindor).length;
  document.querySelector(".flex-left li:nth-child(1) span").textContent =
    gryffindorNum;
  let hufflepuffNum = allStudents.filter(isHufflepuff).length;
  document.querySelector(".flex-left li:nth-child(2) span").textContent =
    hufflepuffNum;
  let ravenclawNum = allStudents.filter(isRavenclaw).length;
  document.querySelector(".flex-left li:nth-child(3) span").textContent =
    ravenclawNum;
  let slytherinNum = allStudents.filter(isSlytherin).length;
  document.querySelector(".flex-left li:nth-child(4) span").textContent =
    slytherinNum;
  if (searchResult !== undefined) {
    document.querySelector(".flex-right li:nth-child(3) span").textContent =
      searchResult.length;
  }
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
  displayNumbers(searchResult);
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
  // create filtered list of different filters

  if (settings.filter === "gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filter === "hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filter === "ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filter === "slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filter === "expel") {
    filteredList = expelledStudents;
  } else if (settings.filter === "prefect") {
    filteredList = allStudents.filter((student) => student.prefect);
  } else if (settings.filter === "squad") {
    filteredList = allStudents.filter((student) => student.squad);
  } else if (settings.filter === "pure-blood") {
    filteredList = allStudents.filter(
      (student) => student.bloodType === "pure-blood"
    );
  } else if (settings.filter === "half-blood") {
    filteredList = allStudents.filter(
      (student) => student.bloodType === "half-blood"
    );
  } else if (settings.filter === "muggle") {
    filteredList = allStudents.filter(
      (student) => student.bloodType === "muggle"
    );
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
function isExpelled(student) {
  if (student.expelled === true) {
    return true;
  }
  return false;
}
function all(student) {
  return true;
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortBy);

  function sortBy(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    }
    return 1 * direction;
  }

  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayNumbers(currentList);
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
function calculateBloodType(blood, lastname) {
  console.log("this is lastname", lastname);
  console.log("this is blood", blood);
  let bloodType;
  if (lastname) {
    bloodType = "muggle";
    if (bloodInfo.pure.includes(lastname)) {
      bloodType = "pure-blood";
    }
    if (bloodInfo.half.includes(lastname)) {
      bloodType = "half-blood";
    }
  } else {
    bloodType = undefined;
  }
  return bloodType;
}
function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
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

  // expelling
  clone.querySelector("[data-field=name]").dataset.exstudent = student.fade;
  clone.querySelector("[data-field=middlename]").dataset.exstudent =
    student.fade;
  clone.querySelector("[data-field=nickname]").dataset.exstudent = student.fade;
  clone.querySelector("[data-field=lastname]").dataset.exstudent = student.fade;
  clone.querySelector("[data-field=house]").dataset.exstudent = student.fade;
  clone.querySelector("[data-field=prefect]").dataset.exstudent = student.fade;
  clone.querySelector("[data-field=squad]").dataset.exstudent = student.fade;
  clone.querySelector("[data-field=expel]").dataset.exstudent = student.fade;

  clone
    .querySelector("[data-field=expel]")
    .addEventListener("click", expelStudent);

  function expelStudent() {
    console.log("expel has been clicked");

    //show modal
    document.querySelector("#expel_student").classList.remove("hide");
    document.querySelector(
      ".dialog_content p span"
    ).textContent = `${student.firstName} ${student.lastName}`;

    window.onclick = function (event) {
      if (event.target == document.querySelector("#expel_student")) {
        document.querySelector("#expel_student").classList.add("hide");
      }
    };
    document.querySelector("#no").addEventListener("click", closeDialog);

    document.querySelector("#yes").addEventListener("click", function () {
      removeStudent(student);
    });
  }

  if (student.firstName === "Marta") {
    clone
      .querySelector("[data-field=expel]")
      .removeEventListener("click", expelStudent);
    clone
      .querySelector("[data-field=expel]")
      .addEventListener("click", youCantExpelMe);
  }

  /****** Prefects **********/
  clone.querySelector("[data-field=prefect").dataset.prefect = student.prefect;

  clone
    .querySelector("[data-field=prefect")
    .addEventListener("click", clickPrefect);

  function clickPrefect() {
    console.log("what is it after click", student.prefect);
    console.log(allStudents);
    console.log(student);

    if (student.prefect === true) {
      student.prefect = false;
    } else {
      checkIfCanBePrefect(student);
    }

    buildList();
  }

  /************** Inquisitorial squad *************/
  clone.querySelector("[data-field=squad").dataset.squad = student.squad;
  clone
    .querySelector("[data-field=squad]")
    .addEventListener("click", function () {
      makeMemberofSquad(student);
    });

  if (student.expelled === true) {
    clone
      .querySelector("[data-field=expel]")
      .removeEventListener("click", expelStudent);
    clone.querySelector("[data-field=expel]").style.backgroundImage = "none";
    clone.querySelector("[data-field=expel]").style.cursor = "initial";
    clone
      .querySelector("[data-field=prefect]")
      .removeEventListener("click", clickPrefect);
    clone.querySelector("[data-field=prefect]").style.backgroundImage = "none";
    clone.querySelector("[data-field=prefect]").style.cursor = "initial";
    clone
      .querySelector("[data-field=squad]")
      .removeEventListener("click", makeMemberofSquad);
    clone.querySelector("[data-field=squad]").style.backgroundImage = "none";
    clone.querySelector("[data-field=squad]").style.cursor = "initial";
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
function makeMemberofSquad(student) {
  if (student.squad === true) {
    student.squad = false;
  } else if (student.bloodType === "pure-blood") {
    canBeMember(student);
  } else if (student.house === "Slytherin") {
    canBeMember(student);
  } else {
    wontBeMemberofSquad(student);
  }

  buildList();
}

function wontBeMemberofSquad(student) {
  document.querySelector("#make_member").classList.remove("hide");
  document.querySelector(
    "#make_member p span"
  ).textContent = `${student.firstName} ${student.lastName}`;
  student.squad = false;

  document
    .querySelector("#make_member #ok")
    .addEventListener("click", closeDialog);

  function closeDialog() {
    document.querySelector("#make_member").classList.add("hide");
    document
      .querySelector("#make_member #ok")
      .removeEventListener("click", closeDialog);
  }

  window.onclick = function (event) {
    if (event.target == document.querySelector("#make_member")) {
      document.querySelector("#make_member").classList.add("hide");
    }
  };
}
function canBeMember(student) {
  console.log("can be member", student);
  student.squad = true;
  if (isHacked === true) {
    messUpSquad(student);
  }
}

// This is the modal wit student information
function showDetails(student) {
  console.log("name has been clicked");
  document.querySelector("#student-details-modal").style.display = "block";

  document.querySelector("[data-student-modal=name]").textContent =
    student.firstName;
  document.querySelector(
    "[data-student-modal=blood]"
  ).textContent = `Blood status: ${student.bloodType}`;

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

  if (student.expelled === true) {
    document.querySelector("[data-student-modal=expel]").textContent =
      "Expelled: Yes";
  }

  if (student.prefect === true) {
    document.querySelector("[data-student-modal=prefect] img").src =
      "images/prefect-chosen.svg";
  }
  if (student.squad === true) {
    document.querySelector("[data-student-modal=squad] img").src =
      "images/squad-chosen.svg";
  }
  window.onclick = function (event) {
    if (event.target == document.querySelector("#student-details-modal")) {
      document.querySelector("#student-details-modal").style.display = "none";
      document.querySelector("[data-student-modal=middlename]").style.display =
        "initial";
      document.querySelector("[data-student-modal=nickname]").style.display =
        "initial";
      document.querySelector("[data-student-modal=prefect] img").src =
        "images/prefect-inactive.svg";
      document.querySelector("[data-student-modal=squad] img").src =
        "images/squad-inactive.svg";
      document.querySelector("[data-student-modal=expel]").textContent =
        "Expelled: No";
    }
  };
}

//Expelling
function closeDialog() {
  document.querySelector("#expel_student").classList.add("hide");
}

function removeStudent(chosenStudent) {
  console.log("what is student here", chosenStudent);

  if (chosenStudent.expelled === false) {
    chosenStudent.fade = true;
    console.log("has he been removed??", allStudents);
    chosenStudent.expelled = false;
    console.log("this is expelled students list", expelledStudents);
  }

  buildList();
  closeDialog();
  removeItem(chosenStudent);
}
function removeItem(chosenStudent) {
  const studentIndex = allStudents.indexOf(chosenStudent);
  if (chosenStudent.expelled === false) {
    setTimeout(function () {
      console.log("Timeout");

      allStudents.splice(studentIndex, 1);
      chosenStudent.expelled = true;
      chosenStudent.fade = false;
      expelledStudents.push(chosenStudent);
      buildList();
    }, 2000);
  }
}

//Prefects
function checkIfCanBePrefect(chosenStudent) {
  const prefects = allStudents.filter((student) => student.prefect);

  let prefectsFromTheSameHouse = prefects.filter((prefect) => {
    return prefect.house === chosenStudent.house;
  });
  console.log("the same house", prefectsFromTheSameHouse);

  let theSameGender = prefectsFromTheSameHouse.filter(
    (prefectFromTheSameHouse) =>
      prefectFromTheSameHouse.gender === chosenStudent.gender
  );

  console.log("this is te same gender", theSameGender);

  if (theSameGender.length >= 1) {
    removeOther(theSameGender);
  } else {
    makePrefect(chosenStudent);
    console.log("the same house", prefectsFromTheSameHouse);
    console.log("this is te same gender", theSameGender);
  }

  console.log(prefects);

  function removeOther(student) {
    document.querySelector("#remove_other").classList.remove("hide");
    if (chosenStudent.gender === "girl") {
      document.querySelector("#remove_other p span").textContent = "female";
    } else {
      document.querySelector("#remove_other p span").textContent = "male";
    }

    document.querySelector(
      "#remove_other p #pr_name"
    ).textContent = `${theSameGender[0].firstName} ${theSameGender[0].lastName}`;
    document
      .querySelector("#remove_other #no")
      .addEventListener("click", closePrefectDialog);
    document
      .querySelector("#remove_other #yes")
      .addEventListener("click", clickRemoveOther);
    window.onclick = function (event) {
      if (event.target == document.querySelector("#remove_other")) {
        document.querySelector("#remove_other").classList.add("hide");
      }
    };

    function closePrefectDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document
        .querySelector("#remove_other #no")
        .removeEventListener("click", closePrefectDialog);
      document
        .querySelector("#remove_other #yes")
        .removeEventListener("click", clickRemoveOther);
    }

    function clickRemoveOther() {
      removePrefect(theSameGender[0]);
      makePrefect(chosenStudent);
      buildList();
      closePrefectDialog();
    }
  }

  function removePrefect(student) {
    student.prefect = false;
  }
  function makePrefect(student) {
    console.log("the same house", prefectsFromTheSameHouse);
    console.log("this is te same gender", theSameGender);
    student.prefect = true;
  }
}

//Hacking
function hackTheSystem() {
  console.log("hacking started");
  isHacked = true;
  document.querySelector("header").removeEventListener("click", hackTheSystem);
  addMyName();
  randomizeBloodStatus();
  buildList();
}

function addMyName() {
  const me = Object.create(Student);
  me.firstName = "Marta";
  me.lastName = "Skrzypczak";
  me.middleName = "";
  me.nickName = "";
  me.img = "images/my-photo.png";
  me.house = "Slytherin";
  me.gender = "girl";
  me.expelled = false;
  me.prefect = false;
  me.squad = false;
  me.bloodType = "pure-blood";
  allStudents.push(me);
  console.log("name has been added", allStudents);
  buildList();
}

function youCantExpelMe() {
  console.log("buahahhhaha");
  document.querySelector(".dontTryToRemoveMe").style.visibility = "visible";
  let laughSound = document.querySelector("#laughter");
  laughSound.play();

  laughSound.addEventListener("ended", () => {
    document.querySelector(".dontTryToRemoveMe").style.visibility = "hidden";
  });
}

function randomizeBloodStatus() {
  console.log("randomizing blood has startef");

  allStudents.forEach((student) => {
    console.log("old blood stuatus", student.bloodType);
    if (student.bloodType === "pure-blood") {
      student.bloodType = randomBlood();
      if (student.bloodType === 0) {
        student.bloodType = "pure-blood";
      } else if (student.bloodType === 1) {
        student.bloodType = "half-blood";
      } else {
        student.bloodType = "muggle";
      }
    } else {
      student.bloodType = "pure-blood";
    }

    console.log("new blood stuatus", student.bloodType);
  });

  buildList();
}

function randomBlood() {
  return Math.floor(Math.random() * 3);
}

function messUpSquad(student) {
  console.log("MESS UP SQUAD IS ON");

  setTimeout(function () {
    console.log("who is stuent now", student);
    document.querySelector(".hackedSquad").style.visibility = "visible";
    document.querySelector(".hackedSquad p span").textContent =
      student.firstName;
    let howl = document.querySelector("#howl");
    howl.play();
    makeMemberofSquad(student);
  }, 5000);

  document.querySelector("#howl").addEventListener("ended", showHackedInfo);
  function showHackedInfo() {
    document.querySelector(".hackedSquad").style.visibility = "hidden";
  }
}
