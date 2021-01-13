let buttonRun = document.getElementById("start");
let buttonStop = document.getElementById("stop");
let buttonRestart = document.getElementById("res");
let buttonDelete = document.getElementById("delete");
let timerShow = document.getElementById("timer");
let saveInfoBtn = document.getElementById("saveInfo");
let scoreModalInput = document.getElementById("finalScore");
let points = document.getElementById("points");
let buttonsWindow = document.querySelector(".content-first");
let scoreTableResults = document.querySelector(".scoreTable");
let cubesWindow = document.querySelector(".cubesWindow");

let timer, startButton, timeMinut = 1;

buttonDelete.addEventListener('click', function () {
  localStorage.clear();
  location.reload();
});

startButton = buttonRun.addEventListener('click', function () {
  startTimer();
  buttonRun.setAttribute("disabled", "");
});

buttonStop.addEventListener('click', function (e) {
  buttonRun.removeAttribute("disabled");
  clearTimer();
  timerShow.innerHTML = timerShow.innerHTML;
  timeMinut = parseInt(timerShow.innerHTML.split(':')[1]);
});

buttonRestart.addEventListener('click', function () {
  buttonRun.setAttribute("disabled", "");
  timeMinut = 60;
  points.innerHTML = 0;
  clearTimer();
  timerShow.innerHTML = '01:00';
  startTimer();
});

const startTimer = () => {
  setTimeout(() => {
    generateCubes();
  }, 1000);
  timer = setInterval(function () {
    let strTimer = '';

    --timeMinut;

    if (timeMinut > 60)
      seconds = 60 % 60;
    else
      seconds = timeMinut % 60;

    minutes = timeMinut / 60 % 60;

    if (timeMinut <= 0) {
      buttonRun.removeAttribute("disabled");
      clearTimer();
      timerShow.innerHTML = '01:00';
      scoreModalInput.innerHTML = points.innerHTML;
      $('#staticBackdrop').modal();
    } else {
      if (seconds < 10)
        strTimer = `0${Math.trunc(minutes)}:0${seconds}`;
      else
        strTimer = `0${Math.trunc(minutes)}:${seconds}`;

      timerShow.innerHTML = strTimer;
    }
  }, 1000)
}

const clearTimer = () => {
  while (cubesWindow.firstChild) {
    cubesWindow.removeChild(cubesWindow.firstChild);
  }
  clearInterval(timer);
};

saveInfoBtn.addEventListener('click', function () {
  let name = "";

  if (!document.getElementById("name").value)
    name = `Player_${(~~(Math.random() * 1e8)).toString(16)}`;
  else
    name = document.getElementById("name").value;

  let score = parseInt(scoreModalInput.innerHTML);

  localStorage.setItem(name, score);

  document.getElementById("name").value = '';
  points.innerHTML = 0;

  buttonDelete.removeAttribute("disabled");

  $('#staticBackdrop').modal('hide');

  showResults();
});

const showResults = () => {
  scoreTableResults.innerHTML = '';
  for (let index = 0; index < localStorage.length; index++) {
    let h5 = document.createElement("h5");
    h5.innerHTML = `${index + 1}) Player "${localStorage.key(index)}" scored ${localStorage.getItem(localStorage.key(index))} ${parseInt(localStorage.getItem(localStorage.key(index))[localStorage.getItem(localStorage.key(index)).length - 1]) === 1 ? 'point' : 'points'}.`;
    scoreTableResults.append(h5);
  }
}

if (localStorage.length) {
  buttonDelete.removeAttribute("disabled");
  showResults();
}
else
  buttonDelete.setAttribute("disabled", "");

const createCube = (cubeShape, color) => {
  let cube = document.createElement("div");
  let randomPositionX = Math.random() * 100;
  let randomPositionY = Math.random() * 100;
  let shiftX = 0;
  let shiftY = 0;

  if (randomPositionX > 94 && randomPositionX < 101)
    shiftX = cubeShape + 1;

  if (randomPositionY > 94 && randomPositionY < 101)
    shiftY = cubeShape + 1;

  cube.id = "cube_" + color + "_" + cubeShape + (~~(Math.random() * 1e8)).toString(16);
  cube.classList.add("clickable");
  cube.style.position = 'absolute';
  cube.style.width = cubeShape + "px";
  cube.style.height = cubeShape + "px";
  cube.style.backgroundColor = color;
  cube.style.top = randomPositionY + "%";
  cube.style.left = randomPositionX + "%";
  cube.style.transform = `translate(-${shiftX}px, -${shiftY}px)`;
  cubesWindow.append(cube);

  return cube;
}

const generateCubes = () => {
  for (let index = 0; index < randomDiap(1, 3); index++) {
    let cubeShape = cubeShapes[Math.floor(Math.random() * cubeShapes.length)];
    let cubeColor = cubeColors[Math.floor(Math.random() * cubeColors.length)];

    let c = createCube(cubeShape.shape, cubeColor.color);
    document.getElementById(c.id).addEventListener('click', (e) => {

      if (c.style.backgroundColor === "rgb(255, 0, 0)") {
        --timeMinut;
      }

      if (c.style.backgroundColor === "rgb(0, 255, 0)") {
        timeMinut += 2;
      }

      cubesWindow.removeChild(document.getElementById(c.id));
      countPoints(cubeShape.shape, cubeShape.cost, cubeColor.cost, cubeColor.color);

      generateCubes();
    });
  }
}

const randomDiap = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

const countPoints = (cubeShape, cubeCost, colorCost, cubeColor) => {
  if (cubeColor === "#FF0000")
    points.innerHTML = parseInt(points.innerHTML) - cubeCost * colorCost * cubeShape;
  else
    points.innerHTML = parseInt(points.innerHTML) + cubeCost * colorCost * cubeShape;
}