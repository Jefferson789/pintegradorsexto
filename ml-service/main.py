"""
═══════════════════════════════════════════════════════════════════════
  MICROSERVICIO DE PREDICCIÓN - Sistema de Detección Temprana
  de Abandono Escolar - UEF "Atanasio Viteri"
  Puerto: 8000 | Framework: FastAPI | Modelo: Híbrido (ML + Reglas)
═══════════════════════════════════════════════════════════════════════
"""

import os
import json
import logging
import traceback
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple

import httpx
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
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
    version="2.0.0",
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
    auc_roc: float
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
    """Determina el nivel de riesgo basado en la probabilidad."""
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


# ═══════════════════════════════════════════════════════════════════════
# SISTEMA DE PUNTUACIÓN POR REGLAS (Híbrido ML + Negocio)
# ═══════════════════════════════════════════════════════════════════════

def calcular_puntuacion_reglas(row: pd.Series) -> Tuple[float, List[str]]:
    """
    Calcula una puntuación de riesgo basada en reglas de negocio.
    Retorna (puntuacion_normalizada_0_1, lista_factores).

    Esta función garantiza que casos OBVIOS de riesgo no pasen desapercibidos,
    independientemente de lo que diga el modelo ML.
    """
    puntuacion = 0.0
    factores = []
    puntos_por_factor = []

    # ─── FACTORES CRÍTICOS (alto impacto) ───

    if row.get("promedio_general", 10.0) < 5.0:
        puntuacion += 35
        factores.append("bajo_promedio")
        puntos_por_factor.append(("promedio < 5.0", 25))
    elif row.get("promedio_general", 10.0) < 6.0:
        puntuacion += 18
        factores.append("promedio_bajo")
        puntos_por_factor.append(("promedio < 6.0", 18))
    elif row.get("promedio_general", 10.0) < 7.0:
        puntuacion += 10
        factores.append("promedio_regular")
        puntos_por_factor.append(("promedio < 7.0", 10))

    if row.get("porcentaje_asistencia", 100.0) < 50.0:
        puntuacion += 35
        factores.append("baja_asistencia")
        puntos_por_factor.append(("asistencia < 50%", 25))
    elif row.get("porcentaje_asistencia", 100.0) < 70.0:
        puntuacion += 18
        factores.append("asistencia_irregular")
        puntos_por_factor.append(("asistencia < 70%", 18))
    elif row.get("porcentaje_asistencia", 100.0) < 85.0:
        puntuacion += 10
        factores.append("asistencia_moderada")
        puntos_por_factor.append(("asistencia < 85%", 10))

    if row.get("ha_abandonado_previamente", False):
        puntuacion += 28
        factores.append("abandono_previo")
        puntos_por_factor.append(("abandono previo", 20))

    if row.get("numero_repeticiones", 0) >= 3:
        puntuacion += 15
        factores.append("multiple_repitencia")
        puntos_por_factor.append(("3+ repeticiones", 15))
    elif row.get("numero_repeticiones", 0) >= 1:
        puntuacion += 10
        factores.append("repitente")
        puntos_por_factor.append(("1+ repeticiones", 10))

    # ─── FACTORES DE VULNERABILIDAD ───

    if row.get("es_trabajador_infantil", False):
        puntuacion += 18
        factores.append("trabajo_infantil")
        puntos_por_factor.append(("trabajo infantil", 15))

    if row.get("consumo_sustancias", False):
        puntuacion += 25
        factores.append("consumo_sustancias")
        puntos_por_factor.append(("consumo sustancias", 15))

    if row.get("es_victima_violencia", False):
        puntuacion += 18
        factores.append("victima_violencia")
        puntos_por_factor.append(("víctima violencia", 12))

    if row.get("embarazo_adolescente", False):
        puntuacion += 12
        factores.append("embarazo_adolescente")
        puntos_por_factor.append(("embarazo adolescente", 12))

    if row.get("tiene_discapacidad", False):
        puntuacion += 10
        factores.append("discapacidad")
        puntos_por_factor.append(("discapacidad", 10))

    # ─── FACTORES SOCIOECONÓMICOS ───

    if row.get("ingreso_mensual", 500.0) < 200.0:
        puntuacion += 12
        factores.append("bajos_ingresos")
        puntos_por_factor.append(("ingreso < $200", 12))
    elif row.get("ingreso_mensual", 500.0) < 350.0:
        puntuacion += 8
        factores.append("ingresos_limitados")
        puntos_por_factor.append(("ingreso < $350", 8))

    if row.get("numero_integrantes", 4) >= 7:
        puntuacion += 8
        factores.append("familia_numerosa")
        puntos_por_factor.append(("7+ integrantes", 8))

    if not row.get("tiene_internet", True):
        puntuacion += 5
        factores.append("sin_internet")
        puntos_por_factor.append(("sin internet", 5))

    # ─── FACTORES CONDUCTUALES ───

    if row.get("faltas_disciplinarias", 0) >= 5:
        puntuacion += 10
        factores.append("faltas_disciplinarias")
        puntos_por_factor.append(("5+ faltas disciplinarias", 10))
    elif row.get("faltas_disciplinarias", 0) >= 3:
        puntuacion += 6
        factores.append("faltas_disciplinarias")
        puntos_por_factor.append(("3+ faltas disciplinarias", 6))

    if row.get("materias_reprobadas", 0) >= 4:
        puntuacion += 10
        factores.append("multiple_reprobacion")
        puntos_por_factor.append(("4+ materias reprobadas", 10))
    elif row.get("materias_reprobadas", 0) >= 2:
        puntuacion += 5
        factores.append("materias_reprobadas")
        puntos_por_factor.append(("2+ materias reprobadas", 5))

    if row.get("tiene_sobreedad", 0) == 1:
        puntuacion += 8
        factores.append("sobreedad")
        puntos_por_factor.append(("sobreedad", 8))

    if row.get("edad_actual", 15) - row.get("edad_esperada", 15) >= 3:
        puntuacion += 8
        factores.append("alta_sobreedad")
        puntos_por_factor.append(("edad >> esperada", 8))

    if row.get("horas_trabajo_semanales", 0) >= 30:
        puntuacion += 18
        factores.append("trabajo_intensivo")
        puntos_por_factor.append(("30+ horas trabajo", 10))
    elif row.get("horas_trabajo_semanales", 0) >= 15:
        puntuacion += 5
        factores.append("trabajo_moderado")
        puntos_por_factor.append(("15+ horas trabajo", 5))

    # ─── NORMALIZAR A [0, 1] ───
    # Puntuación máxima teórica ~200, pero normalizamos con sigmoide suave
    # para que casos extremos den ~0.95 y casos normales ~0.05
    probabilidad_reglas = 1.0 / (1.0 + np.exp(-0.035 * (puntuacion - 25)))

    logger.info("📊 Puntuación reglas: %.1f puntos | Prob reglas: %.4f | Factores: %s",
                puntuacion, probabilidad_reglas, puntos_por_factor)

    return float(probabilidad_reglas), factores[:5]


