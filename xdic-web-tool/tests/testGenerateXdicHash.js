const { generateXdicHash } = require('../js/generateXdic.js');
const { verifyXdicHash } = require('../js/verifyXdic.js');

function testGenerateXdicHash() {
    const testXml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rootElement>
        <child>Sample Content</child>
        <!-- Comment -->
    </rootElement>`;

    // Test generating XDIC hash
    generateXdicHash(testXml)
        .then(generatedXml => {
            console.log('XDIC Hash generated successfully.');
            console.log('Generated XML:', generatedXml);

            // Optionally, verify the generated hash
            return verifyXdicHash(generatedXml);
        })
        .then(verificationResult => {
            if (verificationResult) {
                console.log('Verification of generated hash passed:', verificationResult);
            } else {
                console.error('Verification of generated hash failed:', verificationResult);
            }
        })
        .catch(error => console.error('XDIC Hash generation failed:', error));
}

testGenerateXdicHash();
