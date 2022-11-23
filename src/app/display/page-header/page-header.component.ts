import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

  url: any;
  loading: string = 'N';
  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
  }

  doMIST() {
    this.url = new URL(window.location.href);
    const baseUrl = this.url.origin;
    location.href = baseUrl + '/today.asp';
  }
  
  gotoMIST() {
    this.loading='Y';
    this.loadingChanged.emit('Y');
    setTimeout(this.doMIST, 500); 
  }

  @Output()
  loadingChanged: EventEmitter<string> = new EventEmitter<string>(); 

}