def combinar_probabilidades(prob_ml: float, prob_reglas: float, peso_ml: float = 0.35) -> float:
    """
    Combina ML + Reglas con protección fuerte para casos extremos.
    """
    # Caso 1: Las reglas detectan riesgo MUY ALTO → forzar alto/crítico
    if prob_reglas >= 0.85:
        # Damos mucho peso a las reglas
        combinada = 0.20 * prob_ml + 0.80 * prob_reglas
        combinada = min(0.97, combinada + 0.05)  # boost extra
        return float(np.clip(combinada, 0.0, 0.9999))

    # Caso 2: Reglas altas y ML bajo (el bug típico)
    if prob_reglas > 0.70 and prob_ml < 0.40:
        combinada = 0.30 * prob_ml + 0.70 * prob_reglas
        combinada = min(0.95, combinada + 0.08)
        return float(np.clip(combinada, 0.0, 0.9999))

    # Caso 3: Ambos detectan riesgo moderado/alto
    if prob_ml > 0.45 and prob_reglas > 0.45:
        combinada = peso_ml * prob_ml + (1 - peso_ml) * prob_reglas
        combinada = min(0.99, combinada * 1.12)
        return float(np.clip(combinada, 0.0, 0.9999))

    # Caso normal
    combinada = peso_ml * prob_ml + (1 - peso_ml) * prob_reglas
    return float(np.clip(combinada, 0.0, 0.9999))


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
    for col in BOOLEAN_COLUMNS:
        if col in df.columns:
            df[col] = df[col].fillna(False).astype(int)

    # ─── Manejar valores nulos en columnas NUMÉRICAS ───
    for col in NUMERIC_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
            df[col] = df[col].fillna(0)

    # ─── Manejar valores nulos en columnas CATEGÓRICAS ───
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
    """Selecciona y ordena las columnas de features."""
    all_feature_cols = CATEGORICAL_COLUMNS + BOOLEAN_COLUMNS + NUMERIC_COLUMNS
    available_cols = [c for c in all_feature_cols if c in df.columns]
    for col in NUMERIC_COLUMNS:
        if col not in available_cols and col in df.columns:
            available_cols.append(col)
    return df[available_cols]


