import { Component, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { errorMonitor } from 'events';

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
  term: any;
  loading: string = 'N';
  list: any;

  format: any = {
    title: "Data Source List",
    search: "Y",
    pagination: "Y",
    pagesize: 300,
    class: "table table-responsive table-striped table-bordered border-primary",
    style: "",
    columns: [
      {
        type: "data",
        class: "p-2",
        style: "",
        title: "TAG",
        value: "TAG",
      },
      {
        type: "data",
        class: "p-2",
        style: "",
        title: "Description",
        value: "DATA_NAME",
      },
      {
        type: "data",
        class: "p-2",
        style: "",
        title: "Source",
        value: "DATA_SOURCE",
      },
      {
        type: "data",
        class: "p-2",
        style: "",
        title: "Field",
        value: "DATA_FIELD_ID",
      },
      {
        type: "data",
        class: "p-2",
        style: "max-width: 80px!important;",
        title: "Derived",
        value: "DERIVED",
      },
      {
        type: "button",
        class: "btn btn-primary",
        style: "",
        title: "Edit",
        value: "",
      }
    ],
    buttons: [
      {
        class: "btn btn-primary",
        title: "Add Data Source",
        value: "Y"
      }]
    };

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: UntypedFormBuilder,
    public http: HttpClient  // used by upload
) { }

getLoading(d: string) {
  this.loading=d;
}

showAdd() {
  if (this.adding=='Y') {
    this.adding='N';
  } else {
    this.adding='Y';
  }
}

editClicked(m: any) {
  this.data.formData['ID']=m.ID;
  this.data.formData['TAG']=m.TAG;
  this.data.formData['DATA_SOURCE']=m.DATA_SOURCE;
  this.data.formData['DATA_NAME']=m.DATA_NAME;
  this.data.formData['DATA_FIELD_ID']=m.DATA_FIELD_ID;
  this.data.formData['DERIVED']=m.DERIVED;
  this.adding='Y'
}

buttonClicked(m: string) {
    this.adding='Y';
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
      this.list=data.list;
    }) 

  }

  showHistory() {
    if (this.history=='Y') {
       this.history='N';
    } else {
      this.history='Y'
    }
  }

  processFormClose(e: any) {
    this.adding='N';
  }
  
  processFormComplete(e: any) {
  //  this._router.navigate(['/contacts',this.data.TEMPLATE_ID, this.data.BUILDING_NBR]);
    location.reload();
  }

  postForm() {
    this._dataService.postForm("post-data-source", this.data['formData']).subscribe((data:any)=>{
      if (data.error_code=="0") {
        location.reload();
      } else {     
//       this.error=data.error_message
      }
    });
  }

}
