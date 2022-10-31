import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.css']
})
export class TemplatePageComponent implements OnInit {

  term: any;
  p: any;
  formFieldHelpers: string[] = [''];
  adding: any;
  data: any;
  navigation: any;
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   currentYear: any;
   email: any;
   user: any;

   constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _dataService: DataService,
    private _formBuilder: UntypedFormBuilder
) { }

  ngOnInit(): void {
    this._activatedRoute.data.subscribe(({ 
      data, menudata, userdata })=> { 
        this.data=data;
        if (this.data.user.force_logout>0) {
          localStorage.removeItem('uid');
          this._router.navigate(['/forced-off',this.data.user.force_logout]);
      }
        this.user=userdata;
        this.navigation=menudata
        console.log(data)
    }) 
  }
  postForm() {
    this._dataService.postForm("post-add-org", this.data).subscribe((data:any)=>{
      if (data.error_code=="0") {
        this._router.navigate(['/org-dashboard',data.id])
      } else {     
//            this.error=data.error_message
      }
    });
  }

}