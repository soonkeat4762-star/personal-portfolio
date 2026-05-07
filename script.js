const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll("[data-page-link]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contactForm");
const feedbackModal = document.getElementById("feedbackModal");
const feedbackModalClose = document.getElementById("feedbackModalClose");
const feedbackModalIcon = document.getElementById("feedbackModalIcon");
const feedbackModalTitle = document.getElementById("feedbackModalTitle");
const feedbackModalText = document.getElementById("feedbackModalText");
const currentPage = document.body.dataset.page;
const skillBars = document.querySelectorAll(".skill-bar span");
const backToTop = document.getElementById("backToTop");
const loadingLinks = document.querySelectorAll("[data-loading-link]");
const previewImages = document.querySelectorAll(".gallery-card img, .experience-media img");
const clickablePreviews = document.querySelectorAll(".clickable-preview");
const educationPreviewMedia = document.querySelectorAll(".education-media");
const practicalGalleryButtons = document.querySelectorAll("[data-practical-gallery]");
const practicalGalleryModal = document.getElementById("practicalGalleryModal");
const practicalGalleryClose = document.getElementById("practicalGalleryClose");
const practicalGalleryImages = document.querySelectorAll(".practical-gallery-image");
const eventGalleryButtons = document.querySelectorAll("[data-event-gallery]");
const eventGalleryModal = document.getElementById("eventGalleryModal");
const eventGalleryClose = document.getElementById("eventGalleryClose");
const eventGalleryImages = document.querySelectorAll(".event-gallery-image");
const viewResumeButton = document.getElementById("viewResumeButton");
const resumeModal = document.getElementById("resumeModal");
const resumeClose = document.getElementById("resumeClose");
const statValues = document.querySelectorAll(".hero-stats strong[data-stat]");
const navCollapseWidth = 1024;
let imagePreviewDelay = null;

const closeNavMenu = () => {
  if (navMenu) {
    navMenu.classList.remove("open");
  }

  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
};

const closeFeedbackModal = () => {
  if (feedbackModal) {
    feedbackModal.classList.remove("visible", "failed");
    feedbackModal.setAttribute("aria-hidden", "true");
  }
};

const openFeedbackModal = (status) => {
  if (!feedbackModal || !feedbackModalIcon || !feedbackModalTitle || !feedbackModalText) {
    return;
  }

  const isSuccess = status === "success";
  feedbackModal.classList.toggle("failed", !isSuccess);
  feedbackModalIcon.innerHTML = isSuccess
    ? '<i class="fa-solid fa-circle-check"></i>'
    : '<i class="fa-solid fa-circle-xmark"></i>';
  feedbackModalTitle.textContent = isSuccess ? "Success" : "Failed";
  feedbackModalText.textContent = isSuccess
    ? "Your message has been sent successfully."
    : "Failed to send your message. Please try again.";
  feedbackModal.setAttribute("aria-hidden", "false");

  requestAnimationFrame(() => {
    feedbackModal.classList.add("visible");
  });
};

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (
      window.innerWidth <= navCollapseWidth &&
      navMenu.classList.contains("open") &&
      event.target instanceof Node &&
      !navMenu.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeNavMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavMenu();
      closeFeedbackModal();
    }
  });
}

if (feedbackModal) {
  feedbackModal.addEventListener("click", (event) => {
    if (
      event.target instanceof HTMLElement &&
      (event.target.dataset.closeFeedback === "true" || event.target.id === "feedbackModalClose")
    ) {
      closeFeedbackModal();
    }
  });
}

if (feedbackModalClose) {
  feedbackModalClose.addEventListener("click", () => {
    closeFeedbackModal();
  });
}

navLinks.forEach((link) => {
  if (link.dataset.pageLink === currentPage) {
    link.classList.add("active");
  }

  link.addEventListener("click", () => {
    closeNavMenu();
  });
});

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const prepareSkillBars = () => {
  skillBars.forEach((bar) => {
    const targetWidth = bar.dataset.width || bar.style.width;

    if (!targetWidth) {
      return;
    }

    bar.dataset.width = targetWidth;
    bar.style.width = "0";
  });
};

const animateSkillBar = (bar) => {
  const targetWidth = bar.dataset.width;

  if (!targetWidth || bar.dataset.animated === "true") {
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bar.style.width = targetWidth;
      bar.dataset.animated = "true";
    });
  });
};

prepareSkillBars();

const readCardCountFromPage = async (pagePath, selector) => {
  const response = await fetch(pagePath);

  if (!response.ok) {
    throw new Error(`Failed to load ${pagePath}`);
  }

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return Array.from(doc.querySelectorAll(selector)).filter((element) => {
    if (element.hasAttribute("hidden")) {
      return false;
    }

    const inlineStyle = (element.getAttribute("style") || "").toLowerCase();
    return !inlineStyle.includes("display:none") && !inlineStyle.includes("visibility:hidden");
  }).length;
};

