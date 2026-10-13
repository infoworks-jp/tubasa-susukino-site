// Static facts: no map/API request is made by visitors.
export const landmarks = {
  shop: {
    coordinates: [141.3544949, 43.055336],
    floor: "B1F",
    position: "新ラーメン横丁の一番奥",
    source: "https://www.google.com/maps?cid=7046924476403280401",
  },
  yokocho: {
    coordinates: [141.3542238, 43.0554494],
    source: "https://www.google.com/maps?cid=7756224481032739636",
  },
  // Photograph shows the entrance beside the police box, at the western end
  // of the north frontage. Project onto that OSM facade; this is a facade
  // placement, not a surveyed doorway coordinate or an indoor floor plan.
  entrance: {
    coordinates: [141.3542, 43.05553027],
    placement: "Photo + mapped north frontage; approximate facade placement",
    width: 3.2,
    signHeight: 2.4,
  },
  building: {
    tileFeature: 1167775510,
    polygonIndex: 16,
    manager: "https://www.susukino-greenbuilding.com/tenants_cat/no3-gb-b1f/",
  },
  crossing: { coordinates: [141.35336, 43.05563] },
  evidence: [
    "https://www.susukino-greenbuilding.com/tenants_cat/no3-gb-b1f/",
    "https://r.gnavi.co.jp/pgp85nwp0000/map/",
    "https://map.yahoo.co.jp/v3/place/G-ppfuzDXnY",
    "User street photograph supplied 2026-10-13 and confirmation: shop at end of alley",
  ],
  caveat:
    "Indoor corridor is a schematic. Google and Yahoo POI pins differ; use the Google shop pin independently of the facade entrance.",
};
