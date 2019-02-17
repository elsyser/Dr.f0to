let video;
let poseNet;
let isCallibrated = false;
var physicalChart = null;
var mentalChart = null;


const poseNet_options = {
  imageScaleFactor: 0.2,
  outputStride: 16,
  flipHorizontal: false,
  minConfidence: 0.5,
  maxPoseDetections: 1,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: 'single',
  multiplier: 0.75,
};
const video_options = {
  video: {
    mandatory: {
      minWidth: 640,
      minHeight: 480
    },
    optional: [{
      maxFrameRate: 20,
    }]
  },
  audio: false
};

var avarages = {
  eed: 0,
  esd: 0,
  shouldersAngle:0,
  headAngle: 0,
  counter: 0
};


function preload(){
  var canvas = createCanvas(windowWidth, windowHeight).hidden = false;
  document.getElementById("defaultCanvas0").hidden = true;


  video = createCapture(video_options);
  video.size(640, 480);
  // document.getElementById("callibratePose").addEventListener('click', handleCallibration, false);

  
  video.hide();
  
  var cnvPhyical = document.getElementById("physicalChart").getContext("2d");
  physicalChart  = new DataHandler(cnvPhyical , {
    diagramName: "ESD (Eye-Shoulder Distance)",
    xName: "Time",
    yName: "Current Eye Shoulder Distance"
  } , 'line');

  var cnvMental = document.getElementById("mentalChart").getContext("2d");
  mentalChart = new DataHandler(cnvMental , {
    diagramName: "Mental wellbeing",
    xName : "",
    yName : "",
  } , "doughnut");


  poseNet = new PoseChecker(video, poseNet_options);

  poseNet.begin();

  //Setup the dataset fot the Line physicalChart
  // 
  physicalChart.addDataset('spine');
  physicalChart.addDataset('head');
  physicalChart.addDataset('shoulders');
  physicalChart.addDataset('distance');
  //

  // mentalChart.addDataset('');
  // mentalChart.addDataset('sad');
}

function postData(url = ``, data = {}) {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
}

function setup() {
  
  

  setInterval(()=>{

    //TODO remove hasFocus
    if(isCallibrated && document.hasFocus()){
      var currDate = new Date().toLocaleTimeString();
      physicalChart.pushData(currDate , poseNet.getCurrentESD() , "spine");
      physicalChart.pushData(null , poseNet.getCurrentEED(), "distance");
      physicalChart.pushData(null , poseNet.getHeadAngle(), "head");
      physicalChart.pushData(null , poseNet.getShoulderAngle(), "shoulders");
      var imgToSend = video;
      // imgToSend.size(48,48);
      imgToSend.loadPixels();
      var baseString = imgToSend.canvas.toDataURL();
      var emotions = null;
      postData('http://172.16.191.205:5000/' , {img: baseString})
      .then(data => console.log(data)) // JSON-string from `response.json()` call
      .catch(error => console.error(error));
    }
  } , 2000);

// mentalChart.updateData(20 , "sad");
mentalChart.updateData([10,20],["happy" , "sad"]);
  
}

// var i =0;
function draw() {
  if (isCallibrated) {
    avarages.counter++;
    var currESD = poseNet.getCurrentESD();
    avarages.esd += currESD;
    avarages.esd /= avarages.counter;
    var currEED = poseNet.getCurrentEED();
    avarages.eed += currEED;
    avarages.eed /= avarages.counter;
    avarages.shouldersAngle += (poseNet.getShoulderAngle() - 180);
    avarages.shouldersAngle /= avarages.counter;
    avarages.headAngle += poseNet.getHeadAngle();
    avarages.headAngle /= avarages.counter;

    if (abs(currESD - poseNet.normalESD) > poseNet.hunchedThreshold && poseNet.isPersonAvailable()) {
      // console.log("Izpravi se be tupanar, shte ti eba maikata, glupak");
    }
    if (abs(abs(poseNet.getShoulderAngle()) - 180) > poseNet.shoulderAngleThreshold && poseNet.getShoulderAngle() != null) {
      // console.log("RAMENETE WE");
    }
    if (abs(poseNet.getHeadAngle()) > poseNet.headAngleThreshold) {
      // console.log("Izprai si glawata wee");
    }
    if ((currEED - poseNet.normalEED) > poseNet.monitorDistThreshold && poseNet.isPersonAvailable()) {
      // console.log("You're too close to the monitor");
    }
  }


  // poseNet.getEyes();
  poseNet.update();

}

function handleCallibration() {
  if (poseNet.isLoaded) {
    var shoulders = poseNet.getShoulders();
    var eyes = poseNet.getEyes();
    poseNet.setNormalESD(eyes, shoulders);
    isCallibrated = true;
    poseNet.setNormalEED(eyes);
    console.log("Callibrated dist:", poseNet.normalESD);

  }
}

// function windowResized(){
//   resizeCanvas(window.width , window.height);
// }

