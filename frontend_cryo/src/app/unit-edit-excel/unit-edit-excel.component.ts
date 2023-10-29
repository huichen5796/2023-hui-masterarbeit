import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { CalculatorService, QueryNeo4jService } from '../app-services';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-unit-edit-excel',
  templateUrl: './unit-edit-excel.component.html',
  styleUrls: ['./unit-edit-excel.component.css']
})

export class UnitEditExcelComponent implements OnChanges {
  @Input() experiment!: any
  excelData: any[] = [
    { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'rel. viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rel. circularity', durchmetterpp: 'rel. diameter', viabilityppn: 'norm. rel. viability', recoveried_cellsppn: 'norm. recovery rate', rundheitppn: 'norm. rel. circularity', durchmetterppn: 'norm. rel. diameter' },
  ];
  sortedExcelData: any[] = [
    { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'rel. viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rel. circularity', durchmetterpp: 'rel. diameter', viabilityppn: 'norm. rel. viability', recoveried_cellsppn: 'norm. recovery rate', rundheitppn: 'norm. rel. circularity', durchmetterppn: 'norm. rel. diameter' },
  ]
  sortedResultData: { [key: string]: { [k: string]: [string, string][] } } = {}
  faktor_group: { [key: string]: { [key: string]: [number, number] } } = {}
  vertikal_merge: [number, number][] = []
  showTable: boolean = false
  maxValuePosition: { [key: string]: number[] } = {}
  classColors: { [key: string]: string } = {}
  formControl: string = 'raw';
  statisticalResults: { [key: string]: any } = {}
  exporting:boolean = false
  dict: string[] = ['viabilityppn', 'recoveried_cellsppn', 'rundheitppn', 'durchmetterppn', 'viabilitypp', 'recoveried_cellspp', 'rundheitpp', 'durchmetterpp']
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
  constructor(
    private queryNeo4jService: QueryNeo4jService,
    private calculatorService: CalculatorService,
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['experiment']['currentValue']) {
      this.init()
    }
  }

  initParameters(){
    this.showTable = false
    this.excelData = [
      { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'rel. viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rel. circularity', durchmetterpp: 'rel. diameter', viabilityppn: 'norm. rel. viability', recoveried_cellsppn: 'norm. recovery rate', rundheitppn: 'norm. rel. circularity', durchmetterppn: 'norm. rel. diameter' },
    ];
    this.sortedExcelData = [
      { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'rel. viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rel. circularity', durchmetterpp: 'rel. diameter', viabilityppn: 'norm. rel. viability', recoveried_cellsppn: 'norm. recovery rate', rundheitppn: 'norm. rel. circularity', durchmetterppn: 'norm. rel. diameter' },
    ]
    this.faktor_group = {}
    this.vertikal_merge = []
    this.maxValuePosition = {}
    this.sortedResultData = {}
    this.classColors = {}
    this.formControl = 'raw'
    this.statisticalResults = {}
    this.exporting = false
  }

  init() {
    this.initParameters()
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
            this.statisticalData()
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

  statisticalData() {
    const faktorNames = this.getObjectKeys(this.faktor_group[this.getObjectKeys(this.faktor_group)[0]]).sort((a, b) => a.localeCompare(b))
    faktorNames.forEach((faktor: string) => {
      if (!this.sortedResultData[faktor]) {
        this.sortedResultData[faktor] = {}
        this.dict.forEach(item => this.sortedResultData[faktor][item] = [])
      }

      for (const versuch_id of this.getObjectKeys(this.faktor_group).sort((a, b) => a.localeCompare(b))) {
        this.excelData.slice(this.faktor_group[versuch_id][faktor][0] + 1, this.faktor_group[versuch_id][faktor][1] + 1).forEach((item: any) => {
          this.dict.forEach(itemDict => this.sortedResultData[faktor][itemDict].push([item[itemDict], versuch_id]))
        })
      }
    })
  }

  getAllStatisticalData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let anovaTestPormise: Promise<string>[] = []
      this.dict.forEach((item: string) => {
        var promise = new Promise<string>((resolve, reject) => {
          this.calculatorService.anovaTest(this.getDataToShow(item)).then((res: any) => {
            if (!this.statisticalResults[item]) {
              this.statisticalResults[item] = {}
            }
            this.statisticalResults[item]['anovaTestResult'] = res
            resolve('done')
          })
        })
        anovaTestPormise.push(promise)
      })
      Promise.all(anovaTestPormise).then(() => {
        let buildColumnPromise: Promise<string>[] = []
        this.dict.forEach((item: string) => {
          var promise = new Promise<string>((resolve, reject) => {
            this.calculatorService.buildColumn(this.getDataToShow(item)).then((res: any) => {
              if (!this.statisticalResults[item]) {
                this.statisticalResults[item] = {}
              }
              this.statisticalResults[item]['buildColumn'] = res
              resolve('done')
            })
          })
          buildColumnPromise.push(promise)
        })
        Promise.all(buildColumnPromise).then(() => {
          let childPromise: Promise<string>[] = []
          this.dict.forEach((item: string) => {
            this.getObjectKeys(this.statisticalResults[item]['buildColumn']).forEach((faktor_id: string) => {
              childPromise.push(this.getDrillDownBoxplot(faktor_id, item))
            })
          })

          Promise.all(childPromise).then(() => {
            resolve()
          })
        })
      })
    })
  }

  getDrillDownBoxplot(faktor_id: string, which: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let out: { [k: string]: any } = {}
      this.getDataToShow(which)[faktor_id].forEach((item: [string, string]) => {
        if (!out[item[1]]) {
          out[item[1]] = [item]
        } else {
          out[item[1]].push(item)
        }
      })
      this.calculatorService.buildColumn(out).then((res: any) => {
        this.statisticalResults[which]['buildColumn'][faktor_id]['child'] = res
        resolve('done')
      })
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

  generateSheet(sheetName: string, workbook: ExcelJS.Workbook) {
    const ws = workbook.addWorksheet(this.hash[sheetName])
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
    })

    this.getObjectKeys(this.classColors).forEach((info: string, index: number) => {
      ws.getCell(`G${index + 2}`).value = info
      ws.getCell(`F${index + 2}`).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.classColors[info].replace('#', '') },
      };
    })

    let summeryRow: { [key: string]: any }[] = []
    this.getObjectKeys(this.statisticalResults[sheetName]['buildColumn']).map((faktor_id: string) => {
      return { "factor / trial ID": faktor_id, ...this.statisticalResults[sheetName]['buildColumn'][faktor_id] }
    }).forEach((objFaktor: any) => {
      summeryRow.push(objFaktor)
      this.getObjectKeys(objFaktor['child']).forEach((versuch_id: string) => {
        summeryRow.push({ "factor / trial ID": versuch_id, ...objFaktor['child'][versuch_id] })
      })
    })
    const headers: string[] = this.getObjectKeys(summeryRow[1])
    headers.forEach((header: string, index: number) => {
      ws.getCell(`${String.fromCharCode(73 + index)}2`).value = header
      ws.getCell(`${String.fromCharCode(73 + index)}2`).style.font = { bold: true }
      ws.getCell(`${String.fromCharCode(73 + index)}2`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      summeryRow.forEach((row: any, i: number) => {
        var cell = ws.getCell(`${String.fromCharCode(73 + index)}${i + 3}`)
        cell.value = row[header]
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        if (!row['child']) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: this.classColors[row["factor / trial ID"]].replace('#', '') },
          };
        }
      })
    })

    const annovaResultsHeader: string[] = this.getObjectKeys(this.statisticalResults[sheetName]['anovaTestResult']['Tukey HSD 0.05'][0])
    annovaResultsHeader.forEach((header: string, index: number) => {
      ws.getCell(`${String.fromCharCode(73 + index)}${summeryRow.length + 9}`).value = header
      ws.getCell(`${String.fromCharCode(73 + index)}${summeryRow.length + 9}`).style.font = { bold: true }
      ws.getCell(`${String.fromCharCode(73 + index)}${summeryRow.length + 9}`).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      this.statisticalResults[sheetName]['anovaTestResult']['Tukey HSD 0.05'].forEach((row: any, i: number) => {
        var cell = ws.getCell(`${String.fromCharCode(73 + index)}${i + summeryRow.length + 10}`)
        cell.value = row[header]
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      })
    })

    const alignment = { horizontal: 'center', vertical: 'middle' };
    ws.eachRow((row: any) => {
      row.eachCell((cell: any) => {
        cell.alignment = alignment;
        if (!Array.isArray(cell.value)) {
          const value = parseFloat(cell.value);
          if (!isNaN(value)) {
            cell.value = value;
          }
        }
        else {
          if (cell.value.length === 0) {
            cell.value = ''
          } else if (cell.value.length === 1) {
            cell.value = parseFloat(cell.value[0])
          }
        }

      });
    });
    ws.getCell(`I1`).value = 'Statistical results'
    ws.getCell(`I1`).border = {
      top: { style: 'thick' },
      bottom: { style: 'thick' },
    };
    ws.getCell('I1').alignment = { horizontal: 'left', vertical: 'middle' }
    ws.getCell('I1').style.font = { bold: true }
    ws.mergeCells(`I1:U1`)

    ws.getCell(`I${summeryRow.length + 5}`).value = 'One-Way ANOVA'
    ws.getCell(`I${summeryRow.length + 5}`).border = {
      top: { style: 'thick' },
      bottom: { style: 'thick' },
    };
    ws.getCell(`I${summeryRow.length + 5}`).alignment = { horizontal: 'left', vertical: 'middle' }
    ws.getCell(`I${summeryRow.length + 5}`).style.font = { bold: true }
    ws.mergeCells(`I${summeryRow.length + 5}:K${summeryRow.length + 5}`)

    ws.getCell(`I${summeryRow.length + 6}`).value = 'F-statistic'
    var fCell = ws.getCell(`J${summeryRow.length + 6}`)
    fCell.value = this.statisticalResults[sheetName]['anovaTestResult']['F-statistic']
    fCell.alignment = { horizontal: 'left', vertical: 'middle' }
    ws.mergeCells(`J${summeryRow.length + 6}: K${summeryRow.length + 6}`)

    ws.getCell(`I${summeryRow.length + 7}`).value = 'p-value'
    var pCell = ws.getCell(`J${summeryRow.length + 7}`)
    pCell.value = this.statisticalResults[sheetName]['anovaTestResult']['p-value']
    pCell.alignment = { horizontal: 'left', vertical: 'middle' }
    ws.mergeCells(`J${summeryRow.length + 7}: K${summeryRow.length + 7}`)

    ws.getCell(`I${summeryRow.length + 8}`).value = 'Tukey'
    ws.getCell(`I${summeryRow.length + 8}`).border = {
      top: { style: 'thick' },
      bottom: { style: 'thick' },
    };
    ws.getCell(`I${summeryRow.length + 8}`).alignment = { horizontal: 'left', vertical: 'middle' }
    ws.getCell(`I${summeryRow.length + 8}`).style.font = { bold: true }
    ws.mergeCells(`I${summeryRow.length + 8}:O${summeryRow.length + 8}`)
  }

  generateGraph(ws:ExcelJS.Worksheet, sheetName:string){

  }

  exportToExcel() {
    this.exporting = true
    this.getAllStatisticalData().then(() => {
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

      console.log(this.statisticalResults) //hier build table and column in excel
      this.dict.forEach(task => this.generateSheet(task, workbook))

      workbook.xlsx.writeBuffer().then((data: BlobPart) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.experiment['experiment']['Experiment_ID'].replace(' ', '_')}.xlsx`;
        a.click();
      });
      this.exporting = false
    })
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