// Configuración centralizada de categorías e iconos
const CATEGORIES = [
    { value: 'trabajo', label: 'Trabajo', icon: 'fas fa-briefcase' },
    { value: 'entretenimiento', label: 'Entretenimiento', icon: 'fas fa-gamepad' },
    { value: 'utilidades', label: 'Utilidades', icon: 'fas fa-tools' },
    { value: 'desarrollo', label: 'Desarrollo', icon: 'fas fa-code' },
    { value: 'multimedia', label: 'Multimedia', icon: 'fas fa-photo-video' },
    { value: 'otros', label: 'Otros', icon: 'fas fa-folder' }
];
const ICONS = [
    'fas fa-desktop','fas fa-gamepad','fas fa-code','fas fa-paint-brush','fas fa-music','fas fa-video','fas fa-calculator','fas fa-globe','fas fa-file-text','fas fa-camera','fas fa-cog','fas fa-terminal',
    'fas fa-book','fas fa-bookmark','fas fa-bug','fas fa-bolt','fas fa-bell','fas fa-cloud','fas fa-database','fas fa-envelope','fas fa-heart','fas fa-lightbulb','fas fa-map','fas fa-mobile','fas fa-print','fas fa-search','fas fa-shield-alt','fas fa-star','fas fa-sync','fas fa-tasks','fas fa-user','fas fa-users','fas fa-wifi','fas fa-wrench','fas fa-rocket','fas fa-shopping-cart','fas fa-chart-bar','fas fa-clipboard','fas fa-comment','fas fa-folder-open','fas fa-key','fas fa-lock','fas fa-microphone','fas fa-paperclip','fas fa-plug','fas fa-power-off','fas fa-question','fas fa-rss','fas fa-save','fas fa-server','fas fa-share','fas fa-sitemap','fas fa-sliders-h','fas fa-thumbs-up','fas fa-trash-alt','fas fa-unlock','fas fa-upload','fas fa-volume-up','fas fa-wallet','fas fa-window-maximize'
];

class AppLauncher {
    constructor() {
        this.apps = JSON.parse(localStorage.getItem('launcherApps') || '[]');
        this.currentCategory = 'all';
        this.selectedIcon = 'fas fa-desktop';
        this.appToDelete = null;
        this.draggedAppId = null;
        this.initializeEventListeners();
        this.renderApps();
        if (this.apps.length === 0) {
            this.addExampleApps();
        }
    }

