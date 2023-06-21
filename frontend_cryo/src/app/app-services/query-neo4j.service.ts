import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class QueryNeo4jService {

  constructor(
    private http: HttpClient,
  ) { }

  queryTest(cypher: string): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`http://ec2-18-197-31-138.eu-central-1.compute.amazonaws.com:8000/freeQueryCryo/${cypher}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  test(): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`http://ec2-18-197-31-138.eu-central-1.compute.amazonaws.com:8000/`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }
}
