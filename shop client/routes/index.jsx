import {createBrowserRouter} from 'react-router-dom'
import Layout from '../pages/layout'
import Signup from '../pages/signup'
import Home from '../pages/home'
import axios from 'axios'
import Login from '../pages/login'
import Product from '../pages/products/id'
import SearchPage from '../pages/searchPage/searched'
import Cart from '../pages/cart'

const options = await axios.get('http://localhost:4000/options')
                .then(res => res.data)
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });

const items = await axios.get('http://localhost:4000/products')
                .then(res => res.data)
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                });



export const router = createBrowserRouter([
    {
        path:"/",
        element:<Layout items={items}/>,
        children:[
            {
                path:"/",
                element:<Home items={items}/>,
            },
            {
                path:"/products/:id",
                element:<Product items={items} options={options}/>
            },
            {
                path:"/search/:searchInput",
                element:<SearchPage items={items}/>
            },
            {
                path:"/cart",
                element:<Cart items={items}/>
            }
        ],
    },
    {
        path:'/signup',
        element:<Signup/>
    },
    {
        path:'/login',
        element:<Login/>
    }
    
])