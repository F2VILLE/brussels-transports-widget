import { Router } from "express";
import type { Route } from ".";

const router = Router()

router.get("/", (req, res) => {
    const { lat, long } = req.query
    const missing = Object.entries({ lat, long })
        .filter(([, v]) => v == null || v === "")
        .map(([k]) => k);
    if (missing.length)
        return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
    res.json({ meow: "waf" })
})

export const getLines: Route = {
    path: "/lines",
    router
}