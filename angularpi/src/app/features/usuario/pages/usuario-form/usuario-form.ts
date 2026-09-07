import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { UsuarioModel } from '../../../../core/models/usuario.model';
import { AppFormLayout } from '../../../../shared/components/app-form-layout/app-form-layout';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppFormLayout
  ],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css'
})
export class UsuarioForm implements OnInit {

  @Input() isEdit: boolean = false;
  @Input() usuarioId: number | null = null;

  @Output() onSuccess = new EventEmitter<string>();
  @Output() onCancel = new EventEmitter<void>();

  usuarioForm: FormGroup;

  loading = false;
  saving = false;

  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | 'info' = 'info';

  roles = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'director', label: 'Director' },
    { value: 'docente', label: 'Docente' },
    { value: 'psicologo', label: 'Psicólogo' },
    { value: 'trabajador_social', label: 'Trabajador Social' }
  ];

  estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['docente', [Validators.required]],
      estado: ['activo'],
      // Agregamos el campo password (valor por defecto "12345")
      password: ['123456']
    });
  }

  ngOnInit(): void {
    if (this.usuarioId && this.isEdit) {
      this.loadUsuario(this.usuarioId);
    }
  }

  loadUsuario(id: number): void {
    this.loading = true;

    this.usuarioService.getById(id).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          cedula: usuario.cedula,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
          rol: usuario.rol,
          estado: usuario.estado
          // No patcheamos password para no sobrescribir con "12345" en edición
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.alertMessage = 'Error al cargar usuario.';
        this.alertType = 'error';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formData = this.usuarioForm.value;

    // Creamos el modelo incluyendo la contraseña si es nuevo
    const usuario = new UsuarioModel(
      this.usuarioId || 0,
      formData.cedula,
      formData.nombres,
      formData.apellidos,
      formData.correo,
      formData.rol,
      formData.estado,
      new Date(),
      undefined,
      formData.password // Pasamos la contraseña al constructor
    );

    const observable = this.isEdit
      ? this.usuarioService.update(this.usuarioId!, usuario)
      : this.usuarioService.create(usuario);

    observable.subscribe({
      next: () => {
        const message = this.isEdit
          ? 'Usuario actualizado correctamente.'
          : 'Usuario creado correctamente.';

        this.saving = false;
        this.onSuccess.emit(message);
      },
      error: (err) => {
        console.error('Error al guardar:', err);
        this.alertMessage = 'Error al guardar usuario. Verifica los datos.';
        this.alertType = 'error';
        this.saving = false;
      }
    });
  }

  onCancelHandler(): void {
    this.onCancel.emit();
  }
}