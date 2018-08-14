import { Injectable, Output, EventEmitter } from "@angular/core";
import { Chart } from "chart.js";

@Injectable()

export class ChartService {

  ChartBar = [];

  @Output() change: EventEmitter<boolean> = new EventEmitter();


  // var ctx = document.getElementById("myChart");
  // var myChart = new Chart(ctx,{
  //        type: 'line',
  //        data: data,
  //        options: options
  //    })

  chartBar(title, xTitle, yAxis, yTitle, xAxis) {
    Chart.defaults.global.defaultFontFamily = "Calibri";
    Chart.defaults.global.defaultFontSize = 16;
    Chart.defaults.global.defaultFontColor = "#828188";

    var ctx = document.getElementById("lineChart");
    this.ChartBar = new Chart(ctx, {
      type: "bar",
      data: {
        labels: yAxis,
        datasets: [
          {
            label: "",
            data: xAxis,
            fill: false,
            lineTension: 0.2,
            backgroundColor: "#f0f0f0",
            borderColor: "#d40b0d",
            borderWidth: 0.8
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: title,
        },
        legend: {
          // x axis: sorting
          display: false,
          labels: {
            padding: 20,
            fontSize: 14,
            fontFamily: "Lato"
          }
        },
        tooltips: {
          enabled: true,
          mode: "single",
          custom: function(tooltip) { 
            if (!tooltip) return; 
            tooltip.displayColors = false; 
            tooltip.xPadding = 10; 
            },  
            callbacks: {                                                               
              label: function(tooltipItem, data) { return '' + tooltipItem.yLabel;  }, // tooltipItem.yLabel
              title: function(tooltipItem, data) { return '';                       }, // tooltipItem[0].xLabel
            },
        },
    
        scales: {
          yAxes: [
            {
              ticks: { beginAtZero: true },
              scaleLabel: {
                display: true,
                fontSize: 14,
                labelString: yTitle,
                fontFamily: "Helvetica",
                fontColor: "#000"
              }
            }
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                fontSize: 14,
                labelString: xTitle,
                fontFamily: "Helvetica",
                fontColor: "#000"
              },
              // categoryPercentage: .4,
              barPercentage: 1.1
            }
          ]
        },
        responsive: true
      }
    });
  }

}
