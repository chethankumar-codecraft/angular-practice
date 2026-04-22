import { Component, inject, signal, computed, linkedSignal } from '@angular/core';
import { HousingLocation } from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { LocationService } from '../../services/location-service';
import { Router } from '@angular/router';
//View model type
type HousingCardVM = HousingLocationInfo & {
  selected: boolean;
};

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  templateUrl: './home.html',
  styleUrl: './home.css',
  // providers: [{ provide: LocationService, useClass: LocationService }],
})
export class Home {
  locationService: LocationService = inject(LocationService);
  mode = signal<'normal' | 'edit'>('normal');
  router = inject(Router);
  modeString = computed(() =>
    this.mode() === 'normal'
      ? 'Click on a property card to view its details'
      : 'Please select the items to edit',
  );
  locations = signal<HousingLocationInfo[]>(this.locationService.getAllLocations());

  cards = linkedSignal<HousingCardVM[]>(() => {
    return this.locations().map((item) => {
      return {
        ...item,
        selected: false,
      };
    });
  });

  selectedIds = computed(() =>
    this.cards()
      .filter((card) => card.selected)
      .map((card) => card.id),
  );

  // selectedIds = signal<number[]>([]);

  handleClick(item: HousingLocationInfo) {
    // const filtered = this.locationService.getAllLocations().filter((l) => l.id !== item.id);
    // this.locationService = [item, ...filtered];

    //If we are in normal then only we need to naviagte
    if (this.mode() === 'normal') this.router.navigate(['details', item.id]);
    else {
      // this.selectedIds.update((prev) =>
      //   prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
      // );
      this.cards.update((prevCards) =>
        prevCards.map((card) => {
          return card.id === item.id ? { ...card, selected: !card.selected } : card;
        }),
      );
    }
  }
  handleCheck(event: Event) {
    console.log('Checkbox is clicked', (event.target as HTMLInputElement).checked);
    this.mode.update((prev) => (prev === 'normal' ? 'edit' : 'normal'));
    if (this.mode() === 'normal')
      this.cards.update((cards) => cards.map((card) => ({ ...card, selected: false })));
  }
  onDelete() {
    const confirmed = confirm('Are you sure you want to delete selected items?');
    if (!confirmed) return;
    this.locationService.deleteLocationsByIds(this.selectedIds());
  }
  onRestore() {
    const confirmed = confirm('Are you sure you want to restore all the deleted items?');
    if (!confirmed) return;
    this.locationService.restoreAllDeletedLocation();
  }
}
