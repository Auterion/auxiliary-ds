import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import { h } from 'vue';
import * as Aux from '@auxiliary/vue';
import { Sparkline, Gauge, TimeSeries } from '@auxiliary/viz';
import { Icon } from '@auxiliary/icons';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import TokenRow from './components/TokenRow.vue';
import PropsTable from './components/PropsTable.vue';

import '@auxiliary/css/theme.css';
import './style.css';

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(ThemeSwitcher),
    }),
  enhanceApp({ app }) {
    // Register every primitive from @auxiliary/vue so .md pages can use
    //   <Button>, <Input>, <StatusBadge>, <AlertBanner>, etc. inline.
    for (const [name, component] of Object.entries(Aux)) {
      if (typeof component === 'object' || typeof component === 'function') {
        app.component(name, component as never);
      }
    }
    app.component('Icon', Icon);
    app.component('TokenRow', TokenRow);
    app.component('PropsTable', PropsTable);
    // Data-viz charts (@auxiliary/viz). TimeSeries inits uPlot on the client only;
    // its SSR render is the bare container, so global registration is SSR-safe.
    app.component('Sparkline', Sparkline);
    app.component('Gauge', Gauge);
    app.component('TimeSeries', TimeSeries);
  },
};

export default theme;
