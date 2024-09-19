import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";


const HomePage = lazy(() => import('./pages/home'))

const NotFoundPage = lazy(() => import('./pages/not-found'))

const SignInPage = lazy(() => import('./pages/auth/sign-in'))
const SignUpPage = lazy(() => import('./pages/auth/sign-up'))

const DashboardLayout = lazy(() => import('./layouts/dashboard-layout'))
const DashboardIndexPage = lazy(() => import('./pages/dashboard/index'))
const DashboardProfilePage = lazy(() => import('./pages/dashboard/profile'))

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
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { path: "", element: <DashboardIndexPage /> },
            { path: "profile", element: <DashboardProfilePage /> },
        ]
    }
])

export default routes;