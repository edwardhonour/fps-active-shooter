import { Component, OnInit, HostListener, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-datasource-form',
  templateUrl: './datasource-form.component.html',
  styleUrls: ['./datasource-form.component.css']
})
export class DatasourceFormComponent implements OnInit, OnChanges {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: UntypedFormBuilder,
    public http: HttpClient  // used by upload
) { }

showing: string = 'N';
@Input() data: any;

  ngOnInit(): void {
  }

  // This is required when parent data is used in the form and
  // changes.
  
  ngOnChanges() {
        console.log(this.data)
  }

  postForm() {
    this._dataService.postForm("post-datasource", this.data['formData']).subscribe((data:any)=>{
      if (data.error_code=="0") {
        this.formComplete.emit('X');
      } else {     
//       this.error=data.error_message
      }
    });
  }

  hideForm() {
    this.formClose.emit('N');
  }

  @Output()
  formClose: EventEmitter<string> = new EventEmitter<string>(); 

  @Output()
  formComplete: EventEmitter<string> = new EventEmitter<string>(); 

}
