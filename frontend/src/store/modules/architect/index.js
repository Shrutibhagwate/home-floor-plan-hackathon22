export default {
    state() {
        return {
            architects: []
        };
    },
    getters: {
        getArchitects(state) {
            return state.architects;
        }
    },
    actions: {
        async getAllArchitects(context) {
            const response = await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/users.json`);
            const responseData = await response.json();
            const architects = [];
            for (const key in responseData) {
                if (responseData[key].role === 'architect') {
                    architects.push(responseData[key])
                }
            }
            context.commit('setArchitects', architects);
        }
    },
    mutations: {
        setArchitects(state, payload) {
            state.architects = payload;
        }
    }
}