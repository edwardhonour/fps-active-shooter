import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT, NgLocalization } from '@angular/common';
import { Editor, Toolbar, toHTML, toDoc } from 'ngx-editor';

@Component({
  selector: 'app-add-building-contact',
  templateUrl: './add-building-contact.component.html',
  styleUrls: ['./add-building-contact.component.css']
})
export class AddBuildingContactComponent implements OnInit {

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

    this.showDataTables='N';
    this.showDisplayTables='N';

    this.editor = new Editor();

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
      console.log(this.data);
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
  
  postAddContact() {
    
    this._dataService.postForm("post-add-contact", this.data.formData).subscribe((data:any)=>{
      if (data.error_code=="0") {
        this._router.navigate(['/contacts',this.data.TEMPLATE_ID,this.data.BUILDING_NBR])
      } else {     
//            this.error=data.error_message
      }
    });

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
      if (this.edit=='N') {
        this.edit="Y";
      } else {
        this.edit="N";
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

  toggleDisplayTables() {
      if (this.adding_section=='N') {
        this.adding_section="Y";
      } else {
        this.adding_section="N";
      }
  }


  showIEditor() {
    this.addDTable='N';
    this.addITable='N';
    if (this.iedit=='N') {
      this.iedit="Y";
    } else {
      this.iedit="N";
    }
  }

  showDTable() {
    this.edit='N';
    this.iedit='N';
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
    } else {
      this.addDTable="N";
    }
  }

  showITable() {
    this.edit='N';
    this.iedit='N';
    this.addDTable='N';
    if (this.addITable=='N') {
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
