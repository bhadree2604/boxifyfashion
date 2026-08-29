'use client';
import { useEffect, useState } from 'react';
import { useProfile } from './profile-provider';

export default function NamePrompt() {
  const { name, setName, ready } = useProfile();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!ready) return;
    if (!name) {
      setInput('');
      setOpen(true);
    }
  }, [ready, name]);

  const save = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setName(trimmed);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-backdrop" onClick={() => setOpen(false)} />
      <div className="modal-card">
        <div className="modal-body" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <h3>Tell us your name</h3>
            <p className="muted">We’ll use it in WhatsApp order requests.</p>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Your name"
              style={{ width: '100%', padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '0.5rem' }}
            />
            <div className="cta-row" style={{ marginTop: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn outline" type="button" onClick={() => setOpen(false)}>Skip</button>
              <button className="btn solid" type="button" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
