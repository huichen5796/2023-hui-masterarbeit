import { Component, Input, OnInit } from '@angular/core';
import { CpaStructur, CpaValueStructur, ExperimentStructur, OtherStructur, defaultProbe, defaultVersuche } from '../app-config';
import { FileTransferService, QueryNeo4jService } from '../app-services';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-unit-create-instance',
  templateUrl: './unit-create-instance.component.html',
  styleUrls: ['./unit-create-instance.component.css']
})
export class UnitCreateInstanceComponent implements OnInit {
  currentFileName: string = ''
  error: { [key: string]: string } = { fileName: '', cpaIndex: '' }

  @Input() defaultData!: CpaStructur | OtherStructur | ExperimentStructur
  @Input() data_type!: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process';

  newFileData!: any //CpaValueStructur | OtherStructur

  createdFiles: { file_name: string, result: string, neo4j: string }[] = [];

  selectedFiles: { [key: string]: string } = {}

  memory: { [fileName: string]: [CpaValueStructur | OtherStructur | ExperimentStructur, string[], string[]] } = {}

  deletedItems: string[] = []

  deletedItemItems: string[] = []

  currrentKey: string = ''

  //only for cpa
  currentType: 'DSC' | 'FTIR' | 'Cryomicroscopy' | 'Osmolality' | 'Viscosity' | string = 'DSC'
  currentCpaIndex: string = ''

  constructor(
    private fileTransferService: FileTransferService,
    private queryNeo4jService: QueryNeo4jService
  ) {

  }

  ngOnInit(): void {
    this.createdFiles = []
    this.selectedFiles = {}
    this.memory = {}
    this.currentType = 'DSC'
    this.reloadConfigFile()
  }

  selectedOrNot(file: { file_name: string, result: string, neo4j: string }) {
    if (file.neo4j == 'undo') {
      return false
    }
    else {
      return true
    }
  }

  onSelected(event: any) {
    if (event['options'][0]['_selected']) {
      if (this.selectedFiles[event['options'][0]['_value']] == 'undo') {
        this.selectedFiles[event['options'][0]['_value']] = 'waiting'
      }
    } else {
      if (this.selectedFiles[event['options'][0]['_value']] == 'waiting') {
        this.selectedFiles[event['options'][0]['_value']] = 'undo'
      }
    }
  }

  deleteAll() {
    if (confirm(`All about ${this.data_type} that not saved in the database will be lost! Are you sure to continue?`)) {
      this.ngOnInit()
    }
  }

  feedToDB() {
    for (var file_name in this.selectedFiles) {
      if (this.selectedFiles[file_name] == 'waiting') {
        var self = this;
        (function (fileName: string) {
          self.queryNeo4jService.feedNeo4j(self.data_type, fileName).then((res: any) => {
            self.selectedFiles[fileName] = res;
          }).finally(() => {
            self.selectedFiles = { ...self.selectedFiles };
          });
        }).call(this, file_name);
      }
    }
  }

  addNewItem() {
    if (this.data_type != 'exp') {
      this.currrentKey = ''
      this.newFileData[this.currrentKey] = ''
      //this.newFileData = {...this.newFileData}
    } else {
      this.newFileData[`Versuche ${Object.keys(this.newFileData).length + 1}`] = cloneDeep(defaultVersuche)
    }
  }

  addNewItemItems(itemName: string) {
    this.newFileData[itemName][`Probe ${Object.keys(this.newFileData[itemName]).length}`] = cloneDeep(defaultProbe)
  }

  updateKey() {
    delete this.newFileData['']
    this.newFileData[this.currrentKey] = ''
  }

  checkFileName() {

    if (this.currentFileName.includes('/') || this.currentFileName.includes('\\') || this.currentFileName.includes('.')) {
      this.error['fileName'] = 'type1'
    } else if (this.currentFileName == '') {
      this.error['fileName'] = 'type2'
    } else {
      this.error['fileName'] = 'none'
    }
  }

  checkCpaIndex() {
    if (this.currentCpaIndex.includes('/') || this.currentCpaIndex.includes('\\') || this.currentCpaIndex.includes('.')) {
      this.error['cpaIndex'] = 'type1'
    } else if (this.currentCpaIndex == '') {
      this.error['cpaIndex'] = 'type2'
    } else {
      this.error['cpaIndex'] = 'none'
    }
  }

