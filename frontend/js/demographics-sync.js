// Demographics Synchronization System
// This script helps sync data between admin panel and homepage charts

class DemographicsSync {
  constructor() {
    this.BASE_URL = "http://localhost:5001";
    this.listeners = [];
    this.init();
  }

  init() {
    // Listen for storage events (cross-tab communication)
    window.addEventListener("storage", (e) => {
      if (e.key === "demographics-updated") {
        this.refreshAllCharts();
      }
    });

    // Listen for custom events
    window.addEventListener("demographics-data-changed", () => {
      this.refreshAllCharts();
    });
  }

  // Trigger data update notification
  notifyDataChange() {
    // Set localStorage to trigger storage event in other tabs
    localStorage.setItem("demographics-updated", Date.now().toString());

    // Dispatch custom event for same tab
    window.dispatchEvent(new CustomEvent("demographics-data-changed"));
  }

  // Register a callback to be called when data changes
  onDataChange(callback) {
    this.listeners.push(callback);
  }

  // Refresh all registered charts
  async refreshAllCharts() {
    try {
      const response = await fetch(`${this.BASE_URL}/pendataan/statistics`);
      if (response.ok) {
        const data = await response.json();

        // Call all registered listeners
        this.listeners.forEach((callback) => {
          try {
            callback(data);
          } catch (error) {
            console.error("Error in demographics sync callback:", error);
          }
        });

        // Call global refresh function if available
        if (typeof window.refreshDemographicsData === "function") {
          window.refreshDemographicsData();
        }
      }
    } catch (error) {
      console.error("Error fetching demographics data:", error);
    }
  }

  // Manually fetch latest data
  async getLatestData() {
    try {
      const response = await fetch(`${this.BASE_URL}/pendataan/statistics`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error fetching demographics data:", error);
      return null;
    }
  }
}

// Create global instance
window.demographicsSync = new DemographicsSync();

// Export for module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = DemographicsSync;
}
