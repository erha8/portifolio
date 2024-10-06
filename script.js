document.addEventListener('DOMContentLoaded', () => {
    // Floating boxes code (unchanged)
    const floatingBoxesContainer = document.getElementById('floating-boxes');
    const fireworksContainer = document.getElementById('fireworks');
    const numBoxes = Math.floor(Math.random() * 7) + 4;
    let boxes = [];
    let explodableBoxIndex = Math.floor(Math.random() * numBoxes);

    const showcase = document.getElementById('showcase');
    const showcaseRect = showcase.getBoundingClientRect();
    const topBoundary = showcaseRect.bottom;

    // ... (rest of the floating boxes code remains unchanged)

    // Click counter functionality
    const clickCounterContainer = document.getElementById('click-counter-container');
    let clickCount = 0;

    function updateClickCounter() {
        clickCounterContainer.textContent = `This Button has been clicked ${clickCount} times`;
    }

    function handleButtonClick() {
        clickCount++;
        updateClickCounter();
        
        // Send the updated count to the server (you'll need to implement this)
        saveClickCount(clickCount);
    }

    function saveClickCount(count) {
        // Implement the logic to save the count to your server
        // This is a placeholder function
        console.log('Saving click count:', count);
    }

    function loadClickCount() {
        // Implement the logic to load the count from your server
        // This is a placeholder function that simulates loading
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Math.floor(Math.random() * 100)); // Simulated count
            }, 1000);
        });
    }

    // Create and append the click counter button
    const clickButton = document.createElement('button');
    clickButton.textContent = 'Click me!';
    clickButton.addEventListener('click', handleButtonClick);
    clickCounterContainer.appendChild(clickButton);

    // Load initial click count
    loadClickCount().then((count) => {
        clickCount = count;
        updateClickCounter();
    });

    // Minecraft servers functionality
    const serverContainer = document.getElementById('server-container');

    const servers = [
        {
            name: "FlowerRealms",
            description: "My biggest server yet, hitting 150+ players online. Gens Tycoon.",
            image: "pictures/FlowerRealms.png"
        },
        {
            name: "Craftgenz",
            description: "My first ever Gens Tycoon server. hitting 30+ players at max.",
            image: "pictures/CraftGenz.gif"
        },
        {
            name: "StrongFight",
            description: "A custom minecraft gamemode, where you would train, level up your stats & fight with our custom pvp system.",
            image: "pictures/StrongFight.png"
        },
        {
            name: "UniqueCraft",
            description: "Survival minecraft server with custom terrerian & economy.",
            image: "pictures/UniqueCraft.png"
        },
        {
            name: "BestBox3",
            description: "My first ever server. This was a box server, where you would mine ores and upgrade your gear.",
            image: "pictures/BestBox3.png"
        }
    ];

    function createServerBox(server) {
        const serverBox = document.createElement('div');
        serverBox.classList.add('server-box');
        serverBox.innerHTML = `
            <h3>${server.name}</h3>
            <p>${server.description}</p>
            <img src="${server.image}" alt="${server.name} Server">
        `;
        return serverBox;
    }

    function loadServers() {
        servers.forEach(server => {
            const serverBox = createServerBox(server);
            serverBox.style.opacity = '0';
            serverBox.style.transform = 'translateY(20px)';
            serverContainer.appendChild(serverBox);
        });

        // Trigger the animation for each server box when it comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'opacity 0.5s, transform 0.5s';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.server-box').forEach(box => {
            observer.observe(box);
        });
    }

    // Load all servers at once
    if (serverContainer) {
        loadServers();
    }


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
