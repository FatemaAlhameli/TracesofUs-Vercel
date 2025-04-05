document.addEventListener('DOMContentLoaded', function() {
  const photoInput = document.getElementById('photoInput');
  const preview = document.getElementById('preview');

  photoInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              preview.src = e.target.result;
              preview.style.display = 'block';
          };
          reader.readAsDataURL(file);
      }
  });

  document.getElementById('uploadForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const printButton = document.getElementById('button');
      printButton.disabled = true;

      const formData = new FormData();
      formData.append('photo', photoInput.files[0]);

      fetch('/upload', {
          method: 'POST',
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          alert('Your photo is on its way! Once printed, place it on the mirror to become part of our shared memory.');
          printButton.disabled = false;
      })
      .catch(error => {
          console.error('Error:', error);
          printButton.disabled = false;
      });
  });
});