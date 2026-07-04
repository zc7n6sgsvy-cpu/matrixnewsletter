'use server';

import { createSubscription, isBeehiivConfigured } from '@/lib/beehiiv';

export async function subscribeAction(prevState: any, formData: FormData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: '> ERROR: invalid address. check syntax and retry.' };
  }

  if (!isBeehiivConfigured()) {
    // In development or before env vars are set, simulate success
    console.log('[DEV] Beehiiv not configured. Would have subscribed:', email);
    return {
      success: true,
      message: '> ACCESS GRANTED (dev mode — add BEEHIIV keys for real delivery)',
    };
  }

  try {
    const result = await createSubscription(email, 'matrixnewsletter.com');

    if (result.ok) {
      return {
        success: true,
        message: '> welcome to the matrix. transmission inbound.',
      };
    } else {
      // Handle common cases gracefully
      if (result.status === 409 || (result.message || '').toLowerCase().includes('already')) {
        return {
          success: true,
          message: '> you are already in the system. welcome back.',
        };
      }
      return {
        success: false,
        message: `> ERROR: ${result.message || 'could not subscribe'}`,
      };
    }
  } catch (err: any) {
    console.error('Subscribe error:', err);
    return {
      success: false,
      message: '> ERROR: secure channel failed. try again later.',
    };
  }
}
