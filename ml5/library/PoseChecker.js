let poses = [];


class PoseChecker{ 
    constructor(source , options){
        this.poseNet ;
        // this.poses = [];
        this.options = options;
        this.source = source;
        this.isLoaded = false;
        this.threshold = 80;
        this.normalESD = null;
    }


    begin(){
        this.poseNet = ml5.poseNet(this.source, this.options , ()=>{
            console.log("LOADED");
            this.isLoaded = true;
        });
        this.poseNet.on('pose', function (results) {
            poses = results;
        });
    }

    update(){
        // this.drawKeypoints();
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

    //Getters
    getEyes(){
        if(this.isPersonAvailable()){
            var toReturn = {
                left:null,
                right:null
            };
            if(this.isLoaded && poses[0]){
                var keypoints = poses[0].pose.keypoints;
                for(var i=0;i<keypoints.length;i++){
                    var keypoint = keypoints[i];
                    if(keypoint.part == 'leftEye'){
                        toReturn.left = keypoint.position; 
                    }else if(keypoint.part == 'rightEye')
                        toReturn.right = keypoint.position;
                }
            }
            return toReturn;
        }
    }
    getShoulders(){
        if(this.isPersonAvailable()){
            var toReturn = {
                left:null,
                right:null
            };
            if(this.isLoaded && poses[0]){
                var keypoints = poses[0].pose.keypoints;
                for(var i=0;i<keypoints.length;i++){
                    var keypoint = keypoints[i];
                    if(keypoint.part == 'rightShoulder'){
                        toReturn.left = keypoint.position; 
                    }else if(keypoint.part == 'leftShoulder')
                        toReturn.right = keypoint.position;
                }
            }
            return toReturn;
        }
    }
    /**
     * Get the current Eye - Shoulder distance (ESD)
     * @returns {Int} The distance
     */
    getCurrentESD(){
        if(this.isPersonAvailable()){
            var shoulders = this.getShoulders();
            var eyes = this.getEyes();
            return dist( (eyes.left.x + eyes.right.x)/2 , (eyes.left.y + eyes.right.y)/2  ,
            (shoulders.left.x + shoulders.right.x)/2 , (shoulders.left.y + shoulders.right.y)/2 );
        }
    }


    isPersonAvailable(){
        return (poses.length) ? true : false;
    }

    //TODO 
    //Make scale factor measured by the distance between the TWO eyes
    //
    //


    //Setters
    /**
     * Set the normal Eye - Shoulder distance (ESD)
     * @param {Object} eyes - The eye object holding the positions
     * @param {Objct} shoulders - The shoulder object holding the positions
     */
    setNormalESD(eyes , shoulders){
        if(this.isPersonAvailable()){
            this.normalESD = dist( (eyes.left.x + eyes.right.x)/2 , (eyes.left.y + eyes.right.y)/2  ,
                         (shoulders.left.x + shoulders.right.x)/2 , (shoulders.left.y + shoulders.right.y)/2 );
        }
    }
    //
}