// Map requirement codes to external manual HTML files. Add entries here for
// any requirement that should show a full manual/article inside the
// requirement content area.
const requirementManualFiles = {
    'REQ-HR-001': 'assets/manuals/employee-dashboard.html'
};

// Map REQ-HR-003 to Attachments manual
requirementManualFiles['REQ-HR-003'] = 'assets/manuals/Attachments.html';
// Map REQ-HR-002 to Attachments manual as requested
requirementManualFiles['REQ-HR-002'] = 'assets/manuals/Attachments.html';

// Simple in-memory cache for loaded manual HTML to avoid repeated fetches
const manualCache = new Map();

// localStorage helpers for persistent manual caching with TTL (24 hours)
const MANUAL_CACHE_PREFIX = 'manual_html__';
const MANUAL_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function saveManualToLocal(manualFile, html) {
    try {
        const payload = { ts: Date.now(), html };
        localStorage.setItem(MANUAL_CACHE_PREFIX + manualFile, JSON.stringify(payload));
    } catch (e) {
        console.warn('Could not save manual to localStorage', e);
    }
}

function loadManualFromLocal(manualFile) {
    try {
        const raw = localStorage.getItem(MANUAL_CACHE_PREFIX + manualFile);
        if (!raw) return null;
        const payload = JSON.parse(raw);
        if (!payload || !payload.ts || !payload.html) return null;
        if ((Date.now() - payload.ts) > MANUAL_CACHE_TTL_MS) {
            localStorage.removeItem(MANUAL_CACHE_PREFIX + manualFile);
            return null;
        }
        return payload.html;
    } catch (e) {
        console.warn('Could not read manual from localStorage', e);
        return null;
    }
}

// Files we prefer to always fetch from network (no localStorage persist)
const skipLocalStorageFor = new Set([
    'assets/manuals/employee-dashboard.html'
]);

// Also skip localStorage caching for Attachments manual so edits show immediately
skipLocalStorageFor.add('assets/manuals/Attachments.html');

// When a requirement has a mapped manual file, we'll fetch and inject it
// into the `.manual-container` element inside the requirement template.

// Main Application
class SystemRequirementsManual {
    constructor() {
        this.menuContainer = document.getElementById('menu');
        this.contentArea = document.getElementById('contentArea');
        this.contentTitle = document.getElementById('contentTitle');
        this.breadcrumb = document.getElementById('breadcrumb');
        this.menuToggle = document.getElementById('menuToggle');
        this.sidebar = document.getElementById('sidebar');
        this.mobileOverlay = document.getElementById('mobileOverlay');
        
        this.init();
    }

    init() {
        this.initMenu();
        this.bindEvents();
        this.setInitialState();
    }

    setInitialState() {
        // Set initial active state for first requirement
        const firstRequirement = document.querySelector('.requirement-item');
        if (firstRequirement) {
            const moduleIndex = firstRequirement.dataset.moduleIndex;
            const submoduleIndex = firstRequirement.dataset.submoduleIndex;
            const reqIndex = firstRequirement.dataset.reqIndex;
            
            this.loadRequirement(moduleIndex, submoduleIndex, reqIndex);
            firstRequirement.classList.add('active');
        }
    }

    initMenu() {
        requirementsData.forEach((module, moduleIndex) => {
            const moduleItem = this.createModuleItem(module, moduleIndex);
            this.menuContainer.appendChild(moduleItem);
        });
    }

    createModuleItem(module, moduleIndex) {
        const moduleItem = document.createElement('li');
        moduleItem.className = 'menu-item';
        
        const moduleHeader = this.createModuleHeader(module.module, moduleIndex);
        const submenu = this.createSubmenu(module.submodules, moduleIndex);
        
        moduleItem.appendChild(moduleHeader);
        moduleItem.appendChild(submenu);
        
        return moduleItem;
    }

