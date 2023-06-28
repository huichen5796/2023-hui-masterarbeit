import { Component, Input, OnInit } from '@angular/core';
import { CpaStructur, OtherStructur } from '../app-config';
import { FileTransferService, QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-create-instance',
  templateUrl: './unit-create-instance.component.html',
  styleUrls: ['./unit-create-instance.component.css']
})
export class UnitCreateInstanceComponent implements OnInit {
  currentFileName: string = ''
  error: { [key: string]: string } = { fileName: '' }

  @Input() defaultData!: CpaStructur | OtherStructur
  @Input() data_type!: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process';

  newFileData!: CpaStructur | OtherStructur

  createdFiles: { file_name: string, result: string, neo4j: string }[] = [];

  selectedFiles: { [key: string]: string } = {}

  memory: { [fileName: string]: [CpaStructur | OtherStructur, string[]] } = {}

  deletedItems: string[] = []

  currrentKey: string = ''

  constructor(
    private fileTransferService: FileTransferService,
    private queryNeo4jService:QueryNeo4jService
  ) {

  }

  ngOnInit(): void {
    this.error = { fileName: '' }
    this.createdFiles = []
    this.selectedFiles = {}
    this.memory = {}
    this.deletedItems = []
    this.currentFileName = ''
    this.currrentKey = ''
    this.newFileData = { ...this.defaultData }
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
      this.selectedFiles[event['options'][0]['_value']] = 'waiting'
    } else {
      this.selectedFiles[event['options'][0]['_value']] = 'undo'
    }
  }

  deleteAll() {
    if (confirm(`All about ${this.data_type} that not saved in the database will be lost! Are you sure to continue?`)){
      this.ngOnInit()
    }
  }

  feedToDB() {
    for (var file_name in this.selectedFiles) {
      if (this.selectedFiles[file_name] == 'waiting'){
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
    this.currrentKey = ''
    this.newFileData[this.currrentKey] = ''
    //this.newFileData = {...this.newFileData}
  }

  updateKey() {
    delete this.newFileData['']
    this.newFileData[this.currrentKey] = ''
  }

  checkFileName() {
    if (this.currentFileName.includes('/') || this.currentFileName.includes('\\')) {
      this.error['fileName'] = 'type1'
    } else if (this.currentFileName == '') {
      this.error['fileName'] = 'type2'
    } else {
      this.error['fileName'] = 'none'
    }
  }

  newFile() {
    if (this.currentFileName != '') {
      if (this.error['fileName'] == 'none') {
        delete this.newFileData['']
        if (this.data_type != 'cpa') {
          this.currentFileName = this.currentFileName + '.txt'
        } else {

        }

        this.memory[this.currentFileName] = [{...this.newFileData}, this.deletedItems]

        for (let deletedItem of this.deletedItems) {
          delete this.newFileData[deletedItem]
        }

        this.deletedItems = []
        this.fileTransferService.fileCreate(this.currentFileName, this.data_type, this.newFileData).then((res) => {
          this.createdFiles.push(...(JSON.parse(res.replace(/'/g, '"'))))
          this.selectedFiles[this.currentFileName] = this.createdFiles[this.createdFiles.length - 1]['neo4j']
          this.currentFileName = ''
          this.newFileData = { ...this.defaultData }
        })

      }
    } else {
      this.error['fileName'] = 'type2'
    }
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
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

  undoItem(itemKey: string) {
    if (itemKey == '') {
      this.addNewItem()
    } else {
      if (this.deletedItems.indexOf(itemKey) != -1) {
        this.deletedItems = this.deletedItems.filter(item => item !== itemKey);
      }
    }

  }

  reloadConfigFile() {
    this.newFileData = { ...this.defaultData }
    this.currentFileName = ''
  }

  editCreatedFiles(fileName:string){
    this.newFileData = this.memory[fileName][0]
    this.currentFileName = fileName.split('.')[0]
    this.deletedItems = this.memory[fileName][1]
    delete this.memory[fileName]
    delete this.selectedFiles[fileName]
    this.createdFiles = this.createdFiles.filter(item => item.file_name != fileName)
  }
}
