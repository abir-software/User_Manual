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

        // Show PDF preview for Employee Dashboard (REQ-HR-001)
        if (requirement.code === 'REQ-HR-001') {
            const pdfPath = 'assets/pdf/User Manual/Human Resource Management HR Module/1. Employee Dashboard.pdf'.replace(/\\/g, '/');
            pdfPreview = `
                <div class="pdf-preview">
                    <h4>Employee Dashboard User Manual</h4>
                    <embed src="${pdfPath}" type="application/pdf" width="100%" height="1000px" style="border:1px solid #ccc;" />
                    <div style="margin-top:8px;">
                        <a href="${pdfPath}" download>Download PDF</a>
                    </div>
                </div>
            `;
        }

        // Show PDF preview for Employee Profile Management (REQ-HR-002)
        if (requirement.code === 'REQ-HR-002') {
            const pdfPath = 'assets/pdf/User Manual/Human Resource Management HR Module/1. Employee Dashboard copy.pdf'.replace(/\\/g, '/');
            pdfPreview = `
                <div class="pdf-preview">
                    <h4>Employee Profile Management User Manual</h4>
                    <embed src="${pdfPath}" type="application/pdf" width="100%" height="1000px" style="border:1px solid #ccc;" />
                    <div style="margin-top:8px;">
                        <a href="${pdfPath}" download>Download PDF</a>
                    </div>
                </div>
            `;
        }

        // Show PDF preview for attachments (REQ-HR-003)
        if (requirement.code === 'REQ-HR-003') {
            const pdfPath = 'assets/pdf/User Manual/Human Resource Management HR Module/1. Employee Dashboard copy.pdf'.replace(/\\/g, '/');
            pdfPreview = `
                <div class="pdf-preview">
                    <h4>Employee Profile Management User Manual</h4>
                    <embed src="${pdfPath}" type="application/pdf" width="100%" height="1000px" style="border:1px solid #ccc;" />
                    <div style="margin-top:8px;">
                        <a href="${pdfPath}" download>Download PDF</a>
                    </div>
                </div>
            `;
        }

        // Show PDF preview for joining and departure management. (REQ-HR-004)
        if (requirement.code === 'REQ-HR-004') {
            const pdfPath = 'assets/pdf/User Manual/Human Resource Management HR Module/1. Employee Dashboard copy.pdf'.replace(/\\/g, '/');
            pdfPreview = `
                <div class="pdf-preview">
                    <h4>Employee Profile Management User Manual</h4>
                    <embed src="${pdfPath}" type="application/pdf" width="100%" height="1000px" style="border:1px solid #ccc;" />
                    <div style="margin-top:8px;">
                        <a href="${pdfPath}" download>Download PDF</a>
                    </div>
                </div>
            `;
        }

        // Show PDF preview for Office Item Requisitions (REQ-HR-005)
        if (requirement.code === 'REQ-HR-005') {
            const pdfPath = 'assets/pdf/User Manual/Human Resource Management HR Module/1. Employee Dashboard copy.pdf'.replace(/\\/g, '/');
            pdfPreview = `
                <div class="pdf-preview">
                    <h4>Employee Profile Management User Manual</h4>
                    <embed src="${pdfPath}" type="application/pdf" width="100%" height="1000px" style="border:1px solid #ccc;" />
                    <div style="margin-top:8px;">
                        <a href="${pdfPath}" download>Download PDF</a>
                    </div>
                </div>
            `;
        }

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