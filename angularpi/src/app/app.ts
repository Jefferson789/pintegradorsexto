import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppToast } from './shared/ui/app-toast/app-toast';
import { AppLoader } from './shared/components/app-loader/app-loader';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AppToast,
    AppLoader
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('atanasio_viteri_front');
}
