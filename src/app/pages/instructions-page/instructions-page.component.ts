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
  addDTable: any;
  addITable: any;
  showdata: any;
  dt_cols: any;
  dt_source: any;
  dt_tag: any;
  dt_col1_title: any;
  dt_col1_data: any;
  dt_col2_title: any;
  dt_col2_data: any;
  dt_col3_title: any;
  dt_col3_data: any;
  dt_col4_title: any;
  dt_col4_data: any;
  dt_col5_title: any;
  dt_col5_data: any;
  dt_col6_title: any;
  dt_col6_data: any;
  dt_header: any;
  dt_width: any;
  adding_section: any;
  showDataTables: any;
  showDisplayTables: any;
  showQuestions: any;
  addQuestions: any;
  editTitle: any;



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
    this.addDTable='N';
    this.addITable='N';
    this.dt_cols="";
    this.dt_source="";
    this.dt_header="";
    this.dt_width="";
    this.adding_section="";
this.showdata='N';
    this.showDataTables='N';
    this.showDisplayTables='N';
    this.showQuestions='N';
    this.addQuestions='N';
    this.editTitle='N';


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
  
  postDataTable() {
    
    this.data.tableData['TTYPE'] = "DATA";
  
    this._dataService.postForm("post-add-section-table", this.data.tableData).subscribe((data:any)=>{
      if (data.error_code=="0") {
        location.reload();
      } else {     
//            this.error=data.error_message
      }
    });

  }
showEditITable(m: any) {
    this.data.tableData=m;
    this.showITable();
}

