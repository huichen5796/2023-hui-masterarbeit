import { Component, Input } from '@angular/core';
import { FileTransferService, ConnectTestService } from '../app-services';

@Component({
  selector: 'app-unit-data-upload',
  templateUrl: './unit-data-upload.component.html',
  styleUrls: ['./unit-data-upload.component.css']
})
export class UnitDataUploadComponent {
  uploadedFiles: { file_name: string, result: string }[] = [];
  @Input() onlyDir!: boolean;
  @Input() allowMultiple!: boolean;
  @Input() allowFolder!: boolean;
  @Input() data_type!: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process';

  dataStoreStatus: 'error' | 'success' | 'pending'  = 'pending'

  selectedFiles:any

  constructor(
    private fileTransferService: FileTransferService,
    private connectTestService: ConnectTestService
  ) {

  }

  ngAfterViewInit() {
    this.connectTestService.cleanDataStoreFile(this.data_type).then((rep)=>{
      this.dataStoreStatus = rep
    })
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.fileTransferService.fileUpload(files, this.data_type).then((res) => {
        this.uploadedFiles = [...this.uploadedFiles, ...(JSON.parse(res.replace(/'/g, '"')))]
        console.log(this.uploadedFiles)
      })
    }
  }

  onSelected(event:any){
    if (event['options'][0]['_selected']){
      console.log('选项已选择:', event['options'][0]['_value'])
    }else{
      console.log('选项已取消选择:', event['options'][0]['_value'])
    }
    
  }
}
