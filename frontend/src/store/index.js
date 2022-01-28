import {createStore} from 'vuex';
import AuthModule from './modules/auth/index.js';
import RequestModule from './modules/request/index.js';
import ArchitectModule from './modules/architect/index.js';

const store = createStore({
    modules: {
        auth: AuthModule,
        req: RequestModule,
        architect: ArchitectModule
    }
});

export default store;