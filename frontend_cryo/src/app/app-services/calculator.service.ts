import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { backendUrl, dataStoreName } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  constructor(
    private http: HttpClient,
  ) { }

  getMeanAndVariance(dataList: string[]): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${backendUrl}/getMeanAndVariance/${JSON.stringify(dataList)}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }

  anovaTest(data: { [k: string]: string[] }): Promise<any> {
    var promise = new Promise<any>((resolve, reject) => {
      this.http.get(`${backendUrl}/anovaTest/${JSON.stringify(data)}`)
        .subscribe((rep: any) => {
          resolve(rep)
        })
    })
    return promise
  }
}
