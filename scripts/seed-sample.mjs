import { createClient } from '@supabase/supabase-js';

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    console.error('Set them and re-run: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-sample.mjs');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  // helper to resolve or create publisher/user ids
  let publisherId = process.env.PUBLISHER_ID;
  let userId = process.env.USER_ID;

  if (!publisherId || !userId) {
    console.log('PUBLISHER_ID or USER_ID not provided as env; attempting to fetch first auth user to use as both publisher and user (service role key required).');
    try {
      const { data: users, error: usersErr } = await supabase.auth.admin.listUsers({ per_page: 10 });
      if (usersErr) {
        console.warn('Could not list auth users:', usersErr.message || usersErr);
      } else if (users && users.length > 0) {
        publisherId = publisherId || users[0].id;
        userId = userId || users[0].id;
        console.log('Using user id:', users[0].id);
      }
    } catch (err) {
      console.warn('List users failed:', err);
    }
  }

  if (!publisherId || !userId) {
    console.error('No publisher/user id available. Provide PUBLISHER_ID and USER_ID env vars or ensure auth users exist and service role key has permissions.');
    process.exit(1);
  }

  // Fetch categories map
  const { data: categories, error: catErr } = await supabase.from('categories').select('category_id, name');
  if (catErr) {
    console.error('Failed to fetch categories:', catErr);
    process.exit(1);
  }
  const catMap = new Map(categories.map((c) => [c.name, c.category_id]));

  const samples = [
    // Restaurants
    { name: 'The Spice Route', cat: 'Restaurants', description: 'Cozy Indian eatery with seasonal thalis and dosa specials.', image_url: 'https://images.unsplash.com/photo-1541542684-6e1f6d4f4f6a', rating: 4.6, lat: 12.9716, lng: 77.5946 },
    { name: 'Green Garden Cafe', cat: 'Restaurants', description: 'Healthy brunch spot with juices and salads.', image_url: 'https://images.unsplash.com/photo-1529692236671-f1b8a0aa5d3a', rating: 4.2, lat: 12.9720, lng: 77.5950 },
    // Hotels
    { name: "Nandan's Hotel", cat: 'Hotels', description: 'Comfortable stay with free breakfast and city views.', image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', rating: 4.3, lat: 17.3850, lng: 78.4867 },
    { name: 'Seaside Suites', cat: 'Hotels', description: 'Beachfront suites and restaurant.', image_url: 'https://images.unsplash.com/photo-1501117716987-c8e3a7b1f7d7', rating: 4.7, lat: 18.5204, lng: 73.8567 },
    // Footwear
    { name: 'Stride Supreme', cat: 'Footwear', description: 'Running shoes, sandals, and custom fittings.', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', rating: 4.1, lat: 28.6139, lng: 77.2090 },
    { name: 'Urban Steps', cat: 'Footwear', description: 'Trendy footwear for urban lifestyles.', image_url: 'https://images.unsplash.com/photo-1526178613284-1f6f1fc3f6d1', rating: 4.0, lat: 19.07598, lng: 72.87766 },
    // Electronics
    { name: 'Gizmo World', cat: 'Electronics', description: 'Latest gadgets, phones and accessories.', image_url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f', rating: 4.4, lat: 12.9718, lng: 77.5937 },
    { name: 'Circuit Hub', cat: 'Electronics', description: 'Repairs and parts for computers and phones.', image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', rating: 4.0, lat: 13.0827, lng: 80.2707 },
    // Fashion
    { name: 'Silk & Stone', cat: 'Fashion', description: 'Designer wear and custom tailoring.', image_url: 'https://images.unsplash.com/photo-1520975915934-6b5a7b1b4f2f', rating: 4.5, lat: 22.5726, lng: 88.3639 },
    { name: 'TrendLab', cat: 'Fashion', description: 'Fast fashion and seasonal collections.', image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15a0c1f2b', rating: 3.9, lat: 12.2958, lng: 76.6394 },
    // Healthcare
    { name: 'HealthPoint Clinic', cat: 'Healthcare', description: '24/7 clinic with general practitioners and diagnostics.', image_url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144', rating: 4.8, lat: 28.7041, lng: 77.1025 },
    { name: 'VitalCare Pharmacy', cat: 'Healthcare', description: 'Medicines and home delivery.', image_url: 'https://images.unsplash.com/photo-1580281657521-3f5d5a5c2b2b', rating: 4.2, lat: 23.0225, lng: 72.5714 },
    // Education
    { name: 'Bright Minds Tuition', cat: 'Education', description: 'Academic coaching for school and competitive exams.', image_url: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d', rating: 4.6, lat: 19.0760, lng: 72.8777 },
    { name: 'TechU Workshops', cat: 'Education', description: 'Short courses: web dev, data science and cloud.', image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', rating: 4.3, lat: 12.9719, lng: 77.5946 },
    // Services
    { name: 'Kumar Consulties (Ad Shoot)', cat: 'Services', description: 'Photography and video shoots for ads and events.', image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1', rating: 4.7, lat: 13.0358, lng: 77.5970 },
    { name: 'EventPro Services', cat: 'Services', description: 'Event planning and management.', image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d', rating: 4.0, lat: 12.9716, lng: 77.5946 },
    // News
    { name: 'Daily City News', cat: 'News', description: 'Local headlines and community updates.', image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb', rating: 4.0, lat: 12.9716, lng: 77.5946 },
    { name: 'Neighborhood Bulletin', cat: 'News', description: 'Neighborhood stories, classifieds, and events.', image_url: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58', rating: 3.8, lat: 12.9728, lng: 77.5952 },
  ];

  const payload = samples.map((s) => ({
    publisher_id: publisherId,
    name: s.name,
    category_id: catMap.get(s.cat) || null,
    description: s.description,
    image_url: s.image_url,
    rating: s.rating,
    lat: s.lat,
    lng: s.lng,
  })).filter(p => p.category_id !== null);

  console.log(`Inserting ${payload.length} businesses...`);
  const { data: insertedBusinesses, error: insertErr } = await supabase.from('businesses').insert(payload).select('business_id, name');
  if (insertErr) {
    console.error('Failed to insert businesses:', insertErr);
    console.error('Full error details:', JSON.stringify(insertErr, null, 2));
    console.error('\n⚠️  ERROR: Row-Level Security is blocking the insert!');
    console.error('Please run one of these SQL scripts in your Supabase SQL Editor:');
    console.error('1. scripts/disable-rls-businesses.sql (Quick fix - disables RLS)');
    console.error('2. scripts/update-rls-policies.sql (Better - updates policies)\n');
  } else {
    console.log('✅ Inserted businesses:', insertedBusinesses.map(b => b.name));
  }

  // Insert sample bookings
  const bookings = [
    { user_id: userId, service_type: 'advertisement-shoots', details: 'Product shoot for 20 items, two-day schedule', status: 'pending' },
    { user_id: userId, service_type: 'marriage-shoots', details: 'Wedding candid + video, 1 day', status: 'confirmed' },
    { user_id: userId, service_type: 'advertisement-publishing', details: 'Run an ad campaign for 2 weeks', status: 'pending' },
  ];

  console.log('Inserting bookings...');
  const { data: insertedBookings, error: bookingsErr } = await supabase.from('service_bookings').insert(bookings).select('*');
  if (bookingsErr) {
    console.error('Failed to insert bookings:', bookingsErr);
    console.error('Full error details:', JSON.stringify(bookingsErr, null, 2));
  } else {
    console.log('✅ Inserted bookings count:', insertedBookings.length);
  }

  // Insert sample advertisements
  const ads = [
    { publisher_id: publisherId, title: 'Summer Sale - The Spice Route', image_url: 'https://example.com/ads/spice-sale.jpg' },
    { publisher_id: publisherId, title: 'Hotel Weekend Deal', image_url: 'https://example.com/ads/hotel-deal.jpg' },
  ];

  console.log('Inserting advertisements...');
  const { data: insertedAds, error: adsErr } = await supabase.from('advertisements').insert(ads).select('*');
  if (adsErr) {
    console.error('Failed to insert ads:', adsErr);
    console.error('Full error details:', JSON.stringify(adsErr, null, 2));
  } else {
    console.log('✅ Inserted ads:', insertedAds.map(a => a.title));
  }

  console.log('\n🎉 Seeding complete.');
  console.log('\n📝 Summary:');
  console.log(`- Businesses: ${insertedBusinesses?.length || 0} inserted`);
  console.log(`- Bookings: ${insertedBookings?.length || 0} inserted`);
  console.log(`- Ads: ${insertedAds?.length || 0} inserted`);
}

main().catch((err) => {
  console.error('Seed script error:', err);
  process.exit(1);
});
