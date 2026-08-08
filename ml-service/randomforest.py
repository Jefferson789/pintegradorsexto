"""
═══════════════════════════════════════════════════════════════════════
  MICROSERVICIO DE PREDICCIÓN - Sistema de Detección Temprana
  de Abandono Escolar - UEF "Atanasio Viteri"
  Puerto: 8000 | Framework: FastAPI | Modelo: Random Forest
═══════════════════════════════════════════════════════════════════════
"""

import os
import json
import logging
import traceback
from datetime import datetime
from typing import List, Dict, Any, Optional

import httpx
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

# ═══════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════════════

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("abandono-escolar-ml")

NESTJS_URL = os.getenv("NESTJS_URL", "http://localhost:3000")
DATASET_ENDPOINT = f"{NESTJS_URL}/dataset-prediccion"
MODEL_PATH = os.getenv("MODEL_PATH", "modelo.pkl")
SCALER_PATH = os.getenv("SCALER_PATH", "scaler.pkl")
ENCODERS_PATH = os.getenv("ENCODERS_PATH", "encoders.pkl")

app = FastAPI(
    title="ML Service - Detección de Abandono Escolar",
    description="Microservicio de Machine Learning para predicción de abandono escolar",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════════════════════════════════
# ESQUEMAS DE DATOS (Pydantic)
# ═══════════════════════════════════════════════════════════════════════

class PredictRequest(BaseModel):
    id_estudiante: int
    genero: str
    edad_actual: int
    edad_esperada: int
    tiene_sobreedad: int
    tiene_discapacidad: bool
    es_trabajador_infantil: bool
    horas_trabajo_semanales: int
    embarazo_adolescente: bool
    es_victima_violencia: bool
    consumo_sustancias: bool
    ha_abandonado_previamente: bool
    anios_abandono_previo: int
    tipo_ingreso: str
    ingreso_mensual: float
    numero_integrantes: int
    recibe_bono: bool
    tiene_internet: bool
    nivel_instruccion: str
    promedio_general: float
    materias_reprobadas: int
    es_repitente: bool
    numero_repeticiones: int
    porcentaje_asistencia: float
    faltas_disciplinarias: int
    nivel: str


class PredictResponse(BaseModel):
    probabilidad: float = Field(..., ge=0.0, le=1.0)
    nivel_riesgo: str
    factores: List[str]
    modelo: str


class TrainResponse(BaseModel):
    status: str
    modelo: str
    total_registros: int
    entrenamiento_registros: int
    test_registros: int
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    timestamp: str
    mensaje: str


class HealthResponse(BaseModel):
    status: str
    modelo_cargado: bool
    timestamp: str


# ═══════════════════════════════════════════════════════════════════════
# VARIABLES GLOBALES
# ═══════════════════════════════════════════════════════════════════════

modelo_global = None
scaler_global = None
encoders_global = None
feature_columns = None


# ═══════════════════════════════════════════════════════════════════════
# MAPEOS Y UTILIDADES
# ═══════════════════════════════════════════════════════════════════════

CATEGORICAL_COLUMNS = [
    "genero",
    "tipo_ingreso",
    "nivel_instruccion",
    "nivel",
]

BOOLEAN_COLUMNS = [
    "tiene_discapacidad",
    "es_trabajador_infantil",
    "embarazo_adolescente",
    "es_victima_violencia",
    "consumo_sustancias",
    "ha_abandonado_previamente",
    "recibe_bono",
    "tiene_internet",
    "es_repitente",
]

NUMERIC_COLUMNS = [
    "edad_actual",
    "edad_esperada",
    "tiene_sobreedad",
    "horas_trabajo_semanales",
    "anios_abandono_previo",
    "ingreso_mensual",
    "numero_integrantes",
    "promedio_general",
    "materias_reprobadas",
    "numero_repeticiones",
    "porcentaje_asistencia",
    "faltas_disciplinarias",
]


def determinar_nivel_riesgo(probabilidad: float) -> str:
    """
    Determina el nivel de riesgo basado en la probabilidad.
    """
    if probabilidad < 0.20:
        return "sin_riesgo"
    elif probabilidad < 0.40:
        return "bajo"
    elif probabilidad < 0.60:
        return "medio"
    elif probabilidad < 0.80:
        return "alto"
    else:
        return "critico"


def extraer_factores_riesgo(row: pd.Series, probabilidad: float) -> List[str]:
    """
    Extrae los factores de riesgo más relevantes del estudiante.
    Solo se muestran si la probabilidad indica riesgo (>= 0.20).
    """
    factores = []

    if probabilidad < 0.20:
        return factores

    # Factores académicos
    if row.get("promedio_general", 10.0) < 6.0:
        factores.append("bajo_promedio")
    elif row.get("promedio_general", 10.0) < 7.0:
        factores.append("promedio_bajo")

    if row.get("materias_reprobadas", 0) >= 2:
        factores.append("materias_reprobadas")

    if row.get("porcentaje_asistencia", 100.0) < 75.0:
        factores.append("baja_asistencia")
    elif row.get("porcentaje_asistencia", 100.0) < 85.0:
        factores.append("asistencia_irregular")

    if row.get("numero_repeticiones", 0) >= 1:
        factores.append("repitente")

    # Factores socioeconómicos
    if row.get("es_trabajador_infantil", False):
        factores.append("trabajo_infantil")

    if row.get("ingreso_mensual", 500.0) < 300.0:
        factores.append("bajos_ingresos")

    if row.get("numero_integrantes", 4) >= 6:
        factores.append("familia_numerosa")

    if not row.get("tiene_internet", True):
        factores.append("sin_internet")

    # Factores de vulnerabilidad
    if row.get("ha_abandonado_previamente", False):
        factores.append("abandono_previo")

    if row.get("consumo_sustancias", False):
        factores.append("consumo_sustancias")

    if row.get("es_victima_violencia", False):
        factores.append("victima_violencia")

    if row.get("embarazo_adolescente", False):
        factores.append("embarazo_adolescente")

    if row.get("tiene_discapacidad", False):
        factores.append("discapacidad")

    # Factores conductuales
    if row.get("faltas_disciplinarias", 0) >= 3:
        factores.append("faltas_disciplinarias")

    if row.get("tiene_sobreedad", 0) == 1:
        factores.append("sobreedad")

    # Si no hay factores específicos pero hay riesgo
    if not factores:
        if probabilidad >= 0.60:
            factores.append("patron_complejo_riesgo")
        else:
            factores.append("factores_moderados")

    return factores[:5]  # Máximo 5 factores


# ═══════════════════════════════════════════════════════════════════════
# PREPROCESAMIENTO
# ═══════════════════════════════════════════════════════════════════════

def preparar_dataframe(df: pd.DataFrame, entrenamiento: bool = False) -> pd.DataFrame:
    """
    Prepara el DataFrame para entrenamiento o predicción.
    Maneja valores nulos (NaN) rellenando con valores por defecto.
    """
    df = df.copy()

    # ─── Manejar valores nulos en columnas BOOLEANAS ───
    # MySQL puede devolver NULL en booleanos → rellenar con False (0)
    for col in BOOLEAN_COLUMNS:
        if col in df.columns:
            # Rellenar NaN con False, luego convertir a int
            df[col] = df[col].fillna(False).astype(int)

    # ─── Manejar valores nulos en columnas NUMÉRICAS ───
    # Rellenar con 0 (o podría ser la media para algunas)
    for col in NUMERIC_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
            df[col] = df[col].fillna(0)

    # ─── Manejar valores nulos en columnas CATEGÓRICAS ───
    # Rellenar con "desconocido"
    for col in CATEGORICAL_COLUMNS:
        if col in df.columns:
            df[col] = df[col].fillna("desconocido").astype(str)

    # ─── Variable objetivo ───
    if "abandono" in df.columns:
        df["abandono"] = pd.to_numeric(df["abandono"], errors="coerce").fillna(0).astype(int)

    return df


def aplicar_encoding(
    df: pd.DataFrame,
    entrenamiento: bool = False,
    encoders: Optional[Dict[str, LabelEncoder]] = None,
) -> tuple[pd.DataFrame, Dict[str, LabelEncoder]]:
    """
    Aplica Label Encoding a las columnas categóricas.
    Si es entrenamiento, crea los encoders. Si no, los reutiliza.
    """
    df = df.copy()

    if entrenamiento:
        encoders = {}

    for col in CATEGORICAL_COLUMNS:
        if col not in df.columns:
            continue

        if entrenamiento:
            le = LabelEncoder()
            # Agregar "desconocido" para manejar valores nuevos
            valores = df[col].astype(str).unique().tolist() + ["desconocido"]
            le.fit(valores)
            encoders[col] = le

        le = encoders[col]
        df[col] = df[col].astype(str).apply(
            lambda x: x if x in le.classes_ else "desconocido"
        )
        df[col] = le.transform(df[col].astype(str))

    return df, encoders


def obtener_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Selecciona y ordena las columnas de features.
    """
    all_feature_cols = (
        CATEGORICAL_COLUMNS
        + BOOLEAN_COLUMNS
        + NUMERIC_COLUMNS
    )

    # Filtrar solo las columnas que existen en el dataframe
    available_cols = [c for c in all_feature_cols if c in df.columns]

    # Agregar columnas numéricas que puedan faltar
    for col in NUMERIC_COLUMNS:
        if col not in available_cols and col in df.columns:
            available_cols.append(col)

    return df[available_cols]


# ═══════════════════════════════════════════════════════════════════════
# CARGA DE MODELO
# ═══════════════════════════════════════════════════════════════════════

def cargar_modelo() -> bool:
    """
    Carga el modelo, scaler y encoders desde disco.
    Retorna True si se cargó correctamente.
    """
    global modelo_global, scaler_global, encoders_global, feature_columns

    try:
        if not os.path.exists(MODEL_PATH):
            logger.warning("⚠️  No se encontró modelo.pkl. Debes entrenar primero.")
            return False

        modelo_global = joblib.load(MODEL_PATH)
        logger.info("✅ Modelo cargado desde %s", MODEL_PATH)

        if os.path.exists(SCALER_PATH):
            scaler_global = joblib.load(SCALER_PATH)
            logger.info("✅ Scaler cargado desde %s", SCALER_PATH)

        if os.path.exists(ENCODERS_PATH):
            encoders_global = joblib.load(ENCODERS_PATH)
            logger.info("✅ Encoders cargados desde %s", ENCODERS_PATH)

        return True

    except Exception as e:
        logger.error("❌ Error cargando modelo: %s", str(e))
        return False


# ═══════════════════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════

@app.on_event("startup")
async def startup_event():
    """Se ejecuta al iniciar el servidor."""
    logger.info("🚀 Microservicio ML iniciado en http://localhost:8000")
    cargar_modelo()


@app.get("/", response_model=Dict[str, str])
async def root():
    """Endpoint raíz."""
    return {
        "servicio": "ML - Detección de Abandono Escolar",
        "version": "1.0.0",
        "endpoints": "/train, /predict, /health",
    }


@app.get("/health", response_model=HealthResponse)
async def health():
    """Verifica el estado del servicio y si el modelo está cargado."""
    return HealthResponse(
        status="ok",
        modelo_cargado=modelo_global is not None,
        timestamp=datetime.now().isoformat(),
    )


@app.post("/train", response_model=TrainResponse)
async def train():
    """
    Descarga datos desde NestJS, entrena el modelo Random Forest
    y guarda los artefactos en disco.
    """
    global modelo_global, scaler_global, encoders_global, feature_columns

    logger.info("📥 Descargando dataset desde %s", DATASET_ENDPOINT)

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(DATASET_ENDPOINT)
            response.raise_for_status()
            data = response.json()
    except httpx.ConnectError as e:
        raise HTTPException(
            status_code=503,
            detail=f"No se pudo conectar con NestJS en {NESTJS_URL}. Verifica que esté corriendo. Error: {str(e)}"
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=502,
            detail=f"NestJS respondió con error: {e.response.status_code}. Verifica el endpoint /dataset-prediccion."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error descargando datos: {str(e)}"
        )

    # Convertir a DataFrame
    if isinstance(data, list):
        df = pd.DataFrame(data)
    elif isinstance(data, dict) and "data" in data:
        df = pd.DataFrame(data["data"])
    elif isinstance(data, dict):
        # Intentar encontrar una lista dentro del dict
        list_keys = [k for k, v in data.items() if isinstance(v, list) and len(v) > 0]
        if list_keys:
            df = pd.DataFrame(data[list_keys[0]])
            logger.info("📦 Dataset encontrado en clave: %s", list_keys[0])
        else:
            raise HTTPException(
                status_code=422,
                detail=f"Formato de datos inesperado desde NestJS. Se esperaba una lista de registros. Claves recibidas: {list(data.keys())}"
            )
    else:
        raise HTTPException(
            status_code=422,
            detail="Formato de datos inesperado desde NestJS. Se esperaba una lista de registros."
        )

    total_registros = len(df)
    logger.info("📊 Dataset recibido: %d registros", total_registros)
    logger.info("📋 Columnas recibidas: %s", list(df.columns))

    # Validar mínimo de datos
    if total_registros < 30:
        raise HTTPException(
            status_code=422,
            detail=f"Datos insuficientes para entrenar. Se necesitan al menos 30 registros. Actual: {total_registros}"
        )

    # Verificar variable objetivo
    if "abandono" not in df.columns:
        raise HTTPException(
            status_code=422,
            detail="La columna 'abandono' no está presente en el dataset. Verifica la vista SQL."
        )

    # Verificar balance de clases
    clases = df["abandono"].value_counts()
    logger.info("📈 Distribución de clases: %s", dict(clases))

    if len(clases) < 2:
        raise HTTPException(
            status_code=422,
            detail="El dataset solo tiene una clase. Se necesitan ejemplos de ambas clases (abandono=0 y abandono=1)."
        )

    # Preprocesamiento
    df = preparar_dataframe(df, entrenamiento=True)
    df, encoders = aplicar_encoding(df, entrenamiento=True)

    # Features y target
    X = obtener_features(df)
    y = df["abandono"].astype(int)

    feature_columns = list(X.columns)
    logger.info("🔧 Features seleccionadas (%d): %s", len(feature_columns), feature_columns)

    # División train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Escalado (opcional para Random Forest, pero útil)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Entrenar Random Forest
    logger.info("🤖 Entrenando Random Forest...")
    modelo = RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        class_weight="balanced",
        n_jobs=-1,
    )
    modelo.fit(X_train_scaled, y_train)

    # Evaluación
    y_pred = modelo.predict(X_test_scaled)

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)

    logger.info("📊 Métricas - Acc: %.4f | Prec: %.4f | Rec: %.4f | F1: %.4f", acc, prec, rec, f1)

    # Guardar artefactos
    joblib.dump(modelo, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    joblib.dump(encoders, ENCODERS_PATH)

    modelo_global = modelo
    scaler_global = scaler
    encoders_global = encoders

    logger.info("💾 Modelo guardado en %s", MODEL_PATH)

    return TrainResponse(
        status="success",
        modelo="random_forest_v1",
        total_registros=total_registros,
        entrenamiento_registros=len(X_train),
        test_registros=len(X_test),
        accuracy=round(acc, 4),
        precision=round(prec, 4),
        recall=round(rec, 4),
        f1_score=round(f1, 4),
        timestamp=datetime.now().isoformat(),
        mensaje="Modelo entrenado y guardado exitosamente.",
    )


@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    """
    Recibe los datos de un estudiante y predice la probabilidad de abandono.
    """
    global modelo_global, scaler_global, encoders_global, feature_columns

    # Verificar que el modelo esté cargado
    if modelo_global is None:
        # Intentar cargar
        if not cargar_modelo():
            raise HTTPException(
                status_code=503,
                detail="El modelo no está entrenado. Ejecuta POST /train primero."
            )

    try:
        # Convertir request a DataFrame
        data_dict = request.model_dump()
        df = pd.DataFrame([data_dict])

        # Preprocesar
        df = preparar_dataframe(df, entrenamiento=False)
        df, _ = aplicar_encoding(df, entrenamiento=False, encoders=encoders_global)

        # Seleccionar features
        X = obtener_features(df)

        # Verificar que todas las columnas necesarias estén presentes
        if feature_columns:
            for col in feature_columns:
                if col not in X.columns:
                    raise HTTPException(
                        status_code=422,
                        detail=f"Falta la columna requerida: '{col}'. Verifica el payload enviado."
                    )
            X = X[feature_columns]

        # Escalar
        if scaler_global is not None:
            X_scaled = scaler_global.transform(X)
        else:
            X_scaled = X.values

        # Predecir probabilidad
        prob = modelo_global.predict_proba(X_scaled)[0][1]
        prob = float(np.clip(prob, 0.0, 0.9999))

        # Determinar nivel de riesgo
        nivel_riesgo = determinar_nivel_riesgo(prob)

        # Extraer factores
        row = pd.Series(data_dict)
        factores = extraer_factores_riesgo(row, prob)

        logger.info(
            "🔮 Predicción - Estudiante %d | Prob: %.4f | Riesgo: %s | Factores: %s",
            request.id_estudiante, prob, nivel_riesgo, factores
        )

        return PredictResponse(
            probabilidad=round(prob, 4),
            nivel_riesgo=nivel_riesgo,
            factores=factores,
            modelo="random_forest_v1",
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("❌ Error en predicción: %s", str(e))
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Error interno en la predicción: {str(e)}"
        )


# ═══════════════════════════════════════════════════════════════════════
# PUNTO DE ENTRADA
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)