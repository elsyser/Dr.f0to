let video;
let poseNet;
let isCallibrated = false;
var chart = null;
var config = null;
// let poses = [];
// let skeletons = [];


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




function setup() {
  createCanvas(windowWidth - 150, windowHeight);
  video = createCapture(video_options);
  video.size(width, height);
  document.getElementById("callibratePose").addEventListener('click', handleCallibration, false);

  poseNet = new PoseChecker(video, poseNet_options);

  poseNet.begin();

  video.hide();


  
  
  var cnv = document.getElementById("chart").getContext("2d");
  chart  = new DataHandler(cnv , {
    diagramName: "ESD (Eye-Shoulder Distance)",
    xName: "Time",
    yName: "Current Eye Shoulder Distance"
  });

  setInterval(()=>{
    var esd = poseNet.getCurrentESD();
    if(esd && isCallibrated && document.hasFocus()){
      chart.pushData(new Date().toLocaleTimeString() , esd);
    }
  } , 1000);
  chart.addDataset([123,43,123,55] , 'spine');

}

function draw() {
  if(mouseIsPressed){
    chart.pushData([1,2,3,4] , [123,43,123,55] , 'spine');
  }


  if (isCallibrated) {
    var currESD = poseNet.getCurrentESD();
    var currEED = poseNet.getCurrentEED();
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

  var path = window.location.href , path = path.slice(path.length-1 , path.length);
  // console.log(window.location.href);


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

function windowResized(){
  resizeCanvas(window.width , window.height);
}