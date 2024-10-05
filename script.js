document.addEventListener('DOMContentLoaded', () => {
    const floatingBoxesContainer = document.getElementById('floating-boxes');
    const fireworksContainer = document.getElementById('fireworks');
    const numBoxes = Math.floor(Math.random() * 7) + 4; // Random between 4 and 10
    let boxes = [];
    let explodableBoxIndex = Math.floor(Math.random() * numBoxes);

    // Get the showcase section to determine the top boundary
    const showcase = document.getElementById('showcase');
    const showcaseRect = showcase.getBoundingClientRect();
    const topBoundary = showcaseRect.bottom;

    function createBox() {
        const box = document.createElement('div');
        box.classList.add('floating-box');
        
        const newPosition = getRandomPosition();
        box.style.left = `${newPosition.left}px`;
        box.style.top = `${newPosition.top}px`;
        
        box.velocityX = (Math.random() - 0.5) * 2;
        box.velocityY = (Math.random() - 0.5) * 2;
        
        box.addEventListener('click', () => handleBoxClick(box));

        floatingBoxesContainer.appendChild(box);
        boxes.push(box);
    }

    function getRandomPosition() {
        let newPosition;
        const scrollOffset = window.scrollY; // Adjust for scrolling
        do {
            newPosition = {
                left: Math.random() * (window.innerWidth - 30),
                top: topBoundary + Math.random() * (document.body.scrollHeight - topBoundary - 30) + scrollOffset
            };
        } while (isOverlapping(newPosition));

        return newPosition;
    }

    function isOverlapping(newPosition) {
        for (let box of boxes) {
            const rect = box.getBoundingClientRect();
            if (
                Math.abs(newPosition.left - rect.left) < 30 &&
                Math.abs(newPosition.top - rect.top) < 30
            ) {
                return true;
            }
        }
        return false;
    }

    function handleBoxClick(box) {
        const boxIndex = boxes.indexOf(box);
        
        if (boxIndex === explodableBoxIndex) {
            // Unsafe bomb
            box.classList.add('explode');
            showExplosionText();
            removeAllBoxes();
        } else {
            // Safe box
            box.textContent = 'Safe';
            box.classList.add('safe');
            setTimeout(() => {
                box.classList.add('disappear');
                setTimeout(() => {
                    box.remove();
                    boxes = boxes.filter(b => b !== box);
                    if (boxes.length === 1 && boxes[0] === boxes[explodableBoxIndex]) {
                        showFireworks();
                        removeAllBoxes();
                    }
                }, 500);
            }, 1000);
        }

        if (boxIndex < explodableBoxIndex) {
            explodableBoxIndex--;
        }
    }

    function removeAllBoxes() {
        boxes.forEach(box => {
            box.classList.add('disappear');
            setTimeout(() => box.remove(), 500);
        });
        boxes = [];
    }

    function showExplosionText() {
        const explosionText = document.createElement('div');
        explosionText.textContent = 'You Exploded!';
        explosionText.classList.add('explosion-text');
        document.body.appendChild(explosionText);

        setTimeout(() => {
            explosionText.classList.add('fade-out');
            setTimeout(() => {
                explosionText.remove();
            }, 1000);
        }, 3000);
    }

    function showFireworks() {
        fireworksContainer.classList.remove('hidden');
        for (let i = 0; i < 50; i++) {
            createFirework();
        }
        setTimeout(() => {
            fireworksContainer.classList.add('hidden');
            fireworksContainer.innerHTML = '';
        }, 10000);
    }

    function createFirework() {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        firework.style.left = `${Math.random() * window.innerWidth}px`;
        firework.style.top = `${window.innerHeight}px`;
        firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        firework.style.animationDelay = `${Math.random() * 2}s`;
        fireworksContainer.appendChild(firework);
    }

    for (let i = 0; i < numBoxes; i++) {
        createBox();
    }

    function updateBoxPositions() {
        const scrollOffset = window.scrollY; // Track the scrolling
        boxes.forEach((box, index) => {
            const rect = box.getBoundingClientRect();
            let newLeft = rect.left + box.velocityX;
            let newTop = rect.top + box.velocityY + scrollOffset; // Adjust for scrolling

            // Check for collisions with screen edges
            if (newLeft < 0 || newLeft + rect.width > window.innerWidth) {
                box.velocityX *= -1;
                newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));
            }
            if (newTop < topBoundary || newTop + rect.height > document.body.scrollHeight) {
                box.velocityY *= -1;
                newTop = Math.max(topBoundary, Math.min(newTop, document.body.scrollHeight - rect.height));
            }

            // Check for collisions with other boxes 
            boxes.forEach((otherBox, otherIndex) => {
                if (index !== otherIndex) {
                    const otherRect = otherBox.getBoundingClientRect();
                    if (
                        newLeft < otherRect.right &&
                        newLeft + rect.width > otherRect.left &&
                        newTop < otherRect.bottom &&
                        newTop + rect.height > otherRect.top
                    ) {
                        // Collision detected, swap velocities
                        const tempVelocityX = box.velocityX;
                        const tempVelocityY = box.velocityY;
                        box.velocityX = otherBox.velocityX;
                        box.velocityY = otherBox.velocityY;
                        otherBox.velocityX = tempVelocityX;
                        otherBox.velocityY = tempVelocityY;

                        // Add bounce animation
                        box.classList.add('bounce');
                        otherBox.classList.add('bounce');
                        setTimeout(() => {
                            box.classList.remove('bounce');
                            otherBox.classList.remove('bounce');
                        }, 300);
                    }
                }
            });

            box.style.left = `${newLeft}px`;
            box.style.top = `${newTop}px`;
        });

        requestAnimationFrame(updateBoxPositions);
    }

    updateBoxPositions();
});
