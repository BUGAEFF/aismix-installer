/**
 * Terms acceptance controller
 *
 * Purpose:
 * - Disable payment until Terms checkbox is accepted
 * - Used on Stripe and PayPal pages
 *
 * Legal importance:
 * - Prevents accidental payment
 * - Explicit user consent before transaction
 */

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("termsAccepted");
  const payButton = document.getElementById("payButton");

  if (!checkbox || !payButton) return;

  payButton.disabled = true;

  checkbox.addEventListener("change", () => {
    payButton.disabled = !checkbox.checked;
  });
});
