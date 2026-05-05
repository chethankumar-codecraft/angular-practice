import { Component, inject, signal, computed, linkedSignal } from '@angular/core';
import { HousingLocation } from '@components/housing-location/housing-location';
import { HousingLocationInfo } from '../../models/housing-location-info';
import { BASE_URL, LocationService } from '../../services/location-service';
import { HousingCardView } from '../../models/housing-location-info';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ToastService } from '../../services/toast-service';
import {
  Subject,
  debounceTime,
  switchMap,
  of,
  delay,
  map,
  distinctUntilChanged,
  catchError,
  Observable,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SearchBar } from '@components/search-bar/search-bar';

//View model type

@Component({
  selector: 'app-home',
  imports: [HousingLocation, RouterOutlet, SearchBar],
  templateUrl: './home.html',
  styleUrl: './home.css',
  // providers: [{ provide: LocationService, useClass: LocationService }],
})
export class Home {
  locationService: LocationService = inject(LocationService);
  mode = signal<'normal' | 'edit'>('normal');
  toast = inject(ToastService);
  router = inject(Router);
  http = inject(HttpClient);
  modeString = computed(() =>
    this.mode() === 'normal'
      ? 'Click on a property card to view its details'
      : 'Please select the items to edit',
  );

  activatedRoute = inject(ActivatedRoute);
  baseUrl = inject(BASE_URL);
  search$ = new Subject<string>();

  ngOnInit() {
    this.search$
      .pipe(
        map((v) => v.trim().toLowerCase()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.fakeApiSearch(query).pipe(catchError(() => of([])))),
      )
      .subscribe((results) => {
        this.locationToDisplay.set(results);
      });
  }

  locationToDisplay = linkedSignal<HousingLocationInfo[], HousingCardView[]>({
    source: this.locationService.getAllLocations(),
    computation: (newDependencyHousingLocationInfoArray, prevValue) => {
      const prevLocationViewModels = (prevValue?.value as HousingCardView[]) ?? [];
      const viewLocationModels = newDependencyHousingLocationInfoArray
        .filter((hl) => !hl.deleted)
        .map((hl) => {
          const matchedModel = prevLocationViewModels.find(
            (prevLocation) => prevLocation.id === hl.id,
          );
          return { ...hl, selected: matchedModel?.selected ?? false };
        });
      return viewLocationModels;
    },
  });

  selectedIds = computed(() =>
    this.locationToDisplay()
      .filter((card) => card.selected)
      .map((card) => card.id),
  );

  // selectedIds = signal<number[]>([]);

  handleClick(item: HousingLocationInfo) {
    //If we are in normal then only we need to naviagte
    if (this.mode() === 'normal') this.router.navigate(['details', item.id]);
    else {
      const updated = this.locationToDisplay().map((card) =>
        card.id === item.id ? { ...card, selected: !card.selected } : card,
      );
      this.locationToDisplay.set(updated);
    }
  }
  handleCheck(event: Event) {
    console.log('Checkbox is clicked', (event.target as HTMLInputElement).checked);
    this.mode.update((prev) => (prev === 'normal' ? 'edit' : 'normal'));
    if (this.mode() === 'normal') {
      const reset = this.locationToDisplay().map((card) => ({
        ...card,
        selected: false,
      }));
      this.locationToDisplay.set(reset);
    }
  }
  onDelete() {
    const confirmed = confirm('Are you sure you want to delete selected items?');
    if (!confirmed) return;
    this.locationService.deleteLocationsByIds(this.selectedIds());
    const reset = this.locationToDisplay().map((card) => ({
      ...card,
      selected: false,
    }));
    this.locationToDisplay.set(reset);
    this.toast.show(`🗑️ Selected homes deleted successfully.`);
  }
  onRestore() {
    const confirmed = confirm('Are you sure you want to restore all the deleted items?');
    if (!confirmed) return;
    this.locationService.restoreAllDeletedLocation();
    this.toast.show(`↩️ Homes restored successfully.`);
  }
  handleAddLocation() {
    this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }

  //search
  onSearch(value: string) {
    this.search$.next(value);
  }

  fakeApiSearch(query: string) {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users');
    const all = this.locationService.getAllLocations()();

    const filtered = all
      .filter((hl) => !hl.deleted)
      .filter(
        (hl) =>
          !query ||
          hl.city.toLowerCase().includes(query.toLowerCase()) ||
          hl.name.toLowerCase().includes(query.toLowerCase()),
      )
      .map((hl) => ({
        ...hl,
        selected: false,
      }));

    return of(filtered).pipe(delay(800));
  }
}
