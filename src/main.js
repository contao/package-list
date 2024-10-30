import bootstrap from './bootstrap';
import router from './router';
import store from './store';
import i18n from './i18n';
import './filters';

import App from './components/App';

bootstrap(App, router, store, i18n);
