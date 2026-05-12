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

    function renderCards() {
        techniqueGrid.innerHTML = '';
        techniques.forEach((tech, index) => {
            const card = document.createElement('div');
            card.className = 'technique-card';
            card.id = `tech-${tech.id}`;
            
            const beforePrompt = "Plan a trip to Goa"; 
            const highlightedPrompt = tech.getHighlightedPrompt(currentTopic);
            const afterPrompt = tech.getAfterPrompt(currentTopic);
            const aiOutput = tech.getOutput(currentTopic);

            card.innerHTML = `
                <div class="card-header">
                    <h2 class="technique-name">${index + 1}. ${tech.name}</h2>
                    <span class="difficulty-badge" style="background: var(--${tech.difficulty})">${tech.difficulty}</span>
                </div>
                <p class="definition">${tech.definition}</p>
                
                <div class="info-section humor-box">
                    <strong>🤡 The Reality Check</strong>
                    ${tech.humor}
                </div>

                <div class="info-section daily-box">
                    <strong>🏠 Daily Life Use Case</strong>
                    ${tech.dailyUseCase}
                </div>

                <div class="info-section myspin-box">
                    <strong>🕵️‍♂️ My Personal Sneaky Spin</strong>
                    "${tech.mySpin}"
                </div>

                <div class="formula-box">
                    <strong>Formula:</strong> ${tech.formula}
                </div>

                <div class="comparison-grid">
                    <div class="comparison-side">
                        <div class="prompt-area">
                            <span class="prompt-label">Before Prompt</span>
                            <div class="prompt-content">${beforePrompt}</div>
                        </div>
                        <div class="ai-output" style="border-color: #eee; background: #fafafa;">
                            <h4 style="color: #888;">Before Output</h4>
                            <div class="prompt-content" style="color: #666; font-size: 0.85rem;">${tech.getBeforeOutput(currentTopic)}</div>
                        </div>
                    </div>
                    <div class="comparison-side">
                        <div class="prompt-area">
                            <span class="prompt-label">After (Technique)</span>
                            <div class="prompt-content">${highlightedPrompt}</div>
                        </div>
                        <div class="ai-output">
                            <h4>After Output</h4>
                            <div class="prompt-content">${tech.getAfterOutput(currentTopic)}</div>
                        </div>
                    </div>
                </div>

                <div class="pro-tip">
                    <strong>💡 Pro Tip:</strong> ${tech.proTip}
                </div>

                <div class="card-actions">
                    <button class="action-btn" onclick="copyText('${afterPrompt.replace(/'/g, "\\'")}')">Copy Prompt</button>
                </div>

                <details class="why-works" style="margin-top: 20px; color: var(--text-secondary);">
                    <summary style="cursor: pointer; font-weight: 700;">Why This Works</summary>
                    <p style="margin-top: 10px; font-size: 0.9rem;">${tech.whyWorks}</p>
                </details>
            `;
            techniqueGrid.appendChild(card);
        });
    }

    function renderRoadmap() {
        const width = 1000;
        const height = 400;
        roadmapSvg.innerHTML = '';

        // Draw Arc Path (Left to Right)
        const points = [];
        const startX = 100;
        const endX = 900;
        const baseY = 300;
        const peakY = 50;

        for (let i = 0; i < 12; i++) {
            const t = i / 11;
            // Quadratic Bezier-like Arc
            const x = startX + t * (endX - startX);
            const y = baseY - Math.sin(t * Math.PI) * (baseY - peakY);
            points.push({ x, y, tech: techniques[i] });
        }

        // Draw connecting lines
        let pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            // Curvy path
            const midX = (points[i-1].x + points[i].x) / 2;
            pathD += ` Q ${midX} ${points[i].y - 20}, ${points[i].x} ${points[i].y}`;
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
                document.getElementById(`tech-${p.tech.id}`).scrollIntoView({ behavior: 'smooth' });
            };

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", p.x);
            circle.setAttribute("cy", p.y);
            circle.setAttribute("r", "18");
            circle.setAttribute("fill", `var(--${p.tech.difficulty})`);
            circle.setAttribute("stroke", "white");
            circle.setAttribute("stroke-width", "3");
            
            // Stagger labels to avoid overlap
            const isTop = i % 2 === 0;
            const textY = isTop ? p.y - 35 : p.y + 45;

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", p.x);
            text.setAttribute("y", textY);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "#2c3e50");
            text.setAttribute("font-size", "12");
            text.setAttribute("font-weight", "500");
            text.setAttribute("font-family", "Inter, sans-serif");
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
            item.innerHTML = `
                <h4 style="font-family: 'Architects Daughter'; color: var(--text-color); margin-bottom: 5px;">${tech.name}</h4>
                <div class="snap-formula" style="background: #f8f9fa; border: 1px solid #eee; padding: 10px; border-radius: 6px;">${tech.formula}</div>
            `;
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

        [ {t: t1, el: compareCard1}, {t: t2, el: compareCard2} ].forEach(pair => {
            pair.el.innerHTML = `
                <div class="difficulty-badge" style="background: var(--${pair.t.difficulty}); margin-bottom: 10px; display: inline-block;">${pair.t.difficulty}</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 15px;">${pair.t.name}</h3>
                
                <div class="info-section daily-box" style="margin: 10px 0; font-size: 0.85rem;">
                    <strong>Best for Daily Life:</strong> ${pair.t.dailyUseCase}
                </div>

                <div class="prompt-area">
                    <span class="prompt-label">The Strategy</span>
                    <div class="prompt-content">${pair.t.getHighlightedPrompt(currentTopic)}</div>
                </div>
                <div class="ai-output" style="margin-top: 15px; padding: 15px;">
                    <h4 style="font-size: 1rem; font-family: 'Inter', sans-serif;">AI Response</h4>
                    <div class="prompt-content" style="font-size: 0.85rem;">${pair.t.getAfterOutput(currentTopic)}</div>
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
        toggleQuickSnap.textContent = quickSnap.classList.contains('collapsed') ? '↑' : '↓';
    });

    openCompare.addEventListener('click', () => {
        compareModal.style.display = 'block';
        updateComparison();
    });

    closeModal.addEventListener('click', () => {
        compareModal.style.display = 'none';
    });

    compare1Select.addEventListener('change', updateComparison);
    compare2Select.addEventListener('change', updateComparison);

    continueAnyway.addEventListener('click', () => {
        mobileWarning.style.display = 'none';
    });

    window.onclick = (event) => {
        if (event.target == compareModal) compareModal.style.display = 'none';
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
});
