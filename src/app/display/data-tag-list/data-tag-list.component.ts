import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-tag-list',
  templateUrl: './data-tag-list.component.html',
  styleUrls: ['./data-tag-list.component.css']
})
export class DataTagListComponent implements OnInit {

  constructor() { }

  @Input() data: any;
  
  ngOnInit(): void {
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

      // function to tell parent component to close the form.
  hideForm() {
    this.formClose.emit('N');
  }

  // returns close message to parent component.
  @Output()
  formClose: EventEmitter<string> = new EventEmitter<string>(); 

  // returns complete message to parent component.
  @Output()
  formComplete: EventEmitter<string> = new EventEmitter<string>(); 

}