editQuestion(m: any) {
     this.data.questionData=m;
//     this.data.questionData['QUESTION']=m.QUESTION;
//     this.data.questionData['DEFAULT_VALUE']=m.DEFAULT_VALUE;
//     this.data.questionData['TAG_NAME']=m.TAG_NAME;
//     this.data.questionData['OPTIONID']=m.OPTIONID;
//     this.data.questionData['QUESTION_TYPE']=m.QUESTION_TYPE;
//     this.data.questionData['CUSTOM_SQL']=m.CUSTOM_SQL;
//     this.data.questionData['DATA_SOURCE']=m.DATA_SOURCE;
     this.showQEditor();   
}

  postQuestion() {
    
    this._dataService.postForm("post-add-section-question", this.data.questionData).subscribe((data:any)=>{
      if (data.error_code=="0") {
        location.reload();
      } else {     
//            this.error=data.error_message
      }
    });

  }

  moveSectionForward() {
    if (confirm("Are you sure you want to move this section forward?")) {
      this._dataService.postForm("move-section-forward", this.data.formData).subscribe((data:any)=>{
         if (data.error_code=="0") {
               location.reload();
          } else {     
  //           this.error=data.error_message
          }
      });
    }
  }

  moveSectionBack() {
    if (confirm("Are you sure you want to move this section backward?")) {
    this._dataService.postForm("move-section-back", this.data.formData).subscribe((data:any)=>{
      if (data.error_code=="0") {
        location.reload();
      } else {     
//            this.error=data.error_message
      }
    });
  }
  }

  showData() {
    if (this.showdata=='N') {
      this.showdata="Y";
    } else {
      this.showdata="N";
    }
  }
  
  postDisplayTable() {
    
    this.data.tableData['TTYPE'] = "DISPLAY";
  
    this._dataService.postForm("post-add-section-table", this.data.tableData).subscribe((data:any)=>{
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

  postSection() {
    let a: any;
    let b: any;

    let payLoad = JSON.stringify(this.form.value);
    a = this.form.get('editorContent')?.value;
    console.log(JSON.stringify(a));
    this.data.formData['JSON'] = JSON.stringify(a);
    this.data.formData['HTML'] = toHTML(a);
  
    this._dataService.postForm("post-add-section", this.data.sectionData).subscribe((data:any)=>{
      if (data.error_code=="0") {
        location.reload();
      } else {     
//            this.error=data.error_message
      }
    });
  }

  showEditor() {
    this.addDTable='N';
    this.addITable='N';
    this.showDataTables='N';
    this.showDisplayTables='N';
    this.showQuestions='N';
    this.addQuestions='N';
      if (this.edit=='N') {
        this.edit="Y";
      } else {
        this.edit="N";
      }
  }

  showQEditor() {
    this.addDTable='N';
    this.addITable='N';
    this.showDataTables='N';
    this.showDisplayTables='N';

      if (this.addQuestions=='N') {
        this.addQuestions="Y";
      } else {
        this.addQuestions="N";
      }
  }

  showQuestionList() {
    this.addDTable='N';
    this.addITable='N';
    this.showDataTables='N';
    this.showDisplayTables='N';

      if (this.showQuestions=='N') {
        this.showQuestions="Y";
      } else {
        this.showQuestions="N";
      }
  }


  showSectionBefore() {
    this.data.sectionData['BEFORE']='BEFORE';
    this.adding_section='N';
      if (this.adding_section=='N') {
        this.adding_section="Y";
      } else {
        this.adding_section="N";
      }
  }

  showSectionAfter() {
    this.data.sectionData['BEFORE']='AFTER';
    this.adding_section='N';
      if (this.adding_section=='N') {
        this.adding_section="Y";
      } else {
        this.adding_section="N";
      }
  }

  showEditTitle() {
      if (this.editTitle=='N') {
        this.editTitle="Y";
      } else {
        this.editTitle="N";
      }
  }

  toggleDisplayTables() {
    this.addDTable='N';
    this.addITable='N';
      if (this.showDisplayTables=='N') {
        this.showDisplayTables="Y";
      } else {
        this.showDisplayTables="N";
      }
  }

  toggleDataTables() {
    this.addDTable='N';
    this.addITable='N';
    if (this.showDataTables=='N') {
      this.showDataTables="Y";
    } else {
      this.showDataTables="N";
    }
}

copyText(val: string, id: any){
  let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    const x = document.getElementById('t'+id);
    x?.classList.add('table-success');
    const y = document.getElementById('zippy');
//      y?.classList.add('table-bordered');

  }


  showIEditor() {
    this.addDTable='N';
    this.addITable='N';
    this.showDataTables='N';
    this.showDisplayTables='N';
    if (this.iedit=='N') {
      this.iedit="Y";
    } else {
      this.iedit="N";
    }
  }

  showDTable() {
    this.edit='N';
    this.iedit='N';
    this.showDataTables='N';
    this.showDisplayTables='N';
    this.data['tableData']['ID']="";
    this.addITable='N';
    if (this.addDTable=='N') {
      this.addDTable="Y";
    } else {
      this.addDTable="N";
    }
  }

  editDTable(m: any) {
    this.edit='N';
    this.iedit='N';
    this.data['tableData']['ID']=m.ID;
    this.addITable='N';
    if (this.addDTable=='N') {
      this.addDTable="Y";
      if (this.data['tableData']['ID']!="") {
      this.data['tableData']['ID']=m.ID;
      this.data['tableData']['TAG']=m.TAG;
      this.data['tableData']['TNAME']=m.TNAME;
      this.data['tableData']['DATA_SOURCE']=m.DATA_SOURCE;
      this.data['tableData']['ROWS']=m.ROWS;
      this.data['tableData']['COLS']=m.COLS;
      this.data['tableData']['HEADER']=m.HEADER;
      this.data['tableData']['BORDER']=m.BORDER;
      this.data['tableData']['WIDTH']=m.WIDTH;
      this.data['tableData']['COL1']=m.COL1;
      this.data['tableData']['COL2']=m.COL2;
      this.data['tableData']['ROW1']=m.ROW1;
      this.data['tableData']['ROW2']=m.ROW2;
      this.data['tableData']['ROW3']=m.ROW3;
      this.data['tableData']['ROW4']=m.ROW4;
      this.data['tableData']['ROW5']=m.ROW5;
      this.data['tableData']['ROW6']=m.ROW6;
      this.data['tableData']['ROW7']=m.ROW7;
      this.data['tableData']['ROW8']=m.ROW8;
      this.data['tableData']['ROW9']=m.ROW9;
      this.data['tableData']['ROW10']=m.ROW10;
      this.data['tableData']['DEFAULT1']=m.DEFAULT1;
      this.data['tableData']['DEFAULT2']=m.DEFAULT2;
      this.data['tableData']['DEFAULT3']=m.DEFAULT3;
      this.data['tableData']['DEFAULT4']=m.DEFAULT4;
      this.data['tableData']['DEFAULT5']=m.DEFAULT5;
      this.data['tableData']['DEFAULT6']=m.DEFAULT6;
      this.data['tableData']['DEFAULT7']=m.DEFAULT7;
      this.data['tableData']['DEFAULT8']=m.DEFAULT8;
      this.data['tableData']['DEFAULT9']=m.DEFAULT9;
      this.data['tableData']['DEFAULT10']=m.DEFAULT10;
      }
    } else {
      this.addDTable="N";
    }
  }

  showITable() {
    this.edit='N';
    this.iedit='N';
    this.addDTable='N';
    if (this.addITable=='N') {
      if (this.data['tableData']['ID']!="") {

      this.data['tableData']['ID']="";
      this.data['tableData']['TAG']="";
      this.data['tableData']['TNAME']="";
      this.data['tableData']['DATA_SOURCE']="";
      this.data['tableData']['ROWS']="";
      this.data['tableData']['COLS']="";
      this.data['tableData']['HEADER']="";
      this.data['tableData']['BORDER']="";
      this.data['tableData']['WIDTH']="";
      this.data['tableData']['COL1']="";
      this.data['tableData']['COL2']="";
      this.data['tableData']['COL3']="";
      this.data['tableData']['COL4']="";
      this.data['tableData']['COL5']="";
      this.data['tableData']['COL6']="";
      this.data['tableData']['COL7']="";
      this.data['tableData']['COL8']="";
      this.data['tableData']['COL9']="";
      this.data['tableData']['COL10']="";
      this.data['tableData']['ROW1']="";
      this.data['tableData']['ROW2']="";
      this.data['tableData']['ROW3']="";
      this.data['tableData']['ROW4']="";
      this.data['tableData']['ROW5']="";
      this.data['tableData']['ROW6']="";
      this.data['tableData']['ROW7']="";
      this.data['tableData']['ROW8']="";
      this.data['tableData']['ROW9']="";
      this.data['tableData']['ROW10']="";
      this.data['tableData']['DEFAULT1']="";
      this.data['tableData']['DEFAULT2']="";
      this.data['tableData']['DEFAULT3']="";
      this.data['tableData']['DEFAULT4']="";
      this.data['tableData']['DEFAULT5']="";
      this.data['tableData']['DEFAULT6']="";
      this.data['tableData']['DEFAULT7']="";
      this.data['tableData']['DEFAULT8']="";
      this.data['tableData']['DEFAULT9']="";
      this.data['tableData']['DEFAULT10']="";
      }
      this.addITable="Y";
    } else {
      this.addITable="N";
    }
  }

  editITable(m: any) {
    this.edit='N';
    this.iedit='N';
    this.addDTable='N';
    if (this.addITable=='N') {
      this.data['tableData']['ID']=m.ID;
      this.data['tableData']['TAG']=m.TAG;
      this.data['tableData']['TNAME']=m.TNAME;
      this.data['tableData']['DATA_SOURCE']=m.DATA_SOURCE;
      this.data['tableData']['ROWS']=m.ROWS;
      this.data['tableData']['COLS']=m.COLS;
      this.data['tableData']['HEADER']=m.HEADER;
      this.data['tableData']['BORDER']=m.BORDER;
      this.data['tableData']['WIDTH']=m.WIDTH;
      this.data['tableData']['COL1']=m.COL1;
      this.data['tableData']['COL2']=m.COL2;
      this.data['tableData']['COL3']=m.COL3;
      this.data['tableData']['COL4']=m.COL4;
      this.data['tableData']['COL5']=m.COL5;
      this.data['tableData']['COL6']=m.COL6;
      this.data['tableData']['COL7']=m.COL7;
      this.data['tableData']['COL8']=m.COL8;
      this.data['tableData']['COL9']=m.COL9;
      this.data['tableData']['COL10']=m.COL10;
      this.data['tableData']['ROW1']=m.ROW1;
      this.data['tableData']['ROW2']=m.ROW2;
      this.data['tableData']['ROW3']=m.ROW3;
      this.data['tableData']['ROW4']=m.ROW4;
      this.data['tableData']['ROW5']=m.ROW5;
      this.data['tableData']['ROW6']=m.ROW6;
      this.data['tableData']['ROW7']=m.ROW7;
      this.data['tableData']['ROW8']=m.ROW8;
      this.data['tableData']['ROW9']=m.ROW9;
      this.data['tableData']['ROW10']=m.ROW10;
      this.data['tableData']['DEFAULT1']=m.DEFAULT1;
      this.data['tableData']['DEFAULT2']=m.DEFAULT2;
      this.data['tableData']['DEFAULT3']=m.DEFAULT3;
      this.data['tableData']['DEFAULT4']=m.DEFAULT4;
      this.data['tableData']['DEFAULT5']=m.DEFAULT5;
      this.data['tableData']['DEFAULT6']=m.DEFAULT6;
      this.data['tableData']['DEFAULT7']=m.DEFAULT7;
      this.data['tableData']['DEFAULT8']=m.DEFAULT8;
      this.data['tableData']['DEFAULT9']=m.DEFAULT9;
      this.data['tableData']['DEFAULT10']=m.DEFAULT10; 
      this.addITable="Y";
    } else {
      this.addITable="N";
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
