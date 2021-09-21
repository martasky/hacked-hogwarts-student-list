"use strict";

window.addEventListener("DOMContentLoaded", start);
let allStudents = [];
let expelledStudents = [];
let bloodInfo = [];

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
};

function start() {
  registerButtons();

  getJSONfiles();
}

function registerButtons() {
  document
    .querySelectorAll(`[data-action="filter"]`)
    .forEach((button) => button.addEventListener("click", selectFilter));
  document
    .querySelectorAll(`[data-action="sort"]`)
    .forEach((button) => button.addEventListener("click", selectSort));
  document.querySelector("#search").addEventListener("keyup", search);
}

//lets fetch json from database

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
    student.bloodType = bloodType;
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
  } else if (settings.filter === "expel") {
    filteredList = expelledStudents;
  } else if (settings.filter === "prefect") {
    filteredList = allStudents.filter((student) => student.prefect);
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
    /* console.log("this is studentA", studentA); */
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
  /*  console.log("this is student in the display function", student); */
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

  // expelling
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
  if (student.expelled === true) {
    clone
      .querySelector("[data-field=expel]")
      .removeEventListener("click", expelStudent);
    clone
      .querySelector("[data-field=prefect]")
      .removeEventListener("click", clickPrefect);
    clone
      .querySelector("[data-field=expel]")
      .removeEventListener("click", expelStudent);
  }

  /****** Prefects **********/
  clone.querySelector("[data-field=prefect").dataset.prefect = student.prefect;

  clone
    .querySelector("[data-field=prefect")
    .addEventListener("click", clickPrefect);

  if (student.expelled === true) {
    clone
      .querySelector("[data-field=prefect]")
      .removeEventListener("click", clickPrefect);
  }
  function clickPrefect() {
    console.log("what is it after click", student.prefect);
    console.log(allStudents);
    console.log(student);

    if (student.prefect === true) {
      student.prefect = false;
    } else {
      checkIfCanBePrefect(student);
    }
    /*   if (student.prefect) {
      document.querySelector("#remove_prefect").classList.remove("hide");
      document
        .querySelector("#remove_prefect #yes")
        .addEventListener("click", function () {
          student.prefect = false;
          document.querySelector("#remove_prefect").classList.add("hide");
        });

      student.prefect = false;
    } else {
      checkIfCanBePrefect(student);
      /* student.prefect = true; */
    buildList();
  }
  /*   if (student.prefect === true) {
    clone.querySelector("[data-field=prefect]").style.backgroundImage =
      "url(images/prefect-chosen.svg)";
  } else {
    clone.querySelector("[data-field=prefect]").style.backgroundImage =
      "url(images/prefect-inactive.svg)";
  } */
  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
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
  window.onclick = function (event) {
    if (event.target == document.querySelector("#student-details-modal")) {
      document.querySelector("#student-details-modal").style.display = "none";
      document.querySelector("[data-student-modal=middlename]").style.display =
        "initial";
      document.querySelector("[data-student-modal=nickname]").style.display =
        "initial";
      document.querySelector("[data-student-modal=prefect] img").src =
        "images/prefect-inactive.svg";
    }
  };
}
function closeDialog() {
  document.querySelector("#expel_student").classList.add("hide");
}
function removeStudent(chosenStudent) {
  console.log("what is student here", chosenStudent);

  if (chosenStudent.expelled === false) {
    chosenStudent.expelled = true;
    const studentIndex = allStudents.indexOf(chosenStudent);
    console.log(studentIndex);
    allStudents.splice(studentIndex, 1);

    console.log("has he been removed??", allStudents);
    expelledStudents.push(chosenStudent);

    console.log("this is expelled students list", expelledStudents);
  }
  buildList();
  closeDialog();
}

