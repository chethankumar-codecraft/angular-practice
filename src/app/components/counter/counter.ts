import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  // templateUrl: './counter.html',
  template: `
    <section>
      @if (this.isEdit()) {
        <input onfocus = "this.select()" (change)="handleInputChange($event)" [value]="value()" />
      } @else {
        <button (click)="handleInputChange($event)">{{ this.value() }}</button>
      }
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </section>
  `,
  styleUrl: './counter.css',
})
export class Counter {
  isEdit = signal(false);
  value = signal(0);
  increment() {
    this.value.update((value) => value + 1);
    this.isEdit.set(false);
  }

  decrement() {
    this.value.update((value) => value - 1);
    this.isEdit.set(false);
  }

  handleInputChange(event: any) {
    if (event.target.tagName === 'INPUT') {
      this.value.set(Number(event.target.value));
    }
    this.isEdit.update((value) => !value);
  }
}
