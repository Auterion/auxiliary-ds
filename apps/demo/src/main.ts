import { createApp } from 'vue';
import Shell from './Shell.vue';
import '@auxiliary/css/theme.css';
import './suite/_instrument.css';
import './_deck07b.css';
// Candidates B and C for the AD-D-013 direction review, plus the accent axis.
// All three are scoped to [data-direction] / [data-accent], so they are inert
// on every other surface.
import './direction/_anno1965.css';
import './direction/_sera.css';
import './direction/_accents.css';

createApp(Shell).mount('#app');