const animateCounter = (element, target, duration) => {
  const startTime = performance.now();
  element.style.opacity = "0";
  element.style.transform = "translateY(12px)";

  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * easedProgress);
    const lift = 12 * (1 - easedProgress);

    element.textContent = String(value);
    element.style.opacity = String(easedProgress);
    element.style.transform = `translateY(${lift}px)`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = String(target);
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }
  };

  requestAnimationFrame(updateCounter);
};

const setupHeroStats = async () => {
  if (statValues.length === 0) {
    return;
  }

  const statTargets = {
    pages: 9,
    skills: 6,
    projects: 6
  };

  try {
    const [skillsCount, projectsCount] = await Promise.all([
      readCardCountFromPage("skills.html", ".skills-grid .skill-card"),
      readCardCountFromPage("projects.html", ".projects-grid .project-card")
    ]);

    statTargets.skills = skillsCount;
    statTargets.projects = projectsCount;
  } catch (error) {
    // Fallback values keep the homepage stable if local fetch is unavailable.
  }

  statValues.forEach((stat) => {
    const statKey = stat.dataset.stat;
    const target = statKey ? statTargets[statKey] : Number(stat.dataset.target || 0);
    stat.dataset.target = String(target);
    stat.textContent = "0";
  });

  const heroStats = document.querySelector(".hero-stats");

  if (!heroStats) {
    return;
  }

  let hasAnimatedStats = false;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const runStatAnimation = () => {
    if (hasAnimatedStats) {
      return;
    }

    hasAnimatedStats = true;

    statValues.forEach((stat, index) => {
      const target = Number(stat.dataset.target || 0);

      if (prefersReducedMotion) {
        stat.textContent = String(target);
        return;
      }

      window.setTimeout(() => {
        animateCounter(stat, target, 4200);
      }, index * 120);
    });
  };

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runStatAnimation();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.45
      }
    );

    statsObserver.observe(heroStats);
  } else {
    runStatAnimation();
  }
};

setupHeroStats();

if ("IntersectionObserver" in window && skillBars.length > 0) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector("span");

          if (bar) {
            animateSkillBar(bar);
          }

          skillObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  document.querySelectorAll(".skill-bar").forEach((barWrap) => skillObserver.observe(barWrap));
} else {
  window.addEventListener("load", () => {
    skillBars.forEach((bar) => animateSkillBar(bar));
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > navCollapseWidth) {
    closeNavMenu();
  }
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton?.textContent || "Send Message";

    closeFeedbackModal();

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: contactForm.method,
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        contactForm.reset();
        openFeedbackModal("success");
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      openFeedbackModal("failed");
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.textContent = defaultButtonText;
      }
    }
  });
}

if (backToTop) {
  backToTop.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  const updateBackToTop = () => {
    if (window.scrollY > 200) {
      backToTop.style.opacity = "1";
      backToTop.style.pointerEvents = "auto";
    } else {
      backToTop.style.opacity = "0";
      backToTop.style.pointerEvents = "none";
    }
  };

  window.addEventListener("scroll", function () {
    updateBackToTop();
  });

  updateBackToTop();
}

if (loadingLinks.length > 0) {
  loadingLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href.startsWith("#")) {
        return;
      }

      event.preventDefault();
      showProjectLoader(link.dataset.loadingText || "Loading Project Details...");

      window.setTimeout(() => {
        window.location.href = href;
      }, 900);
    });
  });
}

const getProjectLoader = () => {
  let loader = document.getElementById("projectLoader");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "projectLoader";
    loader.className = "project-loader";
    loader.innerHTML = `
      <div class="project-loader-panel">
        <div class="project-loader-spinner"></div>
        <p class="project-loader-text"></p>
      </div>
    `;
    document.body.appendChild(loader);
  }

  return loader;
};

const showProjectLoader = (text) => {
  const loader = getProjectLoader();
  const loaderText = loader.querySelector(".project-loader-text");

  if (loaderText) {
    loaderText.textContent = text;
  }

  requestAnimationFrame(() => {
    loader.classList.add("visible");
  });
};

const hideProjectLoader = () => {
  const loader = document.getElementById("projectLoader");

  if (loader) {
    loader.classList.remove("visible");
  }
};

const getImageLoadingOverlay = () => {
  let overlay = document.getElementById("imageLoadingOverlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "imageLoadingOverlay";
    overlay.className = "image-loading-overlay";
    overlay.innerHTML = `
      <div class="image-loading-panel" role="status" aria-live="polite">
        <div class="image-loading-spinner" aria-hidden="true"></div>
        <p class="image-loading-text">Loading Image Preview...</p>
      </div>
    `;
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
  }

  return overlay;
};

