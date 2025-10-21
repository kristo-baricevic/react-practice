import { seed } from '../../lib/seed';

export async function GET() {
  return Response.json(seed);
}
