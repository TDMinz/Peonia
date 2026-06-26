export function flyToCart(
    imageElement: HTMLImageElement,
    cartElement: HTMLElement
  ) {
    const start = imageElement.getBoundingClientRect();
    const end = cartElement.getBoundingClientRect();
  
    const clone = imageElement.cloneNode(true) as HTMLImageElement;
  
    clone.style.position = "fixed";
    clone.style.left = `${start.left}px`;
    clone.style.top = `${start.top}px`;
    clone.style.width = `${start.width}px`;
    clone.style.height = `${start.height}px`;
    clone.style.objectFit = "cover";
    clone.style.borderRadius = "20px";
    clone.style.pointerEvents = "none";
    clone.style.zIndex = "9999";
    clone.style.boxShadow = "0 15px 40px rgba(0,0,0,.25)";
    clone.style.transition = "none";
  
    document.body.appendChild(clone);
  
    const duration = 700;
    const startTime = performance.now();
  
    function animate(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
  
      // easeOutCubic
      const progress = 1 - Math.pow(1 - t, 3);
  
      const endX =
  end.left + end.width / 2 - start.width * 0.15-60;

const endY =
  end.top + end.height / 2 - start.height * 0.15-80;

const currentX =
  start.left + (endX - start.left) * progress;

const currentY =
  start.top +
  (endY - start.top) * progress -
  Math.sin(progress * Math.PI) * 170;
      const scale = 1 - progress * 0.8;
  
      clone.style.left = `${currentX}px`;
      clone.style.top = `${currentY}px`;
  
      clone.style.transform = `
        scale(${scale})
        rotate(${progress * 18}deg)
      `;
  
      clone.style.opacity = `${1 - progress * 0.4}`;
  
      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        clone.remove();
  
        // rung icon giỏ hàng
        cartElement.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.18)" },
            { transform: "scale(.95)" },
            { transform: "scale(1)" },
          ],
          {
            duration: 300,
            easing: "ease-out",
          }
        );
      }
    }
  
    requestAnimationFrame(animate);
  }