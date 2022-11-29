import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-section-form',
  templateUrl: './add-section-form.component.html',
  styleUrls: ['./add-section-form.component.css']
})
export class AddSectionFormComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: UntypedFormBuilder,
) { }

  // data variable from parent component.  contactData is used by the form.
  @Input() data: any;

  ngOnInit(): void { }

  postForm() {
    this._dataService.postForm("post-contacts", this.data['contactData']).subscribe((data:any)=>{
      if (data.error_code=="0") {
        //
        // When form is complete return 'Y' to the parent component.
        //
        this.formComplete.emit('Y');
      } else {     
        // this.error=data.error_message
      }
    });
  }

  // function to tell parent component to close the form.
  hideForm() {
    this.formClose.emit('N');
  }

  // returns close message to parent component.
  @Output()
  formClose: EventEmitter<string> = new EventEmitter<string>(); 

  // returns complete message to parent component.
  @Output()
  formComplete: EventEmitter<string> = new EventEmitter<string>(); 

}
