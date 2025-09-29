import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DebugDb() {
  const rows = await prisma.$queryRaw<{ now: Date }[]>`SELECT now() AS now`;
  return <pre style={{ padding: 24 }}>{JSON.stringify(rows, null, 2)}</pre>;
}
