document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("termsAccepted");
  const payButton = document.getElementById("payButton");

  if (!checkbox || !payButton) return;

  checkbox.addEventListener("change", () => {
    payButton.disabled = !checkbox.checked;
  });
});

