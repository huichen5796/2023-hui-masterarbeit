import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { QueryNeo4jService } from '../app-services';
import HC_more from 'highcharts/highcharts-more';
import HC_accessibility from 'highcharts/modules/accessibility';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-unit-highcharts-graph',
  templateUrl: './unit-highcharts-graph.component.html',
  styleUrls: ['./unit-highcharts-graph.component.css']
})
export class UnitHighchartsGraphComponent implements OnChanges, OnInit {
  @Input() experiment!: any
  selectItem: string[] = ["Viability_(%)", "Total_cells_/_ml_(x_10^6)", "Total_viable_cells_/_ml_(x_10^6)", "Average_diameter_(microns)", "Average_circularity"]
  selectedItem: string = this.selectItem[0]
  type: any = 'column'
  Highcharts: typeof Highcharts = Highcharts;
  tableHeader: string[] = ["group1", "group2", "meandiff", "p-adj", "lower", "upper", "reject"]
  classColors: { [key: string]: string } = {}

  chartOptions!: Highcharts.Options
  dataStorage: { [key: string]: { preData: any, postData: any } } = {} //number | string[]
  dataSumme: { [key: string]: { preData: any, postData: any } } = {}
  categories: string[] = []
  plotBands: { from: number, to: number, color: string, label: { text: string } }[] = []
  show: boolean = false
  tableData: { [key: string]: any } = {}
  showTable: boolean = false

  chartOptions_average_versuch!: Highcharts.Options
  dataStorage_average_versuch: { [key: string]: { preData: any, postData: any } } = {} //number | string[]
  dataSumme_average_versuch: { [key: string]: { preData: any, postData: any } } = {}
  categories_average_versuch: string[] = []
  plotBands_average_versuch: { from: number, to: number, color: string, label: { text: string } }[] = []
  show_average_versuch: boolean = false
  tableData_average_versuch: { [key: string]: any } = {}
  showTable_average_versuch: boolean = false

