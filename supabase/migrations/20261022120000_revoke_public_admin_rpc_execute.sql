-- Security fix: administrative RPCs must never be callable by public API roles.
-- The application reaches these functions through server-side admin endpoints
-- using the Supabase service-role key.

revoke all privileges on function public.waitlist_admin_stats()
  from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_list(
  boolean, text, boolean, text, date, date, int, int
) from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_invite_beta_emails(text[])
  from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_invite_beta_segment(
  boolean, text, boolean, text, date, date
) from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_set_beta_active(text, boolean)
  from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_create_campaign(text, text, jsonb)
  from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_campaign_add_recipients(uuid, text[])
  from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_campaign_set_recipient_result(
  uuid, text, text, text
) from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_campaign_mark_sent(uuid, int)
  from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_get_campaign(uuid)
  from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_list_campaign_recipients(uuid, int, int)
  from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_campaign_begin_send(uuid)
  from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_campaign_finish_send(uuid, int)
  from public, anon, authenticated;
revoke all privileges on function public.waitlist_admin_campaign_mark_failed(uuid)
  from public, anon, authenticated;

grant execute on function public.waitlist_admin_stats() to service_role;
grant execute on function public.waitlist_admin_list(
  boolean, text, boolean, text, date, date, int, int
) to service_role;
grant execute on function public.waitlist_admin_invite_beta_emails(text[]) to service_role;
grant execute on function public.waitlist_admin_invite_beta_segment(
  boolean, text, boolean, text, date, date
) to service_role;
grant execute on function public.waitlist_admin_set_beta_active(text, boolean) to service_role;
grant execute on function public.waitlist_admin_create_campaign(text, text, jsonb) to service_role;
grant execute on function public.waitlist_admin_campaign_add_recipients(uuid, text[]) to service_role;
grant execute on function public.waitlist_admin_campaign_set_recipient_result(
  uuid, text, text, text
) to service_role;
grant execute on function public.waitlist_admin_campaign_mark_sent(uuid, int) to service_role;
grant execute on function public.waitlist_admin_get_campaign(uuid) to service_role;
grant execute on function public.waitlist_admin_list_campaign_recipients(uuid, int, int)
  to service_role;
grant execute on function public.waitlist_admin_campaign_begin_send(uuid) to service_role;
grant execute on function public.waitlist_admin_campaign_finish_send(uuid, int) to service_role;
grant execute on function public.waitlist_admin_campaign_mark_failed(uuid) to service_role;
