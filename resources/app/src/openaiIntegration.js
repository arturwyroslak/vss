const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");

const productConfigPath = './product.json';

function initializeOpenAI() {
    const productConfig = JSON.parse(fs.readFileSync(productConfigPath, 'utf8'));
    const openAIKey = productConfig.aiConfig.openAIKey;
    const configuration = new Configuration({
        apiKey: openAIKey,
    });
    const openai = new OpenAIApi(configuration);
    return openai;
}

async function generateText(model, prompt, options = {}) {
    const openai = initializeOpenAI();
    const response = await openai.createCompletion({
        model: model,
        prompt: prompt,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 150,
        top_p: options.top_p || 1.0,
        frequency_penalty: options.frequency_penalty || 0.0,
        presence_penalty: options.presence_penalty || 0.0,
    });
    return response.data.choices[0].text.trim();
}

module.exports = {
    generateText,
};
