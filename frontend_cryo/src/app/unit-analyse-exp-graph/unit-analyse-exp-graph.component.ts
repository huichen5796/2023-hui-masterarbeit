import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CalculatorService } from '../app-services';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_drilldown from 'highcharts/modules/drilldown';

@Component({
  selector: 'app-unit-analyse-exp-graph',
  templateUrl: './unit-analyse-exp-graph.component.html',
  styleUrls: ['./unit-analyse-exp-graph.component.css']
})
export class UnitAnalyseExpGraphComponent implements OnChanges {
  hash: { [k: string]: string } = {
    viabilityppn: 'norm. rel. viability',
    durchmetterppn: 'norm. rel. diameter',
    recoveried_cellsppn: 'norm. recovery rate',
    rundheitppn: 'norm. rel. circularity',
    viabilitypp: 'rel. viability',
    durchmetterpp: 'rel. diameter',
    recoveried_cellspp: 'recovery rate',
    rundheitpp: 'rel. circularity'
  }

  @Input() sortedResultData!: { [key: string]: { [k: string]: [string, string][] } }
  @Input() which!: string
  @Input() classColors:any
  dataToShow: any
  chartOptions!: Highcharts.Options
  Highcharts: typeof Highcharts = Highcharts;
  show: boolean = false

  tableData: any = {}
  showTable: boolean = false
  tableHeader: string[] = ["group1", "group2", "meandiff", "p-adj", "lower", "upper", "reject"]
  constructor(
    private calculatorService: CalculatorService,
  ) {

  }

  ngOnInit(): void {
    HC_more(Highcharts)
    HC_accessibility(Highcharts);
    HC_drilldown(Highcharts);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['which']['currentValue']) {
      this.buildColumn()
    }
  }

  buildColumn() {
    this.show = false
    this.calculatorService.buildColumn(this.getDataToShow(this.which)).then((res: any) => {
      this.dataToShow = res
      this.anovaTest()

    })
  }

  getDataToShow(which: string | null): { [key: string]: [string, string][] } {
    if (which) {
      let out: { [key: string]: [string, string][] } = {}
      this.getObjectKeys(this.sortedResultData).forEach((faktor: string) => {
        out[faktor] = this.sortedResultData[faktor][which]
      })
      return out
    } else {
      return {}
    }

  }

  getObjectKeys(obj: any): string[] {
    if (Object.keys(obj).length === 0) {
      return []
    }
    else {
      return Object.keys(obj);
    }
  }

  anovaTest() {
    this.tableData = {}
    this.showTable = false

    this.calculatorService.anovaTest(this.getDataToShow(this.which)).then((res: any) => {
      this.tableData = res
      this.showTable = true
      this.updateChartOptions()
      this.show = true
    })
  }

  updateChartOptions() {
    let self = this
    this.chartOptions = {
      title: {
        align: 'left',
        text: this.hash[this.which]
      },
      subtitle: {
        align: 'left',
        text: 'Click the columns to view trial data.'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: [{
        title: {
          text: '%'
        }
      }],
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        }
      },
      series: [
        {
          name: this.hash[this.which],
          type: 'column',
          colorByPoint: true,
          data: this.getObjectKeys(this.dataToShow).map(faktor_id => {
            return { y: parseFloat(this.dataToShow[faktor_id]['mean']), drilldown: faktor_id, name: faktor_id }
          }),
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + this.y + '</b><br/><span style="color:' + this.color + '">\u25CF</span> n = ' + self.getDataToShow(self.which)[this.name].length;
            }
          },
        },
        {
          name: 'CI 95%',
          type: 'errorbar',
          data: this.getObjectKeys(this.dataToShow).map(faktor_id => [parseFloat(this.dataToShow[faktor_id]['mean']) - 1.96 * parseFloat(this.dataToShow[faktor_id]['SE']), parseFloat(this.dataToShow[faktor_id]['mean']) + 1.96 * parseFloat(this.dataToShow[faktor_id]['SE'])]),
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.point.high === this.y) {
                const index: number = checkType(this.point.category)
                this.point.name = self.getObjectKeys(self.dataToShow)[index]
                return self.tableData['Tukey Group'][self.getObjectKeys(self.dataToShow)[index]];
              }
              return null;
            },
          },
          linkedTo: this.hash[this.which]
        }
      ],
      drilldown: {
        series: []
      }
    }
    this.getObjectKeys(this.dataToShow).forEach(faktor_id => {
      const drillData = this.getDrillDown(faktor_id)
      this.chartOptions.drilldown?.series?.push({ type: 'column', id: faktor_id, data: drillData, name: faktor_id, dataLabels: {
        enabled: true,
        format: '{point.y:.4f}'
    } })

      // error-bar
      // let out: { [k: string]: any } = {}
      // this.getDataToShow(this.which)[faktor_id].forEach((item: [string, string]) => {
      //   if (!out[item[1]]) {
      //     out[item[1]] = [item]
      //   } else {
      //     out[item[1]].push(item)
      //   }
      // })
      // this.calculatorService.buildColumn(out).then((res:any)=>{
      //   this.chartOptions.drilldown?.series?.push({ type: 'errorbar', id: faktor_id, data: this.getObjectKeys(res).map((versuch_id:string)=>{
      //     return [parseFloat(res[versuch_id]['mean']) - 1.96 * parseFloat(res[versuch_id]['SE']), parseFloat(res[versuch_id]['mean']) + 1.96 * parseFloat(res[versuch_id]['SE'])]
      //   }), name: 'CI 95%' })
      // })
    })
  }

  setGreen(value: any) {
    return value === true
  }

  getDrillDown(faktor_id: string): { name: string; y: number; color: any; }[] {
    let out: { [k: string]: any } = {}
    this.getDataToShow(this.which)[faktor_id].forEach((item: [string, string]) => {
      if (!out[item[1]]) {
        out[item[1]] = [parseFloat(item[0])]
      } else {
        out[item[1]].push(parseFloat(item[0]))
      }
    })
    return this.getObjectKeys(out).map((versuch_id: string) => {
      return {name:versuch_id, y:calculateArrayAverage(out[versuch_id]), color:this.classColors[versuch_id]}
    })
  }
}

function calculateArrayAverage(arr: number[]): number {
  if (arr.length === 0) {
    return 0
  }

  const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const average = sum / arr.length;

  return average;
}


function checkType(value: any): number {
  if (typeof value === 'string') {
    return parseInt(value)
  } else if (typeof value === 'number') {
    return value
  } else {
    return 0
  }
}