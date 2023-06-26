import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from '../app-config';

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

  feedNeo4j(data_type: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process', file_name: string): Promise<string> {
    var promise = new Promise<string>((resolve, reject) => {
      this.http.get(`${backendUrl}/feedInNeo/?data_type=${data_type}&file_name=${file_name}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }
}
