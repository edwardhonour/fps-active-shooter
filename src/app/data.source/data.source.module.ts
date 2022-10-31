//--
//-- The Data Service communicates with the database API function written in PHP asynchronisly. 
//-- The component or reslover calls a data service function and subscribes to it's results.  
//-- Control is passed back to the component because data retreival is not instant.  
//--
//-- For page navigation the route provider uses resolvers to coordinate the page load.
//-- For queries inside a component, the component subsribes to the results returned from 
//-- the data provider.
//--
//-- HttpClient is the method used.
//--
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

     t: any;
     uid: any;
     url: any;
     un: any;
     role: any;
     production: any;
     localPath: any;
     remotePath: any;
     path: any;

  constructor(private http: HttpClient) {

    //--
    //-- Tell the data service if we are getting data from MIST or a dev server.
    //--
    //-- Change this to Y before builds for MIST.
    //--
    
    this.production='N';
    this.localPath="assets/data/";
    this.remotePath="https://myna-api.com/api/"

    if (this.production=='N') {
        this.path=this.remotePath;
        this.url=this.remotePath+"active-shooter.php";
    } else {
        this.path=this.localPath;
        this.url=this.localPath+"index.php";
    } 
        
  }

  getLocalStorage() {
    //--
    //-- Get the login variables before each API call.
    //--
    if (localStorage.getItem('uid')===null) {
      this.uid="";
    } else {
      this.uid=localStorage.getItem('uid')
    }

    if (localStorage.getItem('un')===null) {
      this.un="";
    } else {
      this.un=localStorage.getItem('un')
    }

    if (localStorage.getItem('role')===null) {
      this.role="";
    } else {
      this.role=localStorage.getItem('role')
    }
  }

  //--
  //-- Queries that return data
  //--
  getData(path: any, id: any, id2: any, id3: any) {
      this.getLocalStorage();
      const data = {
        "q" : path,         //-- Tells the API wh:wat function to call to return data.
        "id": id,           //-- Optional ID (1 of 3)
        "id2": id2,         //-- Optional ID (2 of 3)
        "id3": id3,         //-- Optional ID (3 of 3)
        "uid": this.uid     //-- The logged in USER_ID
      }
      this.t= this.http.post(this.url, data);
      return this.t;
  }

  //--
  //-- Posting data to the database.
  //-- formData contains the form that is sent to the API.
  //--
  postForm(formID: any, formData: any[]) {
    this.getLocalStorage();
    const data = {
      "q" : formID,
      "data": formData,
      "uid": this.uid
    }

    this.t= this.http.post(this.url, data);
    return this.t;

  }

  getVerticalMenu() {
    this.getLocalStorage()
    const data = {
      "q" : "vertical-menu",
      "uid": this.uid,
      "role": this.role
    }

    this.t= this.http.post(this.t=this.path+"fps_menu.php",data);
    return this.t;
 }

  getUser() {
    this.getLocalStorage()
    const data = {
      "q" : "vertical-menu",
      "uid": this.uid,
      "role": this.role
    }

    this.t= this.http.post(this.t=this.path+"fps_user.php",data);
    return this.t;

  }

  postUpload(filedata: any) {
    this.t=this.http.post(this.path+'upload.php',filedata);   
    return this.t;
  }

}