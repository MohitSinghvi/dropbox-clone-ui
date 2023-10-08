import { Component } from '@angular/core';
import { FileService } from '../services/file.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  files: any;
  showModal= false;
  loadFileSubscription: any;
  currentDateSortType: any;
  currentNameSortType: any;
  uploadedFileTemp: any;
  newFileDescriptionTemp: any;
  showEdit:any;
  isAdmin = localStorage.getItem('username')=='Admin'?true: false;
  constructor(public fileService: FileService){

  }
  ngOnInit(){
    this.showEdit=[];
    this.loadFiles();
  }

  loadFiles(dateSortType?: any, nameSortType?: any){
    if(this.loadFileSubscription){
      this.loadFileSubscription.unsubscribe();
    }
    this.loadFileSubscription = this.fileService.getFiles(dateSortType, nameSortType, localStorage.getItem('userId')!=null ? localStorage.getItem('userId')! : "").subscribe({
      next: (response: any)=>{
        this.files = response.body;
      },
      error: (error)=>{

      }
    });
  }

  download(file: any){
    this.fileService.download(file.fileName, file.userId ? file.userId : "");
  }

  deleteButtonClicked(file: any){
    let text;
    if (confirm("Are you sure you want to delete the file?") == true) {
      this.delete(file);
    }
  }

  delete(file: any){
    this.fileService.delete(file.fileName, file.userId ? file.userId : "").subscribe({
      next: ()=>{
        alert("File Deleted Successfully!");
        this.loadFiles();

      },
      error:()=>{

      }
    })
  }

  onFileUpload(event: any){

    // const file = event.target.files[0];
    this.uploadedFileTemp = event.target.files[0];
    
  }

  uploadToServer(fileId?: any){
    const file = this.uploadedFileTemp;
    if(file !=null) {
      const username = localStorage.getItem('username')?.split(' ') || '';
      let firstname = '';
      let lastname = '';
      if(username.length>=2){
        firstname = username[0];
        lastname = username[1];
      } else if(username.length == 1){
        firstname = username[0];
      }
      const formData: FormData = new FormData();
      formData.append('file', file, file?.name);
      formData.append('userId', localStorage.getItem('userId')!=null ? localStorage.getItem('userId')! : "");
      formData.append('description', this.newFileDescriptionTemp);
      formData.append('firstname', firstname);
      formData.append('lastname', lastname);
      if(fileId){
        formData.append('fileId', fileId);
      }
      this.fileService.upload(formData).subscribe({
        next: ()=>{
          alert("File uploaded Successfully!");
          this.loadFiles();
          this.newFileDescriptionTemp = '';
        },
        error:()=>{
          // console.log("HIHI");
          alert("File upload failed!");
        }

      })
    } else {
      alert("Please select file");
    }
    
  }

  sortDate(sortType: any){
    if(this.currentDateSortType != sortType){
      if(sortType == 'asc'){

      }
    }
  }

  editClicked(i: number){
    this.showEdit[i] = !this.showEdit[i];
  }
}
