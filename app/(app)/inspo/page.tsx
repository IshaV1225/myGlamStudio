'use client';

// ---------------------------------------------------------------------------
// Planned features data
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    icon: '📈',
    title: 'Trend Scroll Bar',
    description:
      'See the latest makeup trends — clean girl, bridal, bold, Indian bride, and more — pulled in real time via the Google Trends API and filtered to your location.',
  },
  {
    icon: '📌',
    title: 'Pinterest Integration',
    description:
      'Connect your Pinterest account and import boards or individual pins directly into your inspo library with one tap.',
  },
  {
    icon: '🗂️',
    title: 'Inspo Folders',
    description:
      'Organise your inspo images into named folders — Espresso, Icy, Strawberry Matcha, Clean Girl — and build a personal mood archive.',
  },
  {
    icon: '🔍',
    title: 'Click to View',
    description:
      'Tap any inspo image to see it full-size in an immersive overlay, with the option to save it to a folder or a mood board.',
  },
  {
    icon: '🌍',
    title: 'Top Trends Near You',
    description:
      'Discover location-based trending makeup hashtags and looks so your inspo always stays relevant to your market.',
  },
];

// ---------------------------------------------------------------------------
// Decorative gradient cards (animated placeholders)
// ---------------------------------------------------------------------------

const GRADIENTS = [
  'linear-gradient(135deg, #4B3B8C, #7B3F6E)',
  'linear-gradient(135deg, #7B3F6E, #F4796B)',
  'linear-gradient(135deg, #F4796B, #F9B4A8)',
  'linear-gradient(135deg, #0F0A1E, #4B3B8C)',
  'linear-gradient(135deg, #9B8DB0, #4B3B8C)',
  'linear-gradient(135deg, #F9B4A8, #7B3F6E)',
  'linear-gradient(135deg, #1C1333, #7B3F6E)',
  'linear-gradient(135deg, #4B3B8C, #F4796B)',
  'linear-gradient(135deg, #7B3F6E, #9B8DB0)',
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InspoPage() {
  return (
    <div className="min-h-screen bg-bg pb-20 overflow-hidden">

      {/* Blurred background mosaic */}
      <div className="fixed inset-0 -z-10 opacity-20 blur-3xl pointer-events-none">
        <div className="grid grid-cols-3 h-full">
          {GRADIENTS.map((g, i) => (
            <div key={i} style={{ background: g }} />
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 space-y-16">

        {/* Hero */}
        <div className="text-center space-y-5">
          <span className="inline-block text-5xl animate-bounce">✨</span>
          <h1 className="text-4xl text-foreground">My Inspo</h1>
          <div className="inline-block bg-accent/15 border border-accent/40 text-accent text-sm px-4 py-1.5 rounded-full">
            Coming Soon
          </div>
          <p className="text-muted text-base max-w-xl mx-auto leading-relaxed">
            Your personal inspo hub is on its way. Discover trends, import from Pinterest, and
            organise your favourite looks into folders — all in one place.
          </p>
        </div>

        {/* Preview mosaic */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 rounded-3xl overflow-hidden">
          {GRADIENTS.map((g, i) => (
            <div
              key={i}
              className={`rounded-xl ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}
              style={{ background: g }}
            />
          ))}
        </div>

        {/* Planned features */}
        <div className="space-y-4">
          <h2 className="text-xl text-foreground">What&apos;s Coming</h2>
          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 bg-surface border border-primary/20 rounded-2xl px-5 py-4"
              >
                <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                <div>
                  <p className="text-foreground text-sm font-medium">{f.title}</p>
                  <p className="text-muted text-xs mt-1 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pinterest early access CTA */}
        <div className="bg-surface border border-primary/30 rounded-3xl px-6 py-8 text-center space-y-4">
          <span className="text-3xl">📌</span>
          <h3 className="text-foreground text-lg">Connect Pinterest Early</h3>
          <p className="text-muted text-sm max-w-sm mx-auto">
            Save your Pinterest board URL in a Mood Board now — it&apos;ll auto-sync when the integration launches.
          </p>
          <a
            href="/moodboard"
            className="inline-block bg-accent text-white px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm"
          >
            Go to Mood Boards →
          </a>
        </div>

      </div>
    </div>
  );
}
