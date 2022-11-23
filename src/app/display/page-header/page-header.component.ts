import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  url: any;
  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
  }

  gotoMIST() {
    this.url = new URL(window.location.href);
    const baseUrl = this.url.origin;
    location.href = baseUrl + '/today.asp';    
  }

}
