import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-facility-info',
  templateUrl: './facility-info.component.html',
  styleUrls: ['./facility-info.component.css']
})
export class FacilityInfoComponent implements OnInit {

  url: any;
  loading: string = 'N';
  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
  }

}