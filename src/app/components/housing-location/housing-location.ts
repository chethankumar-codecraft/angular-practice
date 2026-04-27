import { Component, inject, input, output, computed } from '@angular/core';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { BASE_URL, LocationService } from '../../services/location-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-housing-location',
  // standalone: true,
  imports: [],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css',
  // providers: [{ provide: BASE_URL, useClass: LocationService }],
})
export class HousingLocation {
  location = input.required<HousingLocationInfo>();
  locationClick = output<HousingLocationInfo>();
  locationService = inject(LocationService);
  baseURL = inject(BASE_URL);
  selectedLocation = input<boolean>();
  mode = input.required<'normal' | 'edit'>();
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  handleClick(event: MouseEvent) {
    console.log(event.target);
    console.log(event.type);
    console.log(this.baseURL);
    console.log(`${this.location().name} is clicked`);
    this.locationClick.emit(this.location());
  }

  onEdit(event: Event) {
    event.stopPropagation();
    this.router.navigate([this.location().id, 'edit'], {
      relativeTo: this.activatedRoute,
    });
  }
}
