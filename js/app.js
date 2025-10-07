// app.js - main JS for system requirements manual
// Main Application
class SystemRequirementsManual {
    constructor() {
        this.menuContainer = document.getElementById('menu');
        this.contentArea = document.getElementById('contentArea');
        this.contentTitle = document.getElementById('contentTitle');
        this.breadcrumb = document.getElementById('breadcrumb');
        this.menuToggle = document.getElementById('menuToggle');
        this.sidebar = document.getElementById('sidebar');
        
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
        
        const moduleHeader = this.createModuleHeader(module.module);
        const submenu = this.createSubmenu(module.submodules, moduleIndex);
        
        moduleItem.appendChild(moduleHeader);
        moduleItem.appendChild(submenu);
        
        return moduleItem;
    }

    createModuleHeader(moduleName) {
        const moduleHeader = document.createElement('div');
        moduleHeader.className = 'menu-item-header';
        moduleHeader.innerHTML = `
            <span>${moduleName}</span>
            <i class="fas fa-chevron-right"></i>
        `;
        
        moduleHeader.addEventListener('click', () => {
            const icon = moduleHeader.querySelector('i');
            const submenu = moduleHeader.nextElementSibling;
            
            icon.style.transform = icon.style.transform === 'rotate(90deg)' ? 'rotate(0deg)' : 'rotate(90deg)';
            submenu.classList.toggle('show');
        });
        
        return moduleHeader;
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
        submoduleItem.className = 'submodule-item';
        submoduleItem.innerHTML = `
            <span>${submodule.name}</span>
            <i class="fas fa-chevron-right"></i>
        `;
        
        const requirementsList = this.createRequirementsList(submodule.requirements, moduleIndex, submoduleIndex);
        submoduleItem.appendChild(requirementsList);
        
        submoduleItem.addEventListener('click', (e) => {
            if (e.target.tagName !== 'I' && !e.target.classList.contains('req-code') && !e.target.classList.contains('req-title')) {
                const icon = submoduleItem.querySelector('i');
                icon.style.transform = icon.style.transform === 'rotate(90deg)' ? 'rotate(0deg)' : 'rotate(90deg)';
                requirementsList.classList.toggle('show');
            }
        });
        
        return submoduleItem;
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
        
        reqItem.addEventListener('click', () => {
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
        if (window.innerWidth <= 768) {
            this.sidebar.classList.remove('open');
        }
    }

    openParentMenus(reqItem) {
        const submoduleItem = reqItem.closest('.submenu-item');
        const moduleHeader = reqItem.closest('.menu-item').querySelector('.menu-item-header');
        const submenu = submoduleItem.parentElement;
        
        submenu.classList.add('show');
        submoduleItem.classList.add('active');
        moduleHeader.classList.add('active');
        moduleHeader.querySelector('i').style.transform = 'rotate(90deg)';
        
        // Open requirements list
        const requirementsList = submoduleItem.querySelector('.requirement-list');
        requirementsList.classList.add('show');
        submoduleItem.querySelector('i').style.transform = 'rotate(90deg)';
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
        this.contentArea.innerHTML = `
            <div class="requirement-title">
                <h3>${requirement.code}: ${requirement.title}</h3>
            </div>
            <div class="requirement-details">
                <p>${requirement.title}</p>
            </div>
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
    }

    bindEvents() {
        this.menuToggle.addEventListener('click', () => {
            this.sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                this.sidebar.classList.contains('open') &&
                !this.sidebar.contains(e.target) &&
                e.target !== this.menuToggle) {
                this.sidebar.classList.remove('open');
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.sidebar.classList.remove('open');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SystemRequirementsManual();
});
