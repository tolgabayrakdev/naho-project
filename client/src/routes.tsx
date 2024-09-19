import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";


const HomePage = lazy(() => import('./pages/home'))

const SignInPage = lazy(() => import('./pages/auth/sign-in'))
const SignUpPage = lazy(() => import('./pages/auth/sign-up'))

const routes = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/sign-in",
        element: <SignInPage />
    },
    {
        path: "/sign-up",
        element: <SignUpPage />
    }
])

export default routes;