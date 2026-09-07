import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-search-box',
  standalone: true,
  templateUrl: './app-search-box.html',
  styleUrl: './app-search-box.css'
})
export class AppSearchBox {

  @Input()
  value = '';

  @Input()
  placeholder = 'Buscar...';

  @Output()
  valueChange =
    new EventEmitter<string>();

}