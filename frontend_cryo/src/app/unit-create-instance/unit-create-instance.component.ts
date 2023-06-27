import { Component, Input, OnInit } from '@angular/core';
import { CpaStructur, OtherStructur } from '../app-config';
import { FileTransferService } from '../app-services';

@Component({
  selector: 'app-unit-create-instance',
  templateUrl: './unit-create-instance.component.html',
  styleUrls: ['./unit-create-instance.component.css']
})
export class UnitCreateInstanceComponent implements OnInit {
  create: boolean = false
  currentFileName: string = ''
  error: { [key: string]: string } = { fileName: '' }

  @Input() defaultData!: CpaStructur | OtherStructur
  @Input() data_type!: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process';

  newFileData!: CpaStructur | OtherStructur

  createdFiles: { file_name: string, result: string, neo4j: string }[] = [];
  dataStoreStatus: 'error' | 'success' | 'pending' = 'pending'

  selectedFiles: { [key: string]: string } = {}

  memory: { [fileName: string]: CpaStructur | OtherStructur } = {}

  constructor(
    private fileTransferService: FileTransferService,
  ) {

  }

  ngOnInit(): void {
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

  }

  feedToDB() {

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
        this.currentFileName = this.currentFileName + '.txt'
        this.memory[this.currentFileName] = this.newFileData
        this.fileTransferService.fileCreate(this.currentFileName, this.data_type, this.newFileData).then((res) => {
          this.createdFiles.push(...(JSON.parse(res.replace(/'/g, '"'))))
          this.selectedFiles[this.currentFileName] = this.createdFiles[this.createdFiles.length - 1]['neo4j']
          this.currentFileName = ''
          this.newFileData = { ...this.defaultData }
          console.log(this.memory)
        })

      }
    } else {
      this.error['fileName'] = 'type2'
    }
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
