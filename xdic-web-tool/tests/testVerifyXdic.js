const { verifyXdicHash } = require('../js/verifyXdic.js');

function testVerifyXdicHash() {
    // Example XML content with a valid XDIC hash
    const validXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xdic integrity="sha256-47689def1604cbb3ee7b70e3dff7d1c9115753083b41b987c063b1cc771b988a" version="1.0" normalize="false"?>
<rootElement>
    <!-- XML content goes here -->
</rootElement>`;

    // Example XML content with an invalid XDIC hash
    const invalidXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xdic integrity="sha256-nope" version="1.0" normalize="false"?>
<rootElement>
    <!-- XML content goes here -->
</rootElement>`;

    // Test with valid XML
    verifyXdicHash(validXml)
        .then(result => console.log('Test with valid XML should pass:', result))
        .catch(error => console.error('Test with valid XML should not fail:', !error));

    // Test with invalid XML
    verifyXdicHash(invalidXml)
        .then(result => console.log('Test with invalid XML should not pass:', !result))
        .catch(error => console.error('Test with invalid XML should fail:', !error));
}

testVerifyXdicHash();
