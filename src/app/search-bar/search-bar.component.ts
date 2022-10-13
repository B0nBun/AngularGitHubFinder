import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';


// Компонента с поисковой стрококой
// Изначально она сама изменяла route и добавляла ?query=searchquery
// Но мне кажется делегирование обработки запросов на родителя идея получше


@Component({
  selector: 'search-bar',
  template: `
<div class="search-bar">
  <input list="auto-complete-users" (input)="handleChange()" [(ngModel)]="search" placeholder={{placeholder}} class="search-input" />
  <button (click)="handleSearchQuery()">Find</button>
  <datalist id="auto-complete-users">
    <option *ngFor="let user of autoCompleteUsers" value={{user}}>{{user}}</option>
  </datalist>
</div>
  `,
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  constructor() {}
  
  
  @Input()
  placeholder : string = ""
  @Input()
  autoCompleteUsers : string[] = []
  
  // Custom two-way binding
  @Input()  search !: string
  @Output() searchChange = new EventEmitter<string>()

  @Output()
  searchEvent = new EventEmitter<string>()
  
  handleSearchQuery() {
    this.searchEvent.emit(this.search)
  }

  handleChange() {
    this.searchChange.emit(this.search)
  }
}
