import { Component, input, output } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';

@Component({
  selector: 'app-housing-location',
  imports: [],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
})
export class HousingLocation {
  location = input.required<HousingLocationInfo>();
  onLocationClick = output<HousingLocationInfo>();

  handleClick(event: MouseEvent) {
    console.log(event.target);
    console.log(event.type);
    console.log(`${this.location().name} is clicked`);
    this.onLocationClick.emit(this.location());
  }
}
