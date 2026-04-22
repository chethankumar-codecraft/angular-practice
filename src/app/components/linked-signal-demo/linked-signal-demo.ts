import { Component } from '@angular/core';
import { signal, computed, linkedSignal, effect } from '@angular/core';
import { ShippingSelection } from '@components/shipping-selection/shipping-selection';

@Component({
  selector: 'app-linked-signal-demo',
  templateUrl: './linked-signal-demo.html',
  styleUrl: './linked-signal-demo.css',
  imports: [ShippingSelection],
})
export class LinkedSignalDemo {
  userStatus = signal<'online' | 'away' | 'offline'>('offline');

  // TODO: Create notificationsEnabled computed signal that returns true when status is 'online'
  // notificationEnabled = computed(() => {
  //   return this.userStatus() === 'online';
  // });

  notificationPreference = signal<boolean>(this.userStatus() === 'online');
  // notificationEnabled = computed(() => {
  //   return this.userStatus() === 'online';
  // });

  notificationEffect = effect(() => {
    if (this.userStatus() === 'online') this.notificationPreference.set(true);
    else this.notificationPreference.set(false);
  });
  // TODO: Create statusMessage computed signal that returns appropriate message for each status
  statusMessage = computed(() => {
    const status = this.userStatus();
    switch (status) {
      case 'online':
        return 'Available for meetings and messages';
      case 'away':
        return 'Temporarily away, will respond soon';
      case 'offline':
        return 'Not available, check back later';
      default:
        return 'Status unknown';
    }
  });

  // TODO: Create isWithinWorkingHours computed signal that calculates if user is within working hours

  isWithinWorkingHours = computed(() => {
    const now = new Date();
    const hour = now.getHours();
    const isWeekday = now.getDay() > 0 && now.getDay() < 6;
    return isWeekday && hour >= 9 && hour < 17 && this.userStatus() !== 'offline';
  });
  goOnline() {
    this.userStatus.set('online');
  }

  goAway() {
    this.userStatus.set('away');
  }

  goOffline() {
    this.userStatus.set('offline');
  }

  toggleStatus() {
    const current = this.userStatus();
    switch (current) {
      case 'offline':
        this.userStatus.set('online');
        break;
      case 'online':
        this.userStatus.set('away');
        break;
      case 'away':
        this.userStatus.set('offline');
        break;
    }
  }
  toggleNotifications() {
    // This works with linkedSignal but would error with computed!
    this.notificationPreference.update((prev) => !prev);
  }
}
