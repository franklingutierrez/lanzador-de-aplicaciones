# 🚀 Lanzador de Aplicaciones

Una aplicación web moderna y funcional para organizar y ejecutar aplicaciones de tu PC desde un interfaz intuitivo y elegante.

## ✨ Características

- **Organización por categorías**: Trabajo, Entretenimiento, Utilidades, Desarrollo, Multimedia y Otros
- **Búsqueda inteligente**: Encuentra aplicaciones rápidamente por nombre o categoría
- **Iconos personalizables**: Elige entre múltiples iconos para cada aplicación
- **Interfaz moderna**: Diseño responsive con animaciones suaves y efectos visuales
- **Almacenamiento local**: Tus aplicaciones se guardan automáticamente en el navegador
- **Atajos de teclado**: Navegación rápida con combinaciones de teclas

## 🎯 Cómo usar

### 1. Abrir la aplicación
- Haz doble clic en `index.html` para abrir la aplicación en tu navegador predeterminado
- También puedes arrastrar el archivo al navegador

### 2. Agregar aplicaciones
1. Haz clic en el botón **"Agregar Aplicación"**
2. Completa los campos:
   - **Nombre**: Como quieres que aparezca la aplicación
   - **Ruta del ejecutable**: Ubicación del archivo .exe
   - **Categoría**: Selecciona la categoría apropiada
   - **Icono**: Elige un icono representativo
3. Haz clic en **"Guardar Aplicación"**

### 3. Ejecutar aplicaciones
- Haz clic en cualquier tarjeta de aplicación para ejecutarla
- La aplicación intentará abrir el programa especificado

### 4. Organizar aplicaciones
- **Filtrar por categoría**: Usa los botones de categoría en la parte superior
- **Buscar**: Escribe en la barra de búsqueda para encontrar aplicaciones
- **Eliminar**: Haz clic en el icono de basura que aparece al pasar el mouse sobre una aplicación

## ⌨️ Atajos de teclado

- **Ctrl + N**: Agregar nueva aplicación
- **Ctrl + F**: Enfocar barra de búsqueda  
- **Escape**: Cerrar modales abiertos

## 🛠️ Configuración inicial

La aplicación incluye tres aplicaciones de ejemplo:
- **Notepad** (Bloc de notas)
- **Calculator** (Calculadora)  
- **Paint** (Microsoft Paint)

Estas son aplicaciones comunes de Windows que deberían funcionar en la mayoría de sistemas.

## 📁 Estructura de archivos

```
web/
├── index.html          # Archivo principal de la aplicación
├── styles.css          # Estilos y diseño
├── script.js           # Funcionalidad JavaScript
└── README.md           # Este archivo de instrucciones
```

## 🔧 Personalización

### Agregar nuevas categorías
Para agregar categorías personalizadas, edita el archivo `script.js` y modifica:
1. Los botones de categoría en `index.html`
2. La función `getCategoryDisplayName()` 
3. Las opciones del select en el modal

### Cambiar iconos
La aplicación usa FontAwesome 6.0. Puedes agregar más iconos editando la sección `icon-options` en `index.html`.

## ⚠️ Limitaciones importantes

1. **Ejecución de aplicaciones**: En navegadores web normales, la ejecución de aplicaciones externas está limitada por seguridad. La funcionalidad completa requiere:
   - Un entorno Electron (aplicación de escritorio)
   - Permisos especiales del sistema
   - O usar la aplicación como referencia visual

2. **Rutas de archivos**: Asegúrate de usar rutas completas y correctas a los archivos ejecutables.

3. **Compatibilidad**: Diseñado principalmente para Windows, pero puede adaptarse para otros sistemas operativos.

## 🌟 Consejos de uso

- **Rutas comunes de aplicaciones en Windows**:
  - `C:\Program Files\` - Aplicaciones de 64 bits
  - `C:\Program Files (x86)\` - Aplicaciones de 32 bits
  - `C:\Windows\System32\` - Utilidades del sistema
  - `%USERPROFILE%\AppData\Local\` - Aplicaciones del usuario

- **Encontrar rutas de ejecutables**:
  - Haz clic derecho en un acceso directo → Propiedades → ver "Destino"
  - Usa el Administrador de tareas → pestaña Detalles → columna "Nombre"

## 🔄 Actualizaciones futuras

Características planeadas:
- Exportar/importar configuración
- Temas personalizables
- Integración con el registro de Windows
- Soporte para argumentos de línea de comandos
- Estadísticas de uso

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, puedes:
1. Verificar que las rutas de las aplicaciones sean correctas
2. Comprobar que tengas permisos para ejecutar las aplicaciones
3. Revisar la consola del navegador (F12) para errores

---

**¡Disfruta organizando tus aplicaciones de una manera moderna y eficiente!** 🎉