  chartOptions_average_probe!: Highcharts.Options
  dataStorage_average_probe: { [key: string]: { preData: any, postData: any } } = {} //number | string[]
  dataSumme_average_probe: { [key: string]: { preData: any, postData: any } } = {}
  categories_average_probe: string[] = []
  plotBands_average_probe: { from: number, to: number, color: string, label: { text: string } }[] = []
  show_average_probe: boolean = false
  tableData_average_probe: { [key: string]: any } = {}
  showTable_average_probe: boolean = false

  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) { }

  ngOnInit(): void {
    HC_more(Highcharts)
    HC_accessibility(Highcharts);
    this.classColors = {}
  }

  ngOnChanges(): void {
    this.ngOnInit()
    this.loadChartOptions()
    this.loadAverageNachVersuch()
    this.loadAverageNachProbe()
  }

  loadChartOptions() {
    if (this.experiment) {
      this.dataStorage = {}
      this.dataSumme = {}
      this.experiment['child'].forEach((versuch: any) => {
        versuch['probes'].forEach((probe: any) => {
          this.dataStorage[probe['Unique_ID']] = { preData: probe['PreData_ID'], postData: probe['PostData_ID'] }
        })
      })
      this.dataSumme = cloneDeep(this.dataStorage)
      this.categories = this.getObjectKeys(this.dataStorage)
      const pB: string[] = this.getObjectKeys(this.dataStorage).map(Unique_ID => Unique_ID.split('*-*')[1])

      findIndexRanges(pB).forEach((range: any, element: any) => {
        if (!this.classColors[element]) {
          this.classColors[element] = getRandomCoolColor()
        }
        this.plotBands.push({ from: range[0] - 0.5, to: range[1] + 0.5, color: this.classColors[element], label: { text: element } })
      })

      let index = 0
      this.categories.forEach((probe_id: string) => {
        this.queryNeo4jService.buildColumn(this.dataStorage[probe_id]['preData'], this.dataStorage[probe_id]['postData'], this.selectedItem).then((res: any) => {
          const pre_mean = parseFloat(res['pre_data']['mean'])
          const post_mean = parseFloat(res['post_data']['mean'])
          const pre_SE = parseFloat(res['pre_data']['SE'])
          const post_SE = parseFloat(res['post_data']['SE'])
          this.dataStorage[probe_id] = { preData: { mean: pre_mean, SE: pre_SE }, postData: { mean: post_mean, SE: post_SE } }
          index += 1
          if (index === this.categories.length) {
            this.anovaTest()
          }
        })
      })
    }
  }

  anovaTest() {
    this.tableData = {}
    this.showTable = false
    this.experiment['child'].forEach((versuch: any) => {
      versuch['probes'].forEach((probe: any) => {
        this.tableData[probe['Unique_ID']] = probe['PostData_ID']
      })
    })
    this.queryNeo4jService.buildAnovaTable(this.tableData, this.selectedItem).then((res: any) => {
      this.tableData = res
      this.showTable = true
      this.updateChartOptions()
      this.show = true
    })
  }

  updateChartOptions() {
    for (const key in this.dataSumme) {
      if (Object.prototype.hasOwnProperty.call(this.dataSumme, key)) {
        this.dataSumme[key] = { preData: this.dataSumme[key].preData.length, postData: this.dataSumme[key].postData.length }
      }
    }
    let dataSumme = this.dataSumme
    let tableData = this.tableData
    this.chartOptions = {
      title: {
        text: this.experiment['experiment']['Experiment_ID']
      },
      xAxis: {
        categories: this.categories,
        plotBands: this.plotBands,
      },
      yAxis: {
        title: {
          text: this.selectedItem
        }
      },
      // tooltip: {
      //   valueSuffix: ' (1000 MT)'
      // },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'pre data',
          type: this.type,
          data: this.categories.map(probeId => this.dataStorage[probeId]['preData']['mean']),
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + this.y + '</b><br/><span style="color:' + this.color + '">\u25CF</span> n = ' + dataSumme[this.category]['preData'];
            }
          },
        },
        {
          name: 'CI 95%',
          type: 'errorbar',
          data: this.categories.map(probeId => [this.dataStorage[probeId]['preData']['mean'] - 1.96 * this.dataStorage[probeId]['preData']['SE'], this.dataStorage[probeId]['preData']['mean'] + 1.96 * this.dataStorage[probeId]['preData']['SE']])
        },
        {
          name: "post data",
          type: this.type,
          data: this.categories.map(probeId => this.dataStorage[probeId]['postData']['mean']),
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + this.y + '</b><br/><span style="color:' + this.color + '">\u25CF</span> n = ' + dataSumme[this.category]['postData'];
            }
          },
        },
        {
          name: 'CI 95%',
          type: 'errorbar',
          data: this.categories.map(probeId => [this.dataStorage[probeId]['postData']['mean'] - 1.96 * this.dataStorage[probeId]['postData']['SE'], this.dataStorage[probeId]['postData']['mean'] + 1.96 * this.dataStorage[probeId]['postData']['SE']]),
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.point.high === this.y) {
                return tableData['Tukey Group'][this.point.category];
              }
              return null;
            },
          },
        }
      ]
    };
  }

  loadAverageNachVersuch() {
    if (this.experiment) {
      this.dataStorage_average_versuch = {}
      this.dataSumme_average_versuch = {}
      this.experiment['child'].forEach((versuch: any) => {
        let preData_list: any[] = []
        let postData_list: any[] = []
        versuch['probes'].forEach((probe: any) => {
          preData_list = preData_list.concat(probe['PreData_ID'])
          postData_list = postData_list.concat(probe['PostData_ID'])
        })
        this.dataStorage_average_versuch[versuch['versuch']['Versuch_ID']] = { preData: preData_list, postData: postData_list }
      })

      this.dataSumme_average_versuch = cloneDeep(this.dataStorage_average_versuch)

      this.categories_average_versuch = this.getObjectKeys(this.dataStorage_average_versuch)

      findIndexRanges(this.categories_average_versuch).forEach((range: any, element: any) => {
        this.plotBands_average_versuch.push({ from: range[0] - 0.5, to: range[1] + 0.5, color: this.classColors[element], label: { text: '' } })
      })

      let index = 0
      this.categories_average_versuch.forEach((versuch_id: string) => {
        this.queryNeo4jService.buildColumn(this.dataStorage_average_versuch[versuch_id]['preData'], this.dataStorage_average_versuch[versuch_id]['postData'], this.selectedItem).then((res: any) => {
          const pre_mean = parseFloat(res['pre_data']['mean'])
          const post_mean = parseFloat(res['post_data']['mean'])
          const pre_SE = parseFloat(res['pre_data']['SE'])
          const post_SE = parseFloat(res['post_data']['SE'])
          this.dataStorage_average_versuch[versuch_id] = { preData: { mean: pre_mean, SE: pre_SE }, postData: { mean: post_mean, SE: post_SE } }
          index += 1
          if (index === this.categories_average_versuch.length) {
            this.anovaTestNachVersuch()
          }
        })
      })
    }
  }

  anovaTestNachVersuch() {
    this.tableData_average_versuch = {}
    this.showTable_average_versuch = false
    this.experiment['child'].forEach((versuch: any) => {
      let postData_list: any[] = []
      versuch['probes'].forEach((probe: any) => {
        postData_list = postData_list.concat(probe['PostData_ID'])
      })
      this.tableData_average_versuch[versuch['versuch']['Versuch_ID']] = postData_list
    })
    this.queryNeo4jService.buildAnovaTable(this.tableData_average_versuch, this.selectedItem).then((res: any) => {
      this.tableData_average_versuch = res
      this.showTable_average_versuch = true
      this.updateAverageNachVersuch()
      this.show_average_versuch = true
    })
  }

  updateAverageNachVersuch() {
    for (const key in this.dataSumme_average_versuch) {
      if (Object.prototype.hasOwnProperty.call(this.dataSumme_average_versuch, key)) {
        this.dataSumme_average_versuch[key] = { preData: this.dataSumme_average_versuch[key].preData.length, postData: this.dataSumme_average_versuch[key].postData.length }
      }
    }
    let dataSumme_average_versuch = this.dataSumme_average_versuch
    let tableData_average_versuch = this.tableData_average_versuch
    this.chartOptions_average_versuch = {
      title: {
        text: this.experiment['experiment']['Experiment_ID']
      },
      xAxis: {
        categories: this.categories_average_versuch,
        plotBands: this.plotBands_average_versuch,
      },
      yAxis: {
        title: {
          text: this.selectedItem
        }
      },
      // tooltip: {
      //   valueSuffix: ' (1000 MT)'
      // },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'pre data',
          type: this.type,
          data: this.categories_average_versuch.map(probeId => this.dataStorage_average_versuch[probeId]['preData']['mean']),
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + this.y + '</b><br/><span style="color:' + this.color + '">\u25CF</span> n = ' + dataSumme_average_versuch[this.category]['preData'];
            }
          },
        },
        {
          name: 'CI 95%',
          type: 'errorbar',
          data: this.categories_average_versuch.map(probeId => [this.dataStorage_average_versuch[probeId]['preData']['mean'] - 1.96 * this.dataStorage_average_versuch[probeId]['preData']['SE'], this.dataStorage_average_versuch[probeId]['preData']['mean'] + 1.96 * this.dataStorage_average_versuch[probeId]['preData']['SE']])
        },
        {
          name: "post data",
          type: this.type,
          data: this.categories_average_versuch.map(probeId => this.dataStorage_average_versuch[probeId]['postData']['mean']),
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + this.y + '</b><br/><span style="color:' + this.color + '">\u25CF</span> n = ' + dataSumme_average_versuch[this.category]['postData'];
            }
          },
        },
        {
          name: 'CI 95%',
          type: 'errorbar',
          data: this.categories_average_versuch.map(probeId => [this.dataStorage_average_versuch[probeId]['postData']['mean'] - 1.96 * this.dataStorage_average_versuch[probeId]['postData']['SE'], this.dataStorage_average_versuch[probeId]['postData']['mean'] + 1.96 * this.dataStorage_average_versuch[probeId]['postData']['SE']]),
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.point.high === this.y) {
                return tableData_average_versuch['Tukey Group'][this.point.category];
              }
              return null;
            },
          },
        }
      ]
    };
  }

  loadAverageNachProbe() {
    if (this.experiment) {
      this.dataStorage_average_probe = {}
      this.dataSumme_average_probe = {}
      let dS: { [key: string]: { preData: any, postData: any } } = {}
      this.experiment['child'].forEach((versuch: any) => {
        versuch['probes'].forEach((probe: any) => {
          dS[probe['Unique_ID']] = { preData: probe['PreData_ID'], postData: probe['PostData_ID'] }
        })
      })

      for (const key in dS) {
        const newKey = key.split('*-*')[2]
        if (newKey) {
          if (!this.dataStorage_average_probe[newKey]) {
            this.dataStorage_average_probe[newKey] = { preData: [], postData: [] };
          }
          this.dataStorage_average_probe[newKey]['preData'] = this.dataStorage_average_probe[newKey]['preData'].concat(dS[key].preData);
          this.dataStorage_average_probe[newKey]['postData'] = this.dataStorage_average_probe[newKey]['postData'].concat(dS[key].postData);
        }
      }

      this.dataSumme_average_probe = cloneDeep(this.dataStorage_average_probe)

      this.categories_average_probe = this.getObjectKeys(this.dataStorage_average_probe)

      findIndexRanges(this.categories_average_probe).forEach((range: any, element: any) => {
        if (!this.classColors[element]) {
          this.classColors[element] = getRandomCoolColor()
        }
        this.plotBands_average_probe.push({ from: range[0] - 0.5, to: range[1] + 0.5, color: this.classColors[element], label: { text: '' } })
      })

      let index = 0
      this.categories_average_probe.forEach((versuch_id: string) => {
        this.queryNeo4jService.buildColumn(this.dataStorage_average_probe[versuch_id]['preData'], this.dataStorage_average_probe[versuch_id]['postData'], this.selectedItem).then((res: any) => {
          const pre_mean = parseFloat(res['pre_data']['mean'])
          const post_mean = parseFloat(res['post_data']['mean'])
          const pre_SE = parseFloat(res['pre_data']['SE'])
          const post_SE = parseFloat(res['post_data']['SE'])
          this.dataStorage_average_probe[versuch_id] = { preData: { mean: pre_mean, SE: pre_SE }, postData: { mean: post_mean, SE: post_SE } }
          index += 1
          if (index === this.categories_average_probe.length) {
            this.anovaTestNachProbe()
          }
        })
      })
    }
  }

  anovaTestNachProbe() {
    this.tableData_average_probe = {}
    this.showTable_average_probe = false
    let dS: { [key: string]: [] } = {}
    this.experiment['child'].forEach((versuch: any) => {
      versuch['probes'].forEach((probe: any) => {
        dS[probe['Unique_ID']] = probe['PostData_ID']
      })
    })

    for (const key in dS) {
      const newKey = key.split('*-*')[2]
      if (newKey) {
        if (!this.tableData_average_probe[newKey]) {
          this.tableData_average_probe[newKey] = []
        }
        this.tableData_average_probe[newKey] = this.tableData_average_probe[newKey].concat(dS[key]);
      }
    }
    this.queryNeo4jService.buildAnovaTable(this.tableData_average_probe, this.selectedItem).then((res: any) => {
      this.tableData_average_probe = res
      this.showTable_average_probe = true
      this.updateAverageNachProbe()
      this.show_average_probe = true
    })
  }

  updateAverageNachProbe() {
    for (const key in this.dataSumme_average_probe) {
      if (Object.prototype.hasOwnProperty.call(this.dataSumme_average_probe, key)) {
        this.dataSumme_average_probe[key] = { preData: this.dataSumme_average_probe[key].preData.length, postData: this.dataSumme_average_probe[key].postData.length }
      }
    }
    let dataSumme_average_probe = this.dataSumme_average_probe
    let tableData_average_probe = this.tableData_average_probe
    this.chartOptions_average_probe = {
      title: {
        text: this.experiment['experiment']['Experiment_ID']
      },
      xAxis: {
        categories: this.categories_average_probe,
        plotBands: this.plotBands_average_probe,
      },
      yAxis: {
        title: {
          text: this.selectedItem
        }
      },
      // plotOptions: {
      //   errorbar: {
      //     dataLabels: {
      //       enabled: true,
      //       formatter: function () {
      //         console.log(this)
      //         if (this.point.high === this.y) {
      //           return tableData_average_probe['Tukey Group'][this.point.category];
      //         }
      //         return null;
      //       },
      //     },
      //   }
      // },
      series: [
        {
          name: 'pre data',
          type: this.type,
          data: this.categories_average_probe.map(probeId => this.dataStorage_average_probe[probeId]['preData']['mean']),
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + this.y + '</b><br/><span style="color:' + this.color + '">\u25CF</span> n = ' + dataSumme_average_probe[this.category]['preData'];
            }
          },
        },
        {
          name: 'CI 95%',
          type: 'errorbar',
          data: this.categories_average_probe.map(probeId => [this.dataStorage_average_probe[probeId]['preData']['mean'] - 1.96 * this.dataStorage_average_probe[probeId]['preData']['SE'], this.dataStorage_average_probe[probeId]['preData']['mean'] + 1.96 * this.dataStorage_average_probe[probeId]['preData']['SE']])
        },
        {
          name: "post data",
          type: this.type,
          data: this.categories_average_probe.map(probeId => this.dataStorage_average_probe[probeId]['postData']['mean']),
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + this.y + '</b><br/><span style="color:' + this.color + '">\u25CF</span> n = ' + dataSumme_average_probe[this.category]['postData'];
            }
          },
        },
        {
          name: 'CI 95%',
          type: 'errorbar',
          data: this.categories_average_probe.map(probeId => [this.dataStorage_average_probe[probeId]['postData']['mean'] - 1.96 * this.dataStorage_average_probe[probeId]['postData']['SE'], this.dataStorage_average_probe[probeId]['postData']['mean'] + 1.96 * this.dataStorage_average_probe[probeId]['postData']['SE']]),
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.point.high === this.y) {
                return tableData_average_probe['Tukey Group'][this.point.category];
              }
              return null;
            },
          }
        }
      ]
    };
  }

  getObjectKeys(obj: any): string[] {
    if (Object.keys(obj).length === 0) {
      return []
    }
    else {
      return Object.keys(obj);
    }
  }

  setGreen(value: any) {
    return value === true
  }

}


function findIndexRanges(arr: any[]): Map<any, [number, number]> {
  const indexRanges = new Map<any, [number, number]>();
  let currentElement = arr[0];
  let startIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== currentElement) {
      indexRanges.set(currentElement, [startIndex, i - 1]);
      currentElement = arr[i];
      startIndex = i;
    }
  }
  indexRanges.set(currentElement, [startIndex, arr.length - 1]);
  return indexRanges;
}


function getRandomCoolColor(): string {
  const blueRange = 10;
  const greenRange = 10;
  const purpleRange = 10;

  const blue = (Math.floor((0.8 + Math.random() * 0.2) * (255 - blueRange))).toString(16).padStart(2, '0');
  const green = (Math.floor((0.8 + Math.random() * 0.2) * (255 - greenRange))).toString(16).padStart(2, '0');
  const purple = (Math.floor((0.8 + Math.random() * 0.2) * (255 - purpleRange))).toString(16).padStart(2, '0');

  return `#${blue}${green}${purple}`;
}