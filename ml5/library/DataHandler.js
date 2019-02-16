
/**
 * Const for colorNames
 */
colorNames = {
    spine: "rgba(100, 50, 132, 1)",
    head: "rgba(100, 200, 132, 1)",
    shoulders: "rgba(100, 50, 132, 1)",
    distance: "rgba(100, 50, 132, 1)",
};

class DataHandler{
    /**
     * 
     * @param {Canvas} canvas - the canvas DOM element to put the Histogram
     * @param {Object} nameOptions - Object containing the specific names(options.diagramName , options.xName , options.yName)
     * @param {String} type - The type of diagram (line , pie and etc.)
     */
    constructor(canvas , nameOptions){
        this.config = {
            type: "line",
            data: {
              labels: [0],
              datasets: [{
                label: 'My First dataset',
                backgroundColor: 'rgba(255, 99, 132, 0.9)',
                borderColor: 'rgba(153, 102, 255, 0.9)',
                data: [ 
                  0
                ],
                fill: false,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              title: {
                display: true,
                text: nameOptions.diagramName
              },
              tooltips: {
                mode: 'index',
                intersect: false,
              },
              hover: {
                mode: 'nearest',
                intersect: true
              },
              scales: {
                xAxes: [{
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: nameOptions.xName
                  }
                }],
                yAxes: [{
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: nameOptions.yName
                  }
                }]
              }
            }
        };
        this.chart = new Chart(canvas, this.config);
        // this.chart.height = 200;
    }

    begin(){
    }

    /**
     * This function adds the passed data to the specific type of dataset
     * @param {Int} x - x coord for the data vertex
     * @param {Int} y - y coord for the data vertex
     * @param {String} type - Which dataset to put the data in
     */
    pushData(x , y , type){
        this.config.data.labels.push(x);
        var obj = this.config.data.datasets.filter((obj) =>{
            if(obj.label == type){
                obj.data.push(y)
                console.log(obj);
                return obj;
            }
        });
        this.chart.update();
    }

    /**
     * This function is for creating a new dataset
     * @param {String} type - the of dataset (ex. spine, head , shoulder , distance) 
     */
    addDataset(type){
		var colorName = colorNames[type];
			var newDataset = {
				label: type,
				backgroundColor: colorName,
				borderColor: colorName,
				data: [],
				fill: false
			};
			this.config.data.datasets.push(newDataset);
			this.chart.update();
    }
}