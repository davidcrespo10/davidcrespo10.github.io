const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#primary-navigation");

if (menuToggle && siteNav) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);
}

const projectTabs = Array.from(document.querySelectorAll('[role="tab"][aria-controls]'));

if (projectTabs.length > 0) {
  const selectProject = (tab, moveFocus = false) => {
    projectTabs.forEach((projectTab) => {
      const isSelected = projectTab === tab;
      const panel = document.getElementById(projectTab.getAttribute("aria-controls"));

      projectTab.setAttribute("aria-selected", String(isSelected));
      projectTab.tabIndex = isSelected ? 0 : -1;
      projectTab.classList.toggle("is-active", isSelected);

      if (panel) {
        panel.hidden = !isSelected;
      }
    });

    if (moveFocus) {
      tab.focus();
    }
  };

  projectTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectProject(tab));

    tab.addEventListener("keydown", (event) => {
      let nextIndex;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        nextIndex = (index + 1) % projectTabs.length;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        nextIndex = (index - 1 + projectTabs.length) % projectTabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = projectTabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      selectProject(projectTabs[nextIndex], true);
    });
  });
}

  document.querySelectorAll(".zara-stage, .airbnb-node").forEach((stage) => {
    stage.addEventListener("click", () => {
      const group = stage.parentElement;

      if (!group) {
        return;
      }

      group.querySelectorAll(".zara-stage, .airbnb-node").forEach((groupStage) => {
        const isSelected = groupStage === stage;
        groupStage.classList.toggle("is-current", isSelected);
        groupStage.setAttribute("aria-pressed", String(isSelected));
      });

      const panel = stage.closest(".project-panel");

      if (panel && stage.dataset.stage) {
        panel.dataset.activeStage = stage.dataset.stage;
      }
    });
  });
