import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'loader',
  template: `
  <div class="w-[var(--loader-width,2rem)] h-[var(--loader-width,2rem)] rounded-full border-[var(--loader-b-width,3px)] border-4 border-solid border-x-zinc-400 border-y-transparent animate-loading-rotation"></div>
  `,
})
export class LoaderComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}
}
