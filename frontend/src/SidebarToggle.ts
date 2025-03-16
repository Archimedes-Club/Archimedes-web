document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar') as HTMLElement | null;
    const sidebarOverlay = document.querySelector('.sidebar-overlay') as HTMLElement | null;
    const closeBtn = document.querySelector('.close-btn') as HTMLElement | null;
  
    if (closeBtn && sidebar && sidebarOverlay) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('visible');
        sidebarOverlay.classList.remove('visible');
      });
  
      sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('visible');
        sidebarOverlay.classList.remove('visible');
      });
    }
  });