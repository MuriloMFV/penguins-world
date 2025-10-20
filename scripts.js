   document.addEventListener('DOMContentLoaded', function() {
            const dynamicBg = document.getElementById('dynamicBg');
            const bgImages = document.querySelectorAll('.bg-image');
            const sections = document.querySelectorAll('.penguin-section');
            const indicatorDots = document.querySelectorAll('.indicator-dot');
            const header = document.getElementById('header');
            const snowContainer = document.getElementById('snow');
            
            // Criar efeito de neve
            function createSnow() {
                const snowflakeCount = 50;
                
                for (let i = 0; i < snowflakeCount; i++) {
                    const snowflake = document.createElement('div');
                    snowflake.classList.add('snowflake');
                    
                    // Tamanho aleatório
                    const size = Math.random() * 5 + 2;
                    snowflake.style.width = `${size}px`;
                    snowflake.style.height = `${size}px`;
                    
                    // Posição inicial aleatória
                    snowflake.style.left = `${Math.random() * 100}%`;
                    snowflake.style.top = `${Math.random() * 100}%`;
                    
                    // Opacidade aleatória
                    snowflake.style.opacity = Math.random() * 0.6 + 0.2;
                    
                    // Duração da animação aleatória
                    const duration = Math.random() * 10 + 10;
                    snowflake.style.animation = `fall ${duration}s linear infinite`;
                    
                    snowContainer.appendChild(snowflake);
                }
                
                // Adicionar keyframes para a animação de queda
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fall {
                        0% {
                            transform: translateY(-100px) translateX(0);
                        }
                        100% {
                            transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Atualizar fundo baseado na posição de scroll
            function updateBackground() {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                
                // Encontrar a seção atual
                let currentSection = null;
                let nextSection = null;
                let progress = 0;
                
                for (let i = 0; i < sections.length; i++) {
                    const section = sections[i];
                    const sectionTop = section.offsetTop - windowHeight * 0.3;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                        currentSection = section;
                        nextSection = sections[i + 1] || null;
                        progress = (scrollY - sectionTop) / sectionHeight;
                        break;
                    }
                }
                
                // Se estamos no hero section
                if (scrollY < sections[0].offsetTop - windowHeight * 0.5) {
                    activateBackgroundImage('bg-hero');
                    // NOVO: Remover gradiente no hero
                    dynamicBg.style.opacity = '0.1';
                    return;
                }
                
                // Se não encontramos uma seção, usar a primeira ou última
                if (!currentSection) {
                    if (scrollY < sections[0].offsetTop) {
                        currentSection = sections[0];
                        progress = 0;
                    } else {
                        currentSection = sections[sections.length - 1];
                        progress = 1;
                    }
                }
                
                // Ativar imagem de fundo da seção atual
                const bgImageId = currentSection.getAttribute('data-bg-image');
                if (bgImageId) {
                    activateBackgroundImage(bgImageId);
                }
                
                // NOVO: Ajustar opacidade do gradiente baseado na progressão
                dynamicBg.style.opacity = (0.3 - (progress * 0.2)).toString();
                
                // Obter cores para interpolação
                const startColor = currentSection.getAttribute('data-bg-start') || '#0a2e46';
                let endColor = currentSection.getAttribute('data-bg-end') || '#1a5276';
                
                // Interpolar entre cores
                const interpolatedColor = interpolateColor(startColor, endColor, progress);
                dynamicBg.style.background = interpolatedColor;
                
                // Atualizar indicadores
                updateIndicators(currentSection.id);
            }
            
            // Ativar imagem de fundo específica
            function activateBackgroundImage(imageId) {
                bgImages.forEach(img => {
                    if (img.id === imageId) {
                        img.classList.add('active');
                    } else {
                        img.classList.remove('active');
                    }
                });
            }
            
            // Função para interpolar entre duas cores
            function interpolateColor(color1, color2, factor) {
                const hex = (color) => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                    return result ? {
                        r: parseInt(result[1], 16),
                        g: parseInt(result[2], 16),
                        b: parseInt(result[3], 16)
                    } : null;
                };
                
                const rgb1 = hex(color1);
                const rgb2 = hex(color2);
                
                if (!rgb1 || !rgb2) return color1;
                
                const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
                const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
                const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
                
                return `rgb(${r}, ${g}, ${b})`;
            }
            
            // Atualizar indicadores de seção
            function updateIndicators(activeSectionId) {
                indicatorDots.forEach(dot => {
                    if (dot.getAttribute('data-section') === activeSectionId) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
            
            // Navegação por clique nos indicadores
            indicatorDots.forEach(dot => {
                dot.addEventListener('click', function() {
                    const targetSection = this.getAttribute('data-section');
                    const targetElement = document.getElementById(targetSection);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Header scroll effect
            function updateHeader() {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            
            // Inicialização
            createSnow();
            updateBackground();
            updateHeader();
            
            // Event listeners
            window.addEventListener('scroll', function() {
                updateBackground();
                updateHeader();
            });
            
            window.addEventListener('resize', updateBackground);
        });