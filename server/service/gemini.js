const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          md5: { type: SchemaType.STRING },
          applicant: { type: SchemaType.STRING },
          skills: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
          experience: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                company: { type: SchemaType.STRING },
                startDate: { type: SchemaType.STRING },
                endDate: { type: SchemaType.STRING },
                description: { type: SchemaType.STRING },
              },
            },
          },
          education: {
            type: SchemaType.OBJECT,
            properties: {
              degree: { type: SchemaType.STRING },
              major: { type: SchemaType.STRING },
              school: { type: SchemaType.STRING },
              graduationYear: { type: SchemaType.STRING },
            },
          },
          // project: {
          //   type: SchemaType.ARRAY,
          //   items: {
          //     type: SchemaType.OBJECT,
          //     properties: {
          //       title: { type: SchemaType.STRING },
          //       link: { type: SchemaType.STRING },
          //       stacks: {
          //         type: SchemaType.ARRAY,
          //         items: { type: SchemaType.STRING },
          //       },
          //     },
          //   },
          // },
          contact: {
            type: SchemaType.OBJECT,
            properties: {
              email: { type: SchemaType.STRING },
            },
          },
        },
      },
    },
  },
});

const prompt =
  'Convert resumes to list of json. Each resume have resume(n) at top of the resuem.' +
  allPdfs;
// count time to generate content
const startTime = Date.now();
const countTokens = await model.countTokens(prompt);
console.log(countTokens);
const result = await model.generateContent(prompt);
console.log(JSON.stringify(JSON.parse(result.response.text()), null, 2));
const endTime = Date.now();
// in seconds
const timeElapsed = (endTime - startTime) / 1000;
console.log(`Time elapsed: ${timeElapsed} seconds`);
