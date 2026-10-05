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

const journeyPins = Array.from(document.querySelectorAll(".journey-pin[data-destination]"));

if (journeyPins.length > 0) {
  const journeyStories = Array.from(document.querySelectorAll(".journey-story"));
  const journeySection = document.querySelector(".journey-section");
  const initialJourneyPin = journeyPins.find((pin) => pin.getAttribute("aria-pressed") === "true") || journeyPins[0];

  if (journeySection) {
    journeySection.dataset.activeDestination = initialJourneyPin.dataset.destination;
  }
  journeyStories.forEach((story) => {
    const isSelected = story.id === initialJourneyPin.getAttribute("aria-controls");
    story.hidden = !isSelected;
    story.classList.toggle("is-current", isSelected);
  });
  const journeyStoryList = document.querySelector(".journey-stories");
  if (journeyStoryList) {
    journeyStoryList.classList.add("has-interaction");
  }

  journeyPins.forEach((pin) => {
    pin.addEventListener("click", () => {
      const selectedId = pin.getAttribute("aria-controls");
      journeyPins.forEach((journeyPin) => {
        const isSelected = journeyPin === pin;
        journeyPin.setAttribute("aria-pressed", String(isSelected));
      });

      journeyStories.forEach((story) => {
        const isSelected = story.id === selectedId;
        story.hidden = !isSelected;
        story.classList.toggle("is-current", isSelected);
      });

      if (journeySection) {
        journeySection.dataset.activeDestination = pin.dataset.destination;
      }
    });
  });
}

const footballExperience = document.querySelector(".football-experience");
const footballTabs = Array.from(document.querySelectorAll('.football-tab[role="tab"][aria-controls]'));

if (footballExperience && footballTabs.length > 0) {
  const footballPanels = footballTabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));
  const footballTimeline = document.querySelector(".football-timeline");
  const footballMarker = document.querySelector(".football-ball-marker");
  const initialTab = footballTabs.find((tab) => tab.getAttribute("aria-selected") === "true") || footballTabs[0];

  const updateFootballMarker = () => {
    const selectedIndex = footballTabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");

    if (selectedIndex < 0 || !footballTimeline || !footballMarker) {
      return;
    }

    if (window.matchMedia("(max-width: 700px)").matches) {
      const selectedTab = footballTabs[selectedIndex];
      footballMarker.style.left = "0.7rem";
      footballMarker.style.top = `${selectedTab.offsetTop + selectedTab.offsetHeight / 2}px`;
    } else {
      footballMarker.style.left = `${((selectedIndex + 0.5) / footballTabs.length) * 100}%`;
      footballMarker.style.top = "";
    }
  };

  const selectFootballMoment = (tab, moveFocus = false) => {
    const selectedIndex = footballTabs.indexOf(tab);

    footballTabs.forEach((footballTab, index) => {
      const isSelected = footballTab === tab;
      footballTab.setAttribute("aria-selected", String(isSelected));
      footballTab.tabIndex = isSelected ? 0 : -1;
      footballPanels[index].hidden = !isSelected;
      footballPanels[index].classList.toggle("is-current", isSelected);
    });

    if (footballTimeline && footballMarker) {
      footballTimeline.dataset.activeMoment = String(selectedIndex + 1);
      updateFootballMarker();
    }

    if (moveFocus) {
      tab.focus();
      tab.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  };

  footballTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectFootballMoment(tab));

    tab.addEventListener("keydown", (event) => {
      let nextIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIndex = (index + 1) % footballTabs.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIndex = (index - 1 + footballTabs.length) % footballTabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = footballTabs.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      selectFootballMoment(footballTabs[nextIndex], true);
    });
  });

  footballExperience.classList.add("has-interaction");
  selectFootballMoment(initialTab);
  window.addEventListener("resize", updateFootballMarker);
}
