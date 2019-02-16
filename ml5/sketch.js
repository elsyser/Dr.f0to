let video;
let poseNet;
let isCallibrated = false;
// let poses = [];
// let skeletons = [];


const options = { 
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
 

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  document.getElementById("callibratePose").addEventListener('click', handleCallibration , false);

  poseNet = new PoseChecker(video , options);

  poseNet.begin();

  video.hide();

}

function draw() {
  image(video, 0, 0, width, height);

  var shoulders = poseNet.getShoulders();


  if(isCallibrated){
    var currESD = poseNet.getCurrentESD();
    if(abs(currESD - poseNet.normalESD) > poseNet.threshold && poseNet.isPersonAvailable())
      console.log("Izpravi se be tupanar, shte ti eba maikata, glupak");
  }

  // poseNet.getEyes();
  poseNet.update();

}

function handleCallibration(){
    if(poseNet.isLoaded){
      var shoulders = poseNet.getShoulders();
      var eyes = poseNet.getEyes();
      poseNet.setNormalESD(eyes , shoulders);
      isCallibrated = true;
      console.log("Callibrated dist:" , poseNet.normalESD);

    }
}