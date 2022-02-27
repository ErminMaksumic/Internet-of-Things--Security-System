const firebaseConfig = {
  apiKey: "AIzaSyAKw511sP4p1ULpZHN9wPLhKl74WC33ajQ",

  authDomain: "sigurnosnisistemiot.firebaseapp.com",

  databaseURL:
    "https://sigurnosnisistemiot-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "sigurnosnisistemiot",

  storageBucket: "sigurnosnisistemiot.appspot.com",

  messagingSenderId: "34877330573",

  appId: "1:34877330573:web:16276ddf4d3d9e4670bec4",

  measurementId: "G-SZ2Y095KEK",
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//firebase data
var PIRSensor = firebase.database().ref("Soba").child("PIRSensor");
var MQ2Sensor = firebase.database().ref("Soba").child("MQ2Sensor");
var FlameSensor = firebase.database().ref("Soba").child("FlameSensor");
var StatusAll = firebase.database().ref("Kontroleri").child("StatusAll");

//variables
var temp = false;
var prosjek = 0;
var PIRAktiviranPuta = 0;
var brojac = 0;

document.querySelector("#systemOn").addEventListener("click", () => {
  firebase.database().ref("Kontroleri/StatusAll").set(true);
  console.log("Turning on");
});

document.querySelector("#systemOff").addEventListener("click", () => {
  firebase.database().ref("Kontroleri/StatusAll").set(false);
  console.log("Turning off");
});

document.querySelector("#flameStop").addEventListener("click", () => {
  firebase.database().ref("Soba/FlameSensor").set(0);
});

document.querySelector("#flameStart").addEventListener("click", () => {
  firebase.database().ref("Soba/FlameSensor").set(1);
});

StatusAll.on("value", (data) => {
  temp = data.val();
  if (temp == false) {
    document.querySelector("#pirStatus").src = "/Images/systemOff.jpg";
    document.querySelector("#flameStatus").src = "/Images/systemOff.jpg";
    document.querySelector("#gasValue").style.width = "0%";
    document.querySelector("#MQ2Status").src = "/Images/systemOff.jpg";
    document.querySelector("#ispisProsjeka").textContent = 0;
    document.querySelector("#ispisVrijednosti").textContent = 0;
    document.querySelector("#gasAverage").style.width = "0%";
    document.querySelector("#PIRAktiviran").style.width = "0%";
    document.querySelector("#ispisPIRVrijednosti").textContent = "";
    PIRAktiviranPuta = 0;
    brojac = 0;
    prosjek = 0;
  } else {
    MQ2Sensor.on("value", (data) => {
      if (data.val() <= 45 && temp == true) {
        prosjek += data.val();
        brojac++;
        document.querySelector("#gasValue").style.width = "33%";
        document.querySelector("#MQ2Status").src =
          "/Images/MQ2-Gas-Sensor-Working.gif";
        document.querySelector("#ispisProsjeka").textContent = parseInt(
          prosjek / brojac
        );
        document.querySelector("#ispisVrijednosti").textContent = data.val();
        document.querySelector("#gasAverage").style.width =
          prosjek / brojac + "%";
      } else if (data.val() > 45 && data.val() <= 80 && temp == true) {
        prosjek += data.val();
        brojac++;
        document.querySelector("#gasValue").style.width = "66%";
        document.querySelector("#MQ2Status").src =
          "/Images/MQ2-Gas-Sensor-Working.gif";
        document.querySelector("#ispisProsjeka").textContent = parseInt(
          prosjek / brojac
        );
        document.querySelector("#ispisVrijednosti").textContent = data.val();
        document.querySelector("#gasAverage").style.width =
          prosjek / brojac + "%";
      } else if (temp == true) {
        prosjek += data.val();
        brojac++;
        document.querySelector("#gasValue").style.width = "100%";
        document.querySelector("#MQ2Status").src = "/Images/alarm.gif";
        document.querySelector("#ispisProsjeka").textContent = parseInt(
          prosjek / brojac
        );
        document.querySelector("#ispisVrijednosti").textContent = data.val();
        document.querySelector("#gasAverage").style.width =
          prosjek / brojac + "%";
      }
    });

    PIRSensor.on("value", (data) => {
      if (data.val() == 0 && temp == true) {
        document.querySelector("#pirStatus").src = "/Images/PIRWorking.gif";
        document.querySelector("#ispisPIRVrijednosti").textContent =
          PIRAktiviranPuta + " put(a)";
      } else if (temp == true) {
        document.querySelector("#pirStatus").src = "/Images/alarm.gif";
        PIRAktiviranPuta++;
        document.querySelector("#PIRAktiviran").style.width =
          PIRAktiviranPuta + "%";
        document.querySelector("#ispisPIRVrijednosti").textContent =
          PIRAktiviranPuta + " put(a)";
      }
    });

    FlameSensor.on("value", (data) => {
      if (data.val() == 1 && temp == true) {
        document.querySelector("#flameStatus").src = "/Images/alarm.gif";
      } else if (temp == true) {
        document.querySelector("#flameStatus").src = "/Images/flame.gif";
      }
    });
  }
});
