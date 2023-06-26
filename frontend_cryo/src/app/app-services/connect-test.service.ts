import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendUrl, dataStoreName } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class ConnectTestService {

  constructor(
    private http: HttpClient,
  ) { }

  testBackend(): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${backendUrl}/`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  testDataStore(): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${backendUrl}/buildDataStore/${dataStoreName}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  testDataStoreFile(data_type: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process'): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${backendUrl}/buildOneType/?store_name=${dataStoreName}&data_type=${data_type}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  cleanDataStore(): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${backendUrl}/deleteDataStore/${dataStoreName}`)
        .subscribe((rep: any) => {
          if (rep=='success'){
            this.testDataStore().then((rep)=>{
              resolve(rep)
            })
          }
          else{
            resolve('error')
          }
        })
    })
    return promise
  }

  cleanDataStoreFile(data_type: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process'): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${backendUrl}/deleteOneType/?store_name=${dataStoreName}&data_type=${data_type}`)
        .subscribe((rep: any) => {
          if (rep=='success'){
            this.testDataStoreFile(data_type).then((rep)=>{
              resolve(rep)
            })
          }
          else{
            resolve('error')
          }
        })
    })
    return promise
  }
}
