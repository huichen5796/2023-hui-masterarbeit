import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-edit-excel',
  templateUrl: './unit-edit-excel.component.html',
  styleUrls: ['./unit-edit-excel.component.css']
})

export class UnitEditExcelComponent implements OnChanges {
  @Input() experiment!: any
  excelData: any[] = [
    { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rundheit', durchmetterpp: 'durchmetter', viabilityppn: 'viability', recoveried_cellsppn:'recovery rate', rundheitppn: 'rundheit', durchmetterppn: 'durchmetter' },
  ];
  sortedExcelData:any[] = [
    { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rundheit', durchmetterpp: 'durchmetter', viabilityppn: 'viability', recoveried_cellsppn:'recovery rate', rundheitppn: 'rundheit', durchmetterppn: 'durchmetter' },
  ]
  faktor_group: {[key:string]:{[key:string]:[number,number]}} = {}
  vertikal_merge: [number,number][] = []
  showTable:boolean = false
  constructor(
    private queryNeo4jService: QueryNeo4jService,
  ) {
    
  }
  ngOnChanges(changes: SimpleChanges): void {
   if (changes['experiment']['currentValue']){
    this.init()
   }
  }

  init(){
    this.showTable = false
    this.excelData = [
      { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rundheit', durchmetterpp: 'durchmetter', viabilityppn: 'viability', recoveried_cellsppn:'recovery rate', rundheitppn: 'rundheit', durchmetterppn: 'durchmetter' },
    ];
    this.sortedExcelData = [
      { vid: '', preid: '', viabilitypre: 'viability', recoveried_cellspre: 'viable cells', rundheitpre: 'rundheit', durchmetterpre: 'durchmetter', postid: '', viabilitypost: 'viability', recoveried_cellspost: 'viable cells', rundheitpost: 'rundheit', durchmetterpost: 'durchmetter', viabilitypp: 'viability', recoveried_cellspp: 'recovery rate', rundheitpp: 'rundheit', durchmetterpp: 'durchmetter', viabilityppn: 'viability', recoveried_cellsppn:'recovery rate', rundheitppn: 'rundheit', durchmetterppn: 'durchmetter' },
    ]
    this.faktor_group = {}
    this.vertikal_merge = []
    let position: number = 1
    this.experiment['child'].forEach((versuch:any)=>{
      versuch['probes'].forEach((probe:any)=>{
        this.queryNeo4jService.queryTheFourElements(probe['PreData_ID'], probe['PostData_ID']).then((res:any)=>{
          if (!this.faktor_group[versuch['versuch']['Versuch_ID']]){
            this.faktor_group[versuch['versuch']['Versuch_ID']] = {}
          }
          const length = Math.max(probe['PostData_ID'].length, probe['PreData_ID'].length)
          let arrayOfObjects = new Array(length+1).fill(null).map(() => ({ vid: versuch['versuch']['Versuch_ID'], preid: '', viabilitypre: '', recoveried_cellspre: '', rundheitpre: '', durchmetterpre: '', postid: '', viabilitypost: '', recoveried_cellspost: '', rundheitpost: '', durchmetterpost: '', viabilitypp: '', recoveried_cellspp: '', rundheitpp: '', durchmetterpp: '', viabilityppn: '', recoveried_cellsppn:'', rundheitppn: '', durchmetterppn: '' }));
          arrayOfObjects[0]['preid'] = probe['Sample_ID']
          arrayOfObjects[0]['viabilitypre'] = res['average_Viability_(%)_pre']
          arrayOfObjects[0]['recoveried_cellspre'] = res['average_Viable_cells_pre']
          arrayOfObjects[0]['rundheitpre'] = res['average_Average_circularity_pre']
          arrayOfObjects[0]['durchmetterpre'] = res['average_Average_diameter_(microns)_pre']
          probe['PreData_ID'].forEach((predata_id:string, index:number)=>{
            arrayOfObjects[index+1]['preid'] = predata_id
            arrayOfObjects[index+1]['viabilitypre'] = res[predata_id]['Viability_(%)']
            arrayOfObjects[index+1]['recoveried_cellspre'] = res[predata_id]['Viable_cells']
            arrayOfObjects[index+1]['rundheitpre'] = res[predata_id]['Average_circularity']
            arrayOfObjects[index+1]['durchmetterpre'] = res[predata_id]['Average_diameter_(microns)']
          })
          probe['PostData_ID'].forEach((postdata_id:string, index:number)=>{
            arrayOfObjects[index+1]['postid'] = postdata_id
            arrayOfObjects[index+1]['viabilitypost'] = res[postdata_id]['Viability_(%)']
            arrayOfObjects[index+1]['recoveried_cellspost'] = res[postdata_id]['Viable_cells']
            arrayOfObjects[index+1]['rundheitpost'] = res[postdata_id]['Average_circularity']
            arrayOfObjects[index+1]['durchmetterpost'] = res[postdata_id]['Average_diameter_(microns)']
            arrayOfObjects[index+1]['viabilitypp'] = res[postdata_id]['Viability_(%)_relative']
            arrayOfObjects[index+1]['recoveried_cellspp'] = res[postdata_id]['Viable_cells_relative']
            arrayOfObjects[index+1]['rundheitpp'] = res[postdata_id]['Average_circularity_relative']
            arrayOfObjects[index+1]['durchmetterpp'] = res[postdata_id]['Average_diameter_(microns)_relative']
          })
          this.excelData = this.excelData.concat(arrayOfObjects)
          this.faktor_group[versuch['versuch']['Versuch_ID']][probe['Sample_ID']] = [position, position+length]
          position = position + length + 1
          if (this.checkDone()){
            this.sortedExcel()
          }
        })
      })
    })
  }

  checkDone():boolean{
    let length = 0
    this.experiment['child'].forEach((versuch:any)=>{
      length += versuch['probes'].length
    })
    let length_faktor = 0
    this.getObjectKeys(this.faktor_group).forEach((versuch_id:string)=>{
      length_faktor += this.getObjectKeys(this.faktor_group[versuch_id]).length
    })
    
    return length_faktor === length
  }

  sortedExcel(){
    this.getObjectKeys(this.faktor_group).sort((a, b) => a.localeCompare(b)).forEach((versuch_id:string, v_index: number)=>{
      let long: number = 3 
      this.getObjectKeys(this.faktor_group[versuch_id]).sort((a, b) => a.localeCompare(b)).forEach((probe_id:string)=>{
        this.sortedExcelData = this.sortedExcelData.concat(this.excelData.slice(this.faktor_group[versuch_id][probe_id][0],this.faktor_group[versuch_id][probe_id][1]+1))
        long += this.faktor_group[versuch_id][probe_id][1] - this.faktor_group[versuch_id][probe_id][0] - 1
      })
      if (v_index == 0){
        this.vertikal_merge.push([3,long+3])
      } else{
        this.vertikal_merge.push([this.vertikal_merge[v_index-1][1]+1, this.vertikal_merge[v_index-1][1]+1+long])
      }
    })
    this.showTable = true
  }


  exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

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
    this.vertikal_merge.forEach((zone:[number,number])=>{
      worksheet.mergeCells(`A${zone[0]}:A${zone[1]}`)
    })

    const border:any = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    for (let i = 1; i <= (this.sortedExcelData.length+1); i++) {
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

    const alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.eachRow((row:any) => {
      row.eachCell((cell:any) => {
        cell.alignment = alignment;
        const value = parseFloat(cell.value);
        if (!isNaN(value)) {
          cell.value = value;
        }
      });
    });

    workbook.xlsx.writeBuffer().then((data: BlobPart) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.experiment['experiment']['Experiment_ID'].replace(' ','_')}.xlsx`;
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
}
