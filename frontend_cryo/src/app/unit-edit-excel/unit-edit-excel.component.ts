import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { QueryNeo4jService } from '../app-services';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-unit-edit-excel',
  templateUrl: './unit-edit-excel.component.html',
  styleUrls: ['./unit-edit-excel.component.css']
})

export class UnitEditExcelComponent implements OnChanges {
  @Input() experiment!: any
  excelData: any[] = [
    { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rundheit', durchmetterpp: 'durchmetter', viabilityppn: 'viability', recoveried_cellsppn: 'recovery rate', rundheitppn: 'rundheit', durchmetterppn: 'durchmetter' },
  ];
  sortedExcelData: any[] = [
    { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rundheit', durchmetterpp: 'durchmetter', viabilityppn: 'viability', recoveried_cellsppn: 'recovery rate', rundheitppn: 'rundheit', durchmetterppn: 'durchmetter' },
  ]
  sortedResultData: { [key: string]: { [k: string]: [string, string][] } } = {}
  faktor_group: { [key: string]: { [key: string]: [number, number] } } = {}
  vertikal_merge: [number, number][] = []
  showTable: boolean = false
  maxValuePosition: { [key: string]: number[] } = {}
  classColors: { [key: string]: string } = {}
  formControl: string = 'raw';
  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['experiment']['currentValue']) {
      this.init()
    }
  }

