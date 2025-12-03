import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

const requiredFields = [
  'email',
  'first_name',
  'last_name',
  'address_line1',
  'address_line2',
  'zip',
  'location',
  'canton',
  'country',
  'language',
  'function',
  'phone',
  'mobile_phone',
  'salutation',
  'gender',
  'website_url',
  'linkedin_url',
  'facebook_url',
  'twitter_url',
  'birth_date',
  'organization',
  'department',
  'description',
  'contact_interests',
  'priority',
  'status',
  'tag',
  'keywords',
  'last_access',
  'account_created_at',
  'ranks',
  'contact_types',
  'sources',
  'notes',
  'industry',
];

const priorities = ['p1', 'p2', 'p3', 'p4', 'p5'];
const salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];
const genders = ['Male', 'Female', 'Other'];
const languages = ['English', 'German', 'French', 'Italian'];
const statuses = [
  'new',
  'closed',
  'contacted',
  'negotiating',
  'registered',
  'backfill',
  'customer/no marketing',
  'prospect/marketing',
];
const tags = ['Lead', 'Customer', 'Prospect'];
const ranks = ['Gold', 'Silver', 'Bronze'];
const contactTypes = ['Primary Contact', 'Secondary Contact'];
const sources = ['Website Form', 'Referral', 'Event'];

function generateContactsCsv(filename: string, count: number, baseDir?: string): void {
  const baseDirectory = baseDir || __dirname;
  const filePath = path.resolve(baseDirectory, filename);
  const rows: string[][] = [requiredFields];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@example.com`;
    const addressLine1 = faker.location.streetAddress();
    const addressLine2 = `Apt ${(i % 100) + 1}`;
    const zipCode = faker.location.zipCode();
    const location = faker.location.city();
    const canton = faker.location.state({ abbreviated: true });
    const country = 'Switzerland';
    const language = faker.helpers.arrayElement(languages);
    const jobFunction = faker.person.jobTitle();
    const phone = `+41${faker.string.numeric(9)}`;
    const mobilePhone = `+41${faker.string.numeric(9)}`;
    const salutation = faker.helpers.arrayElement(salutations);
    const gender = faker.helpers.arrayElement(genders);
    const websiteUrl = `https://${firstName.toLowerCase()}${lastName.toLowerCase()}${i}.com`;
    const linkedinUrl = `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;
    const facebookUrl = `https://facebook.com/${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;
    const twitterUrl = `https://twitter.com/${firstName.toLowerCase()}${lastName.toLowerCase()}${i}`;
    const birthDate = faker.date
      .birthdate({ min: 18, max: 70, mode: 'age' })
      .toISOString()
      .split('T')[0];
    const organization = `${faker.company.name()} ${i}`;
    const department = `${faker.company.catchPhrase().split(' ')[0]} ${i}`;
    const description = `Test contact ${firstName} ${lastName} (${i})`;
    const contactInterests = `${faker.lorem.word()}_${i}`;
    const priority = faker.helpers.arrayElement(priorities);
    const status = faker.helpers.arrayElement(statuses);
    const tag = `${faker.helpers.arrayElement(tags)}_${i}`;
    const keywords = `${firstName},${lastName},test,${i}`;
    const lastAccess = `2024-07-07T12:${Math.floor(i / 60) % 60}:${i % 60}`;
    const accountCreatedAt = `2023-01-01T08:${Math.floor(i / 60) % 60}:${i % 60}`;
    const ranksVal = `${faker.helpers.arrayElement(ranks)}_${i}`;
    const contactTypesVal = `${faker.helpers.arrayElement(contactTypes)}_${i}`;
    const sourcesVal = `${faker.helpers.arrayElement(sources)}_${i}`;
    const notes = `Generated for testing (${i})`;
    const industry = `${faker.lorem.word()}_${i}`;

    const row = [
      email,
      firstName,
      lastName,
      addressLine1,
      addressLine2,
      zipCode,
      location,
      canton,
      country,
      language,
      jobFunction,
      phone,
      mobilePhone,
      salutation,
      gender,
      websiteUrl,
      linkedinUrl,
      facebookUrl,
      twitterUrl,
      birthDate,
      organization,
      department,
      description,
      contactInterests,
      priority,
      status,
      tag,
      keywords,
      lastAccess,
      accountCreatedAt,
      ranksVal,
      contactTypesVal,
      sourcesVal,
      notes,
      industry,
    ];
    rows.push(row);
  }

  const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  fs.writeFileSync(filePath, csvContent, 'utf-8');
  console.log(`Done: '${filename}' generated with ${count} unique contacts.`);
}

// Run if called directly (for CLI usage)
if (typeof require !== 'undefined' && require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: ts-node generate-contacts.ts <output_file> <count>');
    process.exit(1);
  }

  const filename = args[0];
  const count = parseInt(args[1], 10);
  generateContactsCsv(filename, count);
}

export { generateContactsCsv };

