import { Component, inject, input, computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../../services/location-service';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-location-details',
  imports: [RouterOutlet],
  templateUrl: './location-details.html',
  styleUrl: './location-details.css',
})
export class LocationDetails {
  //We need to able to read the id of the location form the window location
  //For that angular can provide us the activated route
  //object,and from it we can get the dynamic param from the url
  route: ActivatedRoute = inject(ActivatedRoute);
  housingLocationId = signal(-1);
  // id=input.required<number>
  locationService: LocationService = inject(LocationService);
  location = computed(() => this.locationService.getLocationForId(this.housingLocationId()));
  router = inject(Router);
  allLocationsList: HousingLocationInfo[] = [];
  locationIndex = -1;

  constructor() {
    LocationDetails.count += 1;
    console.log('The instance number: ', LocationDetails.count);
    // console.log('This id of the location ', this.housingLocationId);
  }
  ngOnInit() {
    console.log('All are ready');
    this.route.params.subscribe((params) => {
      this.housingLocationId.set(Number(params['id']));
      this.allLocationsList = this.locationService
        .getAllLocations()()
        .filter((item) => !item.deleted);
      this.locationIndex = this.allLocationsList.findIndex(
        (item) => item.id === this.housingLocationId(),
      );
      if (!this.location()) {
        this.router.navigate(['/']);
        return;
      }
      //   this.location = this.locationService.getLocationForId(this.housingLocationId);
    });
  }

  ngOnDestroy() {
    LocationDetails.count--;
    console.log('LocationDetails Destroyed');
  }
  static count = 0;

  handlePrev() {
    if (this.locationIndex > 0)
      this.router.navigate(['details', this.allLocationsList[this.locationIndex - 1].id]);
  }
  handleNext() {
    if (this.locationIndex < this.allLocationsList.length - 1)
      this.router.navigate(['details', this.allLocationsList[this.locationIndex + 1].id]);
  }
  handleEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
}
