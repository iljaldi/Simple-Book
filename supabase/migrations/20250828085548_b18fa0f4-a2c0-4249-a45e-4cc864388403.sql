-- Create enum types for various fields
CREATE TYPE public.user_role AS ENUM ('user', 'admin');
CREATE TYPE public.user_status AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');
CREATE TYPE public.evidence_type AS ENUM ('TAX_INVOICE', 'INVOICE', 'CARD', 'CASH_RCPT', 'SIMPLE_RCPT', 'NONE');
CREATE TYPE public.taxation_type AS ENUM ('TAXABLE', 'ZERO_RATED', 'EXEMPT');
CREATE TYPE public.payment_method AS ENUM ('transfer', 'card', 'cash', 'etc');
CREATE TYPE public.ocr_status AS ENUM ('pending', 'done', 'failed');
CREATE TYPE public.report_format AS ENUM ('excel', 'csv', 'pdf', 'zip');
CREATE TYPE public.transaction_status AS ENUM ('draft', 'confirmed');

-- Create User table (이메일 회원가입 전용)
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Basic fields
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role public.user_role NOT NULL DEFAULT 'user',
    -- Authentication fields
    email_verified BOOLEAN NOT NULL DEFAULT false,
    verification_token TEXT,
    verification_expiry TIMESTAMP WITH TIME ZONE,
    reset_token TEXT,
    reset_expiry TIMESTAMP WITH TIME ZONE,
    -- Operation fields
    last_login_at TIMESTAMP WITH TIME ZONE,
    status public.user_status NOT NULL DEFAULT 'active',
    terms_agreed_at TIMESTAMP WITH TIME ZONE,
    privacy_agreed_at TIMESTAMP WITH TIME ZONE,
    -- Business fields
    business_reg_no TEXT,
    biz_type_code TEXT,
    -- Meta fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create Business table (선택·복수 사업장용)
CREATE TABLE public.businesses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    reg_no TEXT NOT NULL,
    biz_type_code TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Category table (사용자 맞춤 분류)
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_deductible BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Transaction table (핵심 원장)
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Owner/context
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id),
    -- Basic fields
    type public.transaction_type NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Classification
    category_id UUID REFERENCES public.categories(id),
    category TEXT,
    -- Evidence/tax
    evidence_type public.evidence_type NOT NULL,
    taxation_type public.taxation_type,
    -- Amount fields
    amount_gross DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (amount_gross >= 0),
    vat_amount DECIMAL(15,2) NOT NULL DEFAULT 0 CHECK (vat_amount >= 0),
    -- Payment
    payment_method public.payment_method,
    -- Counterparty
    counterparty_name TEXT,
    counterparty_biz_no TEXT,
    -- Other fields
    currency TEXT NOT NULL DEFAULT 'KRW',
    amount_original DECIMAL(15,2),
    currency_original TEXT,
    fx_rate DECIMAL(10,6),
    is_deductible BOOLEAN DEFAULT true,
    business_use_ratio DECIMAL(3,2) DEFAULT 1.00,
    withholding_income_tax DECIMAL(15,2) DEFAULT 0,
    withholding_local_tax DECIMAL(15,2) DEFAULT 0,
    project TEXT,
    description TEXT,
    status public.transaction_status DEFAULT 'draft',
    -- Meta fields
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create Receipt table (영수증)
CREATE TABLE public.receipts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Owner/connection
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id),
    -- File fields
    file_url TEXT NOT NULL,
    original_filename TEXT,
    mime_type TEXT,
    file_size INTEGER,
    -- OCR fields
    ocr_status public.ocr_status DEFAULT 'pending',
    ocr_text TEXT,
    match_confidence DECIMAL(3,2) CHECK (match_confidence >= 0 AND match_confidence <= 1),
    -- Meta fields
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create Report table (신고 산출물 스냅샷)
CREATE TABLE public.reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Owner/context
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id),
    -- Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    -- Format
    format public.report_format NOT NULL DEFAULT 'excel',
    -- Output
    parameters JSONB DEFAULT '{}',
    file_url TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    -- Constraints
    CHECK (period_start <= period_end)
);

-- Create indexes for better performance
CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX idx_receipts_transaction_id ON public.receipts(transaction_id);
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_period ON public.reports(period_start, period_end);

-- Create function to update updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at
    BEFORE UPDATE ON public.receipts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can view all users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create RLS policies for businesses table
CREATE POLICY "Users can view their own businesses" ON public.businesses
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own businesses" ON public.businesses
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own businesses" ON public.businesses
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own businesses" ON public.businesses
    FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for categories table
CREATE POLICY "Users can view their own categories" ON public.categories
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own categories" ON public.categories
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own categories" ON public.categories
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own categories" ON public.categories
    FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for transactions table
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own transactions" ON public.transactions
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own transactions" ON public.transactions
    FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for receipts table
CREATE POLICY "Users can view their own receipts" ON public.receipts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own receipts" ON public.receipts
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own receipts" ON public.receipts
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own receipts" ON public.receipts
    FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for reports table
CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own reports" ON public.reports
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reports" ON public.reports
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reports" ON public.reports
    FOR DELETE USING (user_id = auth.uid());