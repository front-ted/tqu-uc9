var unityInstance = null;

document.addEventListener("DOMContentLoaded", function() {
    const clickSound = document.getElementById("click-sound");
    const buttons = document.querySelectorAll("button");

    buttons.forEach(button => {
        // Evento de clique para reproduzir o som
        button.addEventListener("click", function() {
            clickSound.currentTime = 0;  // Rewind to the start
            clickSound.play();
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var menuPanel = document.getElementById('menu-panel');
    var menuButton = document.getElementById('menu');
    
    // Calcula a largura do painel e ajusta a posição inicial
    var panelWidth = menuPanel.offsetWidth;
    menuPanel.style.right = `-${panelWidth}px`;

    menuButton.addEventListener('click', function() {
        if (menuPanel.classList.contains('open')) {
            menuPanel.classList.remove('open');
            menuPanel.style.right = `-${panelWidth}px`;
            menuButton.style.right = '0';
        } else {
            menuPanel.classList.add('open');
            menuPanel.style.right = '0';
            menuButton.style.right = `${panelWidth}px`;
        }
    });
});

function updateProgressBar(value) {
    const filler = document.getElementById('progressFiller');
    filler.style.width = `${Math.min(value * 100, 100)}%`;
    if (value >= 1) {
        filler.style.animation = 'none';
        filler.style.backgroundColor = '#00ff00'; // Cor de destaque ao finalizar
    }
}

function updateButtonIcon() {
    const icon = document.getElementById("fullscreen-icon");
    if (document.fullscreenElement) {
        icon.src = "image/zoom-out.png";
    } else {
        icon.src = "image/zoom-in.png";
    }
}

function toggleFullscreen() {
    let docElm = document.documentElement;
    if (!document.fullscreenElement) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.webkitRequestFullscreen) { 
            docElm.webkitRequestFullscreen(); 
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen(); 
        }
    }
}

function disableF11(event) {
    if (event.key === "F11") {
        event.preventDefault();
        alert("Use o botão de ZOOM para zoom in e zoom out");
    }
}

function resizeCanvas() {
    const canvas = document.getElementById("unityCanvas");
    const container = document.getElementById("unityContainer");
    const containerAspectRatio = container.clientWidth / container.clientHeight;
    const canvasAspectRatio = 16 / 9;
    
    if (containerAspectRatio > canvasAspectRatio) {
        canvas.style.width = `${container.clientHeight * canvasAspectRatio}px`;
        canvas.style.height = `${container.clientHeight}px`;
    } else {
        canvas.style.width = `${container.clientWidth}px`;
        canvas.style.height = `${container.clientWidth / canvasAspectRatio}px`;
    }

    if (unityInstance != null) {
        unityInstance.SendMessage('CanvasResizeHandler', 'OnResize', `${canvas.width},${canvas.height}`);
    }
}

function applyFilter(filterType) {
    const body = document.body;
    body.classList.remove('grayscale', 'deuteranopia', 'protanopia', 'tritanopia');
    
    if (filterType !== 'normal') {
        body.classList.add(filterType);
    }
}

// Desabilitar F11
document.addEventListener("keydown", disableF11);

// Atualiza o ícone ao carregar a página
document.addEventListener('DOMContentLoaded', updateButtonIcon);

// Verifica se a tela cheia foi ativada ou desativada
document.addEventListener('fullscreenchange', updateButtonIcon);

window.addEventListener("resize", resizeCanvas);

// Carrega o Unity WebGL
var script = document.createElement("script");
script.src = "Build/Build.loader.js";
script.onload = () => {
    // Criar a instância Unity com progressão de carregamento
    createUnityInstance(document.querySelector("#unityCanvas"), {
        dataUrl: "Build/Build.data.unityweb",
        frameworkUrl: "Build/Build.framework.js.unityweb",
        codeUrl: "Build/Build.wasm.unityweb",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "SenacRS",
        productName: "UnityTemplate2024",
        productVersion: "0.1.0",
    }, (progress) => {
        // Atualizar barra de progresso
        updateProgressBar(progress);
    }).then(function (instance) {
        unityInstance = instance;

        // Ocultar a barra de carregamento quando o conteúdo estiver totalmente carregado
        var loadingBar = document.getElementById("loadingBar");
        if (loadingBar) {
            loadingBar.style.display = "none";
        }

        // Reaplica o estilo e garante o redimensionamento após o carregamento completo
        resizeCanvas();
    }).catch(function (message) {
        alert(message);
    });
};
// Adicionar o script ao documento
document.body.appendChild(script);


