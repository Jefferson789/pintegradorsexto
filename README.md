levantar backend
1. crear la base en MySQL
CREATE DATABASE abandono_escolar_uef;
2. importar en MySQL el archivo sql de la base 
3. descomprimir backend repositorio
4. entrar en la carpeta nestpi aquí esta el backend hecho en nest
cd nestpi
5. ejecutar los comandos de instalación y ejecución
pnpm install
npm run start
6. en otra terminal entrar a la carpeta ml-service aquí es donde esta el modelo
cd ml-service
7. crear y activar un entorno virtual Python recomendado 
python -m venv .venv
.\.venv\Scripts\Activate
8. instalar requerimientos
pip install -r requirements.txt
9. ejecutar modelo
uvicorn main:app --reload --port 8000
