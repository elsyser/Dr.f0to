let video;
let poseNet;
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
  document.getElementById("callibratePose" , handleCallibration , false);

  poseNet = new PoseChecker(video , options);

  poseNet.begin();

  video.hide();

}

function draw() {
  image(video, 0, 0, width, height);


  console.log(poseNet.getEyes());

  // poseNet.getEyes();
  poseNet.update();

}

function handleCallibration(){
}