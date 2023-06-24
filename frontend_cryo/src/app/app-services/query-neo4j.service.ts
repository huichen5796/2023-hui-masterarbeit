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

  queryTest(cypher: string): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${backendUrl}/freeQueryCryo/${cypher}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  queryTestCpa(cypher: string): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${backendUrl}/freeQueryCpa/${cypher}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }
}
