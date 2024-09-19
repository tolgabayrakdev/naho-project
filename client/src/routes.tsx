import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";


const HomePage = lazy(() => import('./pages/home'))

const NotFoundPage = lazy(() => import('./pages/not-found'))

const SignInPage = lazy(() => import('./pages/auth/sign-in'))
const SignUpPage = lazy(() => import('./pages/auth/sign-up'))

const routes = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "*",
        element: <NotFoundPage />
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