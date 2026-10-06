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

const siteHeader = document.querySelector(".site-header");
const navigationLinks = Array.from(document.querySelectorAll('#primary-navigation a[href^="#"]'));
const navigationSections = navigationLinks
  .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
  .filter((section) => section !== null);
const contactSection = document.getElementById("contact");
const progressIndicator = document.querySelector(".reading-progress");

if (siteHeader && navigationLinks.length > 0 && "IntersectionObserver" in window) {
  const setCurrentNavigationTarget = (sectionId) => {
    navigationLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${sectionId}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };
  const initialHash = window.location.hash.slice(1);
  const initialLink = navigationLinks.find((link) => link.getAttribute("href") === `#${initialHash}`);
  const activeSections = new Set();
  let sectionObserver;
  let contactObserver;
  let contactIsDominant = false;

  if (initialHash === "contact") {
    setCurrentNavigationTarget("");
  } else {
    setCurrentNavigationTarget(initialLink ? initialHash : "home");
  }

  const updateCurrentSection = () => {
    if (contactIsDominant) {
      setCurrentNavigationTarget("");
      return;
    }

    const headerHeight = siteHeader.getBoundingClientRect().height;
    const currentSection = Array.from(activeSections).sort((first, second) =>
      Math.abs(first.getBoundingClientRect().top - headerHeight) -
      Math.abs(second.getBoundingClientRect().top - headerHeight)
    )[0];

    setCurrentNavigationTarget(currentSection && currentSection.id !== "contact" ? currentSection.id : "");
  };

  const observeNavigationSections = () => {
    if (sectionObserver) {
      sectionObserver.disconnect();
    }
    if (contactObserver) {
      contactObserver.disconnect();
    }
    activeSections.clear();
    contactIsDominant = false;

    const activationTop = Math.max(0, Math.ceil(siteHeader.getBoundingClientRect().height) - 1);
    const bottomInset = Math.max(0, window.innerHeight - activationTop - 2);
    sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSections.add(entry.target);
        } else {
          activeSections.delete(entry.target);
        }
      });
      updateCurrentSection();
    }, {
      rootMargin: `-${activationTop}px 0px -${bottomInset}px 0px`,
      threshold: 0
    });

    navigationSections.forEach((section) => sectionObserver.observe(section));
    if (contactSection) {
      contactObserver = new IntersectionObserver((entries) => {
        contactIsDominant = entries[0].isIntersecting;
        updateCurrentSection();
      }, {
        rootMargin: `0px 0px -${Math.floor(window.innerHeight * 0.3)}px 0px`,
        threshold: 0
      });
      contactObserver.observe(contactSection);
    }
  };

  observeNavigationSections();
  window.addEventListener("resize", observeNavigationSections);
}

if (progressIndicator) {
  let progressFrame = 0;

  const updateReadingProgress = () => {
    if (progressFrame) {
      return;
    }

    progressFrame = window.requestAnimationFrame(() => {
      progressFrame = 0;
      const scrollableDistance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableDistance > 0 && window.scrollY < scrollableDistance - 1
        ? window.scrollY / scrollableDistance
        : 1;
      progressIndicator.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    });
  };

  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  window.addEventListener("resize", updateReadingProgress);
  updateReadingProgress();
}

