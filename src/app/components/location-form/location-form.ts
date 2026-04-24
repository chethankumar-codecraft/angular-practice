import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LocationService } from '../../services/location-service';
import { NewHousingLocation } from '../../models/housing-location-info';
import { A11yModule } from '@angular/cdk/a11y';
import { HostListener } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule, A11yModule],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {
  shouldShowPanel = signal<boolean>(false);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  editingId: number | null = null;
  locationService = inject(LocationService);
  location = inject(Location);

  HomeForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
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
        this.HomeForm.patchValue(location);
      }
    }
  }
  private setPanelState(open: boolean) {
    this.shouldShowPanel.set(open);
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
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
    this.location.back();
  }
  onSubmit() {
    const formValue: NewHousingLocation = this.HomeForm.value as NewHousingLocation;
    if (this.editingId !== null) {
      if (this.HomeForm.dirty) this.locationService.updateLocation(this.editingId, formValue);
    } else {
      this.locationService.addLocation(formValue);
    }
    this.hidePanel();
  }
  handleClose() {
    if (this.HomeForm.dirty) {
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
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.shouldShowPanel()) {
      this.handleClose();
    }
  }
}
