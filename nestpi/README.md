<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# 🎓 Backend - Sistema de Detección Temprana de Abandono Escolar

> **UEF "Atanasio Viteri" - Quito, Ecuador**
> 
> API REST desarrollada con **NestJS + TypeORM + MySQL** para el proyecto universitario.

---

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [pnpm](https://pnpm.io/) instalado globalmente
- [Laragon](https://laragon.org/) (o cualquier servidor MySQL local)
- Base de datos `abandono_escolar_uef` creada en MySQL

---

## ⚡ Instalación Rápida

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd nestpi

# 2. Instalar dependencias
pnpm install

# 3. Verificar credenciales de MySQL en src/app.module.ts
#    (Por defecto: host=localhost, user=root, password="", database=abandono_escolar_uef)

# 4. Ejecutar en modo desarrollo
pnpm start:dev
```

El servidor quedará disponible en: **`http://localhost:3000`**

---

## 📡 Endpoints Disponibles

Cada recurso expone las 5 operaciones CRUD estándar:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET`    | `/{recurso}`      | Listar todos los registros |
| `GET`    | `/{recurso}/:id`  | Obtener un registro por ID |
| `POST`   | `/{recurso}`      | Crear un nuevo registro |
| `PUT`    | `/{recurso}/:id`  | Actualizar un registro existente |
| `DELETE` | `/{recurso}/:id`  | Eliminar un registro |

### 📋 Tabla de Recursos

| # | Recurso | URL Base | Relaciones cargadas en GET |
|---|---------|----------|---------------------------|
| 1 | **Periodos Lectivos** | `/periodos-lectivos` | — |
| 2 | **Cursos** | `/cursos` | — |
| 3 | **Usuarios** | `/usuarios` | — |
| 4 | **Familias** | `/familias` | — |
| 5 | **Estudiantes** | `/estudiantes` | `familia`, `curso` |
| 6 | **Historiales Académicos** | `/historiales-academicos` | `estudiante`, `periodo`, `curso` |
| 7 | **Alertas Predictivas** | `/alertas-predictivas` | `estudiante`, `periodo` |
| 8 | **Intervenciones** | `/intervenciones` | `estudiante`, `alerta` |

---

## 🧪 Ejemplos de Uso

### 🔹 PowerShell (Windows / VS Code Terminal)

```powershell
# ───────────────────────────────────────────────
# 1. LISTAR todos los registros de un recurso
# ───────────────────────────────────────────────
irm http://localhost:3000/estudiantes
irm http://localhost:3000/periodos-lectivos
irm http://localhost:3000/cursos

# ───────────────────────────────────────────────
# 2. OBTENER un registro por ID
# ───────────────────────────────────────────────
irm http://localhost:3000/estudiantes/1
irm http://localhost:3000/cursos/2

# ───────────────────────────────────────────────
# 3. CREAR un nuevo registro (POST)
# ───────────────────────────────────────────────

# Crear un Periodo Lectivo
irm -Method POST -Uri http://localhost:3000/periodos-lectivos `
  -ContentType "application/json" `
  -Body '{"anio_lectivo":"2025-2026","fecha_inicio":"2025-09-01","fecha_fin":"2026-07-15","estado":"en_curso"}'

# Crear un Curso
irm -Method POST -Uri http://localhost:3000/cursos `
  -ContentType "application/json" `
  -Body '{"nombre":"1ro BGU A","nivel":"BGU1","paralelo":"A","jornada":"manana","anio_lectivo":"2025-2026","estado":"activo"}'

# Crear una Familia
irm -Method POST -Uri http://localhost:3000/familias `
  -ContentType "application/json" `
  -Body '{"nombre_representante":"María González","parentesco":"madre","telefono":"0991234567","direccion":"Quito, Ecuador","nivel_instruccion":"secundaria","ocupacion":"Ama de casa","ingreso_mensual":450.00,"tipo_vivienda":"casa","numero_integrantes":4,"recibe_bono":true,"tiene_internet":false}'

# Crear un Estudiante (completo)
irm -Method POST -Uri http://localhost:3000/estudiantes `
  -ContentType "application/json" `
  -Body '{"id_familia":1,"id_curso":1,"cedula":"1234567890","apellidos":"Pérez López","nombres":"Juan Carlos","fecha_nacimiento":"2010-05-15","genero":"M","etnia":"mestizo","telefono":"0987654321","correo":"juan@email.com","direccion":"Av. Principal 123","edad_esperada":15,"tiene_discapacidad":false,"condicion_medica":false,"es_trabajador_infantil":false,"horas_trabajo_semanales":0,"embarazo_adolescente":false,"es_victima_violencia":false,"consumo_sustancias":false,"ha_abandonado_previamente":false,"anios_abandono_previo":0,"fecha_matricula":"2025-09-01","tipo_ingreso":"nuevo","estado":"activo"}'

# Crear un Historial Académico
irm -Method POST -Uri http://localhost:3000/historiales-academicos `
  -ContentType "application/json" `
  -Body '{"id_estudiante":1,"id_periodo":1,"id_curso":1,"promedio_general":7.50,"materias_reprobadas":1,"materias_aprobadas":8,"total_materias":9,"es_repitente":false,"numero_repeticiones":0,"dias_asistidos":120,"dias_inasistidos":15,"dias_habiles":135,"porcentaje_asistencia":88.89,"faltas_disciplinarias":2,"estado_periodo":"en_curso"}'

# Crear una Alerta Predictiva
irm -Method POST -Uri http://localhost:3000/alertas-predictivas `
  -ContentType "application/json" `
  -Body '{"id_estudiante":1,"id_periodo":1,"probabilidad_abandono":0.75,"nivel_riesgo":"alto","factores_principales":{"sobre_edad":true,"bajo_promedio":true,"inasistencias":true},"estado_alerta":"nueva","observaciones":"Requiere seguimiento psicológico"}'

# Crear una Intervención
irm -Method POST -Uri http://localhost:3000/intervenciones `
  -ContentType "application/json" `
  -Body '{"id_estudiante":1,"id_alerta":1,"fecha_inicio":"2025-10-01","tipo":"psicologica","descripcion":"Sesión de orientación familiar","responsable":"Dra. Ana Torres","area":"psicologia","resultado":"en_proceso"}'

# ───────────────────────────────────────────────
# 4. ACTUALIZAR un registro (PUT)
# ───────────────────────────────────────────────
irm -Method PUT -Uri http://localhost:3000/estudiantes/1 `
  -ContentType "application/json" `
  -Body '{"estado":"riesgo_medio"}'

irm -Method PUT -Uri http://localhost:3000/periodos-lectivos/1 `
  -ContentType "application/json" `
  -Body '{"estado":"cerrado"}'

# ───────────────────────────────────────────────
# 5. ELIMINAR un registro (DELETE)
# ───────────────────────────────────────────────
irm -Method DELETE -Uri http://localhost:3000/estudiantes/1
irm -Method DELETE -Uri http://localhost:3000/periodos-lectivos/1
```

### 🔹 cURL (Linux / macOS / Git Bash)

```bash
# Listar estudiantes
curl http://localhost:3000/estudiantes

# Crear estudiante
curl -X POST http://localhost:3000/estudiantes   -H "Content-Type: application/json"   -d '{"cedula":"1234567890","apellidos":"Pérez","nombres":"Juan","fecha_nacimiento":"2010-05-15","genero":"M","etnia":"mestizo","tiene_discapacidad":false,"condicion_medica":false,"es_trabajador_infantil":false,"horas_trabajo_semanales":0,"embarazo_adolescente":false,"es_victima_violencia":false,"consumo_sustancias":false,"ha_abandonado_previamente":false,"anios_abandono_previo":0,"tipo_ingreso":"nuevo","estado":"activo"}'

# Actualizar
curl -X PUT http://localhost:3000/estudiantes/1   -H "Content-Type: application/json"   -d '{"estado":"riesgo_alto"}'

# Eliminar
curl -X DELETE http://localhost:3000/estudiantes/1
```

### 🔹 JavaScript (Frontend - Fetch API)

```javascript
// Listar estudiantes
const res = await fetch('http://localhost:3000/estudiantes');
const estudiantes = await res.json();
console.log(estudiantes);

// Crear estudiante
const res = await fetch('http://localhost:3000/estudiantes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cedula: '1234567890',
    apellidos: 'Pérez',
    nombres: 'Juan',
    fecha_nacimiento: '2010-05-15',
    genero: 'M',
    etnia: 'mestizo',
    tiene_discapacidad: false,
    condicion_medica: false,
    es_trabajador_infantil: false,
    horas_trabajo_semanales: 0,
    embarazo_adolescente: false,
    es_victima_violencia: false,
    consumo_sustancias: false,
    ha_abandonado_previamente: false,
    anios_abandono_previo: 0,
    tipo_ingreso: 'nuevo',
    estado: 'activo'
  })
});
const nuevo = await res.json();
console.log(nuevo);
```

---

## 🗄️ Estructura de la Base de Datos

El sistema maneja **8 tablas**:

1. `periodo_lectivo` — Años lectivos
2. `curso` — Cursos académicos (EGB1-EGB7, BGU1-BGU3)
3. `usuario` — Usuarios del sistema (admin, director, docente, psicólogo, trabajador social)
4. `familia` — Ficha socioeconómica del representante
5. `estudiante` — Datos personales + factores de riesgo
6. `historial_academico` — Rendimiento, asistencia y conducta
7. `alerta_predictiva` — Resultados del modelo ML
8. `intervencion` — Acciones preventivas

> 📌 **Nota:** Asegúrate de que la base de datos `abandono_escolar_uef` esté creada en MySQL antes de iniciar el servidor.

---

## 🔧 Configuración de la Base de Datos

Edita `src/app.module.ts` si tus credenciales de MySQL son diferentes:

```typescript
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',      // ← Cambiar si es necesario
  password: '',          // ← Cambiar si es necesario
  database: 'abandono_escolar_uef',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,    // ⚠️ false porque las tablas ya existen
  logging: true,
})
```

---

## 📚 Documentación con Swagger (Opcional)

Si instalaste `@nestjs/swagger`, accede a:

```
http://localhost:3000/api/docs
```

Desde ahí puedes probar todos los endpoints interactivamente desde el navegador.

---

## 🛠️ Comandos Útiles

```bash
# Modo desarrollo (con hot-reload)
pnpm start:dev

# Compilar para producción
pnpm build

# Modo producción
pnpm start:prod

# Ejecutar tests
pnpm test

# Formatear código
pnpm format

# Lint
pnpm lint
```

---

## ⚠️ Notas Importantes para el Frontend

1. **CORS está habilitado** — El frontend puede conectarse desde cualquier origen.
2. **Validaciones automáticas** — Si envías datos inválidos, recibirás `400 Bad Request` con el listado de errores.
3. **Relaciones** — Al consultar `estudiantes`, `historiales-academicos`, `alertas-predictivas` e `intervenciones`, las relaciones se cargan automáticamente.
4. **Campos obligatorios** — Revisa los DTOs en `src/dto/` para ver qué campos son requeridos en cada endpoint.

---

## 👥 Equipo

- **Backend:** [Tu nombre]
- **Frontend:** [Nombre del compañero]
- **Base de datos / ML:** [Nombre del compañero]

---

## 📄 Licencia

Proyecto universitario — UEF "Atanasio Viteri" — 2026
