// récupération de block par le DOM
const numberMusic = document.getElementById("numberMusic");
const resultatMessage = document.getElementById("resultatMessage");
const resultat = document.getElementById("resultat");
const lecteur = document.getElementById("lecteur");
const play = document.getElementById("play");
const pause = document.getElementById("pause");
const playerMusic = document.getElementById("playerMusic");
const musicBlind = document.getElementById("musicBlind");
const time = document.getElementById("time");
const score = document.getElementById("score");
const nextButton = document.getElementById("nextButton");
const audioButton = document.getElementById("audioButton");

// les données du localStorage
const listMusic = atob(localStorage.getItem("musics"));
const arrayList = JSON.parse(listMusic);
const lengthMusic = arrayList.length;
const typeLocal = localStorage.getItem("type");
const usernameLocal = localStorage.getItem("pseudo");

// récupération des données par rapport à l'index
let index = arrayList.findIndex((i) => i);
let nameMusic;
let imageMusic;
let urlMusicList;

function indexOfMusic(i) {
  nameMusic = arrayList[i].name;
  imageMusic = arrayList[i].imageUrl;
  urlMusicList = arrayList[i].musicUrl;
  numberMusic.innerHTML = `${i + 1}/${lengthMusic}`;
  // implémenter dans le DOM l'url de la musique
  musicBlind.setAttribute("src", urlMusicList);
}
indexOfMusic(index);

// cette fonction permet d'afficher le minuteur et de le faire fonctionner
let timeLeft;
let timeId;
function timeSecond() {
  timeLeft = 59;
  timeId = setInterval(() => {
    if (timeLeft == 0) {
      musicBlind.pause();
      alertMessage.style.display = "none";
      clearInterval(timeId);
      index += 1;
      // permet de remettre à 0 le lecteur audio
      musicBlind.currentTime = 0;
      lecteur.style.display = "none";
      resultat.style.display = "block";
      resultatMessage.innerHTML = `
        <h2>La réponse était ${nameMusic.toUpperCase()}</h2>
        <img class="imageMusic" src="${imageMusic}" alt="${nameMusic}"/>
        <p>Dommage, tu feras mieux à la prochaine !</p>
      `;
      if (arrayList.length === index) {
        score.style.display = "block";
        nextButton.style.display = "none";
      }
    } else {
      // permet d'afficher correctement le minuteur
      if (timeLeft < 10) {
        time.innerHTML = "00:0" + timeLeft;
      } else {
        time.innerHTML = "00:" + timeLeft;
      }
      timeLeft--;
    }
  }, 1000);
}
// permet de lancer la lecture de la musique et d'activer le minuteur
play.addEventListener("click", () => {
  musicBlind
    .play()
    .then(() => {
      timeSecond();
      play.style.display = "none";
      time.style.display = "block";
      playerMusic.style.border = "0.4rem solid #4fd1c5";
    })
    .catch((err) => console.log(err));
});

// récupération de la réponse de l'utilisateur et vérification de sa véracité
const regexResponse =
  /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ' -]{2,50}$/;
const responseButton = document.getElementById("responseButton");
const alertMessage = document.getElementById("alertMessage");
const response = document.getElementById("response");
responseButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const valueResponse = response.value
    .toLowerCase()
    .trim()
    .replace(/[-]/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f,:]/g, "");
  if (
    !regexResponse.test(valueResponse) ||
    valueResponse == "" ||
    valueResponse != nameMusic
  ) {
    alertMessage.style.display = "block";
    response.value = "";
  } else if (valueResponse === nameMusic) {
    lecteur.style.display = "none";
    musicBlind.pause();
    clearInterval(timeId);
    let scoreAddLocalStorage = JSON.parse(localStorage.getItem("score"));
    if (scoreAddLocalStorage) {
      const numberScore = Number(scoreAddLocalStorage);
      const resultatScore = numberScore + 1;
      localStorage.setItem("score", JSON.stringify(resultatScore));
    } else {
      localStorage.setItem("score", "1");
    }
    musicBlind.currentTime = 0;
    resultat.style.display = "block";
    resultatMessage.innerHTML = `
        <h2>Bien joué!</h2>
        <img class="imageMusic" src="${imageMusic}" alt="${nameMusic}"/>
        <p>La réponse était bien ${nameMusic.toUpperCase()}</p>
      `;
    index += 1;
    if (arrayList.length === index) {
      score.style.display = "block";
      nextButton.style.display = "none";
    }
  }
  response.addEventListener("click", () => {
    alertMessage.style.display = "none";
  });
});

nextButton.addEventListener("click", () => {
  audioButton.play();
  lecteur.style.display = "block";
  resultat.style.display = "none";
  play.style.display = "block";
  time.style.display = "none";
  playerMusic.style.border = "0.2rem solid #f7ff3c";
  time.innerHTML = `01:00`;
  response.value = "";
  indexOfMusic(index);
});

function recordScore(username, type, number, score) {
  const data = JSON.stringify({ username, type, number, score });
  fetch("http://localhost:3000/api/scores/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: data,
  })
    .then(async (responseUserScore) => {
      await responseUserScore.json();
      const scoreLocal = Number(localStorage.getItem("score"));
      console.log(scoreLocal <= lengthMusic);
      console.log(lengthMusic);
      if (responseUserScore.status === 201 && scoreLocal <= lengthMusic) {
        window.addEventListener("beforeunload", (e) => {
          localStorage.removeItem("score");
          return e.preventDefault;
        });
        window.location = "score.html";
      } else {
        alert("Enregistrement du score impossible");
      }
    })
    .catch(() => console.log("error"));
}

score.addEventListener("click", () => {
  audioButton.play();
  const scoreLocal = Number(localStorage.getItem("score"));
  localStorage.setItem("scores", scoreLocal);
  recordScore(usernameLocal, typeLocal, lengthMusic, scoreLocal);
});

const pass = document.getElementById("pass");
pass.addEventListener("click", () => {
  musicBlind.pause();
  alertMessage.style.display = "none";
  clearInterval(timeId);
  index += 1;
  // permet de remettre à 0 le lecteur audio
  musicBlind.currentTime = 0;
  lecteur.style.display = "none";
  resultat.style.display = "block";
  resultatMessage.innerHTML = `
    <h2>La réponse était ${nameMusic.toUpperCase()}</h2>
    <img class="imageMusic" src="${imageMusic}" alt="${nameMusic}"/>
    <p>Dommage, tu feras mieux à la prochaine !</p>
  `;
  if (arrayList.length === index) {
    score.style.display = "block";
    nextButton.style.display = "none";
  }
});

localStorage.removeItem("score");
localStorage.removeItem("scores");
