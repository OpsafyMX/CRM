# Instrucciones de Instalación

## Problema: PowerShell Execution Policy

Si encuentras el error de "la ejecución de scripts está deshabilitada", sigue estas instrucciones:

### Solución Rápida: Usar CMD

1. Abre el **Símbolo del sistema (CMD)** presionando `Win + R`, escribe `cmd` y presiona Enter

2. Navega al directorio del proyecto:
   ```cmd
   cd C:\Users\Rey-Orozco\.gemini\antigravity\scratch\crm-system
   ```

3. Instala las dependencias:
   ```cmd
   npm install
   ```

4. Inicia el proyecto:
   ```cmd
   npm run dev
   ```

5. La aplicación se abrirá automáticamente en tu navegador en `http://localhost:5173`

### Solución Alternativa: Habilitar en PowerShell

Si prefieres usar PowerShell:

1. Abre PowerShell como **Administrador** (click derecho → Ejecutar como administrador)

2. Ejecuta:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. Confirma con "S" cuando te lo pida

4. Ahora puedes usar PowerShell normalmente:
   ```powershell
   cd C:\Users\Rey-Orozco\.gemini\antigravity\scratch\crm-system
   npm install
   npm run dev
   ```

## Credenciales de Prueba

Una vez que la aplicación esté corriendo:

- **Email**: admin@crm.com
- **Password**: admin123

O crea una nueva cuenta usando el formulario de registro.

## ¿Necesitas ayuda?

Si tienes algún problema, revisa el archivo README.md para más información.
