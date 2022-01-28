import { getAuth, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import router from '../../../router.js';
// import { useRouter } from 'vue-router';


let timer;

export default {
    state() {
        return {
            user: null,
            token: null,
            didAutoLogout: false,
            role: null,
            portfolio: null
        };
    },
    getters: {
        user(state)
        {
            return state.user; 
        },
        token(state)
        {
            return state.token;
        },
        isAuthenticated(state) {
            return !!state.token;
        },
        getProfileImage(state) {
            return state.user.photoURL;
        },
        getName(state) {
            return state.user.displayName;
        },
        getEmail(state) {
            return state.user.email;
        },
        getPhone(state) {
            return state.user.phoneNumber;
        },
        getRole(state) {
            return state.role;
        },
        getPortfolio(state) {
            return state.portfolio;
        }
    },
    actions: {
        login(context, payload) {
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            signInWithPopup(auth, provider)
            .then(async (result) => {
                // // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // // The signed-in user info.
                // const user = result.user;
                // // ...

                const expiresIn = +result._tokenResponse.expiresIn * 1000;
        
                const expirationDate = new Date().getTime() + expiresIn;

                let user = JSON.stringify(result.user);
                localStorage.setItem('token', token);
                localStorage.setItem('user', user);
                localStorage.setItem('tokenExpiration', expirationDate);

                timer = setTimeout(() => {
                    context.dispatch('autoLogout');
                }, expiresIn);

                const userRequest = {
                    ...result.user
                }

                const response = await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/users/${result.user.uid}.json`);

                const responseData = await response.json();

                let role;

                if (responseData && responseData.role) {
                    role = responseData.role;
                }
                // if (role) {
                //     localStorage.setItem('role', role);
                //     context.dispatch('setRole', {role: role});
                // }
                if (!role && payload && payload.redirectTo) {
                    role = 'customer';  
                }


                if (!responseData) {
                    await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/users/${result.user.uid}.json`, {
                        method: 'PATCH',
                        body: JSON.stringify(userRequest)
                    });
                }



                if (responseData && responseData.portfolio) {
                    if (responseData.portfolio.description) {
                        context.commit('updatePortfolio', {portfolio: responseData.portfolio});
                    }
                }

                context.commit('setUser', {
                    token: token,
                    user: result.user,
                });
            
                if (payload && payload.redirectTo && role !== 'architect') {
                    router.push(payload.redirectTo);
                } else {
                    if (role) {
                        localStorage.setItem('role', role);
                        context.dispatch('setRole', {role: role});
                    } else {
                        router.push('/role');
                    }
                }
            }).catch((error) => {
                console.log("error: ", error);
            });
        },
        logout(context) {
            const provider = new GoogleAuthProvider();

            const auth = getAuth();
            signOut(auth, provider)
            .then(() => {
                context.commit('setUser', {
                    token: null,
                    user: null,
                });
                const requests = [];
                context.commit('setRequests', requests);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('tokenExpiration');
                localStorage.removeItem('role');
                clearTimeout(timer);
            }).catch((error) => {
                console.log("error: ", error);
            });
        },
        async tryLogin(context) {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            const tokenExpiration = localStorage.getItem('tokenExpiration');
            const role = localStorage.getItem('role');
    
            const expiresIn = tokenExpiration - new Date().getTime();
            if(expiresIn<10000)
            {
                return;
            }
            
            timer = setTimeout(() => {
                context.dispatch('autoLogout');
            }, expiresIn);
    
            if(token && user)
            {
                context.commit('setUser', {
                    token: token,
                    user: user,
                });
            }

            const response = await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/users/${user.uid}.json`);

            const responseData = await response.json();
            
            if (responseData) {
                context.commit('updateProfile', {
                    displayName: responseData.displayName,
                    email: responseData.email,
                    phoneNumber: responseData.phoneNumber
                })
            }

            if (responseData && responseData.portfolio) {
                if (responseData.portfolio.description || responseData.portfolio.image) {
                    context.commit('updatePortfolio', {portfolio: responseData.portfolio});
                }
            }

            // if (role && !responseData.role) {
            //     let userRequest = {
            //         role: role
            //     }
            //     await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/users/${user.uid}.json`, {
            //         method: 'PATCH',
            //         body: JSON.stringify(userRequest)
            //     })
            // }

            // const Router = useRouter();

            if (role) {
                context.commit('setRole', {role: role});
                // router.push('/profile');
            } else {
                // router.push('/role');
            }
        },
        autoLogout(context) {
            context.dispatch('logout');
            context.commit('setAutoLogout');
        },
        async setRole(context, payload) {
            localStorage.setItem('role', payload.role);
            context.commit('setRole', payload);

            let userRequest = {
                role: payload.role
            }
            await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/users/${context.getters.user.uid}.json`, {
                method: 'PATCH',
                body: JSON.stringify(userRequest)
            })
        },
        async updatePortfolio(context, payload) {
            let userRequest = {
                ...payload
            }

            await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/users/${context.getters.user.uid}.json`, {
                method: 'PATCH',
                body: JSON.stringify(userRequest)
            })
            context.commit('updatePortfolio', userRequest);
        },
        async updateProfile(context, payload) {
            let userRequest = {
                ...payload.request
            }

            await fetch(`https://home-floor-plan-hackathon-default-rtdb.asia-southeast1.firebasedatabase.app/users/${context.getters.user.uid}.json`, {
                method: 'PATCH',
                body: JSON.stringify(userRequest)
            })
            context.commit('updateProfile', userRequest);
        }
    },
    mutations: {
        setRole(state, payload) {
            state.role = payload.role;
        },
        setUser(state, payload) {
            state.token = payload.token;
            state.user = payload.user;
            state.didAutoLogout = false;
        },
        setAutoLogout(state) {
            state.didAutoLogout = true;
        },
        updatePortfolio(state, payload) {
            state.portfolio = payload.portfolio;
        }, 
        updateProfile(state, payload) {
            state.user.displayName = payload.displayName;
            state.user.email = payload.email;
            state.user.phoneNumber = payload.phoneNumber;
        }
    }
}