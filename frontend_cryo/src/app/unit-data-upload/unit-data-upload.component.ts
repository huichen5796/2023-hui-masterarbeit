import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FileTransferService, ConnectTestService, QueryNeo4jService } from '../app-services';

@Component({
  selector: 'app-unit-data-upload',
  templateUrl: './unit-data-upload.component.html',
  styleUrls: ['./unit-data-upload.component.css']
})
export class UnitDataUploadComponent {
  @ViewChild('fileInput1') fileInput1!: ElementRef;
  @ViewChild('fileInput2') fileInput2!: ElementRef;
  
  uploadedFiles: { file_name: string, result: string, neo4j: string }[] = [];
  @Input() onlyDir!: boolean;
  @Input() allowMultiple!: boolean;
  @Input() allowFolder!: boolean;
  @Input() data_type!: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process';

  dataStoreStatus: 'error' | 'success' | 'pending' = 'pending'

  selectedFiles: {[key:string]:string} = {}
  
  memoryForCpa: {[key:string]:string} = {}

  constructor(
    private fileTransferService: FileTransferService,
    private connectTestService: ConnectTestService,
    private queryNeo4jService:QueryNeo4jService
  ) {

  }

  clearFileInput() {
    if (this.fileInput1 && this.fileInput1.nativeElement) {
      this.fileInput1.nativeElement.value = '';
    }
    if (this.fileInput2 && this.fileInput2.nativeElement) {
      this.fileInput2.nativeElement.value = '';
    }
  }

  ngAfterViewInit() {
    this.connectTestService.cleanDataStoreFile(this.data_type).then((rep) => {
      this.dataStoreStatus = rep
      this.uploadedFiles = []
      this.selectedFiles = {};
      this.clearFileInput()
    })
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.fileTransferService.fileUpload(files, this.data_type).then((res) => {
        this.uploadedFiles = [...this.uploadedFiles, ...(JSON.parse(res.replace(/'/g, '"')))]
        this.uploadedFiles.forEach(file => {
          this.selectedFiles[file.file_name] = file.neo4j
        });
      })
    }
  }

  selectedOrNot(file: { file_name: string, result: string, neo4j: string }){
    if (file.neo4j == 'undo'){
      return false
    }
    else{
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
  deleteAll(){
    if (confirm(`All about ${this.data_type} that not saved in the database will be lost! Are you sure to continue?`)){
      this.ngAfterViewInit()
    }
  }
}
