
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
    envConfig.split('\n').map(line => {
        const [key, ...val] = line.split('=');
        return [key, val.join('=')];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchStory() {
    const { data, error } = await supabase
        .from('stories')
        .select('interview_content, founder_image_url')
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching story:', error);
        return;
    }

    const output = {
        founder_image_url: data.founder_image_url,
        interview_content: data.interview_content
    };

    fs.writeFileSync('story_content.json', JSON.stringify(output, null, 2));
    console.log('Content written to story_content.json');
}

fetchStory();
