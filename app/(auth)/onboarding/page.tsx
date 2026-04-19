'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SKIN_TYPES   = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive'];
const SKIN_TONES   = ['Fair', 'Light', 'Light Medium', 'Medium', 'Medium Tan', 'Tan', 'Deep Tan', 'Deep', 'Rich', 'Ebony'];
const UNDERTONES   = ['Cool', 'Warm', 'Neutral', 'Olive'];
const LOOK_OPTIONS = ['Full Glam', 'Office Going', 'Natural', 'Bridal', 'Editorial', 'Smoky', 'Clean Girl', 'Bold Lip'];
const BRAND_SUGGESTIONS = [
  'Fenty Beauty', 'Charlotte Tilbury', 'Rare Beauty', 'Anastasia Beverly Hills',
  'Lancôme', 'NARS', 'MAC', 'NYX', 'Urban Decay', 'Too Faced',
  'Huda Beauty', 'Dior Beauty', 'YSL Beauty', 'Givenchy', 'Laura Mercier',
  'Bobbi Brown', 'Giorgio Armani Beauty', 'Hourglass', 'Pat McGrath', 'Ilia',
];

const TOTAL_STEPS = 9;

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const inputCls =
  'w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent transition-colors text-sm';

const chipBase  = 'py-2 px-4 rounded-full text-sm border transition-colors cursor-pointer';
const chipOn    = 'bg-accent/25 border-accent text-accent';
const chipOff   = 'bg-white/5 border-white/20 text-white/70 hover:border-accent/50 hover:text-white';

