'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribeAction } from '@/app/actions';

function SubmitButton({ label = 'JACK IN' }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="jack disabled:opacity-60 disabled:cursor-wait"
    >
      {pending ? 'CONNECTING...' : label}
    </button>
  );
}

interface SubscribeFormProps {
  idPrefix: string;
  compact?: boolean;
}

export default function SubscribeForm({ idPrefix, compact = false }: SubscribeFormProps) {
  const [state, formAction] = useActionState(subscribeAction, null);

  const inputId = `${idPrefix}-email`;
  const statusId = `${idPrefix}-status`;

  const statusMessage = state?.message || '';
  const isSuccess = state?.success;

  return (
    <form action={formAction} className={compact ? '' : 'signup'}>
      {!compact && <div className="signup-label">// run: subscribe --email</div>}
      <div className="field">
        <span className="prompt">$</span>
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          placeholder="you@domain.net"
          aria-label="Email address"
          required
          className="flex-1"
        />
        <SubmitButton />
      </div>
      <div
        className="status"
        id={statusId}
        role="status"
        aria-live="polite"
        style={{ color: isSuccess ? '#54f0a0' : undefined }}
      >
        {statusMessage}
      </div>
      {!compact && (
        <div className="signup-note">
          No spam. No selling your data. Unsubscribe with one keystroke.
        </div>
      )}
    </form>
  );
}
