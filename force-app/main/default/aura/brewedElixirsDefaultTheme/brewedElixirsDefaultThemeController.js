({
  doInit: function (component, event, helper) {
    // Perform any initialization logic here
    // For example, you might want to fetch data asynchronously
    // and show a spinner until the data is loaded

    // Set isLoading to true initially
    component.set("v.isLoading", false);
  }
});