  init() {
    this.showTable = false
    this.excelData = [
      { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rundheit', durchmetterpp: 'durchmetter', viabilityppn: 'viability', recoveried_cellsppn: 'recovery rate', rundheitppn: 'rundheit', durchmetterppn: 'durchmetter' },
    ];
    this.sortedExcelData = [
      { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rundheit', durchmetterpp: 'durchmetter', viabilityppn: 'viability', recoveried_cellsppn: 'recovery rate', rundheitppn: 'rundheit', durchmetterppn: 'durchmetter' },
    ]
    this.faktor_group = {}
    this.vertikal_merge = []
    this.maxValuePosition = {}
    this.sortedResultData = {}
    this.classColors = {}
    this.formControl = 'raw'
    let position: number = 1
    this.experiment['child'].forEach((versuch: any) => {
      versuch['probes'].forEach((probe: any) => {
        this.queryNeo4jService.queryTheFourElements(probe['PreData_ID'], probe['PostData_ID']).then((res: any) => {
          if (!this.faktor_group[versuch['versuch']['Versuch_ID']]) {
            this.faktor_group[versuch['versuch']['Versuch_ID']] = {}
          }
          const length = Math.max(probe['PostData_ID'].length, probe['PreData_ID'].length)
          let arrayOfObjects = new Array(length + 1).fill(null).map(() => ({ vid: versuch['versuch']['Versuch_ID'], preid: '', viabilitypre: '', recoveried_cellspre: '', rundheitpre: '', durchmetterpre: '', postid: '', viabilitypost: '', recoveried_cellspost: '', rundheitpost: '', durchmetterpost: '', viabilitypp: '', recoveried_cellspp: '', rundheitpp: '', durchmetterpp: '', viabilityppn: '', recoveried_cellsppn: '', rundheitppn: '', durchmetterppn: '' }));
          arrayOfObjects[0]['preid'] = probe['Sample_ID']
          arrayOfObjects[0]['viabilitypre'] = res['average_Viability_(%)_pre']
          arrayOfObjects[0]['recoveried_cellspre'] = res['average_Total_viable_cells_/_ml_(x_10^6)_pre']
          arrayOfObjects[0]['rundheitpre'] = res['average_Average_circularity_pre']
          arrayOfObjects[0]['durchmetterpre'] = res['average_Average_diameter_(microns)_pre']
          probe['PreData_ID'].forEach((predata_id: string, index: number) => {
            arrayOfObjects[index + 1]['preid'] = predata_id
            arrayOfObjects[index + 1]['viabilitypre'] = res[predata_id]['Viability_(%)']
            arrayOfObjects[index + 1]['recoveried_cellspre'] = res[predata_id]['Total_viable_cells_/_ml_(x_10^6)']
            arrayOfObjects[index + 1]['rundheitpre'] = res[predata_id]['Average_circularity']
            arrayOfObjects[index + 1]['durchmetterpre'] = res[predata_id]['Average_diameter_(microns)']
          })
          probe['PostData_ID'].forEach((postdata_id: string, index: number) => {
            arrayOfObjects[index + 1]['postid'] = postdata_id
            arrayOfObjects[index + 1]['viabilitypost'] = res[postdata_id]['Viability_(%)']
            arrayOfObjects[index + 1]['recoveried_cellspost'] = res[postdata_id]['Total_viable_cells_/_ml_(x_10^6)']
            arrayOfObjects[index + 1]['rundheitpost'] = res[postdata_id]['Average_circularity']
            arrayOfObjects[index + 1]['durchmetterpost'] = res[postdata_id]['Average_diameter_(microns)']
            arrayOfObjects[index + 1]['viabilitypp'] = res[postdata_id]['Viability_(%)_relative']
            arrayOfObjects[index + 1]['recoveried_cellspp'] = res[postdata_id]['Total_viable_cells_/_ml_(x_10^6)_relative']
            arrayOfObjects[index + 1]['rundheitpp'] = res[postdata_id]['Average_circularity_relative']
            arrayOfObjects[index + 1]['durchmetterpp'] = res[postdata_id]['Average_diameter_(microns)_relative']
          })
          this.excelData = this.excelData.concat(arrayOfObjects)
          this.faktor_group[versuch['versuch']['Versuch_ID']][probe['Sample_ID']] = [position, position + length]
          position = position + length + 1
          if (this.checkDone()) {
            this.sortedExcel()
            this.normalize()
            this.statisticalResults()
          }
        })
      })
    })
  }

  getFirstCol(): number[] {
    let out: number[] = []
    this.vertikal_merge.forEach((item: [number, number]) => {
      out.push(item[0])
    })
    return out
  }

  checkDone(): boolean {
    let length = 0
    this.experiment['child'].forEach((versuch: any) => {
      length += versuch['probes'].length
    })
    let length_faktor = 0
    this.getObjectKeys(this.faktor_group).forEach((versuch_id: string) => {
      length_faktor += this.getObjectKeys(this.faktor_group[versuch_id]).length
    })

    return length_faktor === length
  }

  sortedExcel() {
    this.getObjectKeys(this.faktor_group).sort((a, b) => a.localeCompare(b)).forEach((versuch_id: string, v_index: number) => {
      let long: number = 3
      this.getObjectKeys(this.faktor_group[versuch_id]).sort((a, b) => a.localeCompare(b)).forEach((probe_id: string) => {
        this.sortedExcelData = this.sortedExcelData.concat(this.excelData.slice(this.faktor_group[versuch_id][probe_id][0], this.faktor_group[versuch_id][probe_id][1] + 1))
        long += this.faktor_group[versuch_id][probe_id][1] - this.faktor_group[versuch_id][probe_id][0] - 1
      })
      if (v_index == 0) {
        this.vertikal_merge.push([3, long + 3])
      } else {
        this.vertikal_merge.push([this.vertikal_merge[v_index - 1][1] + 1, this.vertikal_merge[v_index - 1][1] + 1 + long])
      }
      this.classColors[versuch_id] = getRandomCoolColor()
    })
    this.showTable = true
  }

  normalize() {
    const oriList: string[] = ['viabilitypp', 'recoveried_cellspp', 'rundheitpp', 'durchmetterpp']
    const taskList: string[] = ['viabilityppn', 'recoveried_cellsppn', 'rundheitppn', 'durchmetterppn']
    oriList.forEach((ori: string, index: number) => {
      this.vertikal_merge.forEach((item: [number, number]) => {
        const start: number = item[0] - 2
        const end: number = item[1] - 2
        let dataList = this.sortedExcelData.slice(start, end + 1).map(obj => obj[ori])
        this.maxNormalize(dataList, ori, taskList[index], start).forEach((aktuell: string, i: number) => {
          this.sortedExcelData[start + i][taskList[index]] = aktuell
        })
      })
    })
  }

  maxNormalize(stringArray: string[], ori: string, task: string, start: number): string[] {
    let max = -Infinity;
    let position: number[] = []
    const floatArray = stringArray.map((str, index) => {
      const num = str === "" ? 0 : parseFloat(str);
      if (num >= max) {
        max = num;
      }
      return num;
    });

    floatArray.forEach((value: number, index: number) => {
      if (value === max) {
        position.push(index + start)
      }
    })
    if (!this.maxValuePosition[ori]) {
      this.maxValuePosition[ori] = position
      this.maxValuePosition[task] = position
    }
    else {
      this.maxValuePosition[ori] = this.maxValuePosition[ori].concat(position)
      this.maxValuePosition[task] = this.maxValuePosition[task].concat(position)
    }


    const normalizedArray = floatArray.map((num) => (num / max) === 0 ? "" : (num / max).toFixed(4).toString());
    return normalizedArray
  }

  statisticalResults() {
    const dict = ['viabilitypp', 'viabilityppn', 'recoveried_cellspp', 'recoveried_cellsppn', 'rundheitpp', 'rundheitppn', 'durchmetterpp', 'durchmetterppn']

    const faktorNames = this.getObjectKeys(this.faktor_group[this.getObjectKeys(this.faktor_group)[0]]).sort((a, b) => a.localeCompare(b))
    faktorNames.forEach((faktor: string) => {
      if (!this.sortedResultData[faktor]) {
        this.sortedResultData[faktor] = {}
        dict.forEach(item => this.sortedResultData[faktor][item] = [])
      }

      for (const versuch_id of this.getObjectKeys(this.faktor_group).sort((a, b) => a.localeCompare(b))) {
        this.excelData.slice(this.faktor_group[versuch_id][faktor][0] + 1, this.faktor_group[versuch_id][faktor][1] + 1).forEach((item: any) => {
          dict.forEach(itemDict => this.sortedResultData[faktor][itemDict].push([item[itemDict], versuch_id]))
        })
      }
    })

  }

  generateSheet(sheetName: string, workbook: ExcelJS.Workbook) {
    const hash: { [k: string]: string } = {
      viabilityppn: 'norm. viability',
      durchmetterppn: 'norm. diameter',
      recoveried_cellsppn: 'norm. recovery rate',
      rundheitppn: 'norm. circularity',
      viabilitypp: 'viability',
      durchmetterpp: 'diameter',
      recoveried_cellspp: 'recovery rate',
      rundheitpp: 'circularity'
    }
    const ws = workbook.addWorksheet(hash[sheetName])
    this.getObjectKeys(this.sortedResultData).forEach((faktorName: string, index: number) => {
      let cell = ws.getCell(`${String.fromCharCode(65 + index)}1`)
      cell.value = faktorName
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      this.sortedResultData[faktorName][sheetName].forEach((data: [string, string], indexData: number) => {
        let cell = ws.getCell(`${String.fromCharCode(65 + index)}${indexData + 2}`)
        cell.value = data[0]
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.classColors[data[1]].replace('#', '') },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      })

      this.getObjectKeys(this.classColors).forEach((info: string, index: number) => {
        ws.getCell(`G${index + 3}`).value = info
        ws.getCell(`F${index + 3}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.classColors[info].replace('#', '') },
        };

      })
    })

    const alignment = { horizontal: 'center', vertical: 'middle' };

    ws.eachRow((row: any) => {
      row.eachCell((cell: any) => {
        cell.alignment = alignment;
        const value = parseFloat(cell.value);
        if (!isNaN(value)) {
          cell.value = value;
        }
      });
    });
  }

  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('raw data');

    worksheet.columns = [
      { header: '', key: 'vid' },
      { header: '', key: 'preid' },
      { header: 'pre data', key: 'viabilitypre' },
      { header: 'pre data', key: 'recoveried_cellspre' },
      { header: 'pre data', key: 'rundheitpre' },
      { header: 'pre data', key: 'durchmetterpre' },
      { header: '', key: 'postid' },
      { header: 'post data', key: 'viabilitypost' },
      { header: 'post data', key: 'recoveried_cellspost' },
      { header: 'post data', key: 'rundheitpost' },
      { header: 'post data', key: 'durchmetterpost' },
      { header: 'post / pre', key: 'viabilitypp' },
      { header: 'post / pre', key: 'recoveried_cellspp' },
      { header: 'post / pre', key: 'rundheitpp' },
      { header: 'post / pre', key: 'durchmetterpp' },
      { header: 'norm. post / pre', key: 'viabilityppn' },
      { header: 'norm. post / pre', key: 'recoveried_cellsppn' },
      { header: 'norm. post / pre', key: 'rundheitppn' },
      { header: 'norm. post / pre', key: 'durchmetterppn' },
    ];

    worksheet.addRows(this.sortedExcelData, "n");

    worksheet.mergeCells('C1:F1');
    worksheet.mergeCells('H1:K1');
    worksheet.mergeCells('L1:O1');
    worksheet.mergeCells('P1:S1');
    this.vertikal_merge.forEach((zone: [number, number]) => {
      worksheet.mergeCells(`A${zone[0]}:A${zone[1]}`)
    })

    const border: any = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    for (let i = 1; i <= (this.sortedExcelData.length + 1); i++) {
      for (let j = 1; j <= this.getObjectKeys(this.sortedExcelData[0]).length; j++) {
        const cell = worksheet.getCell(i, j);

        if ((j >= 3 && j <= 6)) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E2EFDA' },
          };
        } else if (j >= 8 && j <= 11) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C5D9F1' },
          };
        } else if (j >= 12 && j <= 15) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF2CC' },
          };
        } else if (j >= 16 && j <= 19) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FCE4D6' },
          };
        }
        cell.border = border
      }
    }
    const oriList: string[] = ['viabilitypp', 'recoveried_cellspp', 'rundheitpp', 'durchmetterpp']
    const taskList: string[] = ['viabilityppn', 'recoveried_cellsppn', 'rundheitppn', 'durchmetterppn']

    const hash: { [k: string]: string } = {
      viabilitypp: 'L',
      recoveried_cellspp: 'M',
      rundheitpp: 'N',
      durchmetterpp: 'O',
      viabilityppn: 'P',
      recoveried_cellsppn: 'Q',
      rundheitppn: 'R',
      durchmetterppn: 'S'
    }

    oriList.forEach((ori: string, index: number) => {
      this.maxValuePosition[ori].forEach((i) => {
        worksheet.getCell(`${hash[ori]}${i + 2}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DA9694' },
        }
      })

      this.maxValuePosition[taskList[index]].forEach((i) => {
        worksheet.getCell(`${hash[taskList[index]]}${i + 2}`).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'DA9694' },
        }
      })

    })

    const alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.eachRow((row: any) => {
      row.eachCell((cell: any) => {
        cell.alignment = alignment;
        const value = parseFloat(cell.value);
        if (!isNaN(value)) {
          cell.value = value;
        }
      });
    });
    const taskTodoSheet: string[] = ['viabilityppn', 'durchmetterppn', 'recoveried_cellsppn', 'rundheitppn', 'viabilitypp', 'durchmetterpp', 'recoveried_cellspp', 'rundheitpp']
    taskTodoSheet.forEach(task => this.generateSheet(task, workbook))

    workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.experiment['experiment']['Experiment_ID'].replace(' ', '_')}.xlsx`;
      a.click();
    });
  }

  getObjectKeys(obj: any): string[] {
    if (Object.keys(obj).length === 0) {
      return []
    }
    else {
      return Object.keys(obj);
    }
  }

  highlightCell(index: number, key: string): boolean {
    if (this.maxValuePosition[key]) {
      return this.maxValuePosition[key].indexOf(index) != -1
    } else {
      return false
    }
  }

  // getFormValue(): string {
  //   return this.formControl.value ? this.formControl.value : ''
  // }

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