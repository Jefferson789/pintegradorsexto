import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../interfaces/toast.interface';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastSubject = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toastSubject.asObservable();
    private counter = 0;
    private show(
        type: Toast['type'],
        message: string
    ): void {
        const toast: Toast = {
            id: ++this.counter,
            type,
            message
        };
        const current =
            this.toastSubject.value;
        this.toastSubject.next([
            ...current,
            toast
        ]);
        setTimeout(() => {
            this.remove(toast.id);
        }, 4000);
    }

    success(message: string): void {
        this.show(
            'success',
            message
        );
    }

    error(message: string): void {
        this.show(
            'error',
            message
        );
    }

    warning(message: string): void {
        this.show(
            'warning',
            message
        );
    }

    info(message: string): void {
        this.show(
            'info',
            message
        );
    }

    remove(id: number): void {
        this.toastSubject.next(
            this.toastSubject.value
                .filter(
                    toast =>
                        toast.id !== id
                )
        );
    }
}