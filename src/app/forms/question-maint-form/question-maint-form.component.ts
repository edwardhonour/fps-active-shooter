import { Component, OnInit, HostListener, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT, NgLocalization } from '@angular/common';
import { Editor, Toolbar, toHTML, toDoc } from 'ngx-editor';

@Component({
  selector: 'app-question-maint-form',
  templateUrl: './question-maint-form.component.html',
  styleUrls: ['./question-maint-form.component.css']
})
export class QuestionMaintFormComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: UntypedFormBuilder,
    public http: HttpClient  // used by upload
) { }

  ngOnInit(): void {
  }

  showing: string = 'N';
  @Input() data: any;

  postForm() {
    this._dataService.postForm("post-question-maint", this.data['formData']).subscribe((data:any)=>{
      if (data.error_code=="0") {
        location.reload();
      } else {     
//       this.error=data.error_message
      }
    });
  }


  hideForm() {
    alert('going to emit')
    this.formClose.emit('N');
  }

  @Output()
  formClose: EventEmitter<string> = new EventEmitter<string>(); 

  @Output()
  formComplete: EventEmitter<string> = new EventEmitter<string>(); 

}
