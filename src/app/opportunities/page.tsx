import { unstable_cache } from 'next/cache';
import { readJSON } from '@/lib/db';
import OpportunitiesClient from './OpportunitiesClient';

const getCachedOpportunities = unstable_cache(
  async () => readJSON<any[]>('opportunities.json', []),
  ['opportunities-cache'],
  { tags: ['opportunities'] }
);

export const metadata = {
  title: 'Opportunities | Quant Club',
  description: 'A curated database of upcoming internships and competitions.',
};

export default async function OpportunitiesPage() {
  const opportunities = await getCachedOpportunities();
  return <OpportunitiesClient initialOpportunities={opportunities} />;
}
