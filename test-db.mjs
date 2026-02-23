import { createClient } from '@insforge/sdk';

const insforgeUrl = 'https://p24ci5zv.eu-central.insforge.app';
const insforgeAnonKey = 'ik_520b10a50f8f12673def8040e677cb62';

const insforge = createClient({
    baseUrl: insforgeUrl,
    anonKey: insforgeAnonKey,
});

async function run() {
    console.log("Starting insert with ik_ key...");
    const { data, error } = await insforge.database
        .from('products')
        .insert([{
            name: 'Test Product',
            price: 100,
            category: 'annual',
            active: true,
            is_popular: false
        }])
        .select();

    console.log("Data:", data);
    if (error) {
        console.log("Error details:", JSON.stringify(error, null, 2));
    } else {
        // delete the test product
        await insforge.database.from('products').delete().eq('id', data[0].id);
        console.log("Test product removed.");
    }
}

run();
