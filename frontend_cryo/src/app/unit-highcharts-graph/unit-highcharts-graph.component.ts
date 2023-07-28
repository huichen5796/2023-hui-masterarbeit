import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { QueryNeo4jService } from '../app-services';
import HC_more from 'highcharts/highcharts-more';
import HC_accessibility from 'highcharts/modules/accessibility';

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
  chartOptions!: Highcharts.Options
  show: boolean = false
  Highcharts: typeof Highcharts = Highcharts;

  dataStorage: { [key: string]: { preData: any, postData: any } } = {} //number | string[]
  categories: string[] = []

  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) { }

  ngOnInit(): void {
    HC_more(Highcharts)
    HC_accessibility(Highcharts);
  }

  ngOnChanges(): void {
    if (this.experiment) {
      this.experiment['child'].forEach((versuch: any) => {
        versuch['probes'].forEach((probe: any) => {
          this.dataStorage[probe['Unique_ID']] = { preData: probe['PreData_ID'], postData: probe['PostData_ID'] }
        })
      })

      this.categories = this.getObjectKeys(this.dataStorage)
      let index = 0
      this.categories.forEach((probe_id: string) => {
        this.queryNeo4jService.buildColumn(this.dataStorage[probe_id]['preData'], this.dataStorage[probe_id]['postData'], this.selectedItem).then((res: any) => {
          const pre_mean = parseFloat(res['pre_data']['mean'])
          const post_mean = parseFloat(res['post_data']['mean'])
          const pre_SE = parseFloat(res['pre_data']['SE'])
          const post_SE = parseFloat(res['post_data']['SE'])
          this.dataStorage[probe_id] = { preData: { mean: pre_mean, SE: pre_SE }, postData: { mean: post_mean, SE: post_SE } }
          index +=1
          if (index === this.categories.length) {
            this.update()
            this.show = true
          }
        })
      })
    }
  }

  update() {
    this.chartOptions = {
      title: {
        text: this.experiment['experiment']['Experiment_ID']
      },
      xAxis: {
        categories: this.categories
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
          data: this.categories.map(probeId => this.dataStorage[probeId]['preData']['mean'])
        },
        {
          name: 'pre data error',
          type: 'errorbar',
          data: this.categories.map(probeId => [this.dataStorage[probeId]['preData']['mean'] - 1.96 * this.dataStorage[probeId]['preData']['SE'], this.dataStorage[probeId]['preData']['mean'] + 1.96 * this.dataStorage[probeId]['preData']['SE']])
        },
        {
          name: "post data",
          type: this.type,
          data: this.categories.map(probeId => this.dataStorage[probeId]['postData']['mean'])
        },
        {
          name: 'post data error',
          type: 'errorbar',
          data: this.categories.map(probeId => [this.dataStorage[probeId]['postData']['mean'] - 1.96 * this.dataStorage[probeId]['postData']['SE'], this.dataStorage[probeId]['postData']['mean'] + 1.96 * this.dataStorage[probeId]['postData']['SE']])
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
}
