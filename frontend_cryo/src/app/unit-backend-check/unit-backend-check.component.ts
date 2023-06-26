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
  connectionStatus: string = 'pending'
  panelOpenState = false

  constructor(
    private connectTestService: ConnectTestService
  ) {
    this.connectTestService.testBackend().then((rep) => {
      this.checkItems['backendConnection'] = rep
      this.updateStatus()
    })
    this.connectTestService.cleanDataStore().then((rep) => {
      this.checkItems['dataStoreExistence'] = rep
      this.updateStatus()
    })
    this.connectTestService.testDataStoreFile('cpa').then((rep) => {
      this.checkItems['dataStoreIntegrityCpa'] = rep
      this.updateStatus()
    })
    this.connectTestService.testDataStoreFile('exp').then((rep) => {
      this.checkItems['dataStoreIntegrityExp'] = rep
      this.updateStatus()
    })
    this.connectTestService.testDataStoreFile('pre_data').then((rep) => {
      this.checkItems['dataStoreIntegrityPredata'] = rep
      this.updateStatus()
    })
    this.connectTestService.testDataStoreFile('post_data').then((rep) => {
      this.checkItems['dataStoreIntegrityPostdata'] = rep
      this.updateStatus()
    })
    this.connectTestService.testDataStoreFile('process').then((rep) => {
      this.checkItems['dataStoreIntegrityProcess'] = rep
      this.updateStatus()
    })
  }
  updateStatus() {
    const values = Object.values(this.checkItems);

    if (values.includes('pending')) {
      this.connectionStatus = 'pending';
    } else if (values.includes('error')) {
      this.connectionStatus = 'error';
    } else {
      this.connectionStatus = 'success';
    }
  }
}
