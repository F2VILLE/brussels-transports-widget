# Brussels Transports Widget (btw)

Small application that lets you add a Widget to your homescreen or a Tile on your watch.
The widget uses your current location to see waiting times of transports around you.


## Features

### API

```http
GET /lines?lat=NUMBER&long=NUMBER&<distance=NUMBER>
```

| Name | Type | Description|
|------|------|------------|
|`lat` | `number` | Latitude|
|`lon` | `number` | Longitude|
|`distance?` | `number` | Distance treshold (*in meters*)|

Returns the stops around you, according to distance (default = 100)
```ts
{
    lat: number,
    lon: number,
    distance: number;
    stops: [
        {
            gpscoordinates: {
                latitude: number,
                longitude: number
            },
            id: string,
            name: { // STOP_NAME
                fr: string,
                nl: string
            }
        }
    ],
    lines: {
        STOP_NAME_FR: [
            {
                line: string, // Line number
                destination: { // terminus
                    fr: string,
                    nl: string
                },
                arrival: string, // Date iso string eg: `2026-11-08T18:54:20.467+01:00`
                minutes: number
            },
        ]
    }
}
```
