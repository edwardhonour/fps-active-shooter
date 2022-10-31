import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgLocalization } from '@angular/common';
import { Editor, Toolbar } from 'ngx-editor';

import jsonDoc from '../doc';

@Component({
  selector: 'app-instructions-page',
  templateUrl: './instructions-page.component.html',
  styleUrls: ['./instructions-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class InstructionsPageComponent implements OnInit {

  editordoc = jsonDoc;
  isCopy = false;
  myInput:any;

  @HostListener('click', ['$event.target']) onClick(e: any){
    console.log(e);
    if (this.isCopy) {
      e.innerText = e.innerText + this.myInput
    }
  }

  editor: any;
  editor2: any;
  editor3: any;
  editorContent3: any;
  data: any;
  p: any;
  user: any;
  history:any;
  menu:any;

  html: any;


  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form = new FormGroup({
    editorContent: new FormControl(
      { value: jsonDoc, disabled: false },
    ),
    editorContent2: new FormControl(
      { value: jsonDoc, disabled: false },
    ),
  });

  //get doc(): AbstractControl {
  //  return this.form.get('editorContent');
  //}

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: UntypedFormBuilder,
    public http: HttpClient  // used by upload
) { }

  ngOnInit(): void {
    this.history='N';
    this.editorContent3=jsonDoc;
    this.editor = new Editor();
    this.editor2 = new Editor();
    this.editor3 = new Editor();

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
  
  onChange(html: object) {
 
  }

  doExec() {
    let payLoad = JSON.stringify(this.form.value);
    console.log(payLoad);
  }
}
