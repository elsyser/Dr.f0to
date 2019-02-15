let poses = [];


class PoseChecker{ 
    constructor(source , options){
        this.poseNet ;
        // this.poses = [];
        this.options = options;
        this.source = source;
        this.isModelLoaded = false;
    }


    begin(){
        this.poseNet = ml5.poseNet(this.source, this.options , ()=>{
            console.log("LOADED");
            this.isModelLoaded = true;
        });
        this.poseNet.on('pose', function (results) {
            poses = results;
        });
    }

    update(){
        this.drawKeypoints();
    }

    drawKeypoints()  {
        // Loop through all the poses detected
        for (let i = 0; i < poses.length; i++) {
          // For each pose detected, loop through all the keypoints
          for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = poses[i].pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.5) {
              fill(255, 0, 0);
              noStroke();
              text(keypoint.part , keypoint.position.x , keypoint.position.y - 10);
              ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
          }
        }
    }

    getEyes(){
        // var buff = poses[0].pose;
        if(this.isModelLoaded){
            console.log(poses[0].pose);
        //     for(var i=0;i<buff.keypoint.length;i++){
        //         var keypoint = buff.keypoint[0];
        //         if(keypoint.part == 'nose'){
        //             console.log("KUREC");
        //         }
        //         console.log(keypoint);
        //     }
            // for(var keypoint of buff.keypoint){

            // }
        }
    }
}