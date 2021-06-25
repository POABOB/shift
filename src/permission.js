import router from './router'

router.beforeEach(async(to, from, next) => {
    // determine whether the user has logged in
    let token = window.localStorage.getItem('token');

    if (token) {
        next();
    } else {
        /* has no token*/
        window.localStorage.setItem('token','');
        if(to.path === '/login') {
            console.log(1);
            next();
        } else {
            console.log(2);
            next(`/login`);
        }
    }
})