// ---------------------------------------------------------------------------
// Progress bar
// ---------------------------------------------------------------------------

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-white/40 text-xs mb-2">
        <span>Step {step} of {total}</span>
        <span>{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step wrapper
// ---------------------------------------------------------------------------

function StepShell({
  title, subtitle, step, onBack, onNext, nextLabel = 'Next →', nextDisabled = false, children,
}: {
  title: string;
  subtitle?: string;
  step: number;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <ProgressBar step={step} total={TOTAL_STEPS} />

      <div>
        <h2 className="text-2xl text-white">{title}</h2>
        {subtitle && <p className="text-white/50 text-sm mt-1">{subtitle}</p>}
      </div>

      <div className="flex-1">{children}</div>

      <div className="flex gap-3">
        {onBack && (
          <button onClick={onBack}
            className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors text-sm">
            ← Back
          </button>
        )}
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex-1 py-3 rounded-xl bg-accent text-white hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-40"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useUser();

  const [step, setStep] = useState(1);

  // Field state
  const [name,       setName]       = useState('');
  const [age,        setAge]        = useState('');
  const [skinType,   setSkinType]   = useState('');
  const [skinTone,   setSkinTone]   = useState('');
  const [undertone,  setUndertone]  = useState('');
  const [looks,      setLooks]      = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [brands,     setBrands]     = useState<string[]>([]);
  const [location,   setLocation]   = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  const COUNTRIES = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua & Barbuda','Argentina','Armenia',
    'Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus',
    'Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia & Herzegovina','Botswana','Brazil',
    'Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada',
    'Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica',
    'Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic',
    'DR Congo','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini',
    'Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana','Greece',
    'Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti','Honduras','Hungary','Iceland',
    'India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan',
    'Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho',
    'Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi','Malaysia',
    'Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia',
    'Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru',
    'Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia',
    'Norway','Oman','Pakistan','Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru',
    'Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda','Saint Kitts & Nevis',
    'Saint Lucia','Saint Vincent & Grenadines','Samoa','San Marino','São Tomé & Príncipe',
    'Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
    'Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka',
    'Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand',
    'Timor-Leste','Togo','Tonga','Trinidad & Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu',
    'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
    'Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
  ];

  function toggleLook(l: string) {
    setLooks((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
  }
  function toggleBrand(b: string) {
    setBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);
  }

  function finish() {
    updateProfile({
      name:            name.trim() || 'Isha',
      skinType,
      skinTone,
      complexion:      skinTone,
      undertone,
      preferredLooks:  looks,
      preferredBrands: brands,
      location,
      hasOnboarded:    true,
    });
    router.push('/home');
  }

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const filteredBrands   = BRAND_SUGGESTIONS.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase()));
  const filteredCountries = COUNTRIES.filter((c) => c.toLowerCase().includes(locationSearch.toLowerCase()));

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #0F0A1E 0%, #4B3B8C 50%, #7B3F6E 100%)' }}
    >
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">

        {/* Step 1 — Name */}
        {step === 1 && (
          <StepShell title="What's your name?" subtitle="This becomes your studio title." step={1}
            onNext={() => { if (name.trim()) next(); }}
            nextDisabled={!name.trim()}>
            <input value={name} onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) next(); }}
              placeholder="e.g. Isha" className={inputCls} autoFocus />
          </StepShell>
        )}

        {/* Step 2 — Age (optional) */}
        {step === 2 && (
          <StepShell title="How old are you?" subtitle="Optional — you can skip this." step={2}
            onBack={back} onNext={next} nextLabel="Next →">
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 24" min={10} max={100} className={inputCls} />
          </StepShell>
        )}

        {/* Step 3 — Skin Type */}
        {step === 3 && (
          <StepShell title="What's your skin type?" step={3}
            onBack={back} onNext={next} nextDisabled={!skinType}>
            <div className="flex flex-col gap-2">
              {SKIN_TYPES.map((st) => (
                <button key={st} onClick={() => setSkinType(st)}
                  className={`${chipBase} text-left px-5 ${skinType === st ? chipOn : chipOff}`}>
                  {st}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {/* Step 4 — Skin Tone */}
        {step === 4 && (
          <StepShell title="What's your skin tone?" step={4}
            onBack={back} onNext={next} nextDisabled={!skinTone}>
            <div className="grid grid-cols-2 gap-2">
              {SKIN_TONES.map((t) => (
                <button key={t} onClick={() => setSkinTone(t)}
                  className={`${chipBase} ${skinTone === t ? chipOn : chipOff}`}>
                  {t}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {/* Step 5 — Undertone */}
        {step === 5 && (
          <StepShell title="What's your undertone?" subtitle="The natural hue beneath your skin." step={5}
            onBack={back} onNext={next} nextDisabled={!undertone}>
            <div className="flex flex-col gap-2">
              {UNDERTONES.map((u) => (
                <button key={u} onClick={() => setUndertone(u)}
                  className={`${chipBase} text-left px-5 ${undertone === u ? chipOn : chipOff}`}>
                  <span className="font-medium">{u}</span>
                  <span className="ml-2 text-white/40 text-xs">
                    {u === 'Cool' && '— pink or bluish hues'}
                    {u === 'Warm' && '— golden or peachy hues'}
                    {u === 'Neutral' && '— mix of both'}
                    {u === 'Olive' && '— greenish or muted hues'}
                  </span>
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {/* Step 6 — Preferred Looks */}
        {step === 6 && (
          <StepShell title="What looks do you love?" subtitle="Pick as many as you like." step={6}
            onBack={back} onNext={next}>
            <div className="flex flex-wrap gap-2">
              {LOOK_OPTIONS.map((l) => (
                <button key={l} onClick={() => toggleLook(l)}
                  className={`${chipBase} ${looks.includes(l) ? chipOn : chipOff}`}>
                  {l}
                </button>
              ))}
            </div>
          </StepShell>
        )}

        {/* Step 7 — Preferred Brands */}
        {step === 7 && (
          <StepShell title="Favourite brands?" subtitle="Pick your go-to makeup brands." step={7}
            onBack={back} onNext={next}>
            <div className="space-y-3">
              <input value={brandSearch} onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands..." className={inputCls} />
              <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
                {filteredBrands.map((b) => (
                  <button key={b} onClick={() => toggleBrand(b)}
                    className={`${chipBase} ${brands.includes(b) ? chipOn : chipOff}`}>
                    {b}
                  </button>
                ))}
              </div>
              {brands.length > 0 && (
                <p className="text-white/40 text-xs">{brands.length} selected</p>
              )}
            </div>
          </StepShell>
        )}

        {/* Step 8 — Location */}
        {step === 8 && (
          <StepShell title="Where are you based?" step={8}
            onBack={back} onNext={next} nextDisabled={!location}>
            <div className="space-y-3">
              <input value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search country..." className={inputCls} />
              <div className="h-52 overflow-y-auto rounded-xl border border-white/10 divide-y divide-white/5">
                {filteredCountries.map((c) => (
                  <button key={c} onClick={() => setLocation(c)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${location === c ? 'bg-accent/20 text-accent' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    {c}
                  </button>
                ))}
              </div>
              {location && <p className="text-accent text-sm">Selected: <span className="text-white">{location}</span></p>}
            </div>
          </StepShell>
        )}

        {/* Step 9 — Hero image (optional) */}
        {step === 9 && (
          <StepShell title="Add a hero image?" subtitle="Optional — set the look of your studio banner."
            step={9} onBack={back} onNext={finish} nextLabel="Finish & Enter My Studio ✨">
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-accent transition-colors text-white/50 text-sm gap-2">
                <span className="text-4xl">📸</span>
                <span>Click to upload a hero image</span>
                <span className="text-xs text-white/30">or skip — you can set this later in your portfolio</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </StepShell>
        )}

      </div>
    </div>
  );
}
