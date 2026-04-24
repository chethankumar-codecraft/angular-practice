import { Routes } from '@angular/router';
import { FormDemo } from '@components/form-demo/form-demo';
import { Home } from '@components/home/home';
import { LinkedSignalDemo } from '@components/linked-signal-demo/linked-signal-demo';
import { LocationForm } from '@components/location-form/location-form';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
    title: 'Home page',
    children: [
      {
        path: 'new',
        component: LocationForm,
        title: 'Edit Location',
      },
      {
        path: ':id/edit',
        component: LocationForm,
        title: 'Edit Location',
      },
    ],
  },
  {
    path: 'details/:id',
    // component: LocationDetails,
    loadComponent: () =>
      import('./components/location-details/location-details').then((m) => m.LocationDetails),
    title: 'Home details',
    children: [
      {
        path: 'edit',
        component: LocationForm,
        title: 'Edit Location',
      },
    ],
  },
  {
    path: 'linked-signal',
    component: LinkedSignalDemo,
    title: 'Linked Signal',
  },
  {
    path: 'forms',
    component: FormDemo,
    title: 'Forms',
  },
];