    createModuleHeader(moduleName, moduleIndex) {
        const moduleHeader = document.createElement('div');
        moduleHeader.className = 'menu-item-header';
        moduleHeader.dataset.moduleIndex = moduleIndex;
        moduleHeader.innerHTML = `
            <span>${moduleName}</span>
            <i class="fas fa-chevron-right"></i>
        `;
        
        moduleHeader.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleModuleClick(moduleHeader);
        });
        
        return moduleHeader;
    }

    handleModuleClick(clickedModuleHeader) {
        const icon = clickedModuleHeader.querySelector('i');
        const submenu = clickedModuleHeader.nextElementSibling;
        const isOpening = !submenu.classList.contains('show');
        
        // If we're opening this module, close all others
        if (isOpening) {
            this.collapseOtherModules(clickedModuleHeader);
        }
        
        // Toggle current module
        icon.style.transform = isOpening ? 'rotate(90deg)' : 'rotate(0deg)';
        submenu.classList.toggle('show');
        clickedModuleHeader.classList.toggle('active', isOpening);
    }

    collapseOtherModules(activeModuleHeader) {
        const allModuleHeaders = document.querySelectorAll('.menu-item-header');
        
        allModuleHeaders.forEach(header => {
            if (header !== activeModuleHeader) {
                const icon = header.querySelector('i');
                const submenu = header.nextElementSibling;
                
                // Close the module
                icon.style.transform = 'rotate(0deg)';
                submenu.classList.remove('show');
                header.classList.remove('active');
                
                // Also close all submenus within this module
                this.collapseAllSubmenusInModule(submenu);
            }
        });
    }

    collapseAllSubmenusInModule(moduleSubmenu) {
        const submenuItems = moduleSubmenu.querySelectorAll('.submenu-item');
        
        submenuItems.forEach(submenuItem => {
            const submenuIcon = submenuItem.querySelector('i');
            const requirementsList = submenuItem.querySelector('.requirement-list');
            
            // Close submenu
            submenuIcon.style.transform = 'rotate(0deg)';
            requirementsList.classList.remove('show');
            submenuItem.classList.remove('active');
        });
    }

    createSubmenu(submodules, moduleIndex) {
        const submenu = document.createElement('ul');
        submenu.className = 'submenu';
        
        submodules.forEach((submodule, submoduleIndex) => {
            const submoduleItem = this.createSubmoduleItem(submodule, moduleIndex, submoduleIndex);
            submenu.appendChild(submoduleItem);
        });
        
        return submenu;
    }

    createSubmoduleItem(submodule, moduleIndex, submoduleIndex) {
        const submoduleItem = document.createElement('li');
        submoduleItem.className = 'submenu-item';
        submoduleItem.innerHTML = `
            <span>${submodule.name}</span>
            <i class="fas fa-chevron-right"></i>
        `;
        
        const requirementsList = this.createRequirementsList(submodule.requirements, moduleIndex, submoduleIndex);
        submoduleItem.appendChild(requirementsList);
        
        submoduleItem.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleSubmoduleClick(submoduleItem, e);
        });
        
        return submoduleItem;
    }

    handleSubmoduleClick(clickedSubmoduleItem, e) {
        // Only handle clicks on the submodule header itself, not on requirements
        if (e.target.tagName !== 'I' && !e.target.classList.contains('req-code') && !e.target.classList.contains('req-title')) {
            const icon = clickedSubmoduleItem.querySelector('i');
            const requirementsList = clickedSubmoduleItem.querySelector('.requirement-list');
            const isOpening = !requirementsList.classList.contains('show');
            
            // If we're opening this submodule, close all other submodules in the same module
            if (isOpening) {
                this.collapseOtherSubmodules(clickedSubmoduleItem);
            }
            
            // Toggle current submodule
            icon.style.transform = isOpening ? 'rotate(90deg)' : 'rotate(0deg)';
            requirementsList.classList.toggle('show');
            clickedSubmoduleItem.classList.toggle('active', isOpening);
            
            // Ensure parent module is open
            this.ensureParentModuleOpen(clickedSubmoduleItem);
        }
    }

    collapseOtherSubmodules(activeSubmoduleItem) {
        const parentModule = activeSubmoduleItem.closest('.menu-item');
        const allSubmoduleItems = parentModule.querySelectorAll('.submodule-item');
        
        allSubmoduleItems.forEach(submoduleItem => {
            if (submoduleItem !== activeSubmoduleItem) {
                const icon = submoduleItem.querySelector('i');
                const requirementsList = submoduleItem.querySelector('.requirement-list');
                
                // Close the submodule
                icon.style.transform = 'rotate(0deg)';
                requirementsList.classList.remove('show');
                submoduleItem.classList.remove('active');
            }
        });
    }

    ensureParentModuleOpen(submoduleItem) {
        const moduleHeader = submoduleItem.closest('.menu-item').querySelector('.menu-item-header');
        const moduleSubmenu = moduleHeader.nextElementSibling;
        
        // Open parent module if it's closed
        if (!moduleSubmenu.classList.contains('show')) {
            moduleHeader.querySelector('i').style.transform = 'rotate(90deg)';
            moduleSubmenu.classList.add('show');
            moduleHeader.classList.add('active');
        }
    }

    createRequirementsList(requirements, moduleIndex, submoduleIndex) {
        const requirementsList = document.createElement('ul');
        requirementsList.className = 'requirement-list';
        
        requirements.forEach((requirement, reqIndex) => {
            const reqItem = this.createRequirementItem(requirement, moduleIndex, submoduleIndex, reqIndex);
            requirementsList.appendChild(reqItem);
        });
        
        return requirementsList;
    }

    createRequirementItem(requirement, moduleIndex, submoduleIndex, reqIndex) {
        const reqItem = document.createElement('li');
        reqItem.className = 'requirement-item';
        reqItem.dataset.moduleIndex = moduleIndex;
        reqItem.dataset.submoduleIndex = submoduleIndex;
        reqItem.dataset.reqIndex = reqIndex;
        reqItem.innerHTML = `
            <span class="req-code">${requirement.code}</span>
            <span class="req-title">${requirement.title.substring(0, 30)}${requirement.title.length > 30 ? '...' : ''}</span>
        `;
        
        reqItem.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleRequirementClick(reqItem, moduleIndex, submoduleIndex, reqIndex);
        });
        
        return reqItem;
    }

    handleRequirementClick(reqItem, moduleIndex, submoduleIndex, reqIndex) {
        this.loadRequirement(moduleIndex, submoduleIndex, reqIndex);
        
        // Update active states
        document.querySelectorAll('.requirement-item.active').forEach(el => el.classList.remove('active'));
        reqItem.classList.add('active');
        
        // Open parent menus
        this.openParentMenus(reqItem);
        
        // Close sidebar on mobile after selection
        if (this.isMobile()) {
            this.closeSidebar();
        }
    }

    openParentMenus(reqItem) {
        const submoduleItem = reqItem.closest('.submenu-item');
        const moduleHeader = reqItem.closest('.menu-item').querySelector('.menu-item-header');
        const moduleSubmenu = submoduleItem.parentElement;
        
        // Close other modules first
        this.collapseOtherModules(moduleHeader);
        
        // Open current module and submodule
        moduleSubmenu.classList.add('show');
        moduleHeader.classList.add('active');
        moduleHeader.querySelector('i').style.transform = 'rotate(90deg)';
        
        // Open requirements list and submodule
        const requirementsList = submoduleItem.querySelector('.requirement-list');
        requirementsList.classList.add('show');
        submoduleItem.classList.add('active');
        submoduleItem.querySelector('i').style.transform = 'rotate(90deg)';
        
        // Close other submodules in the same module
        this.collapseOtherSubmodules(submoduleItem);
    }

    loadRequirement(moduleIndex, submoduleIndex, reqIndex) {
        const module = requirementsData[moduleIndex];
        const submodule = module.submodules[submoduleIndex];
        const requirement = submodule.requirements[reqIndex];
        
        this.contentTitle.textContent = requirement.code;
        this.updateBreadcrumb(module, submodule, requirement);
        this.updateContent(module, submodule, requirement);
    }

    updateBreadcrumb(module, submodule, requirement) {
        this.breadcrumb.innerHTML = `
            <a href="#" class="breadcrumb-home">Home</a>
            <span class="separator">/</span>
            <a href="#" class="breadcrumb-module">${module.module}</a>
            <span class="separator">/</span>
            <a href="#" class="breadcrumb-submodule">${submodule.name}</a>
            <span class="separator">/</span>
            <span class="breadcrumb-requirement">${requirement.code}</span>
        `;
    }

    updateContent(module, submodule, requirement) {
        let pdfPreview = '';

        // If this requirement has an external manual file mapped, show a
        // placeholder that will be filled after rendering the template.
        const manualFile = requirementManualFiles[requirement.code];
        if (manualFile) {
            pdfPreview = `
                <div class="manual-container">
                    <p>Loading manual...</p>
                </div>
            `;
        } else if (requirement.code === 'REQ-HR-002') {
            const pdfPath = 'assets/pdf/User Manual/Human Resource Management HR Module/1. Employee Dashboard copy.pdf'.replace(/\\/g, '/');
            pdfPreview = `
                <div class="pdf-preview">
                    <h4>Employee Profile Management User Manual</h4>
                    <embed src="${pdfPath}" type="application/pdf" width="100%" height="1000px" style="border:1px solid #ccc;" />
                </div>
            `;
        } else if (requirement.code === 'REQ-HR-003') {
            const pdfPath = 'assets/pdf/User Manual/Human Resource Management HR Module/1. Employee Dashboard copy.pdf'.replace(/\\/g, '/');
            pdfPreview = `
                <div class="pdf-preview">
                    <h4>Attachments - User Manual</h4>
                    <embed src="${pdfPath}" type="application/pdf" width="100%" height="1000px" style="border:1px solid #ccc;" />
                </div>
            `;
        } else if (requirement.code === 'REQ-HR-004') {
            const pdfPath = 'assets/pdf/User Manual/Human Resource Management HR Module/1. Employee Dashboard copy.pdf'.replace(/\\/g, '/');
            pdfPreview = `
                <div class="pdf-preview">
                    <h4>Joining & Departure Management - User Manual</h4>
                    <embed src="${pdfPath}" type="application/pdf" width="100%" height="1000px" style="border:1px solid #ccc;" />
                </div>
            `;
        } else if (requirement.code === 'REQ-HR-005') {
            const pdfPath = 'assets/pdf/User Manual/Human Resource Management HR Module/1. Employee Dashboard copy.pdf'.replace(/\\/g, '/');
            pdfPreview = `
                <div class="pdf-preview">
                    <h4>Office Item Requisitions - User Manual</h4>
                    <embed src="${pdfPath}" type="application/pdf" width="100%" height="1000px" style="border:1px solid #ccc;" />
                </div>
            `;
        }

        // Render the main template and insert either the manual placeholder or
        // the PDF preview as needed.
        this.contentArea.innerHTML = `
            <div class="requirement-title">
                <h3>${requirement.code}: ${requirement.title}</h3>
            </div>
            <div class="requirement-details">
                <p>${requirement.title}</p>
            </div>
            ${pdfPreview}
            <div class="requirement-meta">
                <div class="meta-item">
                    <i class="fas fa-layer-group"></i>
                    <span>${module.module}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-folder"></i>
                    <span>${submodule.name}</span>
                </div>
            </div>
        `;

        // If a manual file is mapped, fetch and inject it into .manual-container
        if (manualFile) {
            const container = this.contentArea.querySelector('.manual-container');
            if (container) {
                // Create content holder for the manual (no extra controls)
                container.innerHTML = '';
                const contentHolder = document.createElement('div');
                contentHolder.className = 'manual-content-holder';
                contentHolder.innerHTML = '<p>Loading manual...</p>';
                container.appendChild(contentHolder);

                const loadAndDisplay = (forceNetwork = false) => {
                    // If the file is flagged to skip localStorage, don't read/write localStorage
                    const useLocalStorage = !skipLocalStorageFor.has(manualFile);

                    if (!forceNetwork && useLocalStorage) {
                        const localHtml = loadManualFromLocal(manualFile);
                        if (localHtml) {
                            manualCache.set(manualFile, localHtml);
                            contentHolder.innerHTML = localHtml;
                            return;
                        }
                    }

                    // If file is set to skip local caching, avoid using in-memory manualCache
                    if (!forceNetwork && !skipLocalStorageFor.has(manualFile) && manualCache.has(manualFile)) {
                        contentHolder.innerHTML = manualCache.get(manualFile);
                        return;
                    }

                    // Fetch from network and cache appropriately
                    fetch(manualFile)
                        .then(res => {
                            if (!res.ok) throw new Error('Manual not found');
                            return res.text();
                        })
                        .then(html => {
                            manualCache.set(manualFile, html);
                            if (!skipLocalStorageFor.has(manualFile)) {
                                try { saveManualToLocal(manualFile, html); } catch (e) { /* ignore */ }
                            }
                            contentHolder.innerHTML = html;
                        })
                        .catch(err => {
                            console.error('Failed to load manual:', err);
                            contentHolder.innerHTML = '<p>Unable to load the manual. Please contact HR.</p>';
                        });
                };

                // Initial load: for REQ-HR-001 and REQ-HR-003 force a fresh fetch & inject so edits on disk show immediately
                if (requirement.code === 'REQ-HR-001' || requirement.code === 'REQ-HR-003') {
                    fetch(manualFile)
                        .then(res => {
                            if (!res.ok) throw new Error('Manual not found');
                            return res.text();
                        })
                        .then(html => {
                            // update in-memory cache as well
                            manualCache.set(manualFile, html);
                            // skip localStorage for this file by design
                            contentHolder.innerHTML = html;
                        })
                        .catch(err => {
                            console.error('Failed to load manual (forced fetch):', err);
                            contentHolder.innerHTML = '<p>Unable to load the manual. Please contact HR.</p>';
                        });
                } else {
                    // Default load (may use cache/localStorage)
                    loadAndDisplay(false);
                }

                // No UI controls (Refresh/Print). Manual content displays inline only.

            }

        }
    }

    // Mobile-specific methods
    isMobile() {
        return window.innerWidth <= 768;
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
        this.mobileOverlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open', this.sidebar.classList.contains('open'));
    }

    closeSidebar() {
        this.sidebar.classList.remove('open');
        this.mobileOverlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }

    openSidebar() {
        this.sidebar.classList.add('open');
        this.mobileOverlay.classList.add('active');
        document.body.classList.add('sidebar-open');
    }

    bindEvents() {
        // Menu toggle
        this.menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleSidebar();
        });

        // Close sidebar when clicking on overlay
        this.mobileOverlay.addEventListener('click', () => {
            this.closeSidebar();
        });

        // Close sidebar when clicking on a requirement (handled in requirement click)
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebar.classList.contains('open')) {
                this.closeSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeSidebar();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SystemRequirementsManual();
});