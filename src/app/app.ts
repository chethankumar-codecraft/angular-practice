import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Home } from './components/home/home';
import { Counter } from '@components/counter/counter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Counter, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('propery-app');
  // protected readonly title='property app';

  //setTimout, event listener is fired, or a promise got resolved,rejected, network call

  ngOnInit() {
    console.log('App component was instantiated');
    this.title.set('propery app reloaded');
  }
}
