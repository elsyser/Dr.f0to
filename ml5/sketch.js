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


function setup() {
  
  

  setInterval(()=>{
    if(isCallibrated && document.hasFocus()){
    // if(isCallibrated){
      var currDate = new Date().toLocaleTimeString();
      var esdCorrected=-(constrain(poseNet.normalESD/poseNet.getCurrentESD(),0,1)-1);
      physicalChart.pushData(currDate , esdCorrected , "spine");

      var eedCorrected=-(constrain(poseNet.normalEED/poseNet.getCurrentEED(),0,1)-1);
      physicalChart.pushData(null , eedCorrected, "distance"); 

      var headDataCorrected=constrain(abs(poseNet.getHeadAngle())/20,0,1);
      physicalChart.pushData(null , headDataCorrected, "head");

      var shoulderDataCorrected=-(abs(poseNet.getShoulderAngle()/180)-1);
      physicalChart.pushData(null , shoulderDataCorrected, "shoulders");
    }
  } , 1000);

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
      console.log("Izpravi se be tupanar, shte ti eba maikata, glupak");
    }
    if (abs(abs(poseNet.getShoulderAngle()) - 180) > poseNet.shoulderAngleThreshold && poseNet.getShoulderAngle() != null) {
      console.log("RAMENETE WE");
    }
    if (abs(poseNet.getHeadAngle()) > poseNet.headAngleThreshold) {
      console.log("Izprai si glawata wee");
    }
    if ((currEED - poseNet.normalEED) > poseNet.monitorDistThreshold && poseNet.isPersonAvailable()) {
      console.log("You're too close to the monitor");
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

