
-- Recreate the trigger for auto-creating profiles on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Allow admins to update orders (for status changes)
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update contact messages (mark as read)
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to manage bookings
CREATE POLICY "Admins can manage bookings" ON public.bookings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
