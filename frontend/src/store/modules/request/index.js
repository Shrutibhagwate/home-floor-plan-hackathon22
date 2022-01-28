// import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import router from '../../../router.js';
// import { useRouter } from 'vue-router';


export default {
    state() {
        return {
            requests: []
        };
    },
    getters: {
        getRequests(state) {
            return state.requests; 
        },
        getRequestsForUser(state) {
            let id = JSON.parse(localStorage.getItem("user")).uid;
            return state.requests.filter(req => req.id === id || req.toId === id);
        },
        getOngoingRequestsForUser(_, getters) {
            return getters.getRequestsForUser.filter(req => req.status === 'Ongoing');
        },
        getPendingRequestsForUser(_, getters) {
            return getters.getRequestsForUser.filter(req => req.status === 'Pending');
        },
        getPastRequestsForUser(_, getters) {
            return getters.getRequestsForUser.filter(req => req.status === 'Completed' || req.status === 'Rejected');
        }
    },
    actions: {
        async getAllRequests(context) {
            const response = await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/requests.json`);
            const responseData = await response.json();
            let id = JSON.parse(localStorage.getItem("user")).uid;
            const requests = [];
            for (const key in responseData) {
                if (responseData[key].id === id) {
                    requests.push(responseData[key])
                }
            }
            context.commit('setRequests', requests);
        },
        async addRequest(context, payload) {
            const request = {
                ...payload.request
            }
            context.commit('addRequest', request);
            await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/requests.json`, {
                method: 'POST',
                body: JSON.stringify(request)
            });
            router.push('/requests');
        },
        async getArchitectRequests(context) {
            const response = await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/requests.json`);
            const responseData = await response.json();
            let id = JSON.parse(localStorage.getItem("user")).uid;
            const requests = [];
            for (const key in responseData) {
                if (responseData[key].toId === id) {
                    responseData[key].reqId = key;
                    requests.push(responseData[key])
                }
            }
            context.commit('setRequests', requests);
        },
        async updateStatus(context, payload) {
            let request = {status: payload.status};
            await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/requests/${payload.id}.json`, {
                method: 'PATCH',
                body: JSON.stringify(request)
            });
            context.commit('updateRequest', payload);
        }
    },
    mutations: {
        addRequest(state, payload) {
            const request = {
                ...payload.request
            }
            state.requests.push(request);
        },
        setRequests(state, payload) {
            state.requests = payload;
        },
        updateRequest(state, payload) {
            state.requests.forEach(req => {
                if (req.reqId === payload.id) {
                    req.status = payload.status;
                }
            })
        }
    }
}