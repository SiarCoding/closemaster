// /components/global/UpgradePlan.tsx
import { Rocket } from 'lucide-react';

export default function UpgradePlan() {  // Der Name der Komponente sollte mit einem Großbuchstaben beginnen
  return (
    <div className="bg-blue-600 p-6 rounded-xl shadow text-white">
      <h2 className="text-xl font-semibold mb-4">Upgrade auf Pro</h2>
      <p className="mb-4">Erhalte erweiterte Funktionen und verbessere die Effizienz deines Vertriebs-Teams.</p>
      <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold">Jetzt starten</button>
      <div className="mt-8 flex justify-end">
        <Rocket size={48} />
      </div>
    </div>
  );
}
