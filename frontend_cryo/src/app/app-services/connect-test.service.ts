import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendUrl } from '../app-config';

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
}
