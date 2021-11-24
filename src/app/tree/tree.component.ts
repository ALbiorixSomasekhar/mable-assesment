import { Component, OnInit } from '@angular/core';
import { NodeModel } from '../models/node.model';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent {

  // list of folder structure data
  folderStructureData: NodeModel[] = [];

  // flag to show file or folder card
  showFileOrFolderCard = false;

  // folder or file name that are used to store the data
  fileOrFolderName: string = '';

  // type of item
  itemType: string = '';

  // flag to check if it's a root folder or not
  isRootFolder = false;

  // selected node
  selectedNode;

  // flag to show/hide the selection menu on add item of folder
  showItemTypeSelection = false;

  // id of the selected node that we need when we are adding
  selectedNodeIdForNewFileOrFolder: number;

  // last id that we store in list
  lastAddedId: number = 0;

  constructor() { }

  // add root folder to folder structure data
  addRootFolder() {

    // checking if there is any character than and then we add it to folder structure array
    if (this.fileOrFolderName.trim()) {
      const item: NodeModel = {
        type: "folder",
        name: this.fileOrFolderName,
        children: [],
        id: this.lastAddedId
      };

      this.folderStructureData.push(item);
    }
    this.showFileOrFolderCard = false;
    this.fileOrFolderName = '';
    this.itemType = '';
    this.isRootFolder = false;
  }

  // set the fields when we click on the add new root folder button
  showRootFolder() {
    this.showFileOrFolderCard = true;
    this.itemType = 'folder';
    this.isRootFolder = true;
  }

  // function that add file/folder to the folder structure data
  addFileOrFolder() {
    this.lastAddedId++;
    if (this.isRootFolder) {
      this.addRootFolder();
    } else {
      const element = this.getItemFromData(this.folderStructureData);
      element.children.push({
        type: this.itemType,
        name: this.fileOrFolderName,
        children: [],
        id: this.lastAddedId
      });

    }

    this.showFileOrFolderCard = false;
    this.fileOrFolderName = '';
    this.itemType = '';
    this.isRootFolder = false;
    this.selectedNodeIdForNewFileOrFolder = 0;
  }

  // return the item based on the selected node id for new file/folder
  getItemFromData(data) {
    data.forEach(item => {
      if (item.children && item.children.length > 0) {
        if (item.id === this.selectedNodeIdForNewFileOrFolder) {
          this.selectedNode = item;
          return;
        } else {
          this.getItemFromData(item.children)
        }
      } else {
        if(item.id === this.selectedNodeIdForNewFileOrFolder) {
          this.selectedNode = item
          return;
        }
      }
    })
    return this.selectedNode;
  }

  // reset all the fields on remove of new file/folder card
  removeFileOrFolder() {
    this.showFileOrFolderCard = false;
    this.itemType = '';
    this.isRootFolder = false;
    this.fileOrFolderName = '';
  }

  // show file/folder card after selection of any
  showAddFileOrFolderCard(itemType: string = 'folder') {
    this.itemType = itemType;
    this.showItemTypeSelection = false;
    this.showFileOrFolderCard = true;
  }

  // function that remove item from an array of folder structure data
  removeItem(folderStructureItem) {
    this.selectedNodeIdForNewFileOrFolder = folderStructureItem.id;

    this.folderStructureData.forEach((element, index) => {
        if (element.id === this.selectedNodeIdForNewFileOrFolder) {
          this.folderStructureData.splice(index,1);
          return;
        } else {
          const element = this.getParentItemFromData(this.folderStructureData);
          const index = element.children.find(item => item.id === this.selectedNodeIdForNewFileOrFolder);

          element.children.splice(index, 1);
        }
    });
    this.selectedNodeIdForNewFileOrFolder = 0;
  }

  // get parent item from folder structure data
  getParentItemFromData(data) {

    return data.find(item => {
        if (item.children && item.children.length > 0) {
            return item.id === this.selectedNodeIdForNewFileOrFolder ? true : this.getItemFromData(item.children)
        } else {
            return item.id === this.selectedNodeIdForNewFileOrFolder
        }
    })
  }
}
