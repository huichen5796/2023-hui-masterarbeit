import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backendUrl, dataStoreName } from '../app-config';

@Injectable({
  providedIn: 'root'
})

export class QueryNeo4jService {

  constructor(
    private http: HttpClient,
  ) { }

  queryTest(db_id: string): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${backendUrl}/connectDatabase/${db_id}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  feedNeo4j(data_type: 'PreData' | 'PostData' | 'CPA' | 'Experiment' | 'Process', file_name: string): Promise<string> {
    var promise = new Promise<string>((resolve, reject) => {
      this.http.get(`${backendUrl}/feedInNeo/?data_type=${data_type}&file_name=${file_name}&data_store=${dataStoreName}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  queryOneType(data_type: 'PreData' | 'PostData' | 'CPA' | 'Experiment' | 'Process'): Promise<string> {
    var promise = new Promise<string>((resolve, reject) => {
      this.http.get(`${backendUrl}/queryOneType/?data_type=${data_type}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  queryOneNode(data_type: 'PreData' | 'PostData' | 'CPA' | 'Experiment' | 'Process', ID: string): Promise<string> {
    var promise = new Promise<string>((resolve, reject) => {
      this.http.get(`${backendUrl}/queryOneNode/?data_type=${data_type}&ID=${ID}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  duplicateCheck(data_type: string, ID: string): Promise<string> {
    var promise = new Promise<string>((resolve, reject) => {
      this.http.get(`${backendUrl}/duplicateCheck/?data_type=${data_type}&ID=${ID}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  queryOneExperiment(ID: string): Promise<string> {
    var promise = new Promise<string>((resolve, reject) => {
      this.http.get(`${backendUrl}/queryOneExperiment/${ID}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  queryOneCPA(ID: string): Promise<string> {
    var promise = new Promise<string>((resolve, reject) => {
      this.http.get(`${backendUrl}/queryOneCPA/${ID}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  buildColumn(pre_data_list: string[], post_data_list: string[], key:string): Promise<string> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify({
      'predata': pre_data_list,
      'postdata': post_data_list,
      'key':key
    });
    var promise = new Promise<string>((resolve, reject) => {
      this.http.post(`${backendUrl}/buildColumn/`, body, {'headers':headers})
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  buildAnovaTable(post_data_list: { [k: string]: string[] }, key:string): Promise<string> {
    const headers = { 'content-type': 'application/json'}  
    const body=JSON.stringify({
      'postdata': post_data_list,
      'key':key
    });
    var promise = new Promise<string>((resolve, reject) => {
      this.http.post(`${backendUrl}/buildAnovaTable/`, body, {'headers': headers})
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }
}
