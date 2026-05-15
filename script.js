document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const transformBtn = document.getElementById('transformBtn');
    const techniqueGrid = document.getElementById('technique-grid');
    const roadmapSvg = document.getElementById('roadmapSvg');
    const quickSnapList = document.getElementById('quickSnapList');
    const toggleQuickSnap = document.getElementById('toggleQuickSnap');
    const quickSnap = document.getElementById('quickSnap');
    
    // Mobile Warning
    const mobileWarning = document.getElementById('mobileWarning');
    const continueAnyway = document.getElementById('continueAnyway');

    // Compare Mode Elements
    const compareModal = document.getElementById('compareModal');
    const openCompare = document.getElementById('openCompare');
    const closeModal = document.querySelector('.close-modal');
    const compare1Select = document.getElementById('compare1');
    const compare2Select = document.getElementById('compare2');
    const compareCard1 = document.getElementById('compareCard1');
    const compareCard2 = document.getElementById('compareCard2');

    let currentTopic = userInput.value;
    
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function renderCards() {
        techniqueGrid.innerHTML = '';
        techniques.forEach((tech, index) => {
            const card = document.createElement('div');
            card.className = 'technique-card';
            card.id = `tech-${tech.id}`;
            
            const safeTopic = escapeHTML(currentTopic);
            const beforePrompt = "Plan a trip to Goa"; 
            const highlightedPrompt = tech.getHighlightedPrompt(safeTopic);
            const afterPrompt = tech.getAfterPrompt(safeTopic);
            const aiOutput = tech.getAfterOutput(safeTopic);

            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <h2 class="technique-name">${index + 1}. ${tech.name}</h2>
                        <p class="definition" style="margin-top: 5px; margin-bottom: 0;">${tech.definition}</p>
                    </div>
                    <span class="difficulty-badge" style="background: var(--${tech.difficulty})">${tech.difficulty}</span>
                </div>
                
                <details class="technique-content-accordion" ${index === 0 ? 'open' : ''}>
                    <summary class="technique-summary">
                        <div class="summary-trigger">
                            <span class="expand-icon">+</span>
                            <span class="summary-text">Click to read more</span>
                        </div>
                    </summary>
                    
                    <div class="card-body-content">
                        <!-- 1. The How-To -->
                        <div class="formula-box">
                            <span class="box-label">The Formula</span>
                            <div class="formula-content">${tech.formula}</div>
                        </div>

                        <!-- 2. The Proof -->
                        <div class="comparison-grid">
                            <div class="comparison-side">
                                <div class="prompt-area">
                                    <span class="prompt-label">Before Prompt</span>
                                    <div class="prompt-content">${beforePrompt}</div>
                                </div>
                                <div class="ai-output before-output">
                                    <h4 class="output-label">Before Output</h4>
                                    <div class="prompt-content">${tech.getBeforeOutput(currentTopic)}</div>
                                </div>
                            </div>
                            <div class="comparison-side">
                                <div class="prompt-area active-prompt">
                                    <span class="prompt-label">After (Technique Applied)</span>
                                    <div class="prompt-content">${highlightedPrompt}</div>
                                </div>
                                <div class="ai-output after-output">
                                    <h4 class="output-label">After Output</h4>
                                    <div class="prompt-content">${tech.getAfterOutput(currentTopic)}</div>
                                </div>
                            </div>
                        </div>

                        <!-- 3. The Science (Now Open and Before Context) -->
                        <div class="why-works-box">
                            <strong>🧠 Why This Works (The Science)</strong>
                            <p>${tech.whyWorks}</p>
                        </div>

                        <!-- 4. The Context -->
                        <div class="pedagogical-grid">
                            <div class="info-section humor-box">
                                <strong>🤡 The Reality Check</strong>
                                <div>${tech.humor}</div>
                            </div>

                            <div class="info-section daily-box">
                                <strong>🏠 Daily Life Use Case</strong>
                                <div>${tech.dailyUseCase}</div>
                            </div>

                            <div class="info-section myspin-box">
                                <strong>🕵️‍♂️ My Personal Sneaky Spin</strong>
                                <div>"${tech.mySpin}"</div>
                            </div>
                        </div>

                        <!-- 5. The Expert Edge -->
                        <div class="pro-tip">
                            <strong>💡 Pro Tip:</strong> ${tech.proTip}
                        </div>
                    </div>
                </details>
            `;
            techniqueGrid.appendChild(card);
        });
    }

    function renderRoadmap() {
        roadmapSvg.innerHTML = '';
        roadmapSvg.setAttribute('viewBox', '0 0 1000 300'); // Reduced height

        // Draw Straight Path (Left to Right)
        const points = [];
        const startX = 100;
        const endX = 900;
        const baseY = 150; // Center vertically

        for (let i = 0; i < 12; i++) {
            const t = i / 11;
            const x = startX + t * (endX - startX);
            const y = baseY; // Straight line
            points.push({ x, y, tech: techniques[i] });
        }

        // Draw connecting lines
        let pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            // Straight line path
            pathD += ` L ${points[i].x} ${points[i].y}`;
        }

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathD);
        path.setAttribute("stroke", "rgba(0,0,0,0.1)");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("stroke-dasharray", "8,8");
        roadmapSvg.appendChild(path);

        // Draw nodes
        points.forEach((p, i) => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("class", "roadmap-node");
            group.onclick = () => {
                const card = document.getElementById(`tech-${p.tech.id}`);
                const details = card.querySelector('details');
                if (details) details.setAttribute('open', '');
                card.scrollIntoView({ behavior: 'smooth' });
            };

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", p.x);
            circle.setAttribute("cy", p.y);
            circle.setAttribute("r", "10"); // Smaller dot
            circle.setAttribute("fill", `var(--${p.tech.difficulty})`);
            circle.setAttribute("opacity", "0.8");
            
            // Stagger labels to avoid overlap
            const isTop = i % 2 === 0;
            const textY = isTop ? p.y - 35 : p.y + 45;

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", p.x);
            text.setAttribute("y", textY);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "#2B3674");
            text.setAttribute("font-size", "13");
            text.setAttribute("font-weight", "600");
            text.setAttribute("font-family", "Poppins, sans-serif");
            text.textContent = p.tech.name;

            group.appendChild(circle);
            group.appendChild(text);
            roadmapSvg.appendChild(group);
        });
    }

    function renderQuickSnap() {
        quickSnapList.innerHTML = '';
        techniques.forEach(tech => {
            const item = document.createElement('div');
            item.className = 'snap-item';
            item.style.cursor = 'pointer';
            item.innerHTML = `
                <h4 style="font-family: var(--font-body); color: var(--text-color); margin-bottom: 5px; font-weight: 600;">${tech.name}</h4>
                <div class="snap-formula" style="background: #f8f9fa; border: 1px solid #eee; padding: 10px; border-radius: 6px; font-size: 0.85rem;">${tech.formula}</div>
            `;
            item.onclick = () => {
                const card = document.getElementById(`tech-${tech.id}`);
                const details = card.querySelector('details');
                if (details) details.setAttribute('open', '');
                card.scrollIntoView({ behavior: 'smooth' });
                // Optional: close the snap panel on mobile after click
                if (window.innerWidth <= 768) {
                    quickSnap.classList.add('collapsed');
                    toggleQuickSnap.querySelector('span').textContent = '↑';
                }
            };
            quickSnapList.appendChild(item);
        });
    }

    function populateCompareSelects() {
        compare1Select.innerHTML = '';
        compare2Select.innerHTML = '';
        techniques.forEach(tech => {
            const opt1 = document.createElement('option');
            opt1.value = tech.id;
            opt1.textContent = tech.name;
            compare1Select.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = tech.id;
            opt2.textContent = tech.name;
            compare2Select.appendChild(opt2);
        });
        compare2Select.selectedIndex = 1;
    }

    function updateComparison() {
        const t1 = techniques.find(t => t.id === compare1Select.value);
        const t2 = techniques.find(t => t.id === compare2Select.value);

        const safeTopic = escapeHTML(currentTopic);
        [ {t: t1, el: compareCard1}, {t: t2, el: compareCard2} ].forEach(pair => {
            pair.el.innerHTML = `
                <div class="difficulty-badge" style="background: var(--${pair.t.difficulty}); margin-bottom: 10px; display: inline-block;">${pair.t.difficulty}</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 15px; font-weight: 700;">${pair.t.name}</h3>
                
                <div class="info-section daily-box" style="margin: 10px 0; font-size: 0.85rem;">
                    <strong>Best for Daily Life:</strong> ${pair.t.dailyUseCase}
                </div>
                <div class="prompt-area">
                    <span class="prompt-label">The Strategy</span>
                    <div class="prompt-content">${pair.t.getHighlightedPrompt(safeTopic)}</div>
                </div>
                <div class="ai-output" style="margin-top: 15px; padding: 15px;">
                    <h4 style="font-size: 1rem; font-family: var(--font-body); font-weight: 600;">AI Response</h4>
                    <div class="prompt-content" style="font-size: 0.85rem;">${pair.t.getAfterOutput(safeTopic)}</div>
                </div>
            `;
        });
    }

    // Event Listeners
    transformBtn.addEventListener('click', () => {
        currentTopic = userInput.value || "Plan a trip to Goa";
        renderCards();
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') transformBtn.click();
    });

    toggleQuickSnap.addEventListener('click', () => {
        quickSnap.classList.toggle('collapsed');
        const isCollapsed = quickSnap.classList.contains('collapsed');
        toggleQuickSnap.querySelector('span').textContent = isCollapsed ? '↑' : '↓';
    });

    openCompare.addEventListener('click', () => {
        compareModal.style.display = 'block';
        document.body.classList.add('no-scroll');
        updateComparison();
    });

    closeModal.addEventListener('click', () => {
        compareModal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    });

    compare1Select.addEventListener('change', updateComparison);
    compare2Select.addEventListener('change', updateComparison);

    continueAnyway.addEventListener('click', () => {
        mobileWarning.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target == compareModal) {
            compareModal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    }

    // Copy to Clipboard Helper
    window.copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Prompt copied to notebook! (Clipboard)');
        });
    };

    // Initial Render
    renderCards();
    renderRoadmap();
    renderQuickSnap();
    populateCompareSelects();

    // Initialize Icons
    if (window.lucide) {
        lucide.createIcons();
    }
});
