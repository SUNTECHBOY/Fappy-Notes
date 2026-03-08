import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('PROJECT_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    );

    const { email, role, name, mobileNumber, inviterId } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Email is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const { data: user, error: inviteError } = await supabaseClient.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          name,
          role,
          mobile_number: mobileNumber,
          invited_by: inviterId,
        },
      }
    );

    // If they were already invited or already exist, inviteUserByEmail fails.
    // In that case, we can force-resend them an invite link using generateLink!
    if (inviteError && inviteError.message.toLowerCase().includes('already registered')) {
      console.log('User already exists, generating a new invite link...');
      
      const { data: linkData, error: linkError } = await supabaseClient.auth.admin.generateLink({
        type: 'invite',
        email: email,
        data: {
          name,
          role,
          mobile_number: mobileNumber,
          invited_by: inviterId,
        }
      });
      
      if (linkError) throw linkError;
      
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Resent invitation link',
        user: linkData.user 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    if (inviteError) throw inviteError;

    return new Response(JSON.stringify({ success: true, user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Edge Function Error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});
