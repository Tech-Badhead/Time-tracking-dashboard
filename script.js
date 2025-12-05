// --- 1. GLOBAL STATE AND DATA ---

// This array holds the application data from the provided JSON.
let activityData = [
  {
    title: 'Work',
    timeframes: {
      daily: {
        current: 5,
        previous: 7,
      },
      weekly: {
        current: 32,
        previous: 36,
      },
      monthly: {
        current: 103,
        previous: 128,
      },
    },
  },
  {
    title: 'Play',
    timeframes: {
      daily: {
        current: 1,
        previous: 2,
      },
      weekly: {
        current: 10,
        previous: 8,
      },
      monthly: {
        current: 23,
        previous: 29,
      },
    },
  },
  {
    title: 'Study',
    timeframes: {
      daily: {
        current: 0,
        previous: 1,
      },
      weekly: {
        current: 4,
        previous: 7,
      },
      monthly: {
        current: 13,
        previous: 19,
      },
    },
  },
  {
    title: 'Exercise',
    timeframes: {
      daily: {
        current: 1,
        previous: 1,
      },
      weekly: {
        current: 4,
        previous: 5,
      },
      monthly: {
        current: 11,
        previous: 18,
      },
    },
  },
  {
    title: 'Social',
    timeframes: {
      daily: {
        current: 1,
        previous: 1,
      },
      weekly: {
        current: 5,
        previous: 10,
      },
      monthly: {
        current: 21,
        previous: 23,
      },
    },
  },
  {
    title: 'Self Care',
    timeframes: {
      daily: {
        current: 0,
        previous: 1,
      },
      weekly: {
        current: 2,
        previous: 2,
      },
      monthly: {
        current: 7,
        previous: 11,
      },
    },
  },
];

// Global state variable controlling which data set is currently shown.
let activeTimeframe = 'weekly'; // Default to 'weekly'

// --- 2. UTILITY FUNCTIONS ---

/**
 * Converts a title (e.g., "Self Care") into a valid CSS class (e.g., "card-self-care").
 */
const titleToClass = (title) => {
  return (
    'card-' +
    title
      .toLowerCase()
      .replace(/\s/g, '-')
  );
};

/**
 * Returns the correct text label for the "Previous" statistic line based on the timeframe.
 */
const getPreviousText = (timeframe) => {
  switch (timeframe) {
    case 'daily':
      return 'Yesterday';
    case 'weekly':
      return 'Last Week';
    case 'monthly':
      return 'Last Month';
    default:
      return 'Previous';
  }
};

// --- 3. RENDERING FUNCTIONS ---

/**
 * Creates and returns the HTML structure for a single activity card using DOM methods.
 */
const createActivityCard = (item) => {
  const cardElement =
    document.createElement('div');
  const cardClass = titleToClass(
    item.title
  );

  // Set data-activity for easy look-up during updates
  cardElement.className = `activity-card ${cardClass}`;
  cardElement.setAttribute(
    'data-activity',
    item.title
  );

  // Using innerHTML for the complex inner structure
  cardElement.innerHTML = `
                <div class="activity-content">
                    <div class="activity-header">
                        <h2>${item.title}</h2>
                        <button aria-label="Options">
                            <!-- Ellipsis icon (More options) -->
                           <img src="./img/icon-ellipsis.svg" alt="More options icon" />
                        </button>
                    </div>
                    <div class="stats-container">
                        <!-- Elements targeted for dynamic updates -->
                        <p class="stats-current" data-stat-type="current-hours"></p>
                        <p class="stats-previous" data-stat-type="previous-hours"></p>
                    </div>
                </div>
            `;
  return cardElement;
};

/**
 * The core update function: reads the global state (activeTimeframe) and updates the UI.
 */
const updateDashboardStats = () => {
  const previousText = getPreviousText(
    activeTimeframe
  );

  // 1. Loop through the data to update each card's stats
  activityData.forEach((item) => {
    // Select the specific card element
    const card = document.querySelector(
      `.activity-card[data-activity="${item.title}"]`
    );
    if (!card) return;

    // Get the correct stats object (daily, weekly, or monthly)
    const data =
      item.timeframes[activeTimeframe];

    // Update the current hours element text
    const currentElement =
      card.querySelector(
        '[data-stat-type="current-hours"]'
      );
    currentElement.textContent = `${data.current}hrs`;

    // Update the previous hours element text
    const previousElement =
      card.querySelector(
        '[data-stat-type="previous-hours"]'
      );
    previousElement.textContent = `${previousText} - ${data.previous}hrs`;
  });

  // 2. Update the navigation buttons' active class for styling
  document
    .querySelectorAll(
      '.timeframe-nav button'
    )
    .forEach((button) => {
      button.classList.remove('active');
      if (
        button.dataset.timeframe ===
        activeTimeframe
      ) {
        button.classList.add('active');
      }
    });
};

// --- 4. EVENT HANDLERS ---

/**
 * Handles the click event on the timeframe buttons (Daily, Weekly, Monthly).
 */
const handleTimeframeChange = (e) => {
  const newTimeframe =
    e.target.dataset.timeframe;

  // Check if the click target has a valid timeframe attribute and it's different from the current one
  if (
    newTimeframe &&
    newTimeframe !== activeTimeframe
  ) {
    activeTimeframe = newTimeframe; // Update global state
    updateDashboardStats(); // Trigger UI update
  }
};

// --- 5. INITIALIZATION ---

/**
 * Initializes the dashboard when the DOM is fully loaded.
 */
const initializeDashboard = () => {
  const container =
    document.querySelector(
      '.dashboard-container'
    );

  // 5a. Initial rendering: create and append all 6 static cards to the grid
  activityData.forEach((item) => {
    const card =
      createActivityCard(item);
    container.appendChild(card);
  });

  // 5b. Attach event listeners to the navigation buttons container
  const nav = document.querySelector(
    '.timeframe-nav'
  );
  // We use event delegation on the parent to catch clicks on any child button
  nav.addEventListener(
    'click',
    handleTimeframeChange
  );

  // 5c. Display the initial (default: weekly) stats
  updateDashboardStats();
};

// Start the application when the DOM is ready
document.addEventListener(
  'DOMContentLoaded',
  initializeDashboard
);
