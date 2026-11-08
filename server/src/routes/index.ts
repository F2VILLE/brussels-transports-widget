import type {Router, Express} from "express"
import { getLines } from "./getLines";

const routes: Route[] = [
    getLines
]

export default function applyRoutes(app: Express)
{
    for (const route of routes)
    {
        app.use(route.path, route.router)
        console.log(`[Router] Loaded route '${route.path}'`)
    }
}

export type Route = {
    path: string;
    router: Router
}