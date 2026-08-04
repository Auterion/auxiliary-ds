import { createApp } from 'vue';
import Shell from './Shell.vue';
import '@auxiliary/css/theme.css';
import './suite/_instrument.css';
// Candidate B for the AD-D-013 direction review. Scoped to [data-direction],
// so it is inert on every other surface.
import './direction/_anno1965.css';

createApp(Shell).mount('#app');
