import { Component, OnInit, HostListener, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT, NgLocalization } from '@angular/common';
import { Editor, Toolbar, toHTML, toDoc } from 'ngx-editor';

@Component({
  selector: 'app-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.css']
})
export class QuestionFormComponent implements OnInit {

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

  postForm() {
    this._dataService.postForm("post-question", this.data['formData']).subscribe((data:any)=>{
      if (data.error_code=="0") {
        location.reload();
      } else {     
//       this.error=data.error_message
      }
    });
  }

  hideForm() {
    this.showingChanged.emit('N');
  }

  @Output()
  showingChanged: EventEmitter<string> = new EventEmitter<string>(); 


}