const projectTabs = Array.from(document.querySelectorAll('.project-index [role="tab"][aria-controls]'));

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

  selectProject(projectTabs.find((tab) => tab.getAttribute("aria-selected") === "true") || projectTabs[0]);
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
  const updateJourneyStoryHeight = () => {
    if (!journeyStoryList) {
      return;
    }

    const visibleStory = journeyStories.find((story) => !story.hidden);
    const storyWidth = visibleStory?.getBoundingClientRect().width;

    if (!storyWidth) {
      return;
    }

    const previousStates = journeyStories.map((story) => ({
      hidden: story.hidden,
      style: story.getAttribute("style")
    }));

    journeyStories.forEach((story) => {
      story.hidden = false;
      story.style.position = "absolute";
      story.style.top = "0";
      story.style.left = "-10000px";
      story.style.width = `${storyWidth}px`;
      story.style.display = "grid";
      story.style.visibility = "hidden";
    });
    const maxHeight = Math.ceil(Math.max(...journeyStories.map((story) => story.getBoundingClientRect().height)));

    journeyStories.forEach((story, index) => {
      const previousState = previousStates[index];
      story.hidden = previousState.hidden;
      if (previousState.style === null) {
        story.removeAttribute("style");
      } else {
        story.setAttribute("style", previousState.style);
      }
    });
    journeyStoryList.style.minHeight = `${maxHeight}px`;
  };

  if (journeyStoryList) {
    journeyStoryList.classList.add("has-interaction");
    updateJourneyStoryHeight();
    window.addEventListener("resize", updateJourneyStoryHeight);
    document.fonts?.ready.then(updateJourneyStoryHeight);
  }

  journeyPins.forEach((pin) => {
    pin.addEventListener("click", () => {
      if (journeyStoryList) {
        updateJourneyStoryHeight();
      }
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
const footballTimeline = document.querySelector(".football-timeline");
const footballTimelineOverlay = footballTimeline?.querySelector(".football-timeline-overlay");
const footballTimelineLine = footballTimeline?.querySelector(".football-timeline-line");
const footballMarker = document.querySelector(".football-ball-marker");
const footballMobileProgress = document.querySelector(".football-mobile-progress");
const footballStages = Array.from(document.querySelectorAll(".football-stage-marker[data-stage]"));
const footballStories = Array.from(document.querySelectorAll(".football-panel[data-football-stage]"));

if (footballExperience && footballTimeline && footballTimelineOverlay && footballTimelineLine && footballMarker && footballStages.length > 0 && footballStories.length > 0) {
  const updateFootballMarker = () => {
    const activeStage = footballStages.find((stage) => stage.classList.contains("is-active"));

    if (!activeStage) {
      return;
    }

    const firstDot = footballStages[0].querySelector(".football-tab-dot");
    const lastDot = footballStages[footballStages.length - 1].querySelector(".football-tab-dot");
    const timelineOverlayBounds = footballTimelineOverlay.getBoundingClientRect();

    if (firstDot && lastDot) {
      const firstBounds = firstDot.getBoundingClientRect();
      const lastBounds = lastDot.getBoundingClientRect();
      footballTimelineLine.classList.toggle("is-vertical", window.matchMedia("(max-width: 700px)").matches);
      footballTimelineLine.classList.add("has-geometry");
      if (!footballTimelineLine.classList.contains("is-vertical")) {
        const firstCenter = firstBounds.left + firstBounds.width / 2;
        const lastCenter = lastBounds.left + lastBounds.width / 2;
        footballTimelineLine.style.left = `${firstCenter - timelineOverlayBounds.left}px`;
        footballTimelineLine.style.top = `${firstBounds.top + firstBounds.height / 2 - timelineOverlayBounds.top - 0.5}px`;
        footballTimelineLine.style.width = `${lastCenter - firstCenter}px`;
        footballTimelineLine.style.removeProperty("right");
      } else {
        footballTimelineLine.style.removeProperty("left");
        footballTimelineLine.style.removeProperty("right");
        footballTimelineLine.style.removeProperty("top");
        footballTimelineLine.style.removeProperty("width");
      }
    }

    const milestoneDot = activeStage.querySelector(".football-tab-dot");

    if (milestoneDot) {
      const dotBounds = milestoneDot.getBoundingClientRect();
      footballMarker.style.left = `${dotBounds.left + dotBounds.width / 2 - timelineOverlayBounds.left}px`;
      footballMarker.style.top = `${dotBounds.top + dotBounds.height / 2 - timelineOverlayBounds.top}px`;
    }
  };

  const setActiveFootballStage = (stageNumber) => {
    const activeStage = footballStages.find((stage) => stage.dataset.stage === stageNumber);

    footballStages.forEach((stage) => {
      const isActive = stage.dataset.stage === stageNumber;
      stage.classList.toggle("is-active", isActive);
      if (isActive) {
        stage.setAttribute("aria-current", "step");
      } else {
        stage.removeAttribute("aria-current");
      }
    });
    if (activeStage && footballMobileProgress) {
      const label = activeStage.querySelector(".football-tab-label")?.textContent.trim().toLocaleUpperCase();
      footballMobileProgress.textContent = `${stageNumber} / ${String(footballStages.length).padStart(2, "0")} — ${label}`;
    }
    updateFootballMarker();
  };

  setActiveFootballStage(footballStages[0].dataset.stage);

  const visibleStories = new Set();
  let storyObserver;

  const observeFootballStories = () => {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    storyObserver?.disconnect();
    visibleStories.clear();
    const centerBandInset = Math.round(window.innerHeight * 0.4);
    storyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleStories.add(entry.target);
        } else {
          visibleStories.delete(entry.target);
        }
      });

      const viewportCenter = window.innerHeight / 2;
      const dominantStory = Array.from(visibleStories).sort((first, second) =>
        Math.abs(first.getBoundingClientRect().top + first.getBoundingClientRect().height / 2 - viewportCenter) -
        Math.abs(second.getBoundingClientRect().top + second.getBoundingClientRect().height / 2 - viewportCenter)
      )[0];

      if (dominantStory) {
        setActiveFootballStage(dominantStory.dataset.footballStage);
      }
    }, {
      rootMargin: `-${centerBandInset}px 0px -${centerBandInset}px 0px`,
      threshold: 0
    });

    footballStories.forEach((story) => storyObserver.observe(story));
  };

  observeFootballStories();

  window.addEventListener("resize", () => {
    updateFootballMarker();
    observeFootballStories();
  });
  if ("ResizeObserver" in window && footballTimeline) {
    new ResizeObserver(updateFootballMarker).observe(footballTimeline);
  }
}

