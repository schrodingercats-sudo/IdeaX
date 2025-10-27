export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const generateVideoThumbnail = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      return reject(new Error('Canvas 2D context is not available.'));
    }

    video.addEventListener('loadeddata', () => {
      video.currentTime = 1; // Seek to 1 second to ensure the frame is loaded
    });

    video.addEventListener('seeked', () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame onto the canvas
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      // Get the image data from the canvas
      const dataUrl = canvas.toDataURL('image/jpeg');
      URL.revokeObjectURL(video.src); // Clean up the object URL
      resolve(dataUrl);
    });
    
    video.addEventListener('error', (e) => {
        URL.revokeObjectURL(video.src);
        reject(new Error(`Failed to load video: ${e.message}`));
    });

    video.src = URL.createObjectURL(file);
    video.load();
  });
