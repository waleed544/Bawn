  // Initialize Swiper Clients Carousel
        let isCarouselPaused = false;
        let clientsSwiper;
        const clientsNavigation = document.getElementById('clientsNavigation');
        
        function initializeSwiper() {
            return new Swiper(".clientsSwiper", {
                slidesPerView: 4,         // رقم ثابت
                spaceBetween: 60,
                loop: true,
                speed: 2000,              // أسرع!
                freeMode: true,           // مهم للـ continuous scroll
                freeModeMomentum: false,  // سرعة ثابتة
                allowTouchMove: true,     // تفعيل اللمس/السحب دائماً
                grabCursor: true,         // مؤشر اليد
                centeredSlides: false,    // بدون centered
                slideToClickedSlide: false, // نتحكم يدوياً
                simulateTouch: true,      // تفعيل touch
                // 👇 المفتاح: إيقاف edge resistance تماماً
                resistance: false,
                resistanceRatio: 0,
                edgeSwipeDetection: false,
                autoplay: {
                    delay: 1,             // NOT 0 (صفر يكسرها)
                    disableOnInteraction: false,
                },
                // Enable keyboard controls
                keyboard: {
                    enabled: true,
                    onlyInViewport: true,
                },
                // Enable navigation
                navigation: {
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                },
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 30,
                        speed: 1500
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 40,
                        speed: 1700
                    },
                    968: {
                        slidesPerView: 3,
                        spaceBetween: 50,
                        speed: 1800
                    },
                    1200: {
                        slidesPerView: 4,
                        spaceBetween: 60,
                        speed: 2000
                    }
                }
            });
        }

        // Initialize the swiper
        clientsSwiper = initializeSwiper();
        
        // تأكد من بدء autoplay
        if (clientsSwiper && clientsSwiper.autoplay) {
            clientsSwiper.autoplay.start();
        }

        // Smart click-to-align logic
        const allSlides = document.querySelectorAll('.clientsSwiper .swiper-slide');
        allSlides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                // إذا ضغط على كارت جزئي، نجيبه كامل
                const swiper = clientsSwiper;
                
                // الـ index الحقيقي
                const clickedIndex = swiper.clickedIndex !== undefined ? swiper.clickedIndex : index;
                
                // عدد الكاردات الظاهرة
                const slidesPerView = swiper.params.slidesPerView || 4;
                
                // نحسب الـ target index
                let targetIndex = clickedIndex;
                
                // في حالة loop mode
                if (swiper.params.loop) {
                    targetIndex = swiper.realIndex + (clickedIndex - swiper.activeIndex);
                }
                
                // نتأكد إننا دايماً نعرض العدد الصحيح من الكاردات
                const maxIndex = swiper.slides.length - slidesPerView;
                if (targetIndex > maxIndex) targetIndex = maxIndex;
                if (targetIndex < 0) targetIndex = 0;
                
                // ننقل للكارت بسلاسة
                swiper.slideTo(targetIndex, 600);
            });
        });

        function pauseCarousel(showNav = false) {
            clientsSwiper.autoplay.stop();
            if (showNav) clientsNavigation.classList.add("show");
        }

        function resumeCarousel() {
            if (!isCarouselPaused) {
                clientsNavigation.classList.remove("show");
                // السحب يظل شغال دايماً
                clientsSwiper.autoplay.start();
            }
        }

        // Handle hover على السيكشن - يوقف مؤقتاً ويظهر الأسهم
        const swiperContainer = document.querySelector(".clientsSwiper");
        if (swiperContainer) {
            swiperContainer.addEventListener("mouseenter", () => {
                pauseCarousel(true); // إظهار الأسهم عند hover دائماً
            });

            swiperContainer.addEventListener("mouseleave", () => {
                resumeCarousel();
            });
        }

        // Handle click على أي كارت - توقف كامل + أسهم ثابتة
        const clientCards = document.querySelectorAll('.client-card');
        clientCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // وقف كامل
                isCarouselPaused = true;
                pauseCarousel(true);
            });
        });

        // Click على السيكشن نفسه (مش على كارت) - toggle
        swiperContainer.addEventListener("click", (e) => {
            // لو ضغط على الأسهم أو الكاردات، نتجاهل
            if (e.target.closest('.swiper-button-custom') || 
                e.target.closest('.client-card')) return;
            
            // Toggle pause state
            isCarouselPaused = !isCarouselPaused;
            
            if (isCarouselPaused) {
                pauseCarousel(true);
            } else {
                resumeCarousel();
            }
        });

        // Navigation is now handled by Swiper's built-in navigation
        // But we keep these for the click animation/feedback
        function setupNavigationButtons() {
            const prevBtn = document.querySelector('.swiper-button-prev-custom');
            const nextBtn = document.querySelector('.swiper-button-next-custom');
            
            // Swiper's navigation system handles the actual sliding
            // These just ensure proper event handling
            if (prevBtn) {
                prevBtn.onclick = (e) => {
                    e.stopPropagation();
                    // Swiper navigation handles this automatically
                };
            }
            
            if (nextBtn) {
                nextBtn.onclick = (e) => {
                    e.stopPropagation();
                    // Swiper navigation handles this automatically
                };
            }
        }

        setupNavigationButtons();

        // Update carousel direction when language changes
        const originalLangToggleHandler = langToggle.onclick;
        langToggle.onclick = function(e) {
            if (originalLangToggleHandler) {
                originalLangToggleHandler.call(this, e);
            }
            
            // Wait for DOM update
            setTimeout(() => {
                const newDir = document.documentElement.dir;
                const wasPaused = isCarouselPaused;
                
                // Destroy and reinitialize swiper with new direction
                if (clientsSwiper) {
                    clientsSwiper.destroy(true, true);
                }
                
                // Reinitialize
                clientsSwiper = initializeSwiper();
                
                // Restore pause state
                if (wasPaused) {
                    clientsSwiper.autoplay.stop();
                    clientsNavigation.classList.add('show');
                }
                
                // Update direction
                if (clientsSwiper.changeLanguageDirection) {
                    clientsSwiper.changeLanguageDirection(newDir);
                }
                
                // Re-setup navigation buttons
                setupNavigationButtons();
            }, 100);
        };

        // تعطيل overscroll بالكامل programmatically
        document.addEventListener('DOMContentLoaded', function() {
            // تعطيل overscroll على document
            document.body.style.overscrollBehavior = 'none';
            document.documentElement.style.overscrollBehavior = 'none';
            
            // تعطيل overscroll على Swiper
            const swiperEl = document.querySelector('.clientsSwiper');
            if (swiperEl) {
                swiperEl.style.overscrollBehavior = 'none';
                swiperEl.style.overscrollBehaviorX = 'none';
                swiperEl.style.overscrollBehaviorY = 'none';
                swiperEl.style.touchAction = 'pan-y pan-x';
            }
            
            const wrapperEl = document.querySelector('.swiper-wrapper');
            if (wrapperEl) {
                wrapperEl.style.overscrollBehavior = 'none';
                wrapperEl.style.overscrollBehaviorX = 'none';
                wrapperEl.style.touchAction = 'pan-y pan-x';
            }

            // منع browser rubber-band على السيكشن (bulletproof)
            const carousel = document.querySelector('.clients-carousel-wrapper');
            if (carousel) {
                carousel.addEventListener('touchmove', function(e) {
                    // يمنع الـ white stretch تماماً
                    // e.preventDefault();
                }, { passive: false });
            }

            // Alternative: prevent only edge bounces
            let startX = 0;
            if (carousel) {
                carousel.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                }, { passive: true });

                carousel.addEventListener('touchmove', (e) => {
                    const currentX = e.touches[0].clientX;
                    const diff = currentX - startX;
                    
                    // منع overscroll على الحواف فقط
                    if (clientsSwiper) {
                        const atStart = clientsSwiper.isBeginning;
                        const atEnd = clientsSwiper.isEnd;
                        
                        if ((atStart && diff > 0) || (atEnd && diff < 0)) {
                            e.preventDefault();
                        }
                    }
                }, { passive: false });
            }
        });