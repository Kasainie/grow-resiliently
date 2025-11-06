-- Create user_credits table to track daily AI usage
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own credits"
ON public.user_credits
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits"
ON public.user_credits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
ON public.user_credits
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to check and update credits
CREATE OR REPLACE FUNCTION public.check_and_use_credit(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_credits_used INTEGER;
  v_last_reset DATE;
  v_daily_limit INTEGER := 5;
BEGIN
  -- Get or create user credits record
  SELECT credits_used, last_reset_date
  INTO v_credits_used, v_last_reset
  FROM user_credits
  WHERE user_id = p_user_id;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_credits (user_id, credits_used, last_reset_date)
    VALUES (p_user_id, 1, CURRENT_DATE);
    RETURN json_build_object('success', true, 'credits_remaining', v_daily_limit - 1);
  END IF;
  
  -- Reset credits if it's a new day
  IF v_last_reset < CURRENT_DATE THEN
    UPDATE user_credits
    SET credits_used = 1, last_reset_date = CURRENT_DATE, updated_at = now()
    WHERE user_id = p_user_id;
    RETURN json_build_object('success', true, 'credits_remaining', v_daily_limit - 1);
  END IF;
  
  -- Check if user has credits remaining
  IF v_credits_used >= v_daily_limit THEN
    RETURN json_build_object('success', false, 'credits_remaining', 0, 'message', 'Daily credit limit reached');
  END IF;
  
  -- Increment credits used
  UPDATE user_credits
  SET credits_used = credits_used + 1, updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN json_build_object('success', true, 'credits_remaining', v_daily_limit - v_credits_used - 1);
END;
$$;

-- Add trigger for updated_at
CREATE TRIGGER update_user_credits_updated_at
BEFORE UPDATE ON public.user_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create analysis_results table to store AI analysis
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_id UUID NOT NULL REFERENCES public.images(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
  analysis_text TEXT NOT NULL,
  severity_level TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own analysis results"
ON public.analysis_results
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analysis results"
ON public.analysis_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add trigger for realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.analysis_results;