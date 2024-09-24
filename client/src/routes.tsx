import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

const HomePage = lazy(() => import('./pages/home'))

const NotFoundPage = lazy(() => import('./pages/not-found'))

const SignInPage = lazy(() => import('./pages/auth/sign-in'))
const SignUpPage = lazy(() => import('./pages/auth/sign-up'))

const DashboardLayout = lazy(() => import('./layouts/dashboard-layout'))
const DashboardIndexPage = lazy(() => import('./pages/dashboard/index'))
const DashboardProfilePage = lazy(() => import('./pages/dashboard/profile'))
const DashboardFeedbackPage = lazy(() => import('./pages/dashboard/feedback/index'))
const DashboardFeedbackForm = lazy(() => import('./pages/dashboard/feedback/pages'))
const FeedbackForm = lazy(() => import('./pages/forms/FeedbackForm'))  // Yeni import
const PreviewPage = lazy(() => import('./pages/preview/preview-page-ui'))

const DashboardPreviewPage = lazy(() => import('./pages/dashboard/feedback/preview-page'))

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
            { path: "feedbacks", element: <DashboardFeedbackPage /> },
            { path: "feedback/pages", element: <DashboardFeedbackForm /> },
            { path: "feedback/preview-page", element: <DashboardPreviewPage /> },
        ]
    },
    {
        path: "/feedback-form/:token",
        element: <FeedbackForm />,
    },
    {
        path: "/preview-page/:token",
        element: <PreviewPage />,
    }
])

export default routes;