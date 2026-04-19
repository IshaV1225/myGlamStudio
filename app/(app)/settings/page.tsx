'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';
import { useUser } from '@/contexts/UserContext';

// ---------------------------------------------------------------------------

const inputCls =
  'w-full bg-bg border border-primary rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent transition-colors text-sm';

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

// ---------------------------------------------------------------------------
// Reusable row
// ---------------------------------------------------------------------------

function SettingRow({
  label, value, onEdit,
}: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-primary/20 last:border-b-0">
      <div>
        <p className="text-xs text-muted uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-foreground text-sm">{value}</p>
      </div>
      <button
        onClick={onEdit}
        className="text-sm px-4 py-1.5 rounded-lg bg-surface border border-primary/40 text-muted hover:text-foreground transition-colors shrink-0 ml-4"
      >Edit</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const { profile, updateProfile } = useUser();

  type ModalKey = 'name' | 'email' | 'password' | 'location' | null;
  const [open, setOpen] = useState<ModalKey>(null);

  const [tmpName,     setTmpName]     = useState('');
  const [tmpEmail,    setTmpEmail]    = useState('');
  const [tmpLocation, setTmpLocation] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  const [curPw,     setCurPw]     = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError,   setPwError]   = useState('');

  function openModal(key: ModalKey) {
    setOpen(key);
    if (key === 'name')     setTmpName(profile.name);
    if (key === 'email')    setTmpEmail(profile.email);
    if (key === 'location') { setTmpLocation(profile.location); setLocationSearch(''); }
    if (key === 'password') { setCurPw(''); setNewPw(''); setConfirmPw(''); setPwError(''); }
  }
  function closeModal() { setOpen(null); }

  function saveName() {
    if (!tmpName.trim()) return;
    updateProfile({ name: tmpName.trim() });
    closeModal();
  }

  function saveEmail() {
    if (!tmpEmail.trim()) return;
    updateProfile({ email: tmpEmail.trim() });
    closeModal();
  }

  function savePassword() {
    if (newPw.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    setPwError('');
    closeModal();
  }

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 space-y-10">

        <h1 className="text-3xl text-foreground">Settings</h1>

        {/* Account — includes Location */}
        <section>
          <h2 className="text-lg text-muted mb-2">Account</h2>
          <div className="bg-surface rounded-2xl px-5">
            <SettingRow label="Name"     value={profile.name}     onEdit={() => openModal('name')} />
            <SettingRow label="Email"    value={profile.email}    onEdit={() => openModal('email')} />
            <SettingRow label="Password" value="••••••••"         onEdit={() => openModal('password')} />
            <SettingRow label="Location" value={profile.location} onEdit={() => openModal('location')} />
          </div>
        </section>

      </div>

      {/* ── Name Modal ── */}
      <Modal open={open === 'name'} onClose={closeModal} title="Change Name">
        <div className="space-y-5">
          <input value={tmpName} onChange={(e) => setTmpName(e.target.value)}
            placeholder="Your name" className={inputCls} />
          <button onClick={saveName} disabled={!tmpName.trim()}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 transition-all disabled:opacity-50">
            Save
          </button>
        </div>
      </Modal>

      {/* ── Email Modal ── */}
      <Modal open={open === 'email'} onClose={closeModal} title="Change Email">
        <div className="space-y-5">
          <input type="email" value={tmpEmail} onChange={(e) => setTmpEmail(e.target.value)}
            placeholder="email@example.com" className={inputCls} />
          <button onClick={saveEmail} disabled={!tmpEmail.trim()}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 transition-all disabled:opacity-50">
            Save
          </button>
        </div>
      </Modal>

      {/* ── Password Modal ── */}
      <Modal open={open === 'password'} onClose={closeModal} title="Change Password">
        <div className="space-y-4">
          <input type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)}
            placeholder="Current password" className={inputCls} />
          <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
            placeholder="New password" className={inputCls} />
          <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Confirm new password" className={inputCls} />
          {pwError && <p className="text-accent text-xs">{pwError}</p>}
          <p className="text-muted/50 text-xs">Real password update requires Firebase/Supabase auth — wired in a later batch.</p>
          <button onClick={savePassword}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 transition-all">
            Save
          </button>
        </div>
      </Modal>

      {/* ── Location Modal ── */}
      <Modal open={open === 'location'} onClose={closeModal} title="Change Location">
        <div className="space-y-3">
          {/* Search */}
          <input
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Search country..."
            className={inputCls}
          />

          {/* Scrollable country list */}
          <div className="h-64 overflow-y-auto rounded-xl border border-primary/20 divide-y divide-primary/10">
            {filteredCountries.length > 0 ? filteredCountries.map((country) => (
              <button
                key={country}
                onClick={() => setTmpLocation(country)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  tmpLocation === country
                    ? 'bg-accent/20 text-accent'
                    : 'text-muted hover:bg-primary/10 hover:text-foreground'
                }`}
              >
                {country}
              </button>
            )) : (
              <p className="text-muted/50 text-sm px-4 py-3">No countries match.</p>
            )}
          </div>

          {tmpLocation && (
            <p className="text-accent text-sm">Selected: <span className="text-foreground">{tmpLocation}</span></p>
          )}

          <button
            onClick={() => { updateProfile({ location: tmpLocation }); closeModal(); }}
            disabled={!tmpLocation}
            className="w-full bg-accent text-white rounded-lg py-3 hover:opacity-90 transition-all disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
