colorNames = {
    spine: "rgba(100, 50, 132, 1)",
    head: "rgba(100, 50, 132, 1)",
    shoulders: "rgba(100, 50, 132, 1)",
    distance: "rgba(100, 50, 132, 1)",
};

class DataHandler{
    constructor(canvas , nameOptions){
        this.config = {
            type: 'line',
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

    pushData(x , y , type){
        this.config.data.labels.push(x);
        var obj = this.config.data.datasets.filter((obj) =>{
            return obj.label == type;
        });
        console.log(obj.data);
        // obj.data.push(y);
        // this.config.data.datasets[type].dataset.data.push(y);
        this.chart.update();
    }

    addDataset(data , type){
		var colorName = colorNames[type];
			var newDataset = {
				label: type,
				backgroundColor: colorName,
				borderColor: colorName,
				data: [],
				fill: false
			};

			for (var index = 0; index < this.config.data.labels.length; ++index) {
                newDataset.data.push(random(0,20));
                console.log("KUREC")
			}

			this.config.data.datasets.push(newDataset);
			this.chart.update();
    }
}