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

  document.getElementById('photoInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(function(blob) {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    // Replace the original file with the compressed file
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(compressedFile);
                    document.getElementById('photoInput').files = dataTransfer.files;
                    // Now you can upload the compressedFile using FormData
                }, 'image/jpeg', 0.7); // Adjust quality (0.0 to 1.0)
            }
            img.src = event.target.result;
        }
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