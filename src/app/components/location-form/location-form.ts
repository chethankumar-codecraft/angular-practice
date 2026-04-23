import { Component, signal, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LocationService } from '../../services/location-service';
import { NewHousingLocation } from '../../models/housing-location-info';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-location-form',
  imports: [ReactiveFormsModule],
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
    state: ['', Validators.required],
    photo: [''],
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
  showPanel() {
    this.shouldShowPanel.set(true);
  }
  hidePanel() {
    this.shouldShowPanel.set(false);
    this.editingId = null;
    this.location.back();
  }
  onSubmit() {
    const formValue: NewHousingLocation = this.HomeForm.getRawValue();
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
}
