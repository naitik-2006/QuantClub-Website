import { unstable_cache } from 'next/cache';
import { readJSON } from '@/lib/db';
import ResourcesClient from './ResourcesClient';

const getCachedResources = unstable_cache(
  async () => readJSON<any[]>('resources.json', []),
  ['resources-cache'],
  { tags: ['resources'] }
);

export const metadata = {
  title: 'Resources | Quant Club',
  description: 'Curated quantitative finance resources.',
};

export default async function ResourcesPage() {
  const resources = await getCachedResources();
  return <ResourcesClient initialResources={resources} />;
}
