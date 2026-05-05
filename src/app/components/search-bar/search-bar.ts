import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  search = output<string>();

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
