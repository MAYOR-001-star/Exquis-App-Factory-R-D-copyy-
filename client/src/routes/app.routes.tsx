import { createHashRouter, Navigate } from "react-router-dom";

export const applicationRoute = createHashRouter([
	{
		path: "/",
		lazy: () => import('../pages/HomePage').then(c => ({ Component: c.default }))
	},
	{
		path: 'page-not-found',
		lazy: () => import('../pages/NotFoundPage').then(c => ({ Component: c.default })),
	},
	{
		path: '*',
		element: <Navigate to="page-not-found" replace />,
	}
]);