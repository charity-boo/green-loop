export interface SubRegion {
  value: string;
  label: string;
}

export interface County {
  value: string;
  label: string;
  subRegions: SubRegion[];
}

export const KENYA_COUNTIES: County[] = [
  {
    value: "mombasa",
    label: "Mombasa",
    subRegions: [
      { value: "mombasa-mvita", label: "Mvita" },
      { value: "mombasa-likoni", label: "Likoni" },
      { value: "mombasa-kisauni", label: "Kisauni" },
    ],
  },
  {
    value: "kwale",
    label: "Kwale",
    subRegions: [
      { value: "kwale-msambweni", label: "Msambweni" },
      { value: "kwale-lungalunga", label: "Lungalunga" },
      { value: "kwale-kinango", label: "Kinango" },
    ],
  },
  {
    value: "kilifi",
    label: "Kilifi",
    subRegions: [
      { value: "kilifi-north", label: "Kilifi North" },
      { value: "kilifi-south", label: "Kilifi South" },
      { value: "kilifi-malindi", label: "Malindi" },
    ],
  },
  {
    value: "tana-river",
    label: "Tana River",
    subRegions: [
      { value: "tana-river-garsen", label: "Garsen" },
      { value: "tana-river-galole", label: "Galole" },
      { value: "tana-river-bura", label: "Bura" },
    ],
  },
  {
    value: "lamu",
    label: "Lamu",
    subRegions: [
      { value: "lamu-east", label: "Lamu East" },
      { value: "lamu-west", label: "Lamu West" },
    ],
  },
  {
    value: "taita-taveta",
    label: "Taita-Taveta",
    subRegions: [
      { value: "taita-taveta-taita", label: "Taita" },
      { value: "taita-taveta-taveta", label: "Taveta" },
      { value: "taita-taveta-voi", label: "Voi" },
    ],
  },
  {
    value: "garissa",
    label: "Garissa",
    subRegions: [
      { value: "garissa-township", label: "Garissa Township" },
      { value: "garissa-balambala", label: "Balambala" },
      { value: "garissa-lagdera", label: "Lagdera" },
    ],
  },
  {
    value: "wajir",
    label: "Wajir",
    subRegions: [
      { value: "wajir-east", label: "Wajir East" },
      { value: "wajir-west", label: "Wajir West" },
      { value: "wajir-north", label: "Wajir North" },
    ],
  },
  {
    value: "mandera",
    label: "Mandera",
    subRegions: [
      { value: "mandera-east", label: "Mandera East" },
      { value: "mandera-west", label: "Mandera West" },
      { value: "mandera-north", label: "Mandera North" },
    ],
  },
  {
    value: "marsabit",
    label: "Marsabit",
    subRegions: [
      { value: "marsabit-north-horr", label: "North Horr" },
      { value: "marsabit-saku", label: "Saku" },
      { value: "marsabit-laisamis", label: "Laisamis" },
    ],
  },
  {
    value: "isiolo",
    label: "Isiolo",
    subRegions: [
      { value: "isiolo-north", label: "Isiolo North" },
      { value: "isiolo-south", label: "Isiolo South" },
    ],
  },
  {
    value: "meru",
    label: "Meru",
    subRegions: [
      { value: "meru-imenti-north", label: "Imenti North" },
      { value: "meru-imenti-south", label: "Imenti South" },
      { value: "meru-tigania-east", label: "Tigania East" },
    ],
  },
  {
    value: "tharaka-nithi",
    label: "Tharaka Nithi",
    subRegions: [
      { value: "tharaka-nithi-chuka", label: "Chuka" },
      { value: "tharaka-nithi-ndagani", label: "Ndagani" },
      { value: "tharaka-nithi-marimanti", label: "Marimanti" },
      { value: "tharaka-nithi-kathwana", label: "Kathwana" },
      { value: "tharaka-nithi-magutuni", label: "Magutuni" },
      { value: "tharaka-nithi-gatunga", label: "Gatunga" },
      { value: "tharaka-nithi-kibuka", label: "Kibuka" },
      { value: "tharaka-nithi-karingani", label: "Karingani" },
      { value: "tharaka-nithi-mukothima", label: "Mukothima" },
      { value: "tharaka-nithi-igambangombe", label: "Igambang'ombe" },
      { value: "tharaka-nithi-kianjokomai", label: "Kianjokomai" },
      { value: "tharaka-nithi-nkuene", label: "Nkuene" },
      { value: "tharaka-nithi-muongoni", label: "Muongoni" },
      { value: "tharaka-nithi-slaughter", label: "Slaughter" },
      { value: "tharaka-nithi-tuamaini", label: "Tuamaini" },
      { value: "tharaka-nithi-lowlands", label: "Lowlands" },
    ],
  },
  {
    value: "embu",
    label: "Embu",
    subRegions: [
      { value: "embu-manyatta", label: "Manyatta" },
      { value: "embu-runyenjes", label: "Runyenjes" },
      { value: "embu-mbeere-south", label: "Mbeere South" },
    ],
  },
  {
    value: "kitui",
    label: "Kitui",
    subRegions: [
      { value: "kitui-central", label: "Kitui Central" },
      { value: "kitui-west", label: "Kitui West" },
      { value: "kitui-mutomo", label: "Mutomo" },
    ],
  },
  {
    value: "machakos",
    label: "Machakos",
    subRegions: [
      { value: "machakos-town", label: "Machakos Town" },
      { value: "machakos-athi-river", label: "Athi River" },
      { value: "machakos-kangundo", label: "Kangundo" },
    ],
  },
  {
    value: "makueni",
    label: "Makueni",
    subRegions: [
      { value: "makueni-makueni", label: "Makueni" },
      { value: "makueni-kibwezi", label: "Kibwezi" },
      { value: "makueni-wote", label: "Wote" },
    ],
  },
  {
    value: "nyandarua",
    label: "Nyandarua",
    subRegions: [
      { value: "nyandarua-ol-kalou", label: "Ol Kalou" },
      { value: "nyandarua-kinangop", label: "Kinangop" },
      { value: "nyandarua-ndaragwa", label: "Ndaragwa" },
    ],
  },
  {
    value: "nyeri",
    label: "Nyeri",
    subRegions: [
      { value: "nyeri-town", label: "Nyeri Town" },
      { value: "nyeri-tetu", label: "Tetu" },
      { value: "nyeri-kieni", label: "Kieni" },
    ],
  },
  {
    value: "kirinyaga",
    label: "Kirinyaga",
    subRegions: [
      { value: "kirinyaga-central", label: "Kirinyaga Central" },
      { value: "kirinyaga-mwea", label: "Mwea" },
      { value: "kirinyaga-gichugu", label: "Gichugu" },
    ],
  },
  {
    value: "muranga",
    label: "Murang'a",
    subRegions: [
      { value: "muranga-town", label: "Murang'a Town" },
      { value: "muranga-gatanga", label: "Gatanga" },
      { value: "muranga-kandara", label: "Kandara" },
    ],
  },
  {
    value: "kiambu",
    label: "Kiambu",
    subRegions: [
      { value: "kiambu-thika", label: "Thika" },
      { value: "kiambu-ruiru", label: "Ruiru" },
      { value: "kiambu-limuru", label: "Limuru" },
    ],
  },
  {
    value: "turkana",
    label: "Turkana",
    subRegions: [
      { value: "turkana-lodwar", label: "Lodwar" },
      { value: "turkana-east", label: "Turkana East" },
      { value: "turkana-west", label: "Turkana West" },
    ],
  },
  {
    value: "west-pokot",
    label: "West Pokot",
    subRegions: [
      { value: "west-pokot-kapenguria", label: "Kapenguria" },
      { value: "west-pokot-south", label: "Pokot South" },
      { value: "west-pokot-sigor", label: "Sigor" },
    ],
  },
  {
    value: "samburu",
    label: "Samburu",
    subRegions: [
      { value: "samburu-east", label: "Samburu East" },
      { value: "samburu-north", label: "Samburu North" },
      { value: "samburu-west", label: "Samburu West" },
    ],
  },
  {
    value: "trans-nzoia",
    label: "Trans Nzoia",
    subRegions: [
      { value: "trans-nzoia-kitale", label: "Kitale" },
      { value: "trans-nzoia-cherangany", label: "Cherangany" },
      { value: "trans-nzoia-endebess", label: "Endebess" },
    ],
  },
  {
    value: "uasin-gishu",
    label: "Uasin Gishu",
    subRegions: [
      { value: "uasin-gishu-eldoret-east", label: "Eldoret East" },
      { value: "uasin-gishu-eldoret-west", label: "Eldoret West" },
      { value: "uasin-gishu-soy", label: "Soy" },
    ],
  },
  {
    value: "elgeyo-marakwet",
    label: "Elgeyo-Marakwet",
    subRegions: [
      { value: "elgeyo-marakwet-east", label: "Marakwet East" },
      { value: "elgeyo-marakwet-west", label: "Marakwet West" },
      { value: "elgeyo-marakwet-keiyo-south", label: "Keiyo South" },
    ],
  },
  {
    value: "nandi",
    label: "Nandi",
    subRegions: [
      { value: "nandi-hills", label: "Nandi Hills" },
      { value: "nandi-mosop", label: "Mosop" },
      { value: "nandi-chesumei", label: "Chesumei" },
    ],
  },
  {
    value: "baringo",
    label: "Baringo",
    subRegions: [
      { value: "baringo-central", label: "Baringo Central" },
      { value: "baringo-north", label: "Baringo North" },
      { value: "baringo-tiaty", label: "Tiaty" },
    ],
  },
  {
    value: "laikipia",
    label: "Laikipia",
    subRegions: [
      { value: "laikipia-east", label: "Laikipia East" },
      { value: "laikipia-west", label: "Laikipia West" },
      { value: "laikipia-north", label: "Laikipia North" },
    ],
  },
  {
    value: "nakuru",
    label: "Nakuru",
    subRegions: [
      { value: "nakuru-town", label: "Nakuru Town" },
      { value: "nakuru-naivasha", label: "Naivasha" },
      { value: "nakuru-gilgil", label: "Gilgil" },
    ],
  },
  {
    value: "narok",
    label: "Narok",
    subRegions: [
      { value: "narok-north", label: "Narok North" },
      { value: "narok-south", label: "Narok South" },
      { value: "narok-transmara-east", label: "Transmara East" },
    ],
  },
  {
    value: "kajiado",
    label: "Kajiado",
    subRegions: [
      { value: "kajiado-central", label: "Kajiado Central" },
      { value: "kajiado-north", label: "Kajiado North" },
      { value: "kajiado-south", label: "Kajiado South" },
    ],
  },
  {
    value: "kericho",
    label: "Kericho",
    subRegions: [
      { value: "kericho-town", label: "Kericho Town" },
      { value: "kericho-ainamoi", label: "Ainamoi" },
      { value: "kericho-belgut", label: "Belgut" },
    ],
  },
  {
    value: "bomet",
    label: "Bomet",
    subRegions: [
      { value: "bomet-central", label: "Bomet Central" },
      { value: "bomet-chepalungu", label: "Chepalungu" },
      { value: "bomet-sotik", label: "Sotik" },
    ],
  },
  {
    value: "kakamega",
    label: "Kakamega",
    subRegions: [
      { value: "kakamega-central", label: "Kakamega Central" },
      { value: "kakamega-mumias-east", label: "Mumias East" },
      { value: "kakamega-likuyani", label: "Likuyani" },
    ],
  },
  {
    value: "vihiga",
    label: "Vihiga",
    subRegions: [
      { value: "vihiga-vihiga", label: "Vihiga" },
      { value: "vihiga-emuhaya", label: "Emuhaya" },
      { value: "vihiga-hamisi", label: "Hamisi" },
    ],
  },
  {
    value: "bungoma",
    label: "Bungoma",
    subRegions: [
      { value: "bungoma-east", label: "Bungoma East" },
      { value: "bungoma-webuye", label: "Webuye" },
      { value: "bungoma-kimilili", label: "Kimilili" },
    ],
  },
  {
    value: "busia",
    label: "Busia",
    subRegions: [
      { value: "busia-teso-north", label: "Teso North" },
      { value: "busia-teso-south", label: "Teso South" },
      { value: "busia-butula", label: "Butula" },
    ],
  },
  {
    value: "siaya",
    label: "Siaya",
    subRegions: [
      { value: "siaya-gem", label: "Gem" },
      { value: "siaya-bondo", label: "Bondo" },
      { value: "siaya-ugenya", label: "Ugenya" },
    ],
  },
  {
    value: "kisumu",
    label: "Kisumu",
    subRegions: [
      { value: "kisumu-central", label: "Kisumu Central" },
      { value: "kisumu-east", label: "Kisumu East" },
      { value: "kisumu-nyando", label: "Nyando" },
    ],
  },
  {
    value: "homa-bay",
    label: "Homa Bay",
    subRegions: [
      { value: "homa-bay-town", label: "Homa Bay Town" },
      { value: "homa-bay-rangwe", label: "Rangwe" },
      { value: "homa-bay-mbita", label: "Mbita" },
    ],
  },
  {
    value: "migori",
    label: "Migori",
    subRegions: [
      { value: "migori-town", label: "Migori Town" },
      { value: "migori-awendo", label: "Awendo" },
      { value: "migori-suna-east", label: "Suna East" },
    ],
  },
  {
    value: "kisii",
    label: "Kisii",
    subRegions: [
      { value: "kisii-central", label: "Kisii Central" },
      { value: "kisii-bomachoge", label: "Bomachoge" },
      { value: "kisii-kitutu-chache", label: "Kitutu Chache" },
    ],
  },
  {
    value: "nyamira",
    label: "Nyamira",
    subRegions: [
      { value: "nyamira-north", label: "Nyamira North" },
      { value: "nyamira-south", label: "Nyamira South" },
      { value: "nyamira-borabu", label: "Borabu" },
    ],
  },
  {
    value: "nairobi",
    label: "Nairobi",
    subRegions: [
      { value: "nairobi-westlands", label: "Westlands" },
      { value: "nairobi-embakasi", label: "Embakasi" },
      { value: "nairobi-dagoretti", label: "Dagoretti" },
      { value: "nairobi-langata", label: "Lang'ata" },
      { value: "nairobi-kasarani", label: "Kasarani" },
    ],
  },
];

/** Flat list of all sub-regions across all counties */
export const ALL_SUB_REGIONS = KENYA_COUNTIES.flatMap((c) =>
  c.subRegions.map((sr) => ({ ...sr, countyValue: c.value, countyLabel: c.label }))
);

/** Look up the county that owns a given sub-region value */
export function getCountyForRegion(regionValue: string): County | undefined {
  return KENYA_COUNTIES.find((c) => c.subRegions.some((sr) => sr.value === regionValue));
}

/** Look up a sub-region by its value */
export function getSubRegionLabel(regionValue: string): string {
  return ALL_SUB_REGIONS.find((sr) => sr.value === regionValue)?.label ?? regionValue;
}