    initializeEventListeners() {
        document.getElementById('addAppBtn').addEventListener('click', () => this.showAddAppModal());
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByCategory(e.currentTarget.dataset.category));
        });
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchApps(e.target.value));
        document.querySelectorAll('#addAppModal .close').forEach(btn => btn.addEventListener('click', () => this.hideModal('addAppModal')));
        document.getElementById('cancelBtn').addEventListener('click', () => this.hideModal('addAppModal'));
        document.getElementById('addAppForm').addEventListener('submit', (e) => { e.preventDefault(); this.addApp(); });
        document.getElementById('browseBtn').addEventListener('click', () => this.browseForFile());
        document.querySelectorAll('#deleteModal .close').forEach(btn => btn.addEventListener('click', () => this.hideModal('deleteModal')));
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.hideModal('deleteModal'));
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => this.confirmDelete());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportApps());
        document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFileInput').click());
        document.getElementById('importFileInput').addEventListener('change', (e) => this.importApps(e));
        document.querySelectorAll('#editAppModal .close').forEach(btn => btn.addEventListener('click', () => this.hideModal('editAppModal')));
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.hideModal('editAppModal'));
        document.getElementById('editAppForm').addEventListener('submit', (e) => { e.preventDefault(); this.saveEditApp(); });
        document.getElementById('editBrowseBtn').addEventListener('click', () => this.browseForFileEdit());
        // Iconos agregar
        document.querySelectorAll('#iconOptions .icon-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('#iconOptions .icon-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedIcon = btn.dataset.icon;
                document.getElementById('selectedIcon').value = this.selectedIcon;
            });
        });
        // Cerrar modal al hacer click fuera
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
    }

    showAddAppModal() {
        document.getElementById('addAppModal').style.display = 'block';
        document.getElementById('appName').focus();
        this.resetForm();
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    resetForm() {
        document.getElementById('addAppForm').reset();
        this.selectedIcon = 'fas fa-desktop';
        document.getElementById('selectedIcon').value = this.selectedIcon;
        document.querySelectorAll('#iconOptions .icon-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('#iconOptions .icon-btn[data-icon="fas fa-desktop"]').classList.add('active');
    }

    browseForFile() {
        if (window.electronAPI && window.electronAPI.openFileDialog) {
            window.electronAPI.openFileDialog().then(filePath => {
                if (filePath) {
                    document.getElementById('appPath').value = filePath;
                    if (!document.getElementById('appName').value) {
                        const name = filePath.split(/[\\/]/).pop().replace(/\.[^/.]+$/, "");
                        document.getElementById('appName').value = name;
                    }
                }
            });
        }
    }

    browseForFileEdit() {
        if (window.electronAPI && window.electronAPI.openFileDialog) {
            window.electronAPI.openFileDialog().then(filePath => {
                if (filePath) {
                    document.getElementById('editAppPath').value = filePath;
                    if (!document.getElementById('editAppName').value) {
                        const name = filePath.split(/[\\/]/).pop().replace(/\.[^/.]+$/, "");
                        document.getElementById('editAppName').value = name;
                    }
                }
            });
        }
    }

    addApp() {
        const name = document.getElementById('appName').value.trim();
        const path = document.getElementById('appPath').value.trim();
        const category = document.getElementById('appCategory').value;
        const icon = this.selectedIcon;
        if (!name || !path) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }
        const newApp = {
            id: Date.now().toString(),
            name,
            path,
            category,
            icon,
            dateAdded: new Date().toISOString()
        };
        this.apps.push(newApp);
        this.saveApps();
        this.renderApps();
        this.hideModal('addAppModal');
        this.showNotification(`"${name}" se ha agregado correctamente.`);
    }

    editApp(appId) {
        const app = this.apps.find(a => a.id === appId);
        if (!app) return;
        document.getElementById('editAppId').value = app.id;
        document.getElementById('editAppName').value = app.name;
        document.getElementById('editAppPath').value = app.path;
        document.getElementById('editAppCategory').value = app.category;
        this.fillEditIcons(app.icon);
        document.getElementById('editAppModal').style.display = 'block';
    }

    fillEditIcons(selectedIcon) {
        const icons = [
            'fas fa-desktop','fas fa-gamepad','fas fa-code','fas fa-paint-brush','fas fa-music','fas fa-video','fas fa-calculator','fas fa-globe','fas fa-file-text','fas fa-camera','fas fa-cog','fas fa-terminal'
        ];
        const container = document.getElementById('editIconOptions');
        container.innerHTML = '';
        icons.forEach(icon => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'icon-btn' + (icon === selectedIcon ? ' active' : '');
            btn.dataset.icon = icon;
            btn.innerHTML = `<i class="${icon}"></i>`;
            btn.onclick = () => {
                document.querySelectorAll('#editIconOptions .icon-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('editSelectedIcon').value = icon;
            };
            container.appendChild(btn);
        });
        document.getElementById('editSelectedIcon').value = selectedIcon;
    }

    saveEditApp() {
        const id = document.getElementById('editAppId').value;
        const name = document.getElementById('editAppName').value.trim();
        const path = document.getElementById('editAppPath').value.trim();
        const category = document.getElementById('editAppCategory').value;
        const icon = document.getElementById('editSelectedIcon').value;
        const idx = this.apps.findIndex(a => a.id === id);
        if (idx > -1) {
            this.apps[idx].name = name;
            this.apps[idx].path = path;
            this.apps[idx].category = category;
            this.apps[idx].icon = icon;
            this.saveApps();
            this.renderApps();
            this.hideModal('editAppModal');
            this.showNotification('Aplicación editada correctamente.');
        }
    }

    deleteApp(appId) {
        this.appToDelete = appId;
        document.getElementById('deleteModal').style.display = 'block';
    }

    confirmDelete() {
        if (this.appToDelete) {
            const appIndex = this.apps.findIndex(app => app.id === this.appToDelete);
            if (appIndex > -1) {
                const appName = this.apps[appIndex].name;
                this.apps.splice(appIndex, 1);
                this.saveApps();
                this.renderApps();
                this.showNotification(`"${appName}" se ha eliminado correctamente.`);
            }
        }
        this.hideModal('deleteModal');
        this.appToDelete = null;
    }

    launchApp(appPath, appId) {
        if (window.electronAPI && window.electronAPI.launchApp) {
            window.electronAPI.launchApp(appPath).then((result) => {
                if (result) {
                    this.showNotification('No se pudo ejecutar la aplicación.');
                } else {
                    const idx = this.apps.findIndex(a => a.id === appId);
                    if (idx > -1) {
                        this.apps[idx].lastUsed = new Date().toISOString();
                        this.saveApps();
                        this.renderApps();
                    }
                }
            });
        } else {
            this.showNotification('No se puede ejecutar fuera de Electron.');
        }
    }

    filterByCategory(category) {
        this.currentCategory = category;
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        this.renderApps();
    }

    searchApps(query) {
        this.renderApps(query.toLowerCase());
    }

    renderApps(searchQuery = '') {
        const appsGrid = document.getElementById('appsGrid');
        let filteredApps = this.apps;
        if (this.currentCategory !== 'all') {
            filteredApps = filteredApps.filter(app => app.category === this.currentCategory);
        }
        if (searchQuery) {
            filteredApps = filteredApps.filter(app => 
                app.name.toLowerCase().includes(searchQuery) ||
                app.category.toLowerCase().includes(searchQuery)
            );
        }
        if (filteredApps.length === 0) {
            appsGrid.innerHTML = this.getEmptyStateHTML();
            return;
        }
        appsGrid.innerHTML = '';
        filteredApps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.setAttribute('data-category', app.category);
            card.setAttribute('draggable', 'true');
            card.setAttribute('data-id', app.id);
            card.innerHTML = `
                <div class="app-actions">
                    <button class="action-btn edit-btn" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
                <div class="app-icon"><i class="${app.icon}"></i></div>
                <div class="app-name">${app.name}</div>
                <div class="app-category">${this.getCategoryDisplayName(app.category)}</div>
                <div class="app-details">
                    <small>Agregado: ${app.dateAdded ? new Date(app.dateAdded).toLocaleDateString() : '-'}</small><br>
                    <small>Última vez: ${app.lastUsed ? new Date(app.lastUsed).toLocaleDateString() : '-'}</small>
                </div>
            `;
            // Ejecutar app al hacer click en la tarjeta (no en los botones de acción)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    this.launchApp(app.path, app.id);
                }
            });
            // Editar
            card.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.editApp(app.id);
            });
            // Eliminar
            card.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteApp(app.id);
            });
            // Drag & drop
            card.addEventListener('dragstart', (e) => {
                this.draggedAppId = app.id;
            });
            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                card.classList.add('drag-over');
            });
            card.addEventListener('dragleave', () => {
                card.classList.remove('drag-over');
            });
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                card.classList.remove('drag-over');
                this.reorderApps(this.draggedAppId, app.id);
            });
            appsGrid.appendChild(card);
        });
    }

    getCategoryDisplayName(category) {
        const categoryNames = {
            'trabajo': 'Trabajo',
            'entretenimiento': 'Entretenimiento',
            'utilidades': 'Utilidades',
            'desarrollo': 'Desarrollo',
            'multimedia': 'Multimedia',
            'otros': 'Otros'
        };
        return categoryNames[category] || category;
    }

    getEmptyStateHTML() {
        const isFiltered = this.currentCategory !== 'all' || document.getElementById('searchInput').value.trim();
        if (isFiltered) {
            return `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron aplicaciones</h3>
                    <p>No hay aplicaciones que coincidan con tu búsqueda o filtro.</p>
                    <button class="btn-primary" onclick="appLauncher.clearFilters()">Mostrar todas</button>
                </div>
            `;
        }
        return `
            <div class="empty-state">
                <i class="fas fa-rocket"></i>
                <h3>¡Bienvenido a tu Lanzador!</h3>
                <p>No tienes aplicaciones agregadas aún. Haz clic en "Agregar Aplicación" para comenzar.</p>
                <button class="btn-primary" onclick="appLauncher.showAddAppModal()">Agregar Primera Aplicación</button>
            </div>
        `;
    }

    clearFilters() {
        this.currentCategory = 'all';
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-category="all"]').classList.add('active');
        this.renderApps();
    }

    saveApps() {
        localStorage.setItem('launcherApps', JSON.stringify(this.apps));
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 10px;
                    box-shadow: 0 8px 25px rgba(72, 187, 120, 0.4);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                    animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
                    animation-fill-mode: both;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    addExampleApps() {
        const exampleApps = [
            {
                id: 'example-1',
                name: 'Notepad',
                path: 'C:\\Windows\\System32\\notepad.exe',
                category: 'utilidades',
                icon: 'fas fa-file-text',
                dateAdded: new Date().toISOString()
            },
            {
                id: 'example-2',
                name: 'Calculator',
                path: 'C:\\Windows\\System32\\calc.exe',
                category: 'utilidades',
                icon: 'fas fa-calculator',
                dateAdded: new Date().toISOString()
            },
            {
                id: 'example-3',
                name: 'Paint',
                path: 'C:\\Windows\\System32\\mspaint.exe',
                category: 'multimedia',
                icon: 'fas fa-paint-brush',
                dateAdded: new Date().toISOString()
            }
        ];
        this.apps = exampleApps;
        this.saveApps();
        this.renderApps();
    }

    exportApps() {
        const data = JSON.stringify(this.apps, null, 2);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aplicaciones.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importApps(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const imported = JSON.parse(evt.target.result);
                    if (Array.isArray(imported)) {
                        this.apps = imported;
                        this.saveApps();
                        this.renderApps();
                        this.showNotification('Lista importada correctamente.');
                    } else {
                        alert('Archivo inválido.');
                    }
                } catch {
                    alert('Error al importar el archivo.');
                }
            };
            reader.readAsText(file);
        }
    }

    reorderApps(draggedId, targetId) {
        const fromIdx = this.apps.findIndex(a => a.id === draggedId);
        const toIdx = this.apps.findIndex(a => a.id === targetId);
        if (fromIdx > -1 && toIdx > -1 && fromIdx !== toIdx) {
            const [dragged] = this.apps.splice(fromIdx, 1);
            this.apps.splice(toIdx, 0, dragged);
            this.saveApps();
            this.renderApps();
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.appLauncher = new AppLauncher();
});

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        appLauncher.showAddAppModal();
    }
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                appLauncher.hideModal(modal.id);
            }
        });
    }
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});