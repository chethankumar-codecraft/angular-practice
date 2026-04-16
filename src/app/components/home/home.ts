import { Component, inject } from '@angular/core';
import { HousingLocation } from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { MockLocationService } from '../../services/mock-service';
@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
  providers: [{ provide: LocationService, useClass: MockLocationService }],
})
export class Home {
  locationService: LocationService = inject(LocationService);
  

  moveToTop(item: HousingLocationInfo) {
    const filtered = this.locationService.getAllLocations().filter((l) => l.id !== item.id);
    // this.locationService = [item, ...filtered];
  }
}
