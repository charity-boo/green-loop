import { KENYA_COUNTIES } from '@/lib/constants/regions';

export type GoogleAddressComponent = {
  long_name?: string;
  short_name?: string;
  longText?: string;
  shortText?: string;
  types: string[];
};

type NormalizedAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export function mapGoogleAddressToCoverage(components: GoogleAddressComponent[]): {
  county: string | null;
  region: string | null;
} {
  const normalizedComponents = components.map((component) => {
    const raw = normalizeAddressComponent(component);

    return {
      ...raw,
      normalizedLong: normalizeLocationToken(raw.long_name),
      normalizedShort: normalizeLocationToken(raw.short_name),
    };
  });

  const countyComponent = normalizedComponents.find((component) =>
    component.types.includes('administrative_area_level_1')
  );

  const county = countyComponent
    ? findCountyValue(countyComponent.normalizedLong, countyComponent.normalizedShort)
    : null;

  if (!county) {
    return { county: null, region: null };
  }

  const countyData = KENYA_COUNTIES.find((countyItem) => countyItem.value === county);
  if (!countyData) {
    return { county, region: null };
  }

  const regionCandidateTokens = normalizedComponents
    .filter((component) =>
      component.types.some((type) =>
        [
          'sublocality_level_1',
          'sublocality',
          'locality',
          'administrative_area_level_2',
          'neighborhood',
          'route',
        ].includes(type)
      )
    )
    .flatMap((component) => [component.normalizedLong, component.normalizedShort])
    .filter(Boolean);

  const region = countyData.subRegions.find((subRegion) => {
    const labelToken = normalizeLocationToken(subRegion.label);
    const valueSuffix = normalizeLocationToken(subRegion.value.replace(`${county}-`, ''));

    return regionCandidateTokens.some(
      (candidate) =>
        candidate === labelToken ||
        candidate === valueSuffix ||
        labelToken.includes(candidate) ||
        valueSuffix.includes(candidate)
    );
  })?.value;

  return {
    county,
    region: region ?? null,
  };
}

function normalizeAddressComponent(component: GoogleAddressComponent): NormalizedAddressComponent {
  return {
    long_name: component.long_name ?? component.longText ?? '',
    short_name: component.short_name ?? component.shortText ?? '',
    types: component.types,
  };
}

function findCountyValue(normalizedLong: string, normalizedShort: string): string | null {
  const candidateTokens = [normalizedLong, normalizedShort].filter(Boolean);

  for (const county of KENYA_COUNTIES) {
    const countyValueToken = normalizeLocationToken(county.value);
    const countyLabelToken = normalizeLocationToken(county.label);

    if (
      candidateTokens.some(
        (candidate) =>
          candidate === countyValueToken ||
          candidate === countyLabelToken ||
          countyValueToken.includes(candidate) ||
          countyLabelToken.includes(candidate)
      )
    ) {
      return county.value;
    }
  }

  return null;
}

function normalizeLocationToken(token: string): string {
  return token
    .toLowerCase()
    .replace(/county/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
    .trim();
}