# ═══════════════════════════════════════════════════════════════════════
# CARGA DE MODELO
# ═══════════════════════════════════════════════════════════════════════

def cargar_modelo() -> bool:
    """Carga el modelo, scaler y encoders desde disco."""
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
    logger.info("🚀 Microservicio ML iniciado en http://localhost:8000")
    cargar_modelo()


@app.get("/", response_model=Dict[str, str])
async def root():
    return {
        "servicio": "ML - Detección de Abandono Escolar",
        "version": "2.0.0",
        "modelo": "Híbrido (LogisticRegression + Reglas de Negocio)",
        "endpoints": "/train, /predict, /health",
    }


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        modelo_cargado=modelo_global is not None,
        timestamp=datetime.now().isoformat(),
    )


@app.post("/train", response_model=TrainResponse)
async def train():
    """
    Descarga datos desde NestJS, entrena el modelo Logistic Regression
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
            detail=f"No se pudo conectar con NestJS en {NESTJS_URL}. Verifica que esté corriendo."
        )
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=502,
            detail=f"NestJS respondió con error: {e.response.status_code}."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error descargando datos: {str(e)}")

    # Convertir a DataFrame
    if isinstance(data, list):
        df = pd.DataFrame(data)
    elif isinstance(data, dict) and "data" in data:
        df = pd.DataFrame(data["data"])
    elif isinstance(data, dict):
        list_keys = [k for k, v in data.items() if isinstance(v, list) and len(v) > 0]
        if list_keys:
            df = pd.DataFrame(data[list_keys[0]])
            logger.info("📦 Dataset encontrado en clave: %s", list_keys[0])
        else:
            raise HTTPException(
                status_code=422,
                detail=f"Formato inesperado. Claves: {list(data.keys())}"
            )
    else:
        raise HTTPException(status_code=422, detail="Formato inesperado. Se esperaba lista.")

    total_registros = len(df)
    logger.info("📊 Dataset recibido: %d registros", total_registros)
    logger.info("📋 Columnas recibidas: %s", list(df.columns))

    if total_registros < 30:
        raise HTTPException(
            status_code=422,
            detail=f"Datos insuficientes. Se necesitan al menos 30 registros. Actual: {total_registros}"
        )

    if "abandono" not in df.columns:
        raise HTTPException(
            status_code=422,
            detail="La columna 'abandono' no está presente en el dataset."
        )

    clases = df["abandono"].value_counts()
    logger.info("📈 Distribución de clases: %s", dict(clases))

    if len(clases) < 2:
        raise HTTPException(
            status_code=422,
            detail="El dataset solo tiene una clase. Se necesitan ambas clases (0 y 1)."
        )

    # Preprocesamiento
    df = preparar_dataframe(df, entrenamiento=True)
    df, encoders = aplicar_encoding(df, entrenamiento=True)

    # Features y target
    X = obtener_features(df)
    y = df["abandono"].astype(int)

    feature_columns = list(X.columns)
    logger.info("🔧 Features (%d): %s", len(feature_columns), feature_columns)

    # División train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Escalado
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Entrenar Logistic Regression (más robusta para datos tabulares)
    logger.info("🤖 Entrenando Logistic Regression...")
    modelo = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        random_state=42,
        solver="lbfgs",
        C=0.5,  # Regularización moderada para evitar sobreajuste
    )
    modelo.fit(X_train_scaled, y_train)

    # Evaluación
    y_pred = modelo.predict(X_test_scaled)
    y_prob = modelo.predict_proba(X_test_scaled)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    auc = roc_auc_score(y_test, y_prob)

    logger.info("📊 Métricas - Acc: %.4f | Prec: %.4f | Rec: %.4f | F1: %.4f | AUC: %.4f",
                acc, prec, rec, f1, auc)

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
        modelo="logistic_regression_v2",
        total_registros=total_registros,
        entrenamiento_registros=len(X_train),
        test_registros=len(X_test),
        accuracy=round(acc, 4),
        precision=round(prec, 4),
        recall=round(rec, 4),
        f1_score=round(f1, 4),
        auc_roc=round(auc, 4),
        timestamp=datetime.now().isoformat(),
        mensaje="Modelo entrenado y guardado exitosamente.",
    )


@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    """
    Recibe los datos de un estudiante y predice la probabilidad de abandono.
    Usa un modelo HÍBRIDO: ML + Reglas de negocio.
    """
    global modelo_global, scaler_global, encoders_global, feature_columns

    if modelo_global is None:
        if not cargar_modelo():
            raise HTTPException(
                status_code=503,
                detail="El modelo no está entrenado. Ejecuta POST /train primero."
            )

    try:
        # Convertir request a DataFrame
        data_dict = request.model_dump()
        df = pd.DataFrame([data_dict])

        # ─── PASO 1: Calcular puntuación por REGLAS ───
        row = pd.Series(data_dict)
        prob_reglas, factores_reglas = calcular_puntuacion_reglas(row)

        # ─── PASO 2: Calcular probabilidad con MODELO ML ───
        df = preparar_dataframe(df, entrenamiento=False)
        df, _ = aplicar_encoding(df, entrenamiento=False, encoders=encoders_global)
        X = obtener_features(df)

        if feature_columns:
            for col in feature_columns:
                if col not in X.columns:
                    raise HTTPException(
                        status_code=422,
                        detail=f"Falta la columna: '{col}'. Verifica el payload."
                    )
            X = X[feature_columns]

        if scaler_global is not None:
            X_scaled = scaler_global.transform(X)
        else:
            X_scaled = X.values

        prob_ml = float(modelo_global.predict_proba(X_scaled)[0][1])
        prob_ml = float(np.clip(prob_ml, 0.0, 0.9999))

        # ─── PASO 3: COMBINAR ambas probabilidades ───
        prob_final = combinar_probabilidades(prob_ml, prob_reglas)

        # ─── REGLA DURA DE NEGOCIO ───
        if (row.get("es_trabajador_infantil", False) and 
            row.get("horas_trabajo_semanales", 0) >= 25 and
            (row.get("es_victima_violencia", False) or 
            row.get("consumo_sustancias", False) or 
            row.get("ha_abandonado_previamente", False))):
            
            prob_final = max(prob_final, 0.72)   # fuerza mínimo "alto"
            if "trabajo_intensivo_critico" not in factores_reglas:
                factores_reglas.insert(0, "trabajo_intensivo_critico")

        # ─── PASO 4: Determinar nivel de riesgo y factores ───
        nivel_riesgo = determinar_nivel_riesgo(prob_final)

        # Si las reglas detectaron factores, usarlos; si no, generar genéricos
        if not factores_reglas and prob_final >= 0.20:
            if prob_ml > 0.5:
                factores_reglas = ["patron_complejo_riesgo_ml"]
            else:
                factores_reglas = ["factores_moderados"]

        logger.info(
            "🔮 Predicción - Estudiante %d | ML: %.4f | Reglas: %.4f | FINAL: %.4f | Riesgo: %s | Factores: %s",
            request.id_estudiante, prob_ml, prob_reglas, prob_final, nivel_riesgo, factores_reglas
        )

        return PredictResponse(
            probabilidad=round(prob_final, 4),
            nivel_riesgo=nivel_riesgo,
            factores=factores_reglas,
            modelo="hybrid_ml_rules_v2",
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