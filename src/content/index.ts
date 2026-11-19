import { cardFlip } from './effects/card-flip';
import { spotlightCard } from './effects/spotlight-card';
import { magneticButton } from './effects/magnetic-button';
import { rippleButton } from './effects/ripple-button';
import { slidingFillButton } from './effects/sliding-fill-button';
import { gradientTextShimmer } from './effects/gradient-text-shimmer';
import { staggeredTextReveal } from './effects/staggered-text-reveal';
import { cardTilt3d } from './effects/card-tilt-3d';
import { typewriter } from './effects/typewriter';
import { glassmorphism } from './effects/glassmorphism';
export const effects = [cardTilt3d, typewriter, glassmorphism, cardFlip, spotlightCard, magneticButton, rippleButton, slidingFillButton, gradientTextShimmer, staggeredTextReveal];
// Only real future references from SPEC §7. Remove this allowance at Stage 4.
export const plannedRelatedSlugs = ['spotlight-card', 'card-flip', 'staggered-text-reveal', 'gradient-text-shimmer', 'aurora-gradient', 'modal-scale-fade'];
export const publishedEffects = effects.filter(effect => effect.status === 'published');
