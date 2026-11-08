import { Router } from "express";
import type { Route } from ".";
import { z } from "zod"
import { STIB_MIVB } from "../lib/STIB-MIVB";

const router = Router()

const stib = new STIB_MIVB({
    api_key: process.env.BMC_API_KEY || "",
    dev: !!process.env.DEV || false
})

const Query = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lon: z.coerce.number().min(-180).max(180),
})

type Arrival = Awaited<ReturnType<STIB_MIVB["getLinesFromStop"]>>[number];

router.get("/", async (req, res) => {
    const parsed = Query.safeParse(req.query)
    if (!parsed.success)
        return res.status(400).json({ error: z.flattenError(parsed.error).fieldErrors });
    const { lat, lon } = parsed.data
    try {
        const stops = await stib.getStopsCloseTo({
            lat, lon
        })
        console.log(stops)
        const lines: Record<string, Arrival[]> = {};
        for (const stop of stops) {
            const l = await stib.getLinesFromStop(stop);
            (lines[stop.name.fr] ??= []).push(...l);
        } return res.json({
            stops,
            lines
        })
    } catch (error) {
        console.error(error)
        return res.json({ error })
    }

})

export const getLines: Route = {
    path: "/lines",
    router
}