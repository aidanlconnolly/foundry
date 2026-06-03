import { SEED_SNAPSHOT } from "@/lib/content/vc";
import { getLatestVcSnapshot } from "@/lib/actions/ai";
import VcLandscape from "@/components/vc/VcLandscape";
import RefreshVcButton from "@/components/vc/RefreshVcButton";

export const dynamic = "force-dynamic";

export default async function VcLandscapePage() {
  const cached = await getLatestVcSnapshot();
  const snapshot = cached ?? SEED_SNAPSHOT;

  return (
    <VcLandscape
      snapshot={snapshot}
      aiGenerated={!!cached}
      refreshSlot={<RefreshVcButton />}
    />
  );
}
