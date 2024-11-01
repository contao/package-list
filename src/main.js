import bootstrap from './bootstrap';
import router from './router';
import store from './store';
import i18n from './i18n';

import App from './components/App';

bootstrap(App, i18n, router, store);
