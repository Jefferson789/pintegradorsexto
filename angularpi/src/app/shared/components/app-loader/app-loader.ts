import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './app-loader.html',
  styleUrl: './app-loader.css'
})
export class AppLoader {
  constructor(
    public loaderService: LoaderService
  ) {}
}