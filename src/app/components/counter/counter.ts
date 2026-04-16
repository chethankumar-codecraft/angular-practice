import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.css',
})
export class Counter {
  value = signal(0);
  increment() {
    this.value.update((value) => value + 1);
  }

  decrement() {
    this.value.update((value) => value - 1);
  }

  handleInputChange(event: any) {
    this.value.set(Number(event.target.value));
  }
}
