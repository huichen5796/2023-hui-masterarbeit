import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from '../app-config';

@Injectable({
  providedIn: 'root'
})

export class FileTransferService {

  constructor(
    private http: HttpClient,
  ) { }

  fileUpload(selectedFile: File, data_type: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process'): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', selectedFile);
      this.http.post(`${backendUrl}/fileUpload/?data_type=${data_type}`, formData)
        .subscribe((rep: any) => {
          resolve(rep)
        })

    })
    return promise
  }
}
