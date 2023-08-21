import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { QueryNeo4jService } from '../app-services';
import { MatSelect } from '@angular/material/select';
import { cloneDeep } from 'lodash';
import { defaultVersuche, defaultProbe, defaultCpaData } from '../app-config';

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
  defaultCpaData = cloneDeep(defaultCpaData)
  currentCpaItemType: string = ''

  //only for cpa
  currentCpaIndex: string = ''
  oldSubName: { [key: string]: string } = {}
  currentSubName: { [key: string]: string } = {}
  statusSubName: { [key: string]: string } = {}
  pppcDataControler: { [key: string]: { [key: string]: any } } = {}
  pppcDataMemory: { [key: string]: { [key: string]: any } } = {}
  addControler: { [key: string]: any } = {}
  addControlerProbe: { [key: string]: any } = {}

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
      this.key = ''
      this.value = ''
      this.createAttrError = ''
      this.addControler = {}
      this.addControlerProbe = {}
      this.currentCpaItemType = ''
      this.defaultCpaData = cloneDeep(defaultCpaData)
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
            this.pppcDataControler[sub['Unique_ID']] = { PreData_ID: sub['PreData_ID'], PostData_ID: sub['PostData_ID'], Process_ID: sub['Process_ID'], CPA_ID: sub['CPA_ID'] }
          })
        })
        this.pppcDataMemory = cloneDeep(this.pppcDataControler)
      }
      else if (this.type === 'CPA') {
        this.currentCpaIndex = this.callBack['cpa']['CPA_ID']
        this.callBack['child'].forEach((item: any) => {
          this.oldSubName[`${item['class']}*-*${item['unique_id']}`] = item['unique_id']
          this.currentSubName[`${item['class']}*-*${item['unique_id']}`] = item['unique_id']
          this.statusSubName[`${item['class']}*-*${item['unique_id']}`] = 'none'
          this.pppcDataControler[`${item['class']}*-*${item['unique_id']}`] = item['properties']
        })
        this.pppcDataMemory = cloneDeep(this.pppcDataControler)
      }
      else if (this.type === 'Process') {
        this.currentFileName = this.callBack['Process_ID']
        this.pppcDataControler = cloneDeep(this.callBack)
      }
      else if (this.type === 'PreData' || this.type === 'PostData') {
        this.currentFileName = this.callBack['Sample_ID']
        this.pppcDataControler = cloneDeep(this.callBack)
      }
      else {

      }
      console.log(this.pppcDataControler)

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
      if (this.oldSubName[`${type}*-*${oldName}`] === this.currentSubName[`${type}*-*${oldName}`] && this.oldSubName[`${type}*-*${oldName}`]) {
        this.statusSubName[`${type}*-*${oldName}`] = 'none'
      }
      else {
        this.queryNeo4jService.duplicateCheck(type, currentName).then((res) => {
          //if already has, be true\
          if (res) {
            this.statusSubName[`${type}*-*${oldName}`] = 'type3'
          } else {
            this.statusSubName[`${type}*-*${oldName}`] = 'none'
          }
        })
      }
    }
  }

  checkTheVersuch(versuchOrProbe: 'Versuch' | 'Probe', unique_id: string, currentName: string) {
    if (currentName === '') {
      this.statusSubName[unique_id] = 'type2'
    }
    else {
      let allId: string[] = []
      if (versuchOrProbe === 'Versuch') {
        this.callBack['child'].forEach((versuch: any) => {
          allId.push(this.currentSubName[versuch['versuch']['Unique_ID']])
        })
        this.getObjectKeys(this.addControler).forEach((nk) => {
          allId.push(this.addControler[nk]['Versuche ID'])
        })
      }
      else {
        this.callBack['child'].forEach((versuch: any) => {
          if (versuch['versuch']['Unique_ID'] == `${unique_id.split('*-*')[0]}*-*${unique_id.split('*-*')[1]}`) {
            versuch['probes'].forEach((sub: any) => {
              allId.push(this.currentSubName[sub['Unique_ID']])
            })
          }
        })
        this.getObjectKeys(this.addControler).forEach((newVersuch: string) => {
          if (newVersuch == unique_id.split('*-*')[0]) {
            this.getObjectKeys(this.addControler[newVersuch]).forEach((probeKey: string) => {
              if (probeKey != 'Versuche ID') {
                allId.push(this.addControler[newVersuch][probeKey]['Sample ID'])
              }
            })
          }
        })
        this.getObjectKeys(this.addControlerProbe).forEach((toVersuch: string) => {
          if (`${unique_id.split('*-*')[0]}*-*${unique_id.split('*-*')[1]}` == toVersuch) {
            (this.addControlerProbe[toVersuch]).forEach((probe: any) => {
              allId.push(probe['Sample ID'])
            })
          }
        })
      }
      if (allId.filter(item => item === currentName).length != 1) {
        this.statusSubName[unique_id] = 'type3'
      }
      else {
        this.statusSubName[unique_id] = 'none'
      }
      console.log(allId)
    }
  }


  search(data_type: string) {
    data_type = data_type.replace('_', ' ')
    this.queryNeo4jService.queryOneType(this.translate[data_type]).then((res) => {
      this.idList[data_type] = JSON.parse(res)
      this.idList = { ...this.idList }
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

  undo() {
    this.error = { fileName: '', cpaIndex: '' }
    this.idList = {}
    this.ngAfterViewInit()
  }

  arraysAreEqual(arr1: any, arr2: any): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  add(location: string, info: 'Versuche' | 'Attr' | 'Probe' | 'ProbeAtNew' | string) {
    if (info === 'Versuche') {
      this.addControler[`versuch ${this.callBack['child'].length + this.getObjectKeys(this.addControler).length + 1}`] = cloneDeep(defaultVersuche)
      this.statusSubName[`versuch ${this.callBack['child'].length + this.getObjectKeys(this.addControler).length}`] = 'none'
    }
    else if (info === 'Attr') {

    }
    else if (info === 'Probe') {
      if (!this.addControlerProbe[`${location}`]){
        this.addControlerProbe[`${location}`] = []
      }
      this.addControlerProbe[`${location}`].push(cloneDeep(defaultProbe))
    }
    else if (info === 'ProbeAtNew'){
      this.addControler[location][`Probe ${this.getObjectKeys(this.addControler[location]).length}`] = cloneDeep(defaultProbe)
    }
    else {
      if (info){
        if (defaultCpaData[info]) {
        this.addControler[info] = cloneDeep(defaultCpaData[info])
      }
      else {
        this.addControler[info] = {}
      }
      }
      
    }
    this.currentCpaItemType = ''
  }

  getItemCpaList() {
    let list: string[] = []
    this.callBack['child'].forEach((item: any) => {
      list.push(item['class'])
    })
    return this.getObjectKeys(this.addControler).concat(list)
  }
  key:string = ''
  value:string = ''
  createAttrError:string = ''
  addAttributes(body: any, key:string, value:string){
    if (key == '' || value == ''){
      this.createAttrError = 'type2'
    }
    else{
      if (this.getObjectKeys(body).indexOf(key) != -1){
        this.createAttrError = 'type3'
      }
      else{
        this.createAttrError = ''
        body[key] = value
        this.key = ''
        this.value = ''
      }
    }
  }
}
