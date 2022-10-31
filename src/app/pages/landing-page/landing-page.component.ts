import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.source/data.source.module';
import { UntypedFormBuilder } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgLocalization } from '@angular/common';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  p: any;
  formFieldHelpers: string[] = [''];
  adding: any;
  data: any;
  menu: any;
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
      this.menu=menudata;
      this.user=userdata;
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