import { Component, OnInit, HostListener, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})

export class UploadFormComponent implements OnInit, OnChanges {

  index: any;
  dsc: any;
  doc_title: any;

  @Input() data: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: UntypedFormBuilder,
    public http: HttpClient  // used by upload
) { }



  ngOnInit(): void {
  }

  ngOnChanges() {
    console.log(this.data)
  }

  //------------------------------
      // Upload Form
      //------------------------------

      file=new FormControl('')
      file_data:any=''

      fileChange(index: any,event: any) {
        
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
              formData.append('building_nbr',this.data.building.BUILDING_NBR);
              formData.append('user_id',this.data.user.USER_ID);
              formData.append('dsc',this.dsc);
              formData.append('doc_title',this.doc_title);
              this.file_data=formData
              
            }else{
              alert('File size exceeds 8 MB. Please choose less than 8 MB');
            }
            
        }
    
      }
    
      ip="https://myna-docs.com/api/"
      
      uploadFile() {
          this._dataService.postUpload(this.file_data).subscribe((data:any)=>{
          if (data.error_code==0) {
                this.formClose.emit('N');
//                window.open(
//                  "https://myna-docs.com/api/"+data.filename);
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
