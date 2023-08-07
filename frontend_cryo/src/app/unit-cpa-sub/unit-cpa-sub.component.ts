import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { QueryNeo4jService } from '../app-services';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_accessibility from 'highcharts/modules/accessibility';

@Component({
  selector: 'app-unit-cpa-sub',
  templateUrl: './unit-cpa-sub.component.html',
  styleUrls: ['./unit-cpa-sub.component.css']
})
export class UnitCpaSubComponent implements OnChanges, OnInit {
  @Input() cpa_id!: string
  @Input() sub!: any
  Highcharts: typeof Highcharts = Highcharts;
  curve: { [k: string]: string[] } = {}
  showOrNot: boolean = false
  chartOptions!: Highcharts.Options

  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) { }

  ngOnInit(): void {
    HC_more(Highcharts)
    HC_accessibility(Highcharts);
  }

  ngOnChanges(): void {
    this.curve = {}
    this.showOrNot = false
    if (this.sub.class && this.sub.unique_id) {
          this.queryNeo4jService.queryOneNode(this.sub.class, this.sub.unique_id).then((res: any) => {
            this.curve = JSON.parse(res['Curve'].replace(/'/g, '"'))
            if (this.sub.class === 'FTIR') {
              this.updateFTIR()
            }
            else if (this.sub.class === 'DSC') {
              this.updateDSC()
            }
          })
      
    }
  }

  updateFTIR() {
    this.chartOptions = {
      chart: {
        zooming: {
          type: 'x'
        }
      },
      title: {
        text: `${this.sub.class} of <u>${this.cpa_id}</u>`
      },
      subtitle: {
        text: `${this.sub.unique_id}`
      },
      xAxis: {
        categories: this.curve["Wavenumber/cm^-1"].map((numString: string) => {
          return `${Number(numString)}`;
        }),
        tickInterval: 500,
        minorTickInterval: 100
      },
      yAxis: {
        title: {
          text: "Absorbance/A"
        }
      },
      // tooltip: {
      //   valueSuffix: ' (1000 MT)'
      // },
      plotOptions: {
        area: {
          fillOpacity: 0.2
        }
      },
      series: [
        {
          type: 'area',
          data: this.curve["Absorbance/A"].map(item => Number(item)),
          lineWidth: 0.5,
          name: "Wavenumber/cm^-1",
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + 'Absorbance/A' + ': <b>' + this.y;
            }
          },
        }
      ]
    };
    this.showOrNot = true
  }

  updateDSC() {
    this.chartOptions = {
      chart: {
        zooming: {
          type: 'x'
        }
      },
      title: {
        text: `${this.sub.class} of <u>${this.cpa_id}</u>`
      },
      subtitle: {
        text: `${this.sub.unique_id}`
      },
      xAxis: {
        categories: this.curve["Time/min"]
          .map((numString: string) => {
            return `${(Number(numString)).toFixed(3)}`;
          }),
        tickInterval: 650,
        minorTickInterval: 0.2,
        type: 'linear',
        title: {
          text: "Time/min"
        }
      },
      yAxis: [{
        title: {
          text: "Temp./\u00b0C"
        }
      },
      {
        title: {
          text: 'Values'
        },
        opposite: true
      }],
      // tooltip: {
      //   valueSuffix: ' (1000 MT)'
      // },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1
          },
          lineWidth: 4,
        }
      },
      series: [
        {
          type: 'spline',
          data: this.curve["Temp./\u00b0C"].map(item => Number(item)),
          name: "Temp./\u00b0C",
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + "Temp./\u00b0C" + ': <b>' + this.y;
            }
          },
        },
        {
          type: 'spline',
          data: this.curve["DSC/(mW/mg)"].map(item => Number(item)),
          name: "DSC/(mW/mg)",
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + "DSC/(mW/mg)" + ': <b>' + this.y;
            }
          },
          yAxis: 1
        },
        {
          type: 'spline',
          data: this.curve["Sensit./(uV/mW)"].map(item => Number(item)),
          name: "Sensit./(uV/mW)",
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + "Sensit./(uV/mW)" + ': <b>' + this.y;
            }
          },
          yAxis: 1
        },
        {
          type: 'spline',
          data: this.curve["Segment"].map(item => Number(item)),

          name: "Segment",
          tooltip: {
            pointFormatter: function () {
              return '<span style="color:' + this.color + '">\u25CF</span> ' + "Segment" + ': <b>' + this.y;
            }
          },
          yAxis: 1
        },
      ]
    };
    this.showOrNot = true
  }
}
