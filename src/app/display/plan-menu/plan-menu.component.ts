import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-plan-menu',
  templateUrl: './plan-menu.component.html',
  styleUrls: ['./plan-menu.component.css']
})
export class PlanMenuComponent implements OnInit {
  url: any;
  loading: string = 'N';

  @Input() data: any;
  constructor() { }

  ngOnInit(): void {
    console.log(this.data)
  }

  buttonPressed(value: string) {
      this.buttonClicked.emit(value);
  }

  uploadPhoto() {
    this.buttonClicked.emit('UPLOAD')
  }

  buttonClick(n: string) {
    // One of the top buttons is click. The 'value' field is 
    // returned to the parent component.
    this.buttonClicked.emit(n);
 }

 editClick(m: any) {
   // An edit button in the list was clicked. The record (m) is
   // returned to the parent component.
   this.editClicked.emit(m);
}

 @Output()
 buttonClicked: EventEmitter<string> = new EventEmitter<string>(); 

 @Output()
 editClicked: EventEmitter<string> = new EventEmitter<any>(); 

}