import HomePage from '../HomePage/HomePage';
import Article from '../Article/Ariticle';
import Detail from '../Article/Detail/Detail'
import Center from '../Center/Center';
import Login from '../Login/Login';
import Register from '../Register/Register'
import Forgot from '../Forgot/Forgot'
import Message from '../Message/Message'
import UserInfo from '../UserInfo/UserInfo'

// path:路径 component:组件 exact:精准路由 login:页面是否受登录控制 none:不满足跳转到位置 needLogin:页面浏览是否需要登录
export default [
    { path: '/', component: HomePage, exact: true, login: false, none: '/login', needLogin: true },
    { path: '/article', component: Article, exact: true, login: false, none: '/login', needLogin: true },
    { path: '/article/:id', component: Detail, exact: true, login: false, none: '/login', needLogin: true },
    { path: '/login', component: Login, exact: true, login: true, none: '/center', needLogin: false },
    { path: '/register', component: Register, exact: true, login: true, none: '/center', needLogin: false },
    { path: '/forgot', component: Forgot, exact: true, login: false, none: '/center', needLogin: false },
    { path: '/center', component: Center, exact: true, login: true, none: '/login', needLogin: true },
    { path: '/message', component: Message, exact: true, login: false, none: '/login', needLogin: true },
    { path: '/info/:id', component: UserInfo, exact: true, login: false, none: '/login', needLogin: true }
]