const showImageLoadingOverlay = (text = "Loading Image Preview...") => {
  const overlay = getImageLoadingOverlay();
  const loadingText = overlay.querySelector(".image-loading-text");

  if (loadingText) {
    loadingText.textContent = text;
  }

  overlay.setAttribute("aria-hidden", "false");

  requestAnimationFrame(() => {
    overlay.classList.add("visible");
  });
};

const hideImageLoadingOverlay = () => {
  const overlay = document.getElementById("imageLoadingOverlay");

  if (overlay) {
    overlay.classList.remove("visible");
    overlay.setAttribute("aria-hidden", "true");
  }
};

const getImagePreviewData = (image) => {
  if (!(image instanceof HTMLImageElement)) {
    return {
      src: "",
      alt: "",
      title: "",
      category: "",
      description: ""
    };
  }

  const card = image.closest(".gallery-card");
  const titleElement = card?.querySelector("figcaption strong");
  const categoryElement = card?.querySelector("figcaption span");

  return {
    src: image.currentSrc || image.src,
    alt: image.alt,
    title: image.dataset.previewTitle || titleElement?.textContent?.trim() || image.alt,
    category: image.dataset.previewCategory || categoryElement?.textContent?.trim() || "",
    description: image.dataset.previewDescription || ""
  };
};

const closeImagePreview = () => {
  if (imagePreviewDelay) {
    window.clearTimeout(imagePreviewDelay);
    imagePreviewDelay = null;
  }

  hideProjectLoader();
  hideImageLoadingOverlay();

  const modal = document.getElementById("imagePreviewModal");

  if (modal) {
    modal.classList.remove("visible");
    modal.setAttribute("aria-hidden", "true");
  }
};

const closePracticalGallery = () => {
  hideProjectLoader();

  if (practicalGalleryModal) {
    practicalGalleryModal.classList.remove("visible");
    practicalGalleryModal.setAttribute("aria-hidden", "true");
  }
};

const closeEventGallery = () => {
  hideProjectLoader();

  if (eventGalleryModal) {
    eventGalleryModal.classList.remove("visible");
    eventGalleryModal.setAttribute("aria-hidden", "true");
  }
};

const closeResumeModal = () => {
  hideProjectLoader();

  if (resumeModal) {
    resumeModal.classList.remove("visible");
    resumeModal.setAttribute("aria-hidden", "true");
  }
};

const getImagePreviewModal = () => {
  let modal = document.getElementById("imagePreviewModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "imagePreviewModal";
    modal.className = "image-preview-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="image-preview-content" role="dialog" aria-modal="true" aria-label="Image preview">
        <button type="button" class="image-preview-close" id="imagePreviewClose" aria-label="Close image preview">&times;</button>
        <div class="image-preview-body">
          <div class="image-preview-media">
            <img id="imagePreviewImage" src="" alt="" class="image-preview-image">
          </div>
          <div class="image-preview-details" id="imagePreviewDetails" hidden>
            <span class="image-preview-category" id="imagePreviewCategory"></span>
            <h3 class="image-preview-title" id="imagePreviewTitle"></h3>
            <p class="image-preview-description" id="imagePreviewDescription"></p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  if (modal.dataset.bound !== "true") {
    modal.addEventListener("click", (event) => {
      if (
        event.target === modal ||
        (event.target instanceof HTMLElement && event.target.classList.contains("image-preview-close"))
      ) {
        closeImagePreview();
      }
    });

    modal.dataset.bound = "true";
  }

  return modal;
};

const showImagePreview = ({ src, alt, title = "", category = "", description = "" }) => {
  const modal = getImagePreviewModal();
  const previewImage = modal.querySelector("#imagePreviewImage, .image-preview-image, .image-preview-content img");
  const previewContent = modal.querySelector(".image-preview-content");
  const details = modal.querySelector("#imagePreviewDetails");
  const categoryElement = modal.querySelector("#imagePreviewCategory");
  const titleElement = modal.querySelector("#imagePreviewTitle");
  const descriptionElement = modal.querySelector("#imagePreviewDescription");
  const hasMetadata = Boolean(title || category || description);

  if (previewImage instanceof HTMLImageElement) {
    previewImage.src = src;
    previewImage.alt = alt;
  }

  if (details instanceof HTMLElement) {
    details.hidden = !hasMetadata;
  }

  if (previewContent instanceof HTMLElement) {
    previewContent.classList.toggle("has-details", hasMetadata);
  }

  if (categoryElement instanceof HTMLElement) {
    categoryElement.textContent = category;
  }

  if (titleElement instanceof HTMLElement) {
    titleElement.textContent = title || alt || "";
  }

  if (descriptionElement instanceof HTMLElement) {
    descriptionElement.textContent = description;
  }

  hideProjectLoader();
  hideImageLoadingOverlay();
  modal.setAttribute("aria-hidden", "false");

  requestAnimationFrame(() => {
    modal.classList.add("visible");
  });
};

if (previewImages.length > 0) {
  previewImages.forEach((image) => {
    image.style.cursor = "zoom-in";

    image.addEventListener("click", () => {
      showProjectLoader("Loading Image Preview...");

      window.setTimeout(() => {
        showImagePreview(getImagePreviewData(image));
      }, 700);
    });
  });
}

if (clickablePreviews.length > 0) {
  clickablePreviews.forEach((preview) => {
    preview.style.cursor = "zoom-in";

    preview.addEventListener("click", () => {
      const image = preview.querySelector("img");
      const src = preview.dataset.previewSrc || (image instanceof HTMLImageElement ? image.currentSrc || image.src : "");
      const alt = image instanceof HTMLImageElement
        ? image.alt
        : (preview.dataset.previewTitle || "Project preview image");

      if (!src) {
        return;
      }

      showImageLoadingOverlay("Loading Image Preview...");

      imagePreviewDelay = window.setTimeout(() => {
        imagePreviewDelay = null;
        showImagePreview({
          src,
          alt
        });
      }, 450);
    });
  });
}

if (practicalGalleryButtons.length > 0 && practicalGalleryModal) {
  practicalGalleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showProjectLoader("Loading Practical Photos...");

      window.setTimeout(() => {
        hideProjectLoader();
        practicalGalleryModal.setAttribute("aria-hidden", "false");

        requestAnimationFrame(() => {
          practicalGalleryModal.classList.add("visible");
        });
      }, 700);
    });
  });

  practicalGalleryModal.addEventListener("click", (event) => {
    if (event.target === practicalGalleryModal) {
      closePracticalGallery();
    }
  });
}

