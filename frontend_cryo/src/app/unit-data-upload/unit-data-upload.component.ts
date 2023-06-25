import { Component } from '@angular/core';
import { FileTransferService } from '../app-services';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

@Component({
  selector: 'app-unit-data-upload',
  templateUrl: './unit-data-upload.component.html',
  styleUrls: ['./unit-data-upload.component.css']
})
export class UnitDataUploadComponent {
  TREE_DATA: FoodNode[] = [
    {
      name: 'Fruit',
      children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
    },
    
  ];
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  selectedFile: File | null = null;

  constructor(private fileTransferService: FileTransferService) { this.dataSource.data = this.TREE_DATA; }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  extensionsLow = {
    'pre_data': ['txt', 'csv', 'asc'],
    'post_data': ['txt', 'csv', 'asc'],
    'process': ['txt', 'csv', 'asc'],
    'exp': ['txt', 'csv', 'asc'],
    'cpa': ['txt', 'csv', 'asc'],
  }

  onFileSelected(event: any, data_type: 'pre_data' | 'post_data' | 'cpa' | 'exp' | 'process'): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      if ((this.extensionsLow[data_type]).indexOf(getFileExtension(this.selectedFile.name)) != -1) {
        console.log(`right format: ${getFileExtension(this.selectedFile.name)}`)
      } else {
        console.log('wrong file format')
      }

    } else {
      console.log('nothing selected')
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.fileTransferService.fileUpload(this.selectedFile, 'process').then((res) => { console.log(res) })
    } else {
      console.log('nothing uploaded')
    }
  }
}

function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex === -1) {
    return 'error';
  }
  const extension = fileName.slice(dotIndex + 1).toLowerCase();
  return extension;
}