import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

const availableFields = [
  'email',
  'name',
  'address_line1',
  'contact_person',
  'location',
  'frequency',
  'media_type',
  'zip',
  'country',
  'url',
  'organization_type',
  'twitter_url',
  'facebook_url',
  'whatsapp_channel',
  'linkedin_url',
  'telegram_url',
  'telegram_channel',
  'instagram_url',
  'tiktok_url',
  'whatsapp_phone',
  'phone',
  'tag',
  'description',
  'canton',
  'language',
  'locale',
  'status',
  'sources',
  'industry',
];

const frequencies = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
const mediaTypes = ['Online', 'Print', 'TV', 'Radio'];
const organizationTypes = ['Non-profit', 'Company', 'Government', 'Startup'];
const countries = ['Switzerland', 'Germany', 'France', 'Italy'];
const languages = ['English', 'German', 'French', 'Italian'];
const cantons = ['ZH', 'GE', 'VD', 'BE', 'TI'];
const locales = ['en_CH', 'de_CH', 'fr_CH', 'it_CH'];
const statuses = ['new', 'existed'];
const sources = ['Website', 'Referral', 'Event', 'Social Media'];
const industries = ['Finance', 'Healthcare', 'Education', 'Technology', 'Retail'];

function generateOrganizationsCsv(filename: string, count: number, baseDir?: string): void {
  const baseDirectory = baseDir || __dirname;
  const filePath = path.resolve(baseDirectory, filename);
  const rows: string[][] = [availableFields];

  for (let i = 0; i < count; i++) {
    const email = faker.internet.email();
    const name = faker.company.name();
    const addressLine1 = faker.location.streetAddress();
    const contactPerson = faker.person.fullName();
    const location = faker.location.city();
    const frequency = faker.helpers.arrayElement(frequencies);
    const mediaType = faker.helpers.arrayElement(mediaTypes);
    const zipCode = faker.string.numeric(4);
    const country = faker.helpers.arrayElement(countries);
    const url = faker.internet.url();
    const organizationType = faker.helpers.arrayElement(organizationTypes);
    const twitterUrl = `https://twitter.com/${faker.internet.username()}${i}`;
    const facebookUrl = `https://facebook.com/${faker.internet.username()}${i}`;
    const whatsappChannel = `+41${faker.string.numeric(9)}`;
    const companySuffixes = ['Inc', 'LLC', 'Ltd', 'Corp', 'Group'];
    const linkedinUrl = `https://linkedin.com/company/${i}-${faker.helpers.arrayElement(companySuffixes)}`;
    const telegramUrl = `https://t.me/${faker.internet.username()}${i}`;
    const telegramChannel = `https://t.me/${faker.internet.username()}${i}_channel`;
    const instagramUrl = `https://instagram.com/${faker.internet.username()}${i}`;
    const tiktokUrl = `https://tiktok.com/@${faker.internet.username()}${i}`;
    const whatsappPhone = `+41${faker.string.numeric(9)}`;
    const phone = `+41${faker.string.numeric(9)}`;
    const tag = `Tag_${i}`;
    const industry = faker.helpers.arrayElement(industries);
    const description = `Organization ${name} (${i}) in ${industry}`;
    const canton = faker.helpers.arrayElement(cantons);
    const language = faker.helpers.arrayElement(languages);
    const locale = faker.helpers.arrayElement(locales);
    const status = faker.helpers.arrayElement(statuses);
    const sourcesVal = faker.helpers.arrayElement(sources);

    const row = [
      email,
      name,
      addressLine1,
      contactPerson,
      location,
      frequency,
      mediaType,
      zipCode,
      country,
      url,
      organizationType,
      twitterUrl,
      facebookUrl,
      whatsappChannel,
      linkedinUrl,
      telegramUrl,
      telegramChannel,
      instagramUrl,
      tiktokUrl,
      whatsappPhone,
      phone,
      tag,
      description,
      canton,
      language,
      locale,
      status,
      sourcesVal,
      industry,
    ];
    rows.push(row);
  }

  const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  fs.writeFileSync(filePath, csvContent, 'utf-8');
  console.log(`Done: '${filename}' generated with ${count} unique organizations.`);
}

// Run if called directly (for CLI usage)
if (typeof require !== 'undefined' && require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: ts-node generate-organizations.ts <output_file> <count>');
    process.exit(1);
  }

  const filename = args[0];
  const count = parseInt(args[1], 10);
  generateOrganizationsCsv(filename, count);
}

export { generateOrganizationsCsv };

