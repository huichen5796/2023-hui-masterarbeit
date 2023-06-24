import { Component } from '@angular/core';
import { ConnectTestService } from '../app-services';

@Component({
  selector: 'app-unit-backend-check',
  templateUrl: './unit-backend-check.component.html',
  styleUrls: ['./unit-backend-check.component.css']
})
export class UnitBackendCheckComponent {
  checkItems: { [key: string]: 'pending' | 'success' | 'error' | 'exists' } =
    {
      'backendConnection': 'pending',
      'dataStoreExistence': 'pending',
      'dataStoreIntegrityCpa': 'pending',
      'dataStoreIntegrityExp': 'pending',
      'dataStoreIntegrityPredata': 'pending',
      'dataStoreIntegrityPostdata': 'pending',
      'dataStoreIntegrityProcess': 'pending'
    }


  constructor(
    private connectTestService: ConnectTestService
  ) {
    this.connectTestService.testBackend().then((rep) => {
      this.checkItems['backendConnection'] = rep
    })
    this.connectTestService.testDataStore().then((rep) => {
      this.checkItems['dataStoreExistence'] = rep
    })
    this.connectTestService.testDataStoreFile('cpa').then((rep) => {
      this.checkItems['dataStoreIntegrityCpa'] = rep
    })
    this.connectTestService.testDataStoreFile('exp').then((rep) => {
      this.checkItems['dataStoreIntegrityExp'] = rep
    })
    this.connectTestService.testDataStoreFile('pre_data').then((rep) => {
      this.checkItems['dataStoreIntegrityPredata'] = rep
    })
    this.connectTestService.testDataStoreFile('post_data').then((rep) => {
      this.checkItems['dataStoreIntegrityPostdata'] = rep
    })
    this.connectTestService.testDataStoreFile('process').then((rep) => {
      this.checkItems['dataStoreIntegrityProcess'] = rep
    })
  }
}
