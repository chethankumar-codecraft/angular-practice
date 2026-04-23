import { Routes } from '@angular/router';
import { FormDemo } from '@components/form-demo/form-demo';
import { Home } from '@components/home/home';
import { LinkedSignalDemo } from '@components/linked-signal-demo/linked-signal-demo';
import { LocationDetails } from '@components/location-details/location-details';

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
  },
  {
    path: 'details/:id',
    // component: LocationDetails,
    loadComponent: () =>
      import('./components/location-details/location-details').then((m) => m.LocationDetails),
    title: 'Home details',
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
