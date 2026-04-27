import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LocationService } from '../../services/location-service';
import { NewHousingLocation } from '../../models/housing-location-info';
import { A11yModule } from '@angular/cdk/a11y';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule, A11yModule],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
  host: {
    '(document:keydown.escape)': 'onEsc()',
  },
})
export class LocationForm {
  shouldShowPanel = signal<boolean>(false);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  editingId: number | null = null;
  locationService = inject(LocationService);
  location = inject(Location);

  homeForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    city: ['', [Validators.required, Validators.minLength(2)]],
    state: [''],
    photo: ['', Validators.required],
    availableUnits: [0],
    wifi: [false],
    laundry: [false],
  });

  ngOnInit() {
    this.showPanel();
    const id =
      this.activatedRoute.snapshot.paramMap.get('id') ??
      this.activatedRoute.snapshot.parent?.paramMap.get('id');
    if (id != null) {
      this.editingId = Number(id);
      const location = this.locationService.getLocationForId(this.editingId);
      if (location) {
        this.homeForm.patchValue(location);
      }
    }
  }

  private previousBodyOverflow = '';

  private setPanelState(open: boolean) {
    if (open) {
      this.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = this.previousBodyOverflow;
    }
  }

  showPanel() {
    this.shouldShowPanel.set(true);
    this.setPanelState(true);
  }

  hidePanel() {
    this.shouldShowPanel.set(false);
    this.setPanelState(false);
    this.editingId = null;
    // this.location.back();
  }

  //routing happen after the transition end
  onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'transform' && !this.shouldShowPanel()) {
      this.location.back();
    }
  }

  onSubmit() {
    const formValue: NewHousingLocation = this.homeForm.value as NewHousingLocation;
    if (this.editingId !== null) {
      if (this.homeForm.dirty) this.locationService.updateLocation(this.editingId, formValue);
    } else {
      this.locationService.addLocation(formValue);
    }
    this.hidePanel();
  }

  handleClose() {
    if (this.homeForm.dirty) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close?',
      );
      if (confirmClose) {
        this.hidePanel();
      }
    } else {
      this.hidePanel();
    }
  }

  //esc
  onEsc() {
    if (this.shouldShowPanel()) {
      this.handleClose();
    }
  }

  //   handleTab(event: KeyboardEvent) {
  //   const focusable = this.el.nativeElement.querySelectorAll(
  //     'button, input, select, textarea, a[href]'
  //   );

  //   const first = focusable[0];
  //   const last = focusable[focusable.length - 1];

  //   if (event.shiftKey && document.activeElement === first) {
  //     (last as HTMLElement).focus();
  //     event.preventDefault();
  //   }

  //   if (!event.shiftKey && document.activeElement === last) {
  //     (first as HTMLElement).focus();
  //     event.preventDefault();
  //   }
  // }
}