const footballClubReveal = document.querySelector(".football-club-reveal");
const footballClubToggle = document.querySelector(".football-club-toggle");
const footballClubAnswer = document.querySelector("#football-club-answer");
const footballClubImage = footballClubReveal?.querySelector(".football-epilogue-photo img");

if (footballClubReveal && footballClubImage && "IntersectionObserver" in window) {
  let footballClubImageRequested = false;
  const footballClubImageObserver = new IntersectionObserver((entries) => {
    if (!footballClubImageRequested && entries.some((entry) => entry.isIntersecting)) {
      footballClubImageRequested = true;
      footballClubImage.loading = "eager";
      footballClubImageObserver.disconnect();
    }
  }, { rootMargin: "900px 0px" });

  footballClubImageObserver.observe(footballClubReveal);
}

if (footballClubReveal && footballClubToggle && footballClubAnswer) {
  const setFootballClubExpanded = (isExpanded) => {
    footballClubToggle.setAttribute("aria-expanded", String(isExpanded));
    footballClubToggle.textContent = isExpanded ? "Hide answer ↑" : "Reveal my club →";
    footballClubAnswer.hidden = !isExpanded;
    footballClubAnswer.classList.toggle("is-open", isExpanded);
  };

  footballClubToggle.addEventListener("click", () => {
    const isExpanded = footballClubToggle.getAttribute("aria-expanded") === "true";
    setFootballClubExpanded(!isExpanded);
  });

  footballClubToggle.hidden = false;
  setFootballClubExpanded(false);
}

const mindsetSection = document.querySelector(".mindset-section");
const mindsetTabs = Array.from(document.querySelectorAll('.mindset-node[role="tab"][aria-controls]'));

if (mindsetSection && mindsetTabs.length > 0) {
  const mindsetPanels = mindsetTabs.map((tab) => document.getElementById(tab.getAttribute("aria-controls")));

  if (mindsetPanels.every((panel) => panel !== null)) {
    const selectMindsetPrinciple = (tab, moveFocus = false) => {
      const selectedIndex = mindsetTabs.indexOf(tab);

      mindsetTabs.forEach((mindsetTab, index) => {
        const isSelected = index === selectedIndex;
        mindsetTab.setAttribute("aria-selected", String(isSelected));
        mindsetTab.tabIndex = isSelected ? 0 : -1;
        mindsetPanels[index].hidden = !isSelected;
      });

      mindsetSection.dataset.activePrinciple = tab.dataset.principle;

      if (moveFocus) {
        tab.focus();
      }
    };

    mindsetTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        mindsetSection.classList.add("has-interaction");
        selectMindsetPrinciple(tab);
      });

      tab.addEventListener("keydown", (event) => {
        let nextIndex;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (index + 1) % mindsetTabs.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (index - 1 + mindsetTabs.length) % mindsetTabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = mindsetTabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        mindsetSection.classList.add("has-interaction");
        selectMindsetPrinciple(mindsetTabs[nextIndex], true);
      });
    });

    selectMindsetPrinciple(mindsetTabs.find((tab) => tab.getAttribute("aria-selected") === "true") || mindsetTabs[0]);
  }
}
