import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class FileService {
  // baseUrl = "http://dropbox-autoscale-1-85322424.us-west-1.elb.amazonaws.com:8000/";
  baseUrl = "http://localhost:8000/";
  constructor(public httpClient: HttpClient) {

  }
  download(fileName: any, userId: any){
    window.open(this.baseUrl+'download/'+fileName+'?userId='+userId,"_self");
    // return this.httpClient.get(this.baseUrl+fileName);
  }

  upload(file: any){
    return this.httpClient.post(this.baseUrl+'upload', file);
  }

  delete(fileName: any, userId: any) {
    return this.httpClient.delete(this.baseUrl+'delete/'+fileName+'?userId='+userId);
  }

  getFiles(dateSortType?: any, nameSortType?: any, userId?:any) {
    var appendString = ''
    if(userId!='75c7e7d3-8802-4f36-bb45-bf6407938d6f'){
      appendString += '?userId='+localStorage.getItem('userId');

      //incomplete feature
      if(dateSortType){
        appendString+='&dateSortType='+dateSortType;
      } else if(nameSortType){
        appendString+='&nameSortType='+nameSortType;
      }
    }
    
    return this.httpClient.get(this.baseUrl+'files'+appendString);
  }
}
