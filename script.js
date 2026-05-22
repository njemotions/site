// script.js - Version Corrigée et Fiabilisée

let firstSwiper; // Pour le portfolio Swiper
let servicesProSwiperInstance; // Pour les services pro Swiper
let mainSplideInstance; // Pour le Splide matériel principal
const allNestedSplideInstances = new Map(); // Pour les Splides matériels imbriqués

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM entièrement chargé et analysé.');

    // --- MODULE: MENU HAMBURGER ---
    try {
        const mobileMenu = document.getElementById('mobile-menu');
        const nav = document.getElementById('nav'); // 'nav' est utilisé plus loin, donc on le garde ici
        if (mobileMenu && nav) {
            // console.log('Initialisation du menu hamburger.');
            mobileMenu.addEventListener('click', function() {
                nav.classList.toggle('active');
                mobileMenu.classList.toggle('is-active');
            });
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        mobileMenu.classList.remove('is-active');
                    }
                });
            });
        } else {
            // console.warn('Éléments du menu hamburger (mobileMenu ou nav) non trouvés.');
        }
    } catch (e) {
        console.error("Erreur dans la logique du menu hamburger:", e);
    }

    // --- MODULE: GESTION DU DÉFILEMENT DU HEADER ---
    try {
        const headerForScroll = document.getElementById('header'); // Variable locale pour cette fonction
        const navForScroll = document.getElementById('nav'); // Utilise la variable nav définie plus haut si elle est globale, sinon la redéfinir ici.
                                
        if (headerForScroll) {
            let lastScrollTop = 0;
            let hideTimeout;
            window.addEventListener("scroll", () => {
                let scrollTop = window.scrollY || document.documentElement.scrollTop;
                if (scrollTop > 50 && (!navForScroll || !navForScroll.classList.contains('active'))) {
                    headerForScroll.classList.add('scrolled');
                } else {
                    headerForScroll.classList.remove('scrolled');
                }
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    if (!navForScroll || !navForScroll.classList.contains('active')) {
                        headerForScroll.classList.add("hidden");
                    }
                } else {
                    headerForScroll.classList.remove("hidden");
                }
                clearTimeout(hideTimeout);
                if (!navForScroll || !navForScroll.classList.contains('active')) {
                    hideTimeout = setTimeout(() => {
                        if (headerForScroll) headerForScroll.classList.remove("hidden"); // Vérifier si headerForScroll existe toujours
                    }, 2000);
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            }, false);
        } else {
            // console.warn("Élément header non trouvé pour la gestion du défilement.");
        }
    } catch (e) {
        console.error("Erreur dans la gestion du défilement du header:", e);
    }

    // --- MODULE: SWIPER SERVICES PROFESSIONNELS ---
    try {
        const servicesProSwiperSelector = '.services-pro-swiper';
        const swiperContainerServicesPro = document.querySelector(servicesProSwiperSelector);

        function initializeServicesProSwiper() {
            const isMobile = window.innerWidth <= 1199;
            // servicesProSwiperInstance est globale
            // swiperContainerServicesPro est défini ci-dessus

            if (isMobile && !servicesProSwiperInstance && swiperContainerServicesPro) {
                // console.log('Initialisation Swiper Services Pro (mobile).');
                servicesProSwiperInstance = new Swiper(servicesProSwiperSelector, {
                    slidesPerView: 1, spaceBetween: 0, centeredSlides: false, loop: true,
                    pagination: { el: '.services-pro-pagination', clickable: true },
                    navigation: { nextEl: '.services-pro-next-btn', prevEl: '.services-pro-prev-btn' },
                    observer: true, observeParents: true,
                    on: {
                        init: function () { if (swiperContainerServicesPro) swiperContainerServicesPro.classList.add('swiper-initialized-mobile'); },
                        destroy: function () { if (swiperContainerServicesPro) swiperContainerServicesPro.classList.remove('swiper-initialized-mobile'); }
                    }
                });
            } else if (!isMobile && servicesProSwiperInstance) {
                // console.log('Destruction Swiper Services Pro (desktop).');
                servicesProSwiperInstance.destroy(true, true);
                servicesProSwiperInstance = undefined;
                const swiperWrapper = swiperContainerServicesPro ? swiperContainerServicesPro.querySelector('.swiper-wrapper') : null;
                if (swiperWrapper) {
                    swiperWrapper.style.display = ''; swiperWrapper.style.transform = ''; swiperWrapper.style.width = '';
                }
            }
        }

        if (swiperContainerServicesPro) {
            initializeServicesProSwiper(); // Appel initial
            let resizeTimeoutServicesPro;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeoutServicesPro);
                resizeTimeoutServicesPro = setTimeout(initializeServicesProSwiper, 250);
            });
        } else {
            // console.warn('Conteneur Swiper Services Pro (.services-pro-swiper) non trouvé.');
        }
    } catch (e) {
        console.error("Erreur lors de l'initialisation de Swiper Services Pro:", e);
    }

    // --- MODULE: SWIPER PORTFOLIO ---
    try {
        const portfolioSwiperElement = document.querySelector('.mySwiper');
        if (portfolioSwiperElement) {
            // console.log('Initialisation Swiper Portfolio (.mySwiper).');
            firstSwiper = new Swiper(".mySwiper", { // Utilise la variable globale
                slidesPerView: 1, spaceBetween: 20, loop: true, initialSlide: 0,
                navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
                pagination: { el: ".swiper-pagination", clickable: true },
            });
        } else {
            // console.warn('Conteneur Swiper Portfolio (.mySwiper) non trouvé.');
        }
    } catch (e) {
        console.error("Erreur lors de l'initialisation de Swiper Portfolio:", e);
    }

    // --- MODULE: SPLIDE MATÉRIEL ---
    try {
    // Déclarez mainSplideInstance et lastOrientationPortrait en dehors pour y accéder globalement dans cette portée
    let mainSplideInstance;
    let lastOrientationPortrait; // Pour suivre l'état de l'orientation

    // Vos fonctions initOrGetInstance et refreshNestedSplideInSlide restent inchangées
    const allNestedSplideInstances = new Map(); // Assurez-vous que c'est bien défini

    const initOrGetInstance = (nestedSplideElement, slideDebugLabel) => {
        if (!nestedSplideElement) return null;
        if (allNestedSplideInstances.has(nestedSplideElement)) return allNestedSplideInstances.get(nestedSplideElement);
        
        const instance = new Splide(nestedSplideElement, {
            type: 'fade', rewind: true, trimSpace: true, perPage: 1, pagination: true, arrows: true,
            width: '100%', height: '100%', gap: 0, speed: 1000, keyboard: false,
        });
        instance.on('error', function(error) { console.error(`Erreur Splide imbriqué ${slideDebugLabel}:`, error); });
        try {
            instance.mount();
            allNestedSplideInstances.set(nestedSplideElement, instance);
            nestedSplideElement.splide = instance; // Attacher l'instance à l'élément DOM
            return instance;
        } catch (mountError) { console.error(`Échec montage Splide imbriqué ${slideDebugLabel}:`, mountError); return null; }
    };

    const refreshNestedSplideInSlide = (slideElement) => {
        if (!slideElement) return;
        const nestedSplideDOMElement = slideElement.querySelector('.nested-splide');
        if (!nestedSplideDOMElement) return;
        // Essayer de récupérer l'instance depuis la Map ou la propriété de l'élément
        const nestedInstance = allNestedSplideInstances.get(nestedSplideDOMElement) || nestedSplideDOMElement.splide;
        if (nestedInstance && nestedInstance.state && nestedInstance.state.isMounted && typeof nestedInstance.refresh === 'function') {
            requestAnimationFrame(() => requestAnimationFrame(() => nestedInstance.refresh()));
        }
    };

    // Fonction pour obtenir les options de Splide basées sur l'orientation
    function getSplideOptionsBasedOnOrientation() {
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        let perPageValue, gapValue, startValue, focusValue;

        if (isPortrait) {
            perPageValue = 1;
            gapValue = '50px'; // Ou une autre valeur adaptée au mode portrait
            startValue = 0;    // Plus logique pour 1 slide
            focusValue = 0;    // 'center' n'a pas beaucoup de sens pour 1 slide
        } else { // Landscape
            perPageValue = 3;
            gapValue = '100px'; // Votre valeur par défaut pour paysage
            startValue = 1;     // Votre valeur par défaut pour paysage
            focusValue = 'center';
        }
        lastOrientationPortrait = isPortrait; // Mettre à jour le tracker

        return {
            updateOnMove: true, // Si vos splides imbriqués en dépendent
            perPage: perPageValue,
            focus: focusValue,
            type: 'loop', // Attention: 'loop' peut parfois être délicat avec des changements dynamiques de perPage. Testez bien.
            start: startValue,
            gap: gapValue,
            speed: 1000,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            pagination: false,
            arrows: true,
            keyboard: 'global',
            // Les breakpoints ne sont plus utilisés pour perPage/gap ici, car gérés par l'orientation.
            // Vous pouvez toujours les utiliser pour d'autres options si nécessaire à des largeurs spécifiques.
        };
    }

    // Fonction pour configurer (ou reconfigurer) le Splide principal
    function setupMainSplide(element) {
        if (mainSplideInstance && typeof mainSplideInstance.destroy === 'function') {
            mainSplideInstance.destroy(true); // true pour supprimer les éléments HTML de Splide
        }

        const options = getSplideOptionsBasedOnOrientation();
        mainSplideInstance = new Splide(element, options);

        // Recréer les écouteurs d'événements pour les splides imbriqués
        mainSplideInstance.on('ready', function () {
            // console.log('Main Splide Ready. Options:', mainSplideInstance.options);
            mainSplideInstance.Components.Slides.forEach(slideComponent => {
                const nestedSplideElement = slideComponent.slide.querySelector('.nested-splide');
                if (nestedSplideElement) {
                    initOrGetInstance(nestedSplideElement, `Slide principal #${slideComponent.index}`);
                }
            });
            // Rafraîchir le splide imbriqué de la slide initialement active
            const initialSlideComponent = mainSplideInstance.Components.Slides.getAt(mainSplideInstance.index);
            if (initialSlideComponent) {
                refreshNestedSplideInSlide(initialSlideComponent.slide);
            }
        });

        mainSplideInstance.on('active', sc => {
            refreshNestedSplideInSlide(sc.slide);
        });
        
        // Il n'est généralement pas nécessaire de rafraîchir les slides inactives,
        // mais si votre logique le demande, vous pouvez le garder.
        mainSplideInstance.on('inactive', sc => {
             refreshNestedSplideInSlide(sc.slide);
        });

        mainSplideInstance.on('error', function(error) {
            console.error('Erreur Splide principal:', error);
        });
        
        mainSplideInstance.mount();
    }

    // Fonction Debounce pour limiter la fréquence d'exécution
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function initializeMainSplideForMaterial() {
        const mainSplideElement = document.querySelector('#materiel .main-carousel');
        if (!mainSplideElement) {
            // console.warn('Élément Splide Matériel (#materiel .main-carousel) non trouvé.');
            return;
        }
        // console.log('Initialisation Splide Matériel.');

        // Configuration initiale
        setupMainSplide(mainSplideElement);

        // Écouteur pour les changements de taille/orientation
        window.addEventListener('resize', debounce(() => {
            const isCurrentlyPortrait = window.matchMedia("(orientation: portrait)").matches;
            // Reconfigurer Splide seulement si l'orientation a effectivement changé
            if (isCurrentlyPortrait !== lastOrientationPortrait) {
                // console.log('Orientation changed, re-setting up Splide.');
                // Sauvegarder l'index courant pour essayer d'y retourner
                const currentIndex = mainSplideInstance ? mainSplideInstance.index : 0;
                setupMainSplide(mainSplideElement);
                if (mainSplideInstance) {
                    mainSplideInstance.go(currentIndex); // Tenter de revenir à la slide
                }
            }
        }, 250)); // Délai de 250ms pour le debounce
    }

    if (document.getElementById('materiel')) {
        initializeMainSplideForMaterial();
    }
} catch (e) {
    console.error("Erreur lors de l'initialisation de Splide Matériel:", e);
}
    // --- MODULE: LIENS SERVICES PRO VERS PORTFOLIO ---
    try {
        const serviceLinks = document.querySelectorAll('#services-pro a[data-slide-index]');
        const portfolioSectionForLink = document.getElementById('portfolio'); 
        serviceLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                const slideIndex = parseInt(this.getAttribute('data-slide-index'), 10);
                if (firstSwiper && typeof firstSwiper.slideToLoop === 'function') {
                    // event.preventDefault(); 
                    if (portfolioSectionForLink) portfolioSectionForLink.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => firstSwiper.slideToLoop(slideIndex, 800), portfolioSectionForLink ? 700 : 50); // Délai plus court si pas de scroll
                }
            });
        });
    } catch (e) {
        console.error("Erreur dans la logique des liens Services Pro vers Portfolio:", e);
    }

    // --- MODULE: LIEN MENU PORTFOLIO VERS PREMIER SLIDE ---
    try {
        const portfolioNavLinkFromMenu = document.querySelector('.nav-portfolio a[href="#portfolio"]');
        if (portfolioNavLinkFromMenu && firstSwiper) { // Vérifie firstSwiper ici aussi
            portfolioNavLinkFromMenu.addEventListener('click', function() {
                if (firstSwiper && typeof firstSwiper.slideToLoop === 'function') {
                    setTimeout(() => firstSwiper.slideToLoop(0, 800), 100);
                }
            });
        }
    } catch (e) {
        console.error("Erreur dans la logique du lien menu Portfolio:", e);
    }

    // --- MODULE: LOGIQUE --header-height ---
    try {
        const pageHeaderForHeight = document.getElementById("header");
        const root = document.documentElement;
        if (pageHeaderForHeight) {
            const setHeaderHeightVariable = () => {
                const height = pageHeaderForHeight.offsetHeight + "px";
                root.style.setProperty("--header-height", height);
            };
            setHeaderHeightVariable();
            window.addEventListener("resize", setHeaderHeightVariable);
        } else {
            // console.warn('Élément header non trouvé pour setHeaderHeightVariable.');
        }
    } catch (e) {
        console.error("Erreur dans la logique --header-height:", e);
    }

}); // Fin du document.addEventListener('DOMContentLoaded') principal

