import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT, NgLocalization } from '@angular/common';
import { Editor, Toolbar, toHTML, toDoc } from 'ngx-editor';

import jsonDoc from '../doc';

@Component({
  selector: 'app-instructions-page',
  templateUrl: './instructions-page.component.html',
  styleUrls: ['./instructions-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class InstructionsPageComponent implements OnInit {

  //editordoc = jsonDoc;
  isCopy = false;
  myInput:any;

  @HostListener('click', ['$event.target']) onClick(e: any){
    console.log(e);
    if (this.isCopy) {
      e.innerText = e.innerText + this.myInput
    }
  }

  editor: any;
  edit: any;
  iedit: any;
  data: any;
  display: any;
  p: any;
  user: any;
  history:any;
  menu:any;

  section_id: any;

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
      { value: '', disabled: false },
    )
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
    this.edit='N';
    this.iedit='N';
    this.editor = new Editor();

    this._activatedRoute.data.subscribe(({ 
      data })=> { 
        this.data=data;
        console.log(this.data)
        if (this.data.user.force_logout>0) {
          localStorage.removeItem('uid');
          this._router.navigate(['/forced-off',this.data.user.force_logout]);
      }

      this.form.patchValue({ editorContent: data.formData.JSON });
      this.menu=data.sections;
      this.user=data.user;
    }) 
  }
  postInstructions() {
    
    this.data.formData['JSON'] = "";
    this.data.formData['HTML'] = "";
  
    this._dataService.postForm("post-section-instructions", this.data.formData).subscribe((data:any)=>{
      if (data.error_code=="0") {
        location.reload();
      } else {     
//            this.error=data.error_message
      }
    });

  }
  
  postTemplate() {
    let a: any;
    let b: any;

    let payLoad = JSON.stringify(this.form.value);
    a = this.form.get('editorContent')?.value;
    console.log(JSON.stringify(a));
    this.data.formData['JSON'] = JSON.stringify(a);
    this.data.formData['HTML'] = toHTML(a);
  
    this._dataService.postForm("post-section-template", this.data.formData).subscribe((data:any)=>{
      if (data.error_code=="0") {
        location.reload();
      } else {     
//            this.error=data.error_message
      }
    });
  }

  showEditor() {
      if (this.edit=='N') {
        this.edit="Y";
      } else {
        this.edit="N";
      }
  }

  showIEditor() {
    if (this.iedit=='N') {
      this.iedit="Y";
    } else {
      this.iedit="N";
    }

}

  doExec() {
    let a: any;
    let b: any;

    let payLoad = JSON.stringify(this.form.value);
    a = this.form.get('editorContent')?.value;
    let html = toHTML(a);
    console.log(html);

    b = toDoc(html);
    console.log(JSON.stringify(b));

//    let b = JSON.stringify(a);
//    console.log(b);
//    console.log(payLoad);

  //  let h = document.getElementById("editor")?.innerHTML;
  //  let h = document.getElementById("editor")?.querySelector('.ProseMirror')?.innerHTML;
  //  console.log(h);
  }
}
