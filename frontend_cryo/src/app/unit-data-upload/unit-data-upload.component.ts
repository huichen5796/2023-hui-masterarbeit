import { Component, Input } from '@angular/core';
import { FileTransferService } from '../app-services';

@Component({
  selector: 'app-unit-data-upload',
  templateUrl: './unit-data-upload.component.html',
  styleUrls: ['./unit-data-upload.component.css']
})
export class UnitDataUploadComponent {
  uploadedFiles: {file_name:string, result:string}[] = [];
  @Input() onlyDir!: boolean;
  @Input() allowMultiple!: boolean;
  @Input() allowFolder!: boolean;
  @Input() data_type!: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process';

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.fileTransferService.fileUpload(files, this.data_type).then((res) => { this.uploadedFiles = JSON.parse(res.replace(/'/g, '"'))})
    }
  }

  constructor(
    private fileTransferService: FileTransferService
  ) {
    
  }

}
