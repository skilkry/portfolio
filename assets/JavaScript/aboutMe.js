// about.js (versión con detección de sistema)

document.addEventListener('DOMContentLoaded', () => {
    const outputElement = document.getElementById('bios-output');
    
    // --- LÓGICA DE DETECCIÓN DEL SISTEMA ---
    
    async function getGpuInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                }
            }
            return 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }

    async function detectSystemInfo() {
        const info = {
            cpuCores: navigator.hardwareConcurrency || 'N/A',
            memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB (aprox.)` : 'N/A',
            os: 'N/A',
            browser: 'N/A',
            gpu: await getGpuInfo()
        };

        const ua = navigator.userAgent;
        if (ua.indexOf("Win") != -1) info.os = "Windows";
        if (ua.indexOf("Mac") != -1) info.os = "macOS";
        if (ua.indexOf("Linux") != -1) info.os = "Linux";

        if (ua.indexOf("Firefox") != -1) info.browser = "Firefox";
        if (ua.indexOf("Chrome") != -1 && ua.indexOf("Edg") == -1) info.browser = "Chrome";
        if (ua.indexOf("Safari") != -1 && ua.indexOf("Chrome") == -1) info.browser = "Safari";
        
        return info;
    }

    // --- LÓGICA DE LA ANIMACIÓN ---

    const charSpeed = 40; 
    const lineSpeed = 500;

    let cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.innerHTML = '█';

    async function typeLine(line) {
        for (let i = 0; i < line.length; i++) {
            outputElement.innerHTML += line.charAt(i);
            await new Promise(resolve => setTimeout(resolve, charSpeed));
        }
        outputElement.innerHTML += '\n';
        outputElement.appendChild(cursor); // Mueve el cursor al final de la nueva línea
    }
    
    async function bootSequence() {
        const systemInfo = await detectSystemInfo();

        // --- ¡PERSONALIZA TU BIO AQUÍ USANDO LOS DATOS RECOPILADOS! ---
        const linesToType = [
            "Booting SKILKRY.SYS v3.0 (Dynamic BIOS)...",
            "Memory Check... " + (systemInfo.memory !== 'N/A' ? systemInfo.memory : '...OK'),
            `CPU Core Check... ${systemInfo.cpuCores} Cores Detected`,
            `OS Detected... ${systemInfo.os}`,
            `GPU Renderer... ${systemInfo.gpu}`,
            "All systems nominal.",
            "> RUN skilkry.bio",
            "",
            "> IDENTIDAD: Daniel (alias: Skilkry)",
            "> CLASE: Ingeniero de Software & Analista de Seguridad",
            "",
            "> HABILIDADES_CLAVE:",
            "  - Frontend: [JavaScript, TypeScript, React, HTML5, CSS3]",
            "  - Backend: [Python, FastAPI, Node.js]",
            "  - Seguridad/DevOps: [Frida, Burp Suite, Docker, Git]",
            "",
            "> ESTADO_ACTUAL: En busca de nuevos retos.",
            "> [Volver al Portfolio Principal]",
            ""
        ];

        for (let i = 0; i < linesToType.length; i++) {
            await typeLine(linesToType[i]);
            // Pausa más larga para las líneas importantes
            const pause = (linesToType[i].startsWith('>') || linesToType[i] === "") ? lineSpeed : charSpeed * 2;
            await new Promise(resolve => setTimeout(resolve, pause));
        }
    }
    
    // Iniciamos la secuencia de arranque
    bootSequence();
});