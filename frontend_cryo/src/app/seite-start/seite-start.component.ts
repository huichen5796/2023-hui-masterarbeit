import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { QueryNeo4jService, FileTransferService } from '../app-services';

@Component({
  selector: 'app-seite-start',
  templateUrl: './seite-start.component.html',
  styleUrls: ['./seite-start.component.css'],
})
export class SeiteStartComponent {
  output!: string
  value: string = 'MATCH (n) RETURN n'
  value1: string = 'MATCH (n) RETURN n'
  Highcharts = Highcharts;
  linechart: any = false

  testInput() {

    this.queryNeo4jService.queryTest(this.value).then((rep) => {
      this.output = rep
      console.log(rep)
    })

  }

  testInputCpa() {

    this.queryNeo4jService.queryTestCpa(this.value1).then((rep) => {
      // this.output = rep[2]['n']['Curve']
      const str = rep[2]['n']['Curve'].replace(/\'/g, '"')
      const json_str: { [key: string]: string[] } = JSON.parse(str)
      const list1 = json_str['Wavenumber/cm^-1']
      const list2 = json_str['Spectral intensity/A']
      const data = []
      for (let i = 0; i < list1.length; i++) {
        const xValue = parseFloat(list1[i]);
        const yValue = parseFloat(list2[i]);
        data.push([xValue, yValue]);
      }
      this.linechart = {
        series: [
          {
            data: data,
          },
        ],
        chart: {
          type: 'line',
        },
        title: {
          text: 'linechart',
        },
        xAxis: {
          title: {
            text: 'Wavenumber/cm^-1'
          }
        },
        yAxis: {
          title: {
            text: 'Spectral intensity/A'
          }
        },
      };
    })
  }
  selectedFile: File | null = null;

  constructor(private fileTransferService: FileTransferService, private queryNeo4jService: QueryNeo4jService,) { }

  extensionsLow = {
    'pre_data': ['txt', 'csv', 'asc'],
    'post_data': ['txt', 'csv', 'asc'],
    'process': ['txt', 'csv', 'asc'],
    'exp': ['txt', 'csv', 'asc'],
    'cpa': ['txt', 'csv', 'asc'],
  }

  onFileSelected(event: any, data_type: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process'): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      if ((this.extensionsLow[data_type]).indexOf(getFileExtension(this.selectedFile.name)) != -1) {
        console.log(`right format: ${getFileExtension(this.selectedFile.name)}`)
      } else {
        console.log('wrong file format')
      }

    } else {
      console.log('nothing selected')
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.fileTransferService.fileUpload(this.selectedFile, 'process').then((res) => { console.log(res) })
    } else {
      console.log('nothing uploaded')
    }
  }
}

function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex === -1) {
    return 'error';
  }
  const extension = fileName.slice(dotIndex + 1).toLowerCase();
  return extension;
}