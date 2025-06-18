document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const loginScreen = document.getElementById('loginScreen');
    const mainScreen = document.getElementById('mainScreen');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const signupFormContainer = document.getElementById('signupFormContainer');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const currentUsername = document.getElementById('currentUsername');
    const generateBtn = document.getElementById('generateBtn');
    const skinContainer = document.getElementById('skinContainer');
    const loading = document.getElementById('loading');
    const loadingDots = document.getElementById('loadingDots');
    const historyLimitElement = document.getElementById('historyLimit');
    
    // Configurações
    const HISTORY_LIMIT = 5;
    historyLimitElement.textContent = HISTORY_LIMIT;
    
    // Histórico de skins
    let skinsHistory = [];
    
    // Alternar entre abas
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginFormContainer.style.display = 'block';
        signupFormContainer.style.display = 'none';
    });
    
    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';
    });
    
    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Resetar erros
        document.querySelectorAll('#loginForm .error').forEach(el => {
            el.classList.remove('active');
        });
        
        // Obter valores
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        let isValid = true;
        
        // Validar username
        if (username.length === 0) {
            document.getElementById('loginUsernameError').classList.add('active');
            isValid = false;
        }
        
        // Validar senha
        if (password.length === 0) {
            document.getElementById('loginPasswordError').classList.add('active');
            isValid = false;
        }
        
        // Se válido, logar
        if (isValid) {
            currentUsername.textContent = username;
            loginScreen.classList.remove('active');
            mainScreen.classList.add('active');
            
            // Salvar dados no localStorage
            localStorage.setItem('mcUser', JSON.stringify({
                username: username
            }));
        }
    });
    
    // Cadastro
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Resetar erros
        document.querySelectorAll('#signupForm .error').forEach(el => {
            el.classList.remove('active');
        });
        
        // Obter valores
        const username = document.getElementById('signupUsername').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        let isValid = true;
        
        // Validar username
        if (username.length < 3) {
            document.getElementById('signupUsernameError').classList.add('active');
            isValid = false;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('signupEmailError').classList.add('active');
            isValid = false;
        }
        
        // Validar senha
        if (password.length < 6) {
            document.getElementById('signupPasswordError').classList.add('active');
            isValid = false;
        }
        
        // Confirmar senha
        if (password !== confirmPassword) {
            document.getElementById('signupConfirmPasswordError').classList.add('active');
            isValid = false;
        }
        
        // Se válido, logar
        if (isValid) {
            currentUsername.textContent = username;
            loginScreen.classList.remove('active');
            mainScreen.classList.add('active');
            
            // Salvar dados no localStorage
            localStorage.setItem('mcUser', JSON.stringify({
                username: username,
                email: email
            }));
            
            // Voltar para aba de login
            loginTab.click();
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('mcUser');
        skinsHistory = [];
        skinContainer.innerHTML = '<div class="no-skins">Nenhuma skin gerada ainda. Clique no botão acima para começar!</div>';
        loginScreen.classList.add('active');
        mainScreen.classList.remove('active');
        loginForm.reset();
        signupForm.reset();
        loginTab.click();
    });
    
    // Verificar se usuário já está logado
    const savedUser = localStorage.getItem('mcUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        currentUsername.textContent = user.username;
        loginScreen.classList.remove('active');
        mainScreen.classList.add('active');
    }
    
    // Gerar skin
    generateBtn.addEventListener('click', async () => {
        loading.classList.add('active');
        animateLoading();
        
        try {
            const skin = await fetchRandomSkin();
            
            // Adicionar ao histórico (limitar a HISTORY_LIMIT)
            skinsHistory.unshift(skin);
            if (skinsHistory.length > HISTORY_LIMIT) {
                skinsHistory.pop();
            }
            
            // Atualizar UI
            updateSkinDisplay();
        } catch (error) {
            console.error('Erro ao buscar skin:', error);
            alert('Ocorreu um erro ao buscar a skin. Tente novamente!');
        } finally {
            loading.classList.remove('active');
        }
    });
    
    // Animação de loading
    function animateLoading() {
        let dots = 0;
        const interval = setInterval(() => {
            if (!loading.classList.contains('active')) {
                clearInterval(interval);
                return;
            }
            dots = (dots + 1) % 4;
            loadingDots.textContent = '.'.repeat(dots);
        }, 300);
    }
    
    // Buscar skin aleatória - CORREÇÃO DO VERCEL
    async function fetchRandomSkin() {
        // Gerar UUID aleatório válido
        const uuid = generateRandomUUID();
        
        // URL da skin no formato NameMC
        const skinUrl = `https://render.namemc.com/skin/3d/body.png?skin=${uuid}&model=classic`;
        
        // URL do perfil no NameMC
        const profileUrl = `https://namemc.com/profile/${uuid}`;
        
        // Gerar nome aleatório
        const prefixes = ['End', 'Creeper', 'Zom', 'Skele', 'Vill', 'Nether', 'Over'];
        const suffixes = ['man', 'craft', 'mine', 'stone', 'wood', 'pick', 'axe'];
        
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const randomNumber = Math.floor(Math.random() * 99) + 1;
        const randomName = randomPrefix + randomSuffix + randomNumber;
        
        return {
            name: randomName,
            uuid: uuid,
            skinUrl: skinUrl,
            profileUrl: profileUrl,
            timestamp: new Date().toLocaleTimeString()
        };
    }
    
    // Gerar UUID aleatório
    function generateRandomUUID() {
        const hex = '0123456789abcdef';
        let uuid = '';
        
        for (let i = 0; i < 32; i++) {
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += hex[Math.floor(Math.random() * 16)];
        }
        
        return uuid;
    }
    
    // Atualizar display de skins
    function updateSkinDisplay() {
        // Remover mensagem "sem skins"
        if (skinContainer.querySelector('.no-skins')) {
            skinContainer.innerHTML = '';
        }
        
        if (skinsHistory.length === 0) {
            skinContainer.innerHTML = '<div class="no-skins">Nenhuma skin gerada ainda. Clique no botão acima para começar!</div>';
            return;
        }
        
        skinContainer.innerHTML = '';
        
        skinsHistory.forEach(skin => {
            const skinCard = document.createElement('div');
            skinCard.className = 'skin-card';
            skinCard.innerHTML = `
                <div class="skin-title">${skin.name}</div>
                <div class="skin-meta">Gerado em: ${skin.timestamp}</div>
                <a href="${skin.profileUrl}" target="_blank">
                    <img src="${skin.skinUrl}" alt="Skin de ${skin.name}" class="skin-image">
                </a>
                <div class="player-name">UUID: ${skin.uuid}</div>
            `;
            skinContainer.appendChild(skinCard);
        });
    }
});