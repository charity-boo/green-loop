import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { renderToString } from 'react-dom/server';

import PickupDetailsForm from '../pickup-details-form';

vi.mock('@/components/location/address-autocomplete', () => ({
  default: ({ value }: { value: string }) => (
    <input aria-label="Pickup Address" value={value} readOnly />
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...props}>{children}</label>
  ),
}));

vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} />,
}));

vi.mock('@/components/ui/calendar', () => ({
  Calendar: () => <div data-testid="calendar" />,
}));

vi.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: () => <span />,
}));

describe('PickupDetailsForm', () => {
  (globalThis as unknown as { React: typeof React }).React = React;

  it('does not render a div inside paragraph for locked GPS coordinates', () => {
    const html = renderToString(
      <PickupDetailsForm
        initialPickupDetails={{
          address: 'Kenyatta Avenue, Nairobi, Kenya',
          region: 'nairobi-cbd',
          date: new Date('2026-04-01'),
          timeSlot: 'morning',
          instructions: '',
          county: 'Nairobi',
          latitude: -1.2864,
          longitude: 36.8172,
          placeId: 'test-place-id',
          locationSource: 'google_autocomplete',
        }}
        onSubmit={() => {}}
        onPrev={() => {}}
      />
    );

    expect(html).not.toMatch(/<p[^>]*>\s*<div/i);
  });
});
