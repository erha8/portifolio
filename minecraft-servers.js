document.addEventListener('DOMContentLoaded', () => {
    const serverContainer = document.getElementById('server-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    let currentPage = 1;
    const serversPerPage = 2;

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

    function loadServers() {
        const startIndex = (currentPage - 1) * serversPerPage;
        const endIndex = startIndex + serversPerPage;
        const serversToLoad = servers.slice(startIndex, endIndex);

        serversToLoad.forEach(server => {
            const serverBox = document.createElement('div');
            serverBox.classList.add('server-box');
            serverBox.innerHTML = `
                <h3>${server.name}</h3>
                <p>${server.description}</p>
                <img src="${server.image}" alt="${server.name} Server">
            `;
            serverContainer.appendChild(serverBox);
        });

        currentPage++;
        loadingSpinner.classList.add('hidden');
    }

    function checkScroll() {
        const scrollPosition = window.innerHeight + window.scrollY;
        const pageHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= pageHeight - 200 && !loadingSpinner.classList.contains('loading')) {
            loadingSpinner.classList.remove('hidden');
            loadingSpinner.classList.add('loading');
            setTimeout(() => {
                loadServers();
                loadingSpinner.classList.remove('loading');
            }, 1000);
        }
    }

    loadServers();
    window.addEventListener('scroll', checkScroll);
});
