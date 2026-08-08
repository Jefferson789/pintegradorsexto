# 🤖 Microservicio ML - Detección de Abandono Escolar

**Institución:** UEF "Atanasio Viteri" - Quito, Ecuador  
**Proyecto:** Sistema de Detección Temprana de Abandono Escolar  
**Framework:** FastAPI + scikit-learn  
**Modelo:** Random Forest Classifier

---

## 📁 Estructura del Proyecto

```
ml-service/
├── main.py              # Microservicio FastAPI completo
├── requirements.txt     # Dependencias
├── modelo.pkl           # Modelo entrenado (se genera con /train)
├── scaler.pkl           # Scaler de features (se genera con /train)
├── encoders.pkl         # LabelEncoders (se genera con /train)
└── README.md            # Este archivo
```

---

## 🚀 Instalación Rápida

### 1. Crear entorno virtual

```bash
# Windows
cd ml-service
python -m venv venv
venv\Scripts\activate

# Linux/Mac
cd ml-service
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Iniciar el servidor

```bash
# Modo desarrollo (con auto-reload)
uvicorn main:app --reload --port 8000

# Modo producción
uvicorn main:app --host 0.0.0.0 --port 8000
```

El servicio estará disponible en: **http://localhost:8000**

---

## 🔌 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Información del servicio |
| GET | `/health` | Estado del servicio y modelo |
| POST | `/train` | Descarga datos y entrena el modelo |
| POST | `/predict` | Predice riesgo de abandono |

### Documentación interactiva
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 🧪 Probar el servicio

### 1. Verificar estado
```pwsh
Invoke-RestMethod -Uri "http://localhost:8000/health" -Method Get
```

### 2. Entrenar el modelo
```pwsh
Invoke-RestMethod -Uri "http://localhost:8000/train" -Method Post
```

### 3. Hacer una predicción riesgo bajo
```pwsh
$body = @{
    id_estudiante = 1
    genero = "M"
    edad_actual = 16
    edad_esperada = 15
    tiene_sobreedad = 1
    tiene_discapacidad = $false
    es_trabajador_infantil = $false
    horas_trabajo_semanales = 0
    embarazo_adolescente = $false
    es_victima_violencia = $false
    consumo_sustancias = $false
    ha_abandonado_previamente = $false
    anios_abandono_previo = 0
    tipo_ingreso = "nuevo"
    ingreso_mensual = 450.00
    numero_integrantes = 4
    recibe_bono = $true
    tiene_internet = $false
    nivel_instruccion = "secundaria"
    promedio_general = 7.50
    materias_reprobadas = 1
    es_repitente = $false
    numero_repeticiones = 0
    porcentaje_asistencia = 88.89
    faltas_disciplinarias = 2
    nivel = "BGU1"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/predict" -Method Post -ContentType "application/json" -Body $body
```
### 3. Hacer una predicción riesgo ALTO
```pwsh
$bodyAltoRiesgo = @{
    id_estudiante = 999
    genero = "M"
    edad_actual = 19
    edad_esperada = 15
    tiene_sobreedad = 1
    tiene_discapacidad = $true
    es_trabajador_infantil = $true
    horas_trabajo_semanales = 35
    embarazo_adolescente = $false
    es_victima_violencia = $true
    consumo_sustancias = $true
    ha_abandonado_previamente = $true
    anios_abandono_previo = 2
    tipo_ingreso = "reincorporado"
    ingreso_mensual = 120.00
    numero_integrantes = 8
    recibe_bono = $true
    tiene_internet = $false
    nivel_instruccion = "primaria"
    promedio_general = 4.20
    materias_reprobadas = 5
    es_repitente = $true
    numero_repeticiones = 3
    porcentaje_asistencia = 45.00
    faltas_disciplinarias = 8
    nivel = "BGU1"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/predict" -Method Post -ContentType "application/json" -Body $bodyAltoRiesgo
```
---
## elimnar modelos
Remove-Item modelo.pkl, scaler.pkl, encoders.pkl -ErrorAction SilentlyContinue

## ⚙️ Variables de Entorno

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `NESTJS_URL` | `http://localhost:3000` | URL del backend NestJS |
| `MODEL_PATH` | `modelo.pkl` | Ruta del modelo guardado |
| `SCALER_PATH` | `scaler.pkl` | Ruta del scaler |
| `ENCODERS_PATH` | `encoders.pkl` | Ruta de los encoders |

**Ejemplo:**
```bash
NESTJS_URL=http://192.168.1.10:3000 uvicorn main:app --port 8000
```

---

## 📊 Niveles de Riesgo

| Probabilidad | Nivel | Color sugerido |
|-------------|-------|----------------|
| 0.00 - 0.19 | `sin_riesgo` | 🟢 Verde |
| 0.20 - 0.39 | `bajo` | 🔵 Azul |
| 0.40 - 0.59 | `medio` | 🟡 Amarillo |
| 0.60 - 0.79 | `alto` | 🟠 Naranja |
| 0.80 - 0.99 | `critico` | 🔴 Rojo |

---

## 🔄 Flujo de Actualización del Modelo

1. Se registran nuevos estudiantes en el sistema
2. Se actualiza la vista `vw_dataset_prediccion` en MySQL
3. Se ejecuta `POST /train` para reentrenar
4. El nuevo `modelo.pkl` reemplaza al anterior
5. Las predicciones siguen usando el modelo actualizado

**Recomendación:** Reentrenar semanalmente o cuando se acumulen 50+ nuevos registros.
