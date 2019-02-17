/**
 * Const for colorNames
 */
colorNames = {
    spine: "rgba(100, 50, 132, 1)",
    head: "rgba(100, 200, 132, 1)",
    shoulders: "rgba(66, 134, 244 , 1)",
    distance: "rgba(188, 50, 132, 1)",
    happy: "rgba(188, 50, 132, 1)",
    sad: "rgba(10, 10, 200, 1)",
};

class DataHandler {
    /**
     * 
     * @param {Canvas} canvas - the canvas DOM element to put the Histogram
     * @param {Object} nameOptions - Object containing the specific names(options.diagramName , options.xName , options.yName)
     * @param {String} type - The type of diagram (line , pie and etc.)
     */
    constructor(canvas, nameOptions, type) {
        this.chartType = type;
        this.config = {
            type: type,
            data: {
                labels: [],
                datasets: []
            },
            options: {
                animation:{
                    duration: 500
                },
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

    begin() {}

    /**
     * This function adds the passed data to the specific type of dataset
     * @param {Int} x - x coord for the data vertex
     * @param {Int} y - y coord for the data vertex
     * @param {String} type - Which dataset to put the data in
     */
    pushData(x, y, type) {
        if(x!=null){
            this.config.data.labels.push(x);
        }
        var obj = this.config.data.datasets.filter((obj) => {
            if (obj.label == type) {
                obj.data.push(y)
                return obj;
            }
        });
        this.chart.update();
    }

    /**
     * This function is for creating a new dataset
     * @param {String} type - the of dataset (ex. spine, head , shoulder , distance) 
     */
    addDataset(type) {
        var colorName
        if (colorNames[type])
            colorName = colorNames[type];

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
    /**
     * Use this only WITH PIE and DOUGHNUT chart
     * @param {Int} val - The values that is going to be written 
     * @param {*} type - Which dataset to update
     */
    updateData(vals, types) {

        // this.config.data.labels.push(type);
        var newDataset = {
            data:vals,
            backgroundColor: [
                "rgba(100, 50, 132, 1)",
                "rgba(100, 200, 132, 1)",
                "rgba(66, 134, 244 , 1)",
                "rgba(66, 154, 90 , 1)",
                "rgba(122, 136, 24 , 1)",
                "rgba(189, 27, 83 , 1)",
                "rgba(199, 194, 133 , 1)",
            ],
        };
        var _l = {
            labels: types
        }
        this.config.data.datasets[0] = newDataset;
        this.config.data.labels = types;       
        this.config.options.animation.duration = 0;
        this.chart.update();
    }
}