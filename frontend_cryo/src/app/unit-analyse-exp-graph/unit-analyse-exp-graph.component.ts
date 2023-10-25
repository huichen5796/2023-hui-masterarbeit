import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CalculatorService } from '../app-services';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_accessibility from 'highcharts/modules/accessibility';

@Component({
  selector: 'app-unit-analyse-exp-graph',
  templateUrl: './unit-analyse-exp-graph.component.html',
  styleUrls: ['./unit-analyse-exp-graph.component.css']
})
export class UnitAnalyseExpGraphComponent implements OnChanges {
  @Input() sortedResultData!:{ [key: string]: { [k: string]: [string, string][] } }
  @Input() which!:string
  dataToShow:any
  chartOptions!: Highcharts.Options
  Highcharts: typeof Highcharts = Highcharts;
  show:boolean = false
  constructor(
    private calculatorService: CalculatorService,
  ) {
    
  }

  ngOnInit(): void {
    HC_more(Highcharts)
    HC_accessibility(Highcharts);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['which']['currentValue']) {
      this.buildColumn()
    }
  }

  buildColumn(){
    this.show = false
    this.calculatorService.buildColumn(this.getDataToShow(this.which)).then((res:any)=>{
      this.dataToShow = res
      if (this.dataToShow){
        this.updateChartOptions()
        this.show = true
      }
      
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

  updateChartOptions() {
    this.chartOptions = {
      title: {
        text: this.which
      },
      xAxis: {
        categories: this.getObjectKeys(this.dataToShow)
      },
      yAxis: [{
        title: {
          text: '%'
        }
      }],
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: this.which,
          type: 'column',
          data: this.getObjectKeys(this.dataToShow).map(faktor_id => parseFloat(this.dataToShow[faktor_id]['mean'])),
          // tooltip: {
          //   pointFormatter: function () {
          //     return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + this.y + '</b><br/><span style="color:' + this.color + '">\u25CF</span> n = ' + dataSumme[this.category]['preData'];
          //   }
          // },
        },
        {
          name: 'CI 95%',
          type: 'errorbar',
          data: this.getObjectKeys(this.dataToShow).map(faktor_id => [parseFloat(this.dataToShow[faktor_id]['mean']) - 1.96 * parseFloat(this.dataToShow[faktor_id]['SE']), parseFloat(this.dataToShow[faktor_id]['mean']) + 1.96 * parseFloat(this.dataToShow[faktor_id]['SE'])])
        }
      ]
    }
  }
}
