// src/app/features/usuario/pages/usuario-list/usuario-list.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { UsuarioModel } from '../../../../core/models/usuario.model';
import { AppAlert } from '../../../../shared/ui/app-alert/app-alert';
import { AppModal } from '../../../../shared/ui/app-modal/app-modal';
import { UsuarioForm } from '../usuario-form/usuario-form';
import { AppSearchBox } from '../../../../shared/ui/app-search-box/app-search-box';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AppAlert,
    AppModal,
    UsuarioForm,
    AppSearchBox
  ],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css'
})
export class UsuarioList implements OnInit {
  users: UsuarioModel[] = [];
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'info';
  loading = false;
  searchQuery = '';

  showFormModal = false;
  isEdit = false;
  editingId: number | null = null;

  showDeleteModal = false;
  usuarioToDelete: UsuarioModel | null = null;

  private alertTimer: any;

  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    // Limpiar timer anterior
    if (this.alertTimer) {
      clearTimeout(this.alertTimer);
    }

    // Forzar ocultamiento previo para reiniciar animación
    this.alertMessage = '';
    this.alertType = type;

    // Pequeño delay para asegurar que el DOM se actualice
    setTimeout(() => {
      this.alertMessage = message;

      // Programar auto-ocultado
      this.alertTimer = setTimeout(() => {
        this.alertMessage = '';
      }, 3000);
    }, 10);
  }

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.usuarioService.getAll().subscribe({
      next: (usuarios) => {
        this.users = usuarios;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.alertMessage = 'Error al cargar usuarios.';
        this.alertType = 'error';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openFormModal(isEdit: boolean = false, id: number | null = null): void {
    this.isEdit = isEdit;
    this.editingId = id;
    this.showFormModal = true;
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.editingId = null;
  }

  onFormSuccess(message: string): void {
    this.showAlert(message, 'success');
    this.closeFormModal();
    this.loadUsers(); // Recargar lista
  }

  openDeleteModal(usuario: UsuarioModel): void {
    this.usuarioToDelete = usuario;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.usuarioToDelete) return;

    this.usuarioService.delete(this.usuarioToDelete.id).subscribe({
      next: () => {
        // Cerrar modal primero
        this.showDeleteModal = false;
        this.usuarioToDelete = null;

        // Mostrar alerta
        this.showAlert('Usuario eliminado correctamente.', 'success');

        // Recargar lista desde el servidor (esto es lo importante)
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.showDeleteModal = false;
        this.usuarioToDelete = null;
        this.showAlert('Error al eliminar usuario.', 'error');
        // No recargamos lista si hay error, pero sí mostramos el mensaje
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.usuarioToDelete = null;
  }

  toggleStatus(usuario: UsuarioModel): void {
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    this.usuarioService.toggleStatus(usuario.id, nuevoEstado).subscribe({
      next: () => {
        usuario.estado = nuevoEstado;
        this.showAlert(`Usuario ${nuevoEstado === 'activo' ? 'activado' : 'desactivado'} correctamente.`, 'success');
        // Opcional: recargar lista completa para asegurar consistencia
        // this.loadUsers();
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        this.showAlert('Error al actualizar estado.', 'error');
      }
    });
  }

  get filteredUsuarios(): UsuarioModel[] {
    if (!this.searchQuery) return this.users;
    const query = this.searchQuery.toLowerCase();
    return this.users.filter(u =>
      u.nombres.toLowerCase().includes(query) ||
      u.apellidos.toLowerCase().includes(query) ||
      u.correo.toLowerCase().includes(query) ||
      u.cedula.includes(query)
    );
  }
}