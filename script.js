document.getElementById('generate').onclick = async () => {
  const videoFile = document.getElementById('videoInput').files[0];
  if (!videoFile) return alert("Please upload a video.");

  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';

  const video = document.createElement('video');
  video.src = URL.createObjectURL(videoFile);
  await video.play();
  video.pause();

  const totalFrames = 1000;
  const framesPerSheet = 100;
  const sheetCount = totalFrames / framesPerSheet;
  const frameCols = 10;
  const frameSize = 64;

  const canvas = document.createElement('canvas');
  canvas.width = frameCols * frameSize;
  canvas.height = frameCols * frameSize;
  const ctx = canvas.getContext('2d');

  const frameGap = video.duration / totalFrames;

  for (let s = 0; s < sheetCount; s++) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < framesPerSheet; i++) {
      const frameIndex = s * framesPerSheet + i;
      video.currentTime = frameIndex * frameGap;
      await new Promise(r => video.onseeked = r);

      ctx.drawImage(
        video,
        (i % frameCols) * frameSize,
        Math.floor(i / frameCols) * frameSize,
        frameSize,
        frameSize
      );
    }

    const imgURL = canvas.toDataURL("image/png");
    const img = document.createElement('img');
    img.src = imgURL;
    img.style.border = "1px solid black";
    outputDiv.appendChild(img);

    const link = document.createElement('a');
    link.href = imgURL;
    link.download = `sheet_${s+1}.png`;
    link.innerText = `Download Sheet ${s+1}`;
    outputDiv.appendChild(link);
    outputDiv.appendChild(document.createElement('br'));
  }
};
