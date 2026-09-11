import {loadFont as loadFraunces, fontFamily as frauncesFamily} from '@remotion/google-fonts/Fraunces';
import {
  loadFont as loadBricolage,
  fontFamily as bricolageFamily,
} from '@remotion/google-fonts/BricolageGrotesque';
import {loadFont as loadMono, fontFamily as monoFamily} from '@remotion/google-fonts/IBMPlexMono';

loadFraunces('italic', {
  weights: ['500', '600'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

loadBricolage('normal', {
  weights: ['400', '600', '800'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

loadMono('normal', {
  weights: ['400'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export const fontDisplay = frauncesFamily;
export const fontSans = bricolageFamily;
export const fontMono = monoFamily;
