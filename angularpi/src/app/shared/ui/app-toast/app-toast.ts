import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './app-toast.html',
  styleUrl: './app-toast.css'
})
export class AppToast {
  constructor(
    public toastService: ToastService
  ) { }
}