  newFile() {
    if (this.data_type != 'cpa') {
      this.currentCpaIndex = 'default'
    }

    if (this.currentFileName != '' && this.currentCpaIndex != '') {
      if (this.error['fileName'] == 'none') {
        delete this.newFileData['']
        if (this.data_type == 'cpa') {
          this.currentFileName = `${this.currentCpaIndex}/${this.currentType}/${this.currentFileName}.txt`
        }
        else if (this.data_type == 'exp') {
          this.currentFileName = `${this.currentFileName}.json`
        }
        else {
          this.currentFileName = `${this.currentFileName}.txt`
        }

        this.memory[this.currentFileName] = [cloneDeep(this.newFileData), this.deletedItems, this.deletedItemItems]

        for (let deletedItemItem of this.deletedItemItems) {
          const key = deletedItemItem.split('-')[0]
          const probe = deletedItemItem.split('-')[1]
          delete this.newFileData[key][probe]
        }

        for (let deletedItem of this.deletedItems) {
          delete this.newFileData[deletedItem]
        }

        this.deletedItems = []
        this.fileTransferService.fileCreate(this.currentFileName, this.data_type, this.newFileData).then((res) => {
          this.createdFiles = [...this.createdFiles.filter(item => item.file_name !== JSON.parse(res.replace(/'/g, '"'))[0].file_name)]
          this.createdFiles.push(...(JSON.parse(res.replace(/'/g, '"'))))
          this.selectedFiles[this.currentFileName] = this.createdFiles[this.createdFiles.length - 1]['neo4j']
          this.reloadConfigFile()
        })
      }
    } else {
      if (this.currentFileName == '') {
        this.error['fileName'] = 'type2'
      }
      if (this.currentCpaIndex == '') {
        this.error['cpaIndex'] = 'type2'
      }
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

  deleteItem(itemKey: string) {
    if (itemKey == '') {
      delete this.newFileData['']
    } else {
      if (this.deletedItems.indexOf(itemKey) == -1) {
        this.deletedItems.push(itemKey)
        this.deletedItems = [...this.deletedItems]
      }
    }
  }

  deleteItemItems(itemKey: string, itemItem: string) {
    this.deletedItemItems.push(`${itemKey}-${itemItem}`)
    this.deletedItemItems = [...this.deletedItemItems]
  }

  undoItem(itemKey: string) {
    if (itemKey == '') {
      this.addNewItem()
    } else {
      if (this.deletedItems.indexOf(itemKey) != -1) {
        this.deletedItems = this.deletedItems.filter(item => item !== itemKey);
      }
    }
  }

  undoItemItems(itemKey: string, itemItem: string) {
    if (this.deletedItemItems.indexOf(`${itemKey}-${itemItem}`) != -1) {
      this.deletedItemItems = this.deletedItemItems.filter(item => item !== `${itemKey}-${itemItem}`);
    }
  }

  reloadConfigFile() {
    if (this.data_type == 'cpa') {
      this.newFileData = cloneDeep(this.defaultData)[this.currentType]
    }
    else if (this.data_type == 'exp') {
      this.newFileData = cloneDeep(this.defaultData)
    }
    else {
      this.newFileData = { ...this.defaultData }
    }
    this.currentFileName = ''
    this.currentCpaIndex = ''
    this.deletedItems = []
    this.deletedItemItems = []
    this.error = { fileName: '', cpaIndex: '' }
    this.currrentKey = ''
  }

  editCreatedFiles(fileName: string) {
    this.newFileData = this.memory[fileName][0]
    if (this.data_type == 'cpa') {
      this.currentCpaIndex = fileName.split('/')[0]
      this.currentType = fileName.split('/')[1]
      this.currentFileName = fileName.split('/')[2].split('.')[0]
    } else {
      this.currentFileName = fileName.split('.')[0]
    }

    this.deletedItems = this.memory[fileName][1]
    this.deletedItemItems = this.memory[fileName][2]
    delete this.memory[fileName]
    delete this.selectedFiles[fileName]
    this.createdFiles = this.createdFiles.filter(item => item.file_name != fileName)
  }

  onSelecteChips(event: any) {
    this.currentType = event['value']
    if (!this.currentType) {
      this.currentType = 'DSC'
    }
    this.reloadConfigFile()
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }
  toString(value: { [key: string]: [] } | string) {
    return JSON.stringify(value)
  }

  makeIndex(input: string): string {
    return input.replace('Probe ', '')
  }

  translate: { [k: string]: ("PreData" | "PostData" | "CPA" | "Process") } = {
    "PreData ID": 'PreData',
    "PostData ID": 'PostData',
    "CPA ID": 'CPA',
    "Process ID": 'Process'
  }

  idList: { [key: string]: string[] } = {
    "PreData ID": [],
    "PostData ID": [],
    "CPA ID": [],
    "Process ID": []
  }

  search(data_type: string) {
    this.idList[data_type] = []
    if (data_type != 'Sample ID') {
      this.queryNeo4jService.queryOneType(this.translate[data_type]).then((res) => {
        this.idList[data_type] = JSON.parse(res)
        this.idList = {...this.idList}
      })
    } else {
      this.idList[data_type] = []
      this.idList = {...this.idList}
    }
  }

  transformer(itemKey: string, itemItem: string) {
    return `${itemKey}-${itemItem}`
  }
}
