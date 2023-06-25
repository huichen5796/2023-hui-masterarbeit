import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-unit-highcharts-graph',
  templateUrl: './unit-highcharts-graph.component.html',
  styleUrls: ['./unit-highcharts-graph.component.css']
})
export class UnitHighchartsGraphComponent {
  // @Input() Highcharts = Highcharts;
  // linechart: any = false

  // testInputCpa() {

  //   this.queryNeo4jService.queryTestCpa(this.value1).then((rep) => {
  //     // this.output = rep[2]['n']['Curve']
  //     const str = rep[2]['n']['Curve'].replace(/\'/g, '"')
  //     const json_str: { [key: string]: string[] } = JSON.parse(str)
  //     const list1 = json_str['Wavenumber/cm^-1']
  //     const list2 = json_str['Spectral intensity/A']
  //     const data = []
  //     for (let i = 0; i < list1.length; i++) {
  //       const xValue = parseFloat(list1[i]);
  //       const yValue = parseFloat(list2[i]);
  //       data.push([xValue, yValue]);
  //     }
  //     this.linechart = {
  //       series: [
  //         {
  //           data: data,
  //         },
  //       ],
  //       chart: {
  //         type: 'line',
  //       },
  //       title: {
  //         text: 'linechart',
  //       },
  //       xAxis: {
  //         title: {
  //           text: 'Wavenumber/cm^-1'
  //         }
  //       },
  //       yAxis: {
  //         title: {
  //           text: 'Spectral intensity/A'
  //         }
  //       },
  //     };
  //   })
  // }
}
