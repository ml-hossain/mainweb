#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class UniversityDataManager {
    constructor() {
        this.templates = {
            basic: {
                name: '',
                description: '',
                location: '',
                country: '',
                logo_url: '',
                banner_url: '',
                website_url: '',
                initial_payment: '',
                course_duration: '',
                popular_courses: [],
                language_requirement: '',
                subjects: [],
                ranking_type: 'QS Ranking',
                ranking_value: '',
                content: {
                    country: '',
                    university_type: '',
                    ranking: '',
                    ranking_type: 'QS Ranking',
                    initial_payment: '',
                    duration: '',
                    language_requirements: [],
                    popular_courses: [],
                    programs: [],
                    tuition_fee_range: '',
                    campus_life: '',
                    research_opportunities: '',
                    career_services: '',
                    international_students: ''
                },
                page_content: '',
                featured: false,
                is_active: true
            }
        };
        
        this.sampleData = {
            countries: ['malaysia', 'canada', 'usa', 'uk', 'australia', 'germany', 'sweden', 'netherlands'],
            universityTypes: ['public', 'semi-government', 'private', 'international'],
            rankingTypes: ['QS Ranking', 'Country Ranking', 'Times Higher Education', 'Academic Ranking'],
            commonCourses: [
                'Computer Science', 'Engineering', 'Business Administration', 'Medicine',
                'Information Technology', 'Civil Engineering', 'Mechanical Engineering',
                'Electrical Engineering', 'Data Science', 'Artificial Intelligence',
                'Biotechnology', 'Finance', 'Marketing', 'Psychology', 'Law'
            ],
            languageRequirements: [
                'IELTS 6.0', 'IELTS 6.5', 'IELTS 7.0', 'TOEFL 550', 'TOEFL 580', 'TOEFL 90', 'TOEFL 100'
            ]
        };
    }

    async run() {
        console.log('🎓 University Data Manager');
        console.log('===========================');
        console.log('Manage university data for your education website');
        console.log('');

        const choice = await this.getMainChoice();
        
        switch (choice) {
            case '1':
                await this.createUniversityFromTemplate();
                break;
            case '2':
                await this.importFromFile();
                break;
            case '3':
                await this.generateAIContent();
                break;
            case '4':
                await this.createBulkData();
                break;
            case '5':
                await this.exportTemplate();
                break;
            default:
                console.log('Invalid choice. Exiting...');
                process.exit(1);
        }
    }

    async getMainChoice() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            console.log('Choose an option:');
            console.log('1. Create university from template');
            console.log('2. Import from file (JSON/CSV)');
            console.log('3. Generate AI-optimized content');
            console.log('4. Create bulk sample data');
            console.log('5. Export template files');
            console.log('');
            
            rl.question('Enter your choice (1-5): ', (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    }

    async createUniversityFromTemplate() {
        console.log('\n📝 Creating University from Template');
        console.log('=====================================');
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const university = { ...this.templates.basic };
        
        // Collect basic information
        university.name = await this.askQuestion(rl, 'University Name: ');
        university.location = await this.askQuestion(rl, 'Location (City, Country): ');
        university.description = await this.askQuestion(rl, 'Short Description: ');
        
        // Select country
        console.log('\nAvailable countries:', this.sampleData.countries.join(', '));
        university.country = await this.askQuestion(rl, 'Country (from list above): ');
        university.content.country = university.country;
        
        // Select university type
        console.log('\nUniversity types:', this.sampleData.universityTypes.join(', '));
        university.content.university_type = await this.askQuestion(rl, 'University Type: ');
        
        // Basic fields
        university.website_url = await this.askQuestion(rl, 'Website URL (optional): ');
        university.logo_url = await this.askQuestion(rl, 'Logo URL (optional): ');
        university.banner_url = await this.askQuestion(rl, 'Banner URL (optional): ');
        
        // Academic information
        university.ranking_value = await this.askQuestion(rl, 'University Ranking (optional): ');
        university.content.ranking = university.ranking_value;
        
        university.initial_payment = await this.askQuestion(rl, 'Initial Payment (e.g., $5,000): ');
        university.content.initial_payment = university.initial_payment;
        
        university.course_duration = await this.askQuestion(rl, 'Course Duration (e.g., 3-4 years): ');
        university.content.duration = university.course_duration;
        
        // Popular courses
        console.log('\nCommon courses:', this.sampleData.commonCourses.join(', '));
        const coursesInput = await this.askQuestion(rl, 'Popular Courses (comma-separated): ');
        university.popular_courses = coursesInput.split(',').map(c => c.trim()).filter(c => c);
        university.content.popular_courses = university.popular_courses;
        
        // Language requirements
        console.log('\nCommon requirements:', this.sampleData.languageRequirements.join(', '));
        const langInput = await this.askQuestion(rl, 'Language Requirements (comma-separated): ');
        university.language_requirement = langInput;
        university.content.language_requirements = langInput.split(',').map(l => l.trim()).filter(l => l);
        
        // Generate slug
        university.slug = this.generateSlug(university.name);
        
        // Generate basic page content
        university.page_content = this.generateBasicPageContent(university);
        
        // Additional content fields
        university.content.tuition_fee_range = await this.askQuestion(rl, 'Tuition Fee Range (optional): ');
        university.content.campus_life = await this.askQuestion(rl, 'Campus Life Description (optional): ');
        university.content.research_opportunities = await this.askQuestion(rl, 'Research Opportunities (optional): ');
        university.content.career_services = await this.askQuestion(rl, 'Career Services (optional): ');
        university.content.international_students = await this.askQuestion(rl, 'International Student Info (optional): ');
        
        // Set featured status
        const featuredInput = await this.askQuestion(rl, 'Is this a featured university? (y/n): ');
        university.featured = featuredInput.toLowerCase() === 'y' || featuredInput.toLowerCase() === 'yes';
        
        rl.close();
        
        // Save the university data
        await this.saveUniversityData(university);
    }

    async importFromFile() {
        console.log('\n📁 Import from File');
        console.log('====================');
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const filePath = await this.askQuestion(rl, 'Enter file path (JSON/CSV): ');
        rl.close();

        try {
            if (!fs.existsSync(filePath)) {
                throw new Error('File not found');
            }

            const ext = path.extname(filePath).toLowerCase();
            const content = fs.readFileSync(filePath, 'utf8');
            
            let data;
            if (ext === '.json') {
                data = JSON.parse(content);
            } else if (ext === '.csv') {
                data = this.parseCSV(content);
            } else {
                throw new Error('Unsupported file format. Please use JSON or CSV.');
            }

            // Process and enhance the data
            const universities = Array.isArray(data) ? data : [data];
            
            for (const uni of universities) {
                const processedUni = this.processImportedUniversity(uni);
                await this.saveUniversityData(processedUni);
            }
            
            console.log(`✅ Successfully imported ${universities.length} universities!`);
            
        } catch (error) {
            console.error('❌ Error importing file:', error.message);
        }
    }

    async generateAIContent() {
        console.log('\n🤖 Generate AI-Optimized Content');
        console.log('==================================');
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const name = await this.askQuestion(rl, 'University Name: ');
        const country = await this.askQuestion(rl, 'Country: ');
        rl.close();

        console.log('\n🔄 Generating AI-optimized content...');
        
        // Simulate AI content generation
        await this.simulateAIGeneration();
        
        const university = this.generateAIOptimizedUniversity(name, country);
        await this.saveUniversityData(university);
        
        console.log('✅ AI-optimized university content generated successfully!');
    }

    async createBulkData() {
        console.log('\n📦 Create Bulk Sample Data');
        console.log('===========================');
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const count = await this.askQuestion(rl, 'How many sample universities to create? (1-10): ');
        rl.close();

        const numUniversities = Math.min(parseInt(count) || 5, 10);
        
        console.log(`\n🔄 Creating ${numUniversities} sample universities...`);
        
        const sampleUniversities = this.generateSampleUniversities(numUniversities);
        
        for (const uni of sampleUniversities) {
            await this.saveUniversityData(uni);
        }
        
        console.log(`✅ Successfully created ${numUniversities} sample universities!`);
    }

    async exportTemplate() {
        console.log('\n📤 Export Template Files');
        console.log('=========================');
        
        // Export JSON template
        const jsonTemplate = this.templates.basic;
        fs.writeFileSync('university-template.json', JSON.stringify(jsonTemplate, null, 2));
        
        // Export CSV template
        const csvTemplate = this.generateCSVTemplate();
        fs.writeFileSync('university-template.csv', csvTemplate);
        
        // Export sample data
        const sampleData = this.generateSampleUniversities(3);
        fs.writeFileSync('university-samples.json', JSON.stringify(sampleData, null, 2));
        
        console.log('✅ Template files exported:');
        console.log('  - university-template.json');
        console.log('  - university-template.csv');
        console.log('  - university-samples.json');
    }

    generateAIOptimizedUniversity(name, country) {
        const countryNames = {
            'malaysia': 'Malaysia',
            'canada': 'Canada',
            'usa': 'USA',
            'uk': 'United Kingdom',
            'australia': 'Australia',
            'germany': 'Germany',
            'sweden': 'Sweden',
            'netherlands': 'Netherlands'
        };

        const countryName = countryNames[country] || country;
        
        return {
            name: name,
            description: `${name} is a leading educational institution in ${countryName}, offering world-class programs and research opportunities.`,
            location: `${countryName}`,
            country: country,
            slug: this.generateSlug(name),
            logo_url: '',
            banner_url: '',
            website_url: '',
            initial_payment: this.getRandomInitialPayment(country),
            course_duration: '3-4 years',
            popular_courses: this.getRandomCourses(),
            language_requirement: this.getRandomLanguageRequirement(),
            subjects: this.getRandomSubjects(),
            ranking_type: 'QS Ranking',
            ranking_value: this.getRandomRanking(),
            content: {
                country: country,
                university_type: this.getRandomUniversityType(),
                ranking: this.getRandomRanking(),
                ranking_type: 'QS Ranking',
                initial_payment: this.getRandomInitialPayment(country),
                duration: '3-4 years',
                language_requirements: this.getRandomLanguageRequirement().split(', '),
                popular_courses: this.getRandomCourses(),
                programs: this.getRandomPrograms(),
                tuition_fee_range: this.getRandomTuitionRange(country),
                campus_life: `${name} offers a vibrant campus life with modern facilities, student clubs, and cultural activities.`,
                research_opportunities: `Extensive research programs and opportunities to work with leading faculty members.`,
                career_services: `Comprehensive career guidance and job placement assistance with industry connections.`,
                international_students: `Welcome international students with dedicated support services and multicultural environment.`
            },
            page_content: this.generateOptimizedPageContent(name, countryName, country),
            featured: Math.random() > 0.7,
            is_active: true
        };
    }

    generateOptimizedPageContent(name, countryName, country) {
        return `<h1>${name} ${countryName} - Complete University Guide 2024</h1>

<p><strong>${name}</strong> stands as one of ${countryName}'s most prestigious educational institutions, offering world-class education to international students. Located in ${countryName}, ${name} provides comprehensive academic programs designed to meet the evolving demands of today's global job market.</p>

<h2>Why Choose ${name} for Your Higher Education?</h2>

<p>${name} has established itself as a leading university in ${countryName}, attracting students from around the globe. Here's why ${name} should be your top choice:</p>

<ul>
  <li><strong>Academic Excellence:</strong> High academic standards with internationally recognized programs</li>
  <li><strong>Global Recognition:</strong> Degrees recognized worldwide by employers and institutions</li>
  <li><strong>Diverse Community:</strong> Multicultural environment with international students</li>
  <li><strong>Modern Facilities:</strong> State-of-the-art campus and research facilities</li>
  <li><strong>Career Support:</strong> Comprehensive career services and industry connections</li>
</ul>

<h2>Popular Programs at ${name}</h2>

<p>${name} offers a comprehensive range of undergraduate and postgraduate programs across multiple faculties.</p>

<h3>Undergraduate Programs</h3>
<ul>
  <li>Bachelor of Computer Science</li>
  <li>Bachelor of Business Administration</li>
  <li>Bachelor of Engineering</li>
  <li>Bachelor of Medicine</li>
  <li>Bachelor of Arts</li>
</ul>

<h3>Postgraduate Programs</h3>
<ul>
  <li>Master of Business Administration (MBA)</li>
  <li>Master of Science in Data Science</li>
  <li>Master of Engineering</li>
  <li>PhD Programs in various disciplines</li>
</ul>

<h2>Admission Requirements for ${name}</h2>

<p>Securing admission to ${name} requires meeting specific academic and language proficiency criteria.</p>

<h3>Academic Requirements</h3>
<ul>
  <li>Completed secondary education with minimum GPA requirements</li>
  <li>Bachelor's degree for postgraduate programs</li>
  <li>Document verification and authentication</li>
</ul>

<h3>English Language Proficiency</h3>
<ul>
  <li>IELTS: Minimum score of 6.0-6.5 (varies by program)</li>
  <li>TOEFL: Minimum score of 80-90 (varies by program)</li>
  <li>Alternative: University English proficiency test</li>
</ul>

<h2>Apply to ${name} with MA Education</h2>

<p>Get expert guidance from MA Education for your ${name} application. We provide comprehensive support throughout the application process.</p>

<p>Contact MA Education today to start your journey to ${name} and achieve your academic dreams in ${countryName}.</p>`;
    }

    generateSampleUniversities(count) {
        const universities = [];
        const sampleNames = [
            'International University of Technology',
            'Global Business Institute',
            'Advanced Science University',
            'Metropolitan College of Arts',
            'Modern Engineering Institute',
            'International Medical University',
            'Digital Innovation University',
            'Global Management Institute',
            'Advanced Research University',
            'International Design Academy'
        ];

        for (let i = 0; i < count; i++) {
            const name = sampleNames[i % sampleNames.length];
            const country = this.sampleData.countries[i % this.sampleData.countries.length];
            universities.push(this.generateAIOptimizedUniversity(name, country));
        }

        return universities;
    }

    processImportedUniversity(data) {
        const university = { ...this.templates.basic, ...data };
        
        // Ensure required fields
        if (!university.slug && university.name) {
            university.slug = this.generateSlug(university.name);
        }
        
        // Ensure content object exists
        if (!university.content) {
            university.content = { ...this.templates.basic.content };
        }
        
        // Generate basic page content if missing
        if (!university.page_content && university.name) {
            university.page_content = this.generateBasicPageContent(university);
        }
        
        return university;
    }

    generateBasicPageContent(university) {
        return `<h1>${university.name} - Your Gateway to Quality Education</h1>

<p><strong>${university.name}</strong> is a distinguished educational institution offering comprehensive academic programs and research opportunities.</p>

<h2>About ${university.name}</h2>
<p>${university.description || 'This university provides excellent educational opportunities for students from around the world.'}</p>

<h2>Why Choose ${university.name}?</h2>
<ul>
  <li>Quality education with international standards</li>
  <li>Experienced faculty and modern facilities</li>
  <li>Diverse student community</li>
  <li>Strong industry connections</li>
</ul>

${university.popular_courses && university.popular_courses.length > 0 ? `
<h2>Popular Programs</h2>
<ul>
  ${university.popular_courses.map(course => `<li>${course}</li>`).join('\n  ')}
</ul>
` : ''}

<h2>Contact MA Education</h2>
<p>Get expert guidance for your application to ${university.name}. Contact MA Education for comprehensive support throughout your application process.</p>`;
    }

    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    parseCSV(content) {
        const lines = content.trim().split('\n');
        if (lines.length === 0) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            
            result.push(row);
        }

        return result;
    }

    generateCSVTemplate() {
        return `name,description,location,country,website_url,initial_payment,course_duration,popular_courses,language_requirement,ranking_value
Sample University,A great university for higher education,Sample City,malaysia,https://example.com,$5000,3-4 years,"Computer Science,Engineering","IELTS 6.0,TOEFL 550",150`;
    }

    getRandomCourses() {
        const shuffled = [...this.sampleData.commonCourses].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 4);
    }

    getRandomSubjects() {
        const shuffled = [...this.sampleData.commonCourses].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 6);
    }

    getRandomPrograms() {
        return [
            'Bachelor of Science',
            'Bachelor of Engineering',
            'Master of Business Administration',
            'Master of Science',
            'PhD Programs'
        ];
    }

    getRandomLanguageRequirement() {
        const reqs = this.sampleData.languageRequirements.sort(() => 0.5 - Math.random());
        return reqs.slice(0, 2).join(', ');
    }

    getRandomUniversityType() {
        return this.sampleData.universityTypes[Math.floor(Math.random() * this.sampleData.universityTypes.length)];
    }

    getRandomRanking() {
        return (Math.floor(Math.random() * 500) + 50).toString();
    }

    getRandomInitialPayment(country) {
        const payments = {
            malaysia: ['RM 10,000', 'RM 15,000', 'RM 20,000'],
            canada: ['CAD 15,000', 'CAD 20,000', 'CAD 25,000'],
            usa: ['$20,000', '$25,000', '$30,000'],
            uk: ['£15,000', '£20,000', '£25,000'],
            australia: ['AUD 20,000', 'AUD 25,000', 'AUD 30,000']
        };
        
        const countryPayments = payments[country] || ['$15,000', '$20,000', '$25,000'];
        return countryPayments[Math.floor(Math.random() * countryPayments.length)];
    }

    getRandomTuitionRange(country) {
        const ranges = {
            malaysia: 'RM 25,000 - RM 45,000 per year',
            canada: 'CAD 30,000 - CAD 50,000 per year',
            usa: '$35,000 - $60,000 per year',
            uk: '£20,000 - £40,000 per year',
            australia: 'AUD 30,000 - AUD 50,000 per year'
        };
        
        return ranges[country] || '$25,000 - $45,000 per year';
    }

    async simulateAIGeneration() {
        const steps = [
            'Analyzing university requirements...',
            'Generating SEO-optimized content...',
            'Creating structured data...',
            'Optimizing for search engines...',
            'Finalizing content...'
        ];

        for (const step of steps) {
            console.log(`🔄 ${step}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    async askQuestion(rl, question) {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async saveUniversityData(university) {
        const filename = `university-${university.slug || 'new'}-${Date.now()}.json`;
        const filepath = path.join(process.cwd(), filename);
        
        fs.writeFileSync(filepath, JSON.stringify(university, null, 2));
        
        console.log(`✅ University data saved as: ${filename}`);
        console.log('📋 Summary:');
        console.log(`   Name: ${university.name}`);
        console.log(`   Country: ${university.country}`);
        console.log(`   Courses: ${university.popular_courses ? university.popular_courses.length : 0}`);
        console.log(`   Featured: ${university.featured ? 'Yes' : 'No'}`);
        console.log('');
        console.log('💡 Next steps:');
        console.log('   1. Review the generated JSON file');
        console.log('   2. Import it into your database using the admin panel');
        console.log('   3. Or use the data-importer.js tool');
        console.log('');
    }
}

// Run the manager
if (require.main === module) {
    const manager = new UniversityDataManager();
    manager.run().catch(console.error);
}

module.exports = UniversityDataManager;
