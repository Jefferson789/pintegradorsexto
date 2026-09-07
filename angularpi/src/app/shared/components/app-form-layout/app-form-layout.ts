import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-form-layout',
  standalone: true,
  templateUrl: './app-form-layout.html',
  styleUrl: './app-form-layout.css'
})
export class AppFormLayout {

  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  showCloseButton = false;

  @Output()
  close = new EventEmitter<void>();

}