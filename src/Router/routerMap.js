import HomePage from '../HomePage/HomePage';
import Article from '../Article/Ariticle';
import Detail from '../Article/Detail/Detail'
import Center from '../Center/Center';
import Login from '../Login/Login';
import Register from '../Register/Register'
import Forgot from '../Forgot/Forgot'

export default [
    { path: '/', component: HomePage, exact: true, login: false, none: '/login', needLogin: true },
    { path: '/article', component: Article, exact: true, login: false, none: '/login', needLogin: true },
    { path: '/article/:id', component: Detail, exact: true, login: false, none: '/login', needLogin: true },
    { path: '/login', component: Login, exact: true, login: true, none: '/center', needLogin: false },
    { path: '/register', component: Register, exact: true, login: true, none: '/center', needLogin: false },
    { path: '/forgot', component: Forgot, exact: true, login: true, none: '/center', needLogin: false },
    { path: '/center', component: Center, exact: true, login: true, none: '/login', needLogin: true }
]