function removeaPrefect(student) {
  document.querySelector("#remove_prefect").classList.remove("hide");
  student.prefect = false;
}
function makeaPrefect(student) {
  const prefects = allStudents.filter((student) => student.prefect);
  const prefectLen = prefects.length;
  console.log("this are prefects", prefects);
  /* function isPrefect(student) {
    if (student.prefect === true) {
      return true;
    } else {
      return false;
    }
  } */

  let prefectsFromTheSameHouse = prefects.filter((prefect) => {
    return prefect.house === student.house;
  });
  /*  let prefectsFromTheSameHouse;

  if (chosen === "gryffindor") {
    prefectsFromTheSameHouse = prefects.filter(isPrefectFromGryffindor);
  } else if (chosen === "hufflepuff") {
    prefectsFromTheSameHouse = prefects.filter(isPrefectFromHufflepuff);
  } else if (chosen === "ravenclaw") {
    prefectsFromTheSameHouse = prefects.filter(isPrefectFromRavenclaw);
  } else {
    prefectsFromTheSameHouse = prefects.filter(isPrefectFromSlytherin);
  }

  function isPrefectFromRavenclaw(prefect) {
    if (prefect.house === "Ravenclaw") {
      prefectsFromTheSameHouse = console.log("prefevt house", prefect.house);
      return true;
    } else {
      console.log("prefevt house", prefect.house);
      return false;
    }
  }
  function isPrefectFromGryffindor(prefect) {
    if (prefect.house === "Gryffindor") {
      prefectsFromTheSameHouse = console.log("prefevt house", prefect.house);
      return true;
    } else {
      console.log("prefevt house", prefect.house);
      return false;
    }
  }
  function isPrefectFromHufflepuff(prefect) {
    if (prefect.house === "Hufflepuff") {
      prefectsFromTheSameHouse = console.log("prefevt house", prefect.house);
      return true;
    } else {
      console.log("prefevt house", prefect.house);
      return false;
    }
  }
  function isPrefectFromSlytherin(prefect) {
    if (prefect.house === "Slytherin") {
      prefectsFromTheSameHouse = console.log("prefevt house", prefect.house);
      return true;
    } else {
      console.log("prefevt house", prefect.house);
      return false;
    }
  }
*/

  if (prefectsFromTheSameHouse.length >= 1) {
    prefectsFromTheSameHouse.forEach((prefectFromTheSameHouse) => {
      if (prefectFromTheSameHouse.gender === student.gender) {
        document.querySelector("#remove_other").classList.remove("hide");
      } else {
        document.querySelector("#make_prefect").classList.remove("hide");
      }
    });
  }
  if (prefectLen >= 0) {
    console.log("wtf is this", student.prefect);
    document.querySelector("#make_prefect").classList.remove("hide");

    document.querySelector(
      "#make_prefect p span"
    ).textContent = `${student.firstName} ${student.lastName}`;

    document
      .querySelector("#make_prefect #no")
      .addEventListener("click", function () {
        /*  const clone = document
          .querySelector("template#student")
          .content.cloneNode(true);
        clone.querySelector("[data-field=prefect]").style.backgroundImage =
          "url(images/prefect-inactive.svg)"; */
        student.prefect = false;
        console.log("this is studnt sratus", student.prefect);
        console.log(student);
        document.querySelector("#make_prefect").classList.add("hide");
      });

    document
      .querySelector("#make_prefect #yes")
      .addEventListener("click", function () {
        /*  const clone = document
          .querySelector("template#student")
          .content.cloneNode(true);
        clone.querySelector("[data-field=prefect]").style.backgroundImage =
          "url(images/prefect-chosen.svg)"; */
        student.prefect = true;
        console.log("this is studnt sratus", student.prefect);
        prefects.push(student);
        console.log(prefects);
        console.log(student);
        /* clone.querySelector("[data-field=prefect]").style.backgroundImage =
          "url(images/prefect-inactive.svg)"; */
        document.querySelector("#make_prefect").classList.add("hide");
      });

    window.onclick = function (event) {
      if (event.target == document.querySelector("#make_prefect")) {
        document.querySelector("#make_prefect").classList.add("hide");
      }
    };
    /*  student.prefect = true; */
  }
}

function checkIfCanBePrefect(chosenStudent) {
  const prefects = allStudents.filter((student) => student.prefect);
  const numberOfPrefects = prefects.length;

  let prefectsFromTheSameHouse = prefects.filter((prefect) => {
    return prefect.house === chosenStudent.house;
  });
  console.log("the same house", prefectsFromTheSameHouse);

  let theSameGender = prefectsFromTheSameHouse.filter(
    (prefectFromTheSameHouse) =>
      prefectFromTheSameHouse.gender === chosenStudent.gender
  );

  console.log("this is te same gender", theSameGender);

  /*  const notPrefect = prefects
    .filter((student) => student.gender === chosenStudent.gender)
    .shift(); */

  /*   if (prefectsFromTheSameHouse.length >= 2) {
    console.log(
      "this is te prefectsFromTheSameHouse",
      prefectsFromTheSameHouse
    );

    removeAorB(prefectsFromTheSameHouse[0], prefectsFromTheSameHouse[1]); */
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

  /* function removeAorB(prefectA, prefectB) {
    if (
      prefectA.gender === chosenStudent.gender ||
      prefectB.gender === chosenStudent.gender
    ) {
      document.querySelector("#remove_other").classList.remove("hide");
      removeOther();
    } else {
      document.querySelector("#remove_aorb").classList.remove("hide");
      document.querySelector("#remove_aorb [data-field=prefectA").textContent =
        prefectA.firstName;
      document.querySelector("#remove_aorb [data-field=prefectB").textContent =
        prefectB.firstName;
      document
        .querySelector("#remove_aorb #removea")
        .addEventListener("click", clickRemoveA);
      document
        .querySelector("#remove_aorb #removeb")
        .addEventListener("click", clickRemoveB);
    }

    function closePrefectDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");

      document
        .querySelector("#remove_aorb #removea")
        .removeEventListener("click", clickRemoveA);
      document
        .querySelector("#remove_aorb #removeb")
        .removeEventListener("click", clickRemoveB);
    }
    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(chosenStudent);
      buildList();
      closePrefectDialog();
    }
    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(chosenStudent);
      buildList();
      closePrefectDialog();
    }
  } */
  function removePrefect(student) {
    student.prefect = false;
  }
  function makePrefect(student) {
    console.log("the same house", prefectsFromTheSameHouse);
    console.log("this is te same gender", theSameGender);
    student.prefect = true;
    /* document.querySelector("#make_prefect").classList.remove("hide");
    document.querySelector(
      "#make_prefect p span"
    ).textContent = `${student.firstName} ${student.lastName}`;

    document
      .querySelector("#make_prefect #no")
      .addEventListener("click", function () {
        student.prefect = false;
        console.log("this is studnt sratus", student.prefect);
        document.querySelector("#make_prefect").classList.add("hide");
      });

    document
      .querySelector("#make_prefect #yes")
      .addEventListener("click", function () {
        student.prefect = true;
        console.log("this is studnt sratus", student.prefect);
        document.querySelector("#make_prefect").classList.add("hide");
      });

    window.onclick = function (event) {
      if (event.target == document.querySelector("#make_prefect")) {
        document.querySelector("#make_prefect").classList.add("hide");
      }
    };
    console.log("the same house", prefectsFromTheSameHouse);
    console.log("this is te same gender", theSameGender);
  }
  console.log("the same house", prefectsFromTheSameHouse);
  console.log("this is te same gender", theSameGender); */
  }
}
