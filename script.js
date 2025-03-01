let blockSlider = document.querySelector(".slider");
let slideItem = document.querySelectorAll(".slider__slide");
let spanCirkel = document.querySelectorAll(".span-cirkel");
let checkIndex = 0;
let colors = [
  "#ffa500",
  "#0000ff",
  "#000000",
  "#7fff00",
  "#35012C",
  "#C7E8F3",
  "#DC0073",
];

// Variables for drag functionality
let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let currentIndex = 0;
let dragThreshold = 100; // Minimum drag distance to trigger slide change

function arrangeSlides() {
  // Calculate positions for all slides
  slideItem.forEach((slide, index) => {
    // Remove all position classes first
    slide.classList.remove(
      "active-slide",
      "left-slide",
      "right-slide",
      "far-left-slide",
      "far-right-slide"
    );

    // Reset any inline styles that might have been applied
    slide.style.width = "";
    slide.style.opacity = "";
    slide.style.visibility = "";

    // Calculate relative position from the active slide
    let relativePos =
      (index - checkIndex + slideItem.length) % slideItem.length;

    // Assign position classes based on relative position
    if (relativePos === 0) {
      slide.style.display = "block";
      slide.classList.add("active-slide");
    } else if (relativePos === 1) {
      slide.style.display = "block";
      slide.classList.add("right-slide");
    } else if (relativePos === slideItem.length - 1) {
      slide.style.display = "block";
      slide.classList.add("left-slide");
    } else if (relativePos === 2) {
      slide.style.display = "block";
      slide.classList.add("far-right-slide");
    } else if (relativePos === slideItem.length - 2) {
      slide.style.display = "block";
      slide.classList.add("far-left-slide");
    } else {
      slide.style.display = "none";
    }
  });

  // Update indicator circles
  spanCirkel.forEach((span, index) => {
    span.style.backgroundColor = index === checkIndex ? "#F04259" : "#d9d9d9";
  });
}

function showSlideItem(index) {
  if (index >= slideItem.length) {
    checkIndex = 0;
  } else if (index < 0) {
    checkIndex = slideItem.length - 1;
  } else {
    checkIndex = index;
  }

  arrangeSlides();
}

// Touch events for drag functionality
function touchStart(event) {
  if (event.type.includes("mouse")) {
    event.preventDefault();
    startPosition = event.clientX;
  } else {
    startPosition = event.touches[0].clientX;
  }

  isDragging = true;
  animationID = requestAnimationFrame(animation);

  blockSlider.classList.add("grabbing");
}

function touchMove(event) {
  if (isDragging) {
    let currentPosition = 0;
    if (event.type.includes("mouse")) {
      currentPosition = event.clientX;
    } else {
      currentPosition = event.touches[0].clientX;
    }

    currentTranslate = prevTranslate + currentPosition - startPosition;
  }
}

function touchEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);

  const movedBy = currentTranslate - prevTranslate;

  // If moved enough negative (right to left), go to next slide
  if (movedBy < -dragThreshold) {
    showSlideItem(checkIndex + 1);
  }
  // If moved enough positive (left to right), go to previous slide
  else if (movedBy > dragThreshold) {
    showSlideItem(checkIndex - 1);
  }

  prevTranslate = 0;
  currentTranslate = 0;

  blockSlider.classList.remove("grabbing");
}

function animation() {
  if (isDragging) {
    // We don't actually move the slider here, just track the movement
    animationID = requestAnimationFrame(animation);
  }
}

// Add event listeners for drag functionality
function addEventListeners() {
  // Touch events
  blockSlider.addEventListener("touchstart", touchStart);
  blockSlider.addEventListener("touchmove", touchMove);
  blockSlider.addEventListener("touchend", touchEnd);

  // Mouse events
  blockSlider.addEventListener("mousedown", touchStart);
  blockSlider.addEventListener("mousemove", touchMove);
  blockSlider.addEventListener("mouseup", touchEnd);
  blockSlider.addEventListener("mouseleave", touchEnd);

  // Prevent context menu on long press
  blockSlider.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
}

// Initialize slider on page load
document.addEventListener("DOMContentLoaded", () => {
  arrangeSlides();
  addEventListeners();
});

// Navigation buttons
document.querySelector(".arrow-next").addEventListener("click", () => {
  showSlideItem(checkIndex + 1);
});

document.querySelector(".arrow-prev").addEventListener("click", () => {
  showSlideItem(checkIndex - 1);
});
