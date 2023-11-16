function generateXdicHash(xmlString, hashAlgorithm = 'SHA-256') {
    return new Promise((resolve, reject) => {
        try {
            const normalizedHashAlgorithm = hashAlgorithm.toLowerCase().replace('-', '');

            // Step 1: Prepare the XML Document
            // Ensure that the XDIC PI is not yet in the document
            const piRegex = /<\?xdic integrity="[^"]*" version="[^"]*" normalize="[^"]*"\?>/i;
            if (piRegex.test(xmlString)) {
                throw new Error("XDIC Processing Instruction already exists in the document.");
            }

            // Step 2: Insert Placeholder Processing Instruction
            // Find the XML declaration
            const xmlDeclRegex = /<\?xml [^?]*\?>/;
            const hasXmlDecl = xmlDeclRegex.test(xmlString);
            const xmlDeclMatch = hasXmlDecl ? xmlString.match(xmlDeclRegex)[0] : null;

            // Placeholder for checksum
            const placeholderChecksum = `${normalizedHashAlgorithm}-`;
            const placeholderPi = `\n<?xdic integrity="${placeholderChecksum}" version="1.0" normalize="false"?>`;

            // Insert the XDIC PI after the XML declaration (if present) or at the beginning
            const xmlWithPlaceholder = hasXmlDecl 
                ? xmlString.replace(xmlDeclMatch, `${xmlDeclMatch}${placeholderPi}`) 
                : `${placeholderPi}${xmlString}`;
            
            // Step 3: Serialize the XML Content
            // Already in string format

            // Step 4: Calculate the Checksum
            const encoder = new TextEncoder();
            const data = encoder.encode(xmlWithPlaceholder);
            const cryptoModule = (typeof window === 'undefined') ? require('crypto').webcrypto : window.crypto;

            cryptoModule.subtle.digest(hashAlgorithm, data)
                .then(hashBuffer => {
                    // Step 5: Encode the Checksum
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const checksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                    // Step 6: Finalize the XML Document
                    // Update the XDIC PI with the actual checksum
                    const finalXml = xmlWithPlaceholder.replace(`${normalizedHashAlgorithm}-`, `${normalizedHashAlgorithm}-${checksum}`);
                    resolve(finalXml);
                })
                .catch(error => reject(error.message));
        } catch (error) {
            reject(error.message);
        }
    });
}

// Conditional export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateXdicHash };
} else {
    window.generateXdicHash = generateXdicHash;
}
