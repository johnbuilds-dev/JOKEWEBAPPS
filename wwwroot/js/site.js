// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
});

// 1. Draw the joke onto a canvas and get it as a file
async function generateJokeCard(setup, punchline) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1080; // square, works everywhere
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f1117'; // your dark bg
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.fillStyle = '#ff5c6c'; // your brand red
  ctx.font = 'bold 56px sans-serif';
  wrapText(ctx, setup, 60, 300, 960, 70);
  ctx.fillStyle = '#ffffff';
  ctx.font = '48px sans-serif';
  wrapText(ctx, punchline, 60, 550, 960, 60);
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText('JOKEWEBAPPS', 60, 1000);

  const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
  return new File([blob], 'joke.png', { type: 'image/png' });
}

// Helper to wrap text on canvas
function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

// 2. One share button, native sheet on mobile, fallback buttons on desktop
async function shareJoke(setup, punchline) {
  const file = await generateJokeCard(setup, punchline);
  const shareData = { files: [file], title: 'JOKEWEBAPPS', text: `${setup}\n\n${punchline}` };

  if (navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData); // opens native sheet — WhatsApp, IG, Snap, Twitter, FB
    } catch (err) {
      console.log('Error sharing', err);
      showFallbackShareLinks(setup, punchline, file);
    }
  } else {
    showFallbackShareLinks(setup, punchline, file); // desktop fallback below
  }
}

function showFallbackShareLinks(setup, punchline, file) {
  const text = encodeURIComponent(`${setup} — ${punchline}`);
  const url = encodeURIComponent(window.location.href);
  // These three accept direct pre-filled sharing:
  document.getElementById('whatsapp-share').href = `https://wa.me/?text=${text}`;
  document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?text=${text}`;
  document.getElementById('facebook-share').href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  // Instagram & Snapchat have no equivalent — offer a download instead,
  // since their story-posting only works via their own native apps:
  document.getElementById('download-card').href = URL.createObjectURL(file);
  
  if (window.$) {
    $('#shareFallbackModal').modal('show');
  }
}

function renderStreak(count) {
  const el = document.querySelector('.streak-count');
  if (el) {
    el.textContent = count;
    el.style.fontSize = count >= 100 ? '13px' : count >= 10 ? '15px' : '18px';
  }
}

// Run renderStreak with a dummy value just to initialize the badge style
document.addEventListener('DOMContentLoaded', () => {
  renderStreak(100);
});

// After user picks a GIF/image and types caption text positioned on it:
async function saveMemeJoke(imageBlob, captionText, position) {
  const flattened = await flattenTextOntoImage(imageBlob, captionText, position);
  const url = await uploadToStorage(flattened); // wherever you're storing media
  await createPost({ type: 'meme', media_url: url, caption: captionText });
}

// Stubs for the meme builder
async function flattenTextOntoImage(imageBlob, captionText, position) {
  return imageBlob;
}
async function uploadToStorage(blob) {
  return URL.createObjectURL(blob); 
}
async function createPost(postData) {
  console.log("Post created", postData);
}
