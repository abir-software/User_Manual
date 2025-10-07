// search.js - search functionality for system requirements manual// Search functionality
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.init();
    }

    init() {
        this.searchInput.addEventListener('input', this.handleSearch.bind(this));
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            this.resetSearch();
            return;
        }
        
        this.performSearch(searchTerm);
    }

    resetSearch() {
        // Reset all items to visible
        document.querySelectorAll('.requirement-item').forEach(item => {
            item.style.display = 'flex';
        });
        document.querySelectorAll('.submenu').forEach(submenu => {
            submenu.style.display = 'block';
        });
        document.querySelectorAll('.menu-item').forEach(item => {
            item.style.display = 'block';
        });
    }

    performSearch(searchTerm) {
        // Hide all items first
        document.querySelectorAll('.requirement-item').forEach(item => {
            item.style.display = 'none';
        });
        
        let hasResults = false;
        
        // Show matching items
        document.querySelectorAll('.requirement-item').forEach(item => {
            const code = item.querySelector('.req-code').textContent.toLowerCase();
            const title = item.querySelector('.req-title').textContent.toLowerCase();
            
            if (code.includes(searchTerm) || title.includes(searchTerm)) {
                item.style.display = 'flex';
                hasResults = true;
                
                // Show parent elements
                this.showParentElements(item);
            }
        });

        // Show no results message if needed
        this.handleNoResults(hasResults);
    }

    showParentElements(item) {
        let parent = item.parentElement;
        while (parent && !parent.classList.contains('sidebar-menu')) {
            if (parent.classList.contains('requirement-list')) {
                parent.classList.add('show');
                parent.style.display = 'block';
            } else if (parent.classList.contains('submenu')) {
                parent.classList.add('show');
                parent.style.display = 'block';
            } else if (parent.classList.contains('menu-item')) {
                parent.style.display = 'block';
            }
            parent = parent.parentElement;
        }
    }

    handleNoResults(hasResults) {
        // You can implement a no results message here if needed
        if (!hasResults) {
            console.log('No results found');
        }
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SearchManager();
});