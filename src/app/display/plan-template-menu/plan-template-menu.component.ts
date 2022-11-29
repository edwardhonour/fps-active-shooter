import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-plan-template-menu',
  templateUrl: './plan-template-menu.component.html',
  styleUrls: ['./plan-template-menu.component.css']
})
export class PlanTemplateMenuComponent implements OnInit {

  url: any;
  loading: string = 'N';

  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
    console.log(this.data)
  }

}