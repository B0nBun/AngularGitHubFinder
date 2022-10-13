import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loader',
  template: `
  <div class="loader"></div>
  `,
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