// --- MODULE: RAFRAÎCHISSEMENT GLOBAL AU CHARGEMENT DE LA FENÊTRE ---
window.addEventListener('load', function() {
    try {
        // console.log('[Window Load Event] Page et toutes les ressources chargées.');
        window.dispatchEvent(new Event('resize'));
        setTimeout(function() {
            // console.log('[Window Load Event - Délai] Tentative de rafraîchissement global.');
            if (mainSplideInstance && mainSplideInstance.state && mainSplideInstance.state.isMounted) {
                mainSplideInstance.refresh();
                // console.log('[Window Load Event - Délai] Splide Principal (Matériel) rafraîchi.');
            }
            allNestedSplideInstances.forEach((instance) => { // Itère sur les valeurs de la Map
                if (instance && instance.state && instance.state.isMounted) instance.refresh();
            });
            if (firstSwiper && typeof firstSwiper.update === 'function') { // Vérifie la méthode update pour Swiper
                firstSwiper.update();
                // console.log('[Window Load Event - Délai] Swiper Portfolio mis à jour.');
            }
            if (servicesProSwiperInstance && typeof servicesProSwiperInstance.update === 'function') { // Vérifie la méthode update
                servicesProSwiperInstance.update();
                // console.log('[Window Load Event - Délai] Swiper Services Pro mis à jour.');
            }
        }, 300);
    } catch (e) {
        console.error("Erreur dans l'écouteur window.load:", e);
    }
});



