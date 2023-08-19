import { AfterViewInit, Component } from '@angular/core';
import { QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-edit-database',
  templateUrl: './unit-edit-database.component.html',
  styleUrls: ['./unit-edit-database.component.css']
})
export class UnitEditDatabaseComponent implements AfterViewInit {
  callBack!: any
  type!: string
  error: { [key: string]: string } = { fileName: '', cpaIndex: '' }

  currentFileName: string = ''
  //only for cpa
  currentType: 'DSC' | 'FTIR' | 'Cryomicroscopy' | 'Osmolality' | 'Viscosity' | string = 'DSC'
  currentCpaIndex: string = ''
  oldSubName: { [key: string]: string } = {}
  currentSubName: { [key: string]: string } = {}
  statusSubName: { [key: string]: string } = {}

  translate: { [k: string]: ("PreData" | "PostData" | "CPA" | "Process") } = {
    "PreData ID": 'PreData',
    "PostData ID": 'PostData',
    "CPA ID": 'CPA',
    "Process ID": 'Process'
  }

  idList: { [key: string]: string[] } = {}

  constructor(
    private queryNeo4jService: QueryNeo4jService
  ) {
    // this.currentFileName = this.callBack['experiment']['Experiment_ID']
  }
  ngAfterViewInit() {
    setTimeout(() => {
      if (this.type === 'Experiment') {
        this.currentFileName = this.callBack['experiment']['Experiment_ID']
        this.callBack['child'].forEach((item: any) => {
          this.oldSubName[item['versuch']['Unique_ID']] = item['versuch']['Versuch_ID']
          this.currentSubName[item['versuch']['Unique_ID']] = item['versuch']['Versuch_ID']
          this.statusSubName[item['versuch']['Unique_ID']] = 'none'
          item['probes'].forEach((sub: any) => {
            this.oldSubName[sub['Unique_ID']] = sub['Sample_ID']
            this.currentSubName[sub['Unique_ID']] = sub['Sample_ID']
            this.statusSubName[sub['Unique_ID']] = 'none'
          })
        })
      }
      else if (this.type === 'CPA') {
        this.currentCpaIndex = this.callBack['cpa']['CPA_ID']
        this.callBack['child'].forEach((item: any) => {
          this.oldSubName[`${item['class']}*-*${item['unique_id']}`] = item['unique_id']
          this.currentSubName[`${item['class']}*-*${item['unique_id']}`] = item['unique_id']
          this.statusSubName[`${item['class']}*-*${item['unique_id']}`] = 'none'
        })
      }
      else if (this.type === 'Process') {
        this.currentFileName = this.callBack['Process_ID']
      }
      else if (this.type === 'PreData' || this.type === 'PostData') {
        this.currentFileName = this.callBack['Sample_ID']
      }
      else {

      }
    }, 0);
  }

  helpCheck(type: string) {
    if (type === 'Experiment') {
      return this.currentFileName === this.callBack['experiment']['Experiment_ID']
    }
    else if (type === 'CPA') {
      return this.currentCpaIndex === this.callBack['cpa']['CPA_ID']
    }
    else if (type === 'Process') {
      return this.currentFileName === this.callBack['Process_ID']
    }
    else {
      return this.currentFileName === this.callBack['Sample_ID']
    }
  }

  checkTheName(type: string, oldName: string, currentName: string) {
    if (this.currentSubName[`${type}*-*${oldName}`] === '') {
      this.statusSubName[`${type}*-*${oldName}`] = 'type2'
    }
    else {
      if (this.oldSubName[`${type}*-*${oldName}`] === this.currentSubName[`${type}*-*${oldName}`]) {
        this.statusSubName[`${type}*-*${oldName}`] = 'none'
      }
      else {
        this.queryNeo4jService.duplicateCheck(type, currentName).then((res) => {
          //if already has, be true
          if (res) {
            this.statusSubName[`${type}*-*${oldName}`] = 'type3'
          } else {
            this.statusSubName[`${type}*-*${oldName}`] = 'none'
          }
        })
      }
    }
  }

  checkTheVersuch(versuchOrProbe:'Versuch' | 'Probe',unique_id: string, currentName: string) {
    if (currentName === '') {
      this.statusSubName[unique_id] = 'type2'
    }
    else {
      let allId: string[] = []
      if (versuchOrProbe === 'Versuch'){
        this.callBack['child'].forEach((versuch: any) => {
        allId.push(versuch['versuch']['Versuch_ID'])
      })
      }
      else{
        this.callBack['child'].forEach((versuch: any) => {
          if (versuch['versuch']['Unique_ID']==`${unique_id.split('*-*')[0]}*-*${unique_id.split('*-*')[1]}`){
            versuch['probes'].forEach((sub: any) => {
            allId.push(sub['Sample_ID'])
          })
          }
          
        })
      }

      if (allId.indexOf(currentName) != -1) {
        this.statusSubName[unique_id] = 'type3'
      }
      else {
        this.statusSubName[unique_id] = 'none'
      }
    }

    if (unique_id.split('*-*').indexOf(currentName) != -1) {
      this.statusSubName[unique_id] = 'none'
    }
  }


  search(data_type: string) {
    if (data_type != 'Sample ID') {
      this.queryNeo4jService.queryOneType(this.translate[data_type]).then((res) => {
        this.idList[data_type] = JSON.parse(res)
        this.idList = { ...this.idList }
      })
    } else {
      this.idList[data_type] = []
      this.idList = { ...this.idList }
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

  parseArray(input: any): boolean {
    try {
      if (Array.isArray(input)) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  emm(input: string) {
    return input + '_ID'
  }

  rename(type: string, orignalName: string, currentName: string) {

  }

  checkFileName(type: string) {
    if (this.currentFileName.includes('/') || this.currentFileName.includes('\\')) {
      this.error['fileName'] = 'type1'
    } else if (this.currentFileName == '') {
      this.error['fileName'] = 'type2'
    } else {
      if (!this.helpCheck(type)) {
        this.queryNeo4jService.duplicateCheck(type, this.currentFileName).then((res) => {
          if (res) {
            this.error['fileName'] = 'type3'
          } else {
            this.error['fileName'] = 'none'
          }
        })
      }
      else {
        this.error['fileName'] = 'none'
      }
    }
  }

  checkCpaIndex() {
    if (this.currentCpaIndex.includes('/') || this.currentCpaIndex.includes('\\') || this.currentCpaIndex.includes('.')) {
      this.error['cpaIndex'] = 'type1'
    } else if (this.currentCpaIndex == '') {
      this.error['cpaIndex'] = 'type2'
    } else {

      if (!this.helpCheck(this.type)) {
        this.queryNeo4jService.duplicateCheck('CPA', this.currentCpaIndex).then((res) => {
          if (res) {
            this.error['cpaIndex'] = 'type3'
          } else {
            this.error['cpaIndex'] = 'none'
          }
        })
      }
      else {
        this.error['cpaIndex'] = 'none'
      }
    }
  }
}
