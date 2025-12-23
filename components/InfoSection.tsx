import React, { useState } from 'react';

const InfoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'doctor' | 'nutrition' | 'mind'>('system');

  const tabs = [
    { id: 'system', label: 'Sustav', icon: 'fa-project-diagram' },
    { id: 'doctor', label: 'Doktor', icon: 'fa-user-md' },
    { id: 'nutrition', label: 'Hrana', icon: 'fa-apple-alt' },
    { id: 'mind', label: 'Psiha', icon: 'fa-brain' },
  ];

  return (
    <div className="bg-white dark:bg-military-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-military-600">
      <div className="flex border-b border-gray-200 dark:border-military-600 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[100px] py-4 text-center font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-50 dark:bg-military-900 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-military-700'
            }`}
          >
            <i className={`fas ${tab.icon} mb-1 block sm:inline sm:mr-2`}></i>
            <span className="text-xs sm:text-sm uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'system' && (
          <div className="animate-fade-in space-y-6">
            <h3 className="text-xl font-black mb-4 text-green-600 uppercase">Centurion Arhitektura</h3>
            
            <div className="relative border-l-2 border-military-200 dark:border-military-700 pl-6 space-y-8">
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-military-800"></div>
                <h4 className="font-bold text-blue-500 uppercase text-sm">1. Trening (Kvaliteta)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tvoj primarni motor. 3 puta tjedno napadamo mišiće znanstvenom periodizacijom. 
                  <strong> Odnos:</strong> Intenzitet (broj ponavljanja) se računa kao % tvog Maxa.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white dark:border-military-800"></div>
                <h4 className="font-bold text-green-500 uppercase text-sm">2. Dnevni Cilj (Kvantiteta)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Osigurava da tvoj metabolizam i CNS ostanu aktivni svaki dan. 
                  <strong> Odnos:</strong> Ako trening ne pokrije cilj, razliku odrađuješ kroz "Grease the Groove" serije (lagani sklekovi kroz dan).
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-yellow-500 border-4 border-white dark:border-military-800"></div>
                <h4 className="font-bold text-yellow-500 uppercase text-sm">3. Max Test (Evolucija)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Trenutak istine. Na kraju svake faze testiramo novi maksimum.
                  <strong> Odnos:</strong> Novi Max automatski ažurira težinu SVIH budućih treninga.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-military-900 p-4 rounded-lg border border-gray-100 dark:border-military-700 mt-4">
              <p className="text-xs font-bold text-military-400 italic">
                "Coach kaže: Trening te gradi, dnevni cilj te održava, a Max test te unaprjeđuje."
              </p>
            </div>
          </div>
        )}

        {activeTab === 'doctor' && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-red-500 uppercase">Dijagnostika Boli</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-military-900 rounded-lg">
                <div className="font-bold text-red-500 mb-1"><i className="fas fa-exclamation-circle"></i> Bol u Zapešću</div>
                <p className="text-sm">Rješenje: Koristite "parallettes" ručke ili radite sklekove na šakama kako bi zapešće ostalo ravno.</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-military-900 rounded-lg">
                <div className="font-bold text-red-500 mb-1"><i className="fas fa-exclamation-circle"></i> Propadanje Donjeg Dijela Leđa</div>
                <p className="text-sm">Rješenje: Aktivirajte gluteus i trbušni zid ("Hollow Body" pozicija).</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-blue-500 uppercase">Gorivo za Mišiće</h3>
            <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-gray-300">
              <li><strong className="text-green-600">Proteini:</strong> Ciljaj 1.6g - 2g po kg tjelesne mase za oporavak vlakana.</li>
              <li><strong className="text-blue-500">Kreatin:</strong> 5g dnevno. Povećava ATP rezerve za eksplozivnost u serijama.</li>
              <li><strong className="text-yellow-600">Magnezij:</strong> Prije spavanja. Ključan za opuštanje mišića i prevenciju grčeva.</li>
            </ul>
          </div>
        )}

        {activeTab === 'mind' && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-purple-500 uppercase">Mentalni Ratnik</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-bold text-lg uppercase text-xs">Pravilo 40%</h4>
                <p className="text-sm">Kada tvoj mozak kaže da si gotov, zapravo si tek na 40% svog fizičkog kapaciteta. Nauči ignorirati signal za odustajanje.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-bold text-lg uppercase text-xs">Self-Talk</h4>
                <p className="text-sm">Govori sebi "Lako je" dok se spuštaš. Tvoje tijelo sluša tvoje naredbe.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSection;