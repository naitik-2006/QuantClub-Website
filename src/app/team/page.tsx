import { unstable_cache } from 'next/cache';
import { readJSON } from '@/lib/db';
import TeamClient from './TeamClient';

const getCachedTeam = unstable_cache(
  async () => readJSON<any[]>('team.json', []),
  ['team-cache'],
  { tags: ['team'] }
);

export const metadata = {
  title: 'Team | Quant Club',
  description: 'Meet the quants behind the code.',
};

export default async function TeamPage() {
  const team = await getCachedTeam();
  return <TeamClient initialMembers={team} />;
}
