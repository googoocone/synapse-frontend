-- Add columns for subscription cancellation and scheduling
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS scheduled_plan_id UUID REFERENCES subscription_plans(id);

-- Comment on columns
COMMENT ON COLUMN subscriptions.cancel_at_period_end IS 'If true, the subscription will be cancelled at the end of the current period.';
COMMENT ON COLUMN subscriptions.scheduled_plan_id IS 'The ID of the plan to switch to at the end of the current period.';
