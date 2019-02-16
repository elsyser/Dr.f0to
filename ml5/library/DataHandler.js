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
    }

    begin(){
    }

    pushData(x , y){
        this.config.data.labels.push(x);
        this.config.data.datasets.forEach(function(dataset) {
            dataset.data.push(y);
        });
        this.chart.update();
    }
}