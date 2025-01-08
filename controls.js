
document.addEventListener('DOMContentLoaded', () => {
  const allHighlightRadios = document.querySelectorAll('input[name="all-highlight"]');
  const otherRadios = {
    'frequency-highlight': document.querySelectorAll('input[name="frequency-highlight"]'),
    'resistance-highlight': document.querySelectorAll('input[name="resistance-highlight"]'),
    'capacitance-highlight': document.querySelectorAll('input[name="capacitance-highlight"]'),
    'inductance-highlight': document.querySelectorAll('input[name="inductance-highlight"]')
  };

  allHighlightRadios.forEach(radio => {
    radio.addEventListener('click', () => {
      if (radio.checked) {
        for (const groupName in otherRadios) {
          otherRadios[groupName].forEach(otherRadio => {
            if (otherRadio.value === radio.value) {
              otherRadio.checked = true;
            } else {
              otherRadio.checked = false;
            }
          });
        }
      }
    });
  });
});