if (practicalGalleryClose) {
  practicalGalleryClose.addEventListener("click", () => {
    closePracticalGallery();
  });
}

if (practicalGalleryImages.length > 0) {
  practicalGalleryImages.forEach((image) => {
    image.addEventListener("click", () => {
      showImageLoadingOverlay("Loading Image Preview...");

      imagePreviewDelay = window.setTimeout(() => {
        imagePreviewDelay = null;
        showImagePreview(getImagePreviewData(image));
      }, 450);
    });
  });
}

if (eventGalleryButtons.length > 0 && eventGalleryModal) {
  eventGalleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showProjectLoader("Loading Event Photos...");

      window.setTimeout(() => {
        hideProjectLoader();
        eventGalleryModal.setAttribute("aria-hidden", "false");

        requestAnimationFrame(() => {
          eventGalleryModal.classList.add("visible");
        });
      }, 700);
    });
  });

  eventGalleryModal.addEventListener("click", (event) => {
    if (event.target === eventGalleryModal) {
      closeEventGallery();
    }
  });
}

if (eventGalleryClose) {
  eventGalleryClose.addEventListener("click", () => {
    closeEventGallery();
  });
}

if (eventGalleryImages.length > 0) {
  eventGalleryImages.forEach((image) => {
    image.addEventListener("click", () => {
      showImageLoadingOverlay("Loading Image Preview...");

      imagePreviewDelay = window.setTimeout(() => {
        imagePreviewDelay = null;
        showImagePreview(getImagePreviewData(image));
      }, 450);
    });
  });
}

if (viewResumeButton && resumeModal) {
  viewResumeButton.addEventListener("click", () => {
    showProjectLoader("Loading Resume...");

    window.setTimeout(() => {
      hideProjectLoader();
      resumeModal.setAttribute("aria-hidden", "false");

      requestAnimationFrame(() => {
        resumeModal.classList.add("visible");
      });
    }, 700);
  });

  resumeModal.addEventListener("click", (event) => {
    if (event.target === resumeModal) {
      closeResumeModal();
    }
  });
}

if (resumeClose) {
  resumeClose.addEventListener("click", () => {
    closeResumeModal();
  });
}

if (educationPreviewMedia.length > 0) {
  educationPreviewMedia.forEach((media) => {
    media.addEventListener("click", () => {
      const image = media.querySelector("img");

      if (!(image instanceof HTMLImageElement)) {
        return;
      }

      showImageLoadingOverlay("Loading Image Preview...");

      imagePreviewDelay = window.setTimeout(() => {
        imagePreviewDelay = null;
        showImagePreview({
          src: image.currentSrc || image.src,
          alt: image.alt
        });
      }, 450);
    });
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePracticalGallery();
    closeEventGallery();
    closeResumeModal();
    closeImagePreview();
  }
});
