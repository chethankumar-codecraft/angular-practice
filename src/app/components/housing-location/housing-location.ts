import { Component, inject, input, output } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { BASE_URL, LocationService } from '../../services/location-service';

@Component({
  selector: 'app-housing-location',
  imports: [],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
  // providers: [{ provide: BASE_URL, useClass: LocationService }],
})
export class HousingLocation {
  location = input.required<HousingLocationInfo>();
  onLocationClick = output<HousingLocationInfo>();
  locationService = inject(LocationService);
  baseURL = inject(BASE_URL);

  handleClick(event: MouseEvent) {
    console.log(event.target);
    console.log(event.type);
    console.log(this.baseURL);
    console.log(`${this.location().name} is clicked`);
    this.onLocationClick.emit(this.location());
  }

}
