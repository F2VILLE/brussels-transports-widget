import { existsSync, readFileSync, writeFileSync } from "node:fs";

type STIB_MIVB_Stop = {
    gpscoordinates: {
        latitude: number;
        longitude: number;
    };
    id: string;
    name: {
        fr: string;
        nl: string;
    };
}

type STIB_MIVB_Passing = {
    lineId: string;
    destination: { fr: string; nl: string } | null;
    expectedArrivalTime: string; // ISO date
    message?: { fr: string; nl: string };
};

type STIB_MIVB_WaitingTime = {
    pointid: string;
    lineid: string;
    passingtimes: STIB_MIVB_Passing[];
};


const API_BASE_URL = `https://api-management-discovery-production.azure-api.net/api/datasets/stibmivb`

const API_PATH = {
    stops: "/static/StopDetails",
    waitingTimes: "/rt/WaitingTimes",
}

function proximityFilter(n1: number, n2: number, treshold = 0.001) {
    // console.log(`[Proximity] checking [${n1}] and [${n2}] => ${n1 - n2}`)
    return Math.abs(n1 - n2) <= treshold
}

const METERS_PER_DEGREE_LAT = 111_320;

function distanceToLatLonThreshold(distance: number, latitude: number) {
    const latThreshold = distance / METERS_PER_DEGREE_LAT;
    const lonThreshold = distance / (METERS_PER_DEGREE_LAT * Math.cos(latitude * Math.PI / 180));
    return { latThreshold, lonThreshold };
}

const parse = <T>(v: unknown): T => (typeof v === "string" ? JSON.parse(v) : v) as T;

class STIB_MIVB {
    public stops: STIB_MIVB_Stop[] = [];
    private stopsLastFetched = 0;

    private waiting: STIB_MIVB_WaitingTime[] = [];
    private waitingLastFetched = 0;

    constructor(private options: { api_key: string, dev?: boolean }) {
        if (this.options.dev)
            console.log("[STIB-MIVB] Running in development mode.")
    }

    private async fetchAll(url: string): Promise<any[]> {
        const rows: any[] = [];
        for (let offset = 0; ;) {
            const u = new URL(url);
            u.searchParams.set("limit", "1000");
            u.searchParams.set("offset", String(offset));
            const res = await fetch(u, { headers: { "bmc-partner-key": this.options.api_key } });
            if (!res.ok) throw new Error(`[STIB-MIVB] ${res.status} ${await res.text()}`);
            const body = (await res.json()) as { results: any[]; total_count: number };
            rows.push(...body.results);
            offset += body.results.length;
            if (!body.results.length || offset >= body.total_count) return rows;
        }
    }

    async fetchStops(): Promise<STIB_MIVB_Stop[]> {
        let raw: any[] | undefined;
        if (this.options.dev) {
            if (!existsSync("./stops.json")) {
                const res = await this.fetchAll(API_BASE_URL + API_PATH.stops)
                writeFileSync("./stops.json", JSON.stringify(res))
                raw = res
            }
            else
                raw = JSON.parse(readFileSync("./stops.json", "utf-8"))
        }
        else if (this.stops.length && Date.now() - this.stopsLastFetched < 60 * 60 * 1000)
            return this.stops
        else {
            raw = await this.fetchAll(API_BASE_URL + API_PATH.stops)
        }
        const stops: STIB_MIVB_Stop[] = raw?.map(x => {
            const stop: STIB_MIVB_Stop = {
                gpscoordinates: JSON.parse(x.gpscoordinates),
                id: x.id,
                name: JSON.parse(x.name)
            }
            return stop
        }) as unknown as STIB_MIVB_Stop[]
        return stops
    }

    async getStopsCloseTo(loc: { lat: number, lon: number, distance?: number | undefined }): Promise<STIB_MIVB_Stop[]> {
        const { latThreshold, lonThreshold } = distanceToLatLonThreshold(loc.distance || parseInt(process.env.DEFAULT_DISTANCE_TRESHOLD || "0") || 100, loc.lat)
        const stops = await this.fetchStops()
        return (stops.filter(x => (
            proximityFilter(x.gpscoordinates.latitude, loc.lat, latThreshold)
            &&
            proximityFilter(x.gpscoordinates.longitude, loc.lon, lonThreshold)
        )))
    }

    async fetchWaitingTimes(): Promise<STIB_MIVB_WaitingTime[]> {
        if (Date.now() - this.waitingLastFetched < 20_000) return this.waiting;
        this.fetchAll(API_BASE_URL + API_PATH.waitingTimes)
            .then(rows => {
                this.waiting = rows.map(r => ({
                    pointid: String(r.pointid),
                    lineid: String(r.lineid),
                    passingtimes: parse<STIB_MIVB_Passing[]>(r.passingtimes) ?? [],
                }));
                this.waitingLastFetched = Date.now();
            })
        return this.waiting;
    }

    async getLinesFromStop(stop: STIB_MIVB_Stop) {
        const all = await this.fetchWaitingTimes();
        return all
            .filter(w => (
                w.pointid === String(stop.id)
            ))
            .flatMap(w => w.passingtimes.map(p => ({
                line: w.lineid,
                destination: p.destination,
                arrival: p.expectedArrivalTime,
                minutes: Math.max(0, Math.round((Date.parse(p.expectedArrivalTime) - Date.now()) / 60_000)),
            })))
            .filter(x => x.destination)
            .sort((a, b) => a.minutes - b.minutes);
    }
}

export { STIB_MIVB, type STIB_MIVB_Stop }