const ageInput = document.getElementById('age');
const ageToggle = document.getElementById('age_toggle');

ageToggle.addEventListener('change', () => {
  ageInput.disabled = !ageToggle.checked;
  ageInput.required = ageToggle.checked;

  if (!ageToggle.checked) ageInput.value = '';
});
