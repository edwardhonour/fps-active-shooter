import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT, NgLocalization } from '@angular/common';
import { Editor, Toolbar, toHTML, toDoc } from 'ngx-editor';

@Component({
  selector: 'app-datasource-list',
  templateUrl: './datasource-list.component.html',
  styleUrls: ['./datasource-list.component.css']
})
export class DatasourceListComponent implements OnInit {

  data: any;
  p: any;
  user: any;
  history:any;
  menu:any;
  adding: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: UntypedFormBuilder,
    public http: HttpClient  // used by upload
) { }

showAdd() {
  console.log("Adding");
  if (this.adding=='Y') {
    this.adding='N';
  } else {
    this.adding='Y';
  }
  console.log(this.adding)
}
  ngOnInit(): void {
    this.adding='N';

    this._activatedRoute.data.subscribe(({ 
      data })=> { 
        this.data=data;
        console.log(this.data)
        if (this.data.user.force_logout>0) {
          localStorage.removeItem('uid');
          this._router.navigate(['/forced-off',this.data.user.force_logout]);
      }
      this.menu=data.sections;
      this.user=data.user;
    }) 

  }

  showHistory() {
    if (this.history=='Y') {
       this.history='N';
    } else {
      this.history='Y'
    }
  }

  postForm() {
    this._dataService.postForm("post-add-template", this.data['formData']).subscribe((data:any)=>{
      if (data.error_code=="0") {
        location.reload();
      } else {     
//       this.error=data.error_message
      }
    });
  }


  //------------------------------
  // Upload Form
  //------------------------------
/*
  file=new FormControl('')
  file_data:any=''

  fileChange(index,event) {
    
    const fileList: FileList = event.target.files;
    //check whether file is selected or not
    if (fileList.length > 0) {

        const file = fileList[0];
        //get file information such as name, size and type
        console.log('finfo',file.name,file.size,file.type);
        //max file size is 8 mb
        if((file.size/1048576)<=8)
        {
          let formData = new FormData();
          formData.append('file', file, file.name);
          formData.append('company_id',this.data.id);
          formData.append('user_id',this.data.user.id);
          formData.append('dsc',this.dsc);
          formData.append('doc_title',this.doc_title);
          this.file_data=formData
          
        }else{
          alert('File size exceeds 8 MB. Please choose less than 8 MB');
        }
        
    }

  }

  ip="https://myna-docs.com/api/"
  
  uploadFile()
    {
      console.log(this.file_data);
      this.http.post(this.ip+'upload.php',this.file_data)
      .subscribe(res => {
        location.reload()
        console.log(res.toString)
      }, (err) => {
      //send error response
      alert('error occured')
    });
    }

    showDoc(id: any) {
      window.open('https://myna-docs.com/?id='+id,'_new')
    }
    